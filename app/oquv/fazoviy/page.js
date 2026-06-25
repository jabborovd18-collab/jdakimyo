"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// GEOMETRIK SHAKLLAR (ilmiy aniq)
// ═══════════════════════════════════════════════════════════
const shakllar = [
  // ── KS=2 ──
  {
    ks: 2,
    href: "/oquv/fazoviy/chiziqli",
    icon: "📏",
    title: "Chiziqli",
    desc: "KS=2 • 180° burchak",
    gibrid: "sp (oddiy) yoki sd (o'tish metallari)",
    misollar: ["[Ag(NH₃)₂]⁺", "[AuCl₂]⁻", "BeCl₂"],
    badge: "KS=2",
    rang: "blue",
    has3D: true
  },
  
  // ── KS=3 ──
  {
    ks: 3,
    href: "/oquv/fazoviy/uchburchak",
    icon: "📐",
    title: "Uchburchak tekislik",
    desc: "KS=3 • 120° burchak • D₃ₕ simmetriya",
    gibrid: "sp²",
    misollar: ["[Pt(PPh₃)₃]", "[Cu(CN)₃]²⁻", "BF₃"],
    badge: "KS=3",
    rang: "green",
    has3D: true
  },
  
  // ── KS=4 ──
  {
    ks: 4,
    href: "/oquv/fazoviy/tetraedrik",
    icon: "🔺",
    title: "Tetraedrik",
    desc: "KS=4 • 109.5° • T_d simmetriya",
    gibrid: "sp³ (asosiy guruh) • sd³ (o'tish metallari)",
    misollar: ["[CoCl₄]²⁻", "[Zn(OH)₄]²⁻", "CH₄", "Ni(CO)₄"],
    badge: "KS=4",
    rang: "cyan",
    has3D: true
  },
  {
    ks: 4,
    href: "/oquv/fazoviy/tekis-kvadrat",
    icon: "◻️",
    title: "Tekis kvadrat",
    desc: "KS=4 • 90° • D₄ₕ simmetriya",
    gibrid: "dsp² (VSEPR bo'yicha)",
    misollar: ["[PtCl₄]²⁻", "Sisplatin", "[Ni(CN)₄]²⁻", "[Cu(NH₃)₄]²⁺"],
    badge: "KS=4",
    rang: "pink",
    has3D: true
  },
  
  // ── KS=5 ──
  {
    ks: 5,
    href: "/oquv/fazoviy/trigonal-bipiramida",
    icon: "🔷",
    title: "Trigonal bipiramida",
    desc: "KS=5 • 90°/120° • D₃ₕ simmetriya",
    gibrid: "VSEPR modeli (gibridlanish emas)",
    misollar: ["[Fe(CO)₅]", "[CuCl₅]³⁻", "PCl₅"],
    badge: "KS=5",
    rang: "orange",
    has3D: true
  },
  {
    ks: 5,
    href: "/oquv/fazoviy/kvadrat-piramida",
    icon: "🏛️",
    title: "Kvadrat piramida",
    desc: "KS=5 • ~90° • C₄ᵥ simmetriya",
    gibrid: "VSEPR modeli",
    misollar: ["[Ni(CN)₅]³⁻", "[VO(acac)₂]", "[InCl₅]²⁻"],
    badge: "KS=5",
    rang: "red",
    has3D: true
  },
  
  // ── KS=6 ──
  {
    ks: 6,
    href: "/oquv/fazoviy/oktaedrik",
    icon: "💎",
    title: "Oktaedrik",
    desc: "KS=6 • 90° • Oₕ simmetriya",
    gibrid: "d²sp³ (inner) yoki sp³d² (outer)",
    misollar: ["[Co(NH₃)₆]³⁺", "[Fe(CN)₆]³⁻", "[Cr(H₂O)₆]³⁺", "SF₆"],
    badge: "KS=6",
    rang: "purple",
    has3D: true,
    featured: true
  },
  {
    ks: 6,
    href: "/oquv/fazoviy/trigonal-prizma",
    icon: "🔶",
    title: "Trigonal prizma",
    desc: "KS=6 • D₃ₕ simmetriya • Kam uchraydi",
    gibrid: "VSEPR/Kepert modeli",
    misollar: ["[Re(S₂C₂Ph₂)₃]", "[W(CH₃)₆]", "[Mo(S₂C₂(CF₃)₂)₃]"],
    badge: "KS=6",
    rang: "amber",
    has3D: false,
    rarity: "Kam uchraydi"
  },
  
  // ── KS=7 ──
  {
    ks: 7,
    href: "/oquv/fazoviy/pentagonal-bipiramida",
    icon: "⬠",
    title: "Pentagonal bipiramida",
    desc: "KS=7 • D₅ₕ simmetriya",
    gibrid: "VSEPR modeli",
    misollar: ["[ZrF₇]³⁻", "[HfF₇]³⁻", "[UO₂F₅]³⁻"],
    badge: "KS=7",
    rang: "indigo",
    has3D: false
  },
  {
    ks: 7,
    href: "/oquv/fazoviy/monoyopiq-prizma",
    icon: "🏠",
    title: "Monoyopiq trigonal prizma",
    desc: "KS=7 • C₂ᵥ simmetriya",
    gibrid: "VSEPR modeli",
    misollar: ["[NbOF₆]³⁻", "[TaF₇]²⁻"],
    badge: "KS=7",
    rang: "teal",
    has3D: false
  },
  
  // ── KS=8 ──
  {
    ks: 8,
    href: "/oquv/fazoviy/kubsimon",
    icon: "🧊",
    title: "Kubsimon",
    desc: "KS=8 • Oₕ simmetriya",
    gibrid: "VSEPR/Kepert (f orbital kam)",
    misollar: ["[Mo(CN)₈]⁴⁻", "[TaF₈]³⁻", "[PaF₈]³⁻"],
    badge: "KS=8",
    rang: "sky",
    has3D: false
  },
  {
    ks: 8,
    href: "/oquv/fazoviy/dodekaedrik",
    icon: "⬡",
    title: "Dodekaedrik",
    desc: "KS=8 • D₂d simmetriya",
    gibrid: "VSEPR/Kepert modeli",
    misollar: ["[Zr(acac)₄]", "[Mo(CN)₈]⁴⁻"],
    badge: "KS=8",
    rang: "fuchsia",
    has3D: false
  },
  {
    ks: 8,
    href: "/oquv/fazoviy/kvadrat-antiprizma",
    icon: "🟦",
    title: "Kvadrat antiprizma",
    desc: "KS=8 • D₄d simmetriya",
    gibrid: "VSEPR/Kepert modeli",
    misollar: ["[XeF₈]²⁻", "[IF₈]⁻", "[TaF₈]³⁻"],
    badge: "KS=8",
    rang: "violet",
    has3D: false
  },
  
  // ── KS=9 ──
  {
    ks: 9,
    href: "/oquv/fazoviy/uch-yoqli-prizma",
    icon: "🔺",
    title: "Uch yoqli trigonal prizma",
    desc: "KS=9 • D₃ₕ simmetriya",
    gibrid: "VSEPR modeli",
    misollar: ["[ReH₉]²⁻", "[Nd(H₂O)₉]³⁺"],
    badge: "KS=9",
    rang: "lime",
    has3D: false
  },
  
  // ── KS=10 ──
  {
    ks: 10,
    href: "/oquv/fazoviy/ikki-yoqli-antiprizma",
    icon: "🔷",
    title: "Ikki yoqli kvadrat antiprizma",
    desc: "KS=10 • D₄d simmetriya",
    gibrid: "VSEPR modeli",
    misollar: ["[Th(C₂O₄)₄(H₂O)₂]⁴⁻"],
    badge: "KS=10",
    rang: "rose",
    has3D: false
  },
  {
    ks: 10,
    href: "/oquv/fazoviy/sendvich",
    icon: "🥪",
    title: "Sendvich (Metallosen)",
    desc: "KS=10 • η⁵-C₅H₅ ligandlar",
    gibrid: "Molekulyar orbital nazariyasi",
    misollar: ["Ferrosen [Fe(C₅H₅)₂]", "Kobaltosen", "Nikelosen"],
    badge: "KS=10",
    rang: "emerald",
    has3D: true,
    featured: true
  },
  
  // ── KS=12 ──
  {
    ks: 12,
    href: "/oquv/fazoviy/ikosaedrik",
    icon: "⚽",
    title: "Ikosaedrik",
    desc: "KS=12 • 20 ta uchburchak yuz • Iₕ simmetriya",
    gibrid: "VSEPR modeli",
    misollar: ["[B₁₂H₁₂]²⁻", "C₆₀ (fulleren)", "[Th(NO₃)₆]²⁻"],
    badge: "KS=12",
    rang: "yellow",
    has3D: false
  }
]

// ═══════════════════════════════════════════════════════════
// RANGLAR XARITASI
// ═══════════════════════════════════════════════════════════
const rangMap = {
  blue:    { border: "hover:border-blue-400/50",    text: "group-hover:text-blue-400",    bg: "bg-blue-600/20 text-blue-400 border-blue-600/30" },
  green:   { border: "hover:border-green-400/50",   text: "group-hover:text-green-400",   bg: "bg-green-600/20 text-green-400 border-green-600/30" },
  cyan:    { border: "hover:border-cyan-400/50",    text: "group-hover:text-cyan-400",    bg: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30" },
  pink:    { border: "hover:border-pink-400/50",    text: "group-hover:text-pink-400",    bg: "bg-pink-600/20 text-pink-400 border-pink-600/30" },
  orange:  { border: "hover:border-orange-400/50",  text: "group-hover:text-orange-400",  bg: "bg-orange-600/20 text-orange-400 border-orange-600/30" },
  red:     { border: "hover:border-red-400/50",     text: "group-hover:text-red-400",     bg: "bg-red-600/20 text-red-400 border-red-600/30" },
  purple:  { border: "hover:border-purple-400/50",  text: "group-hover:text-purple-400",  bg: "bg-purple-600/20 text-purple-400 border-purple-600/30" },
  amber:   { border: "hover:border-amber-400/50",   text: "group-hover:text-amber-400",   bg: "bg-amber-600/20 text-amber-400 border-amber-600/30" },
  indigo:  { border: "hover:border-indigo-400/50",  text: "group-hover:text-indigo-400",  bg: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30" },
  teal:    { border: "hover:border-teal-400/50",    text: "group-hover:text-teal-400",    bg: "bg-teal-600/20 text-teal-400 border-teal-600/30" },
  sky:     { border: "hover:border-sky-400/50",     text: "group-hover:text-sky-400",     bg: "bg-sky-600/20 text-sky-400 border-sky-600/30" },
  fuchsia: { border: "hover:border-fuchsia-400/50", text: "group-hover:text-fuchsia-400", bg: "bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-600/30" },
  violet:  { border: "hover:border-violet-400/50",  text: "group-hover:text-violet-400",  bg: "bg-violet-600/20 text-violet-400 border-violet-600/30" },
  lime:    { border: "hover:border-lime-400/50",    text: "group-hover:text-lime-400",    bg: "bg-lime-600/20 text-lime-400 border-lime-600/30" },
  rose:    { border: "hover:border-rose-400/50",    text: "group-hover:text-rose-400",    bg: "bg-rose-600/20 text-rose-400 border-rose-600/30" },
  emerald: { border: "hover:border-emerald-400/50", text: "group-hover:text-emerald-400", bg: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30" },
  yellow:  { border: "hover:border-yellow-400/50",  text: "group-hover:text-yellow-400",  bg: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30" }
}

export default function FazoviyTuzilishi() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedKS, setSelectedKS] = useState("all")
  const [showOnly3D, setShowOnly3D] = useState(false)

  // ═══════════════════════════════════════════════════════════
  // STATISTIKA
  // ═══════════════════════════════════════════════════════════
  const stats = useMemo(() => ({
    total: shakllar.length,
    with3D: shakllar.filter(s => s.has3D).length,
    ksRange: [Math.min(...shakllar.map(s => s.ks)), Math.max(...shakllar.map(s => s.ks))],
    ksCounts: shakllar.reduce((acc, s) => {
      acc[s.ks] = (acc[s.ks] || 0) + 1
      return acc
    }, {})
  }), [])

  // ═══════════════════════════════════════════════════════════
  // FILTERLANGAN SHAKLLAR
  // ═══════════════════════════════════════════════════════════
  const filtered = useMemo(() => {
    let result = shakllar
    
    if (selectedKS !== "all") {
      result = result.filter(s => s.ks === parseInt(selectedKS))
    }
    
    if (showOnly3D) {
      result = result.filter(s => s.has3D)
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.misollar.some(m => m.toLowerCase().includes(q)) ||
        s.gibrid.toLowerCase().includes(q)
      )
    }
    
    return result
  }, [selectedKS, showOnly3D, searchQuery])

  // ═══════════════════════════════════════════════════════════
  // KS BO'YICHA GURUHLANGAN
  // ═══════════════════════════════════════════════════════════
  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(s => {
      if (!groups[s.ks]) groups[s.ks] = []
      groups[s.ks].push(s)
    })
    return Object.entries(groups).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  }, [filtered])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ═════ HEADER ═════ */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv" className="hover:text-purple-300">O'quv</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Fazoviy tuzilishi</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-purple-300 flex items-center gap-3">
                <span className="text-3xl">💎</span>
                Fazoviy tuzilishi
              </h1>
              <p className="text-purple-500 text-sm mt-1">
                Koordinatsion son va VSEPR modeli asosida • KS=2 dan KS=12 gacha • 18 ta geometrik shakl
              </p>
            </div>
            <Link 
              href="/oquv"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Orqaga
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8">
        
        {/* ═════ STATISTIKA KARTOCHKALARI ═════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
            <div className="text-xs text-purple-400 mb-1">Jami shakllar</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-xl p-4">
            <div className="text-xs text-cyan-400 mb-1">3D model bilan</div>
            <div className="text-2xl font-bold text-white">{stats.with3D}</div>
          </div>
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
            <div className="text-xs text-amber-400 mb-1">KS diapazoni</div>
            <div className="text-2xl font-bold text-white font-mono">{stats.ksRange[0]}-{stats.ksRange[1]}</div>
          </div>
          <div className="bg-pink-900/30 border border-pink-700/50 rounded-xl p-4">
            <div className="text-xs text-pink-400 mb-1">KS guruhlar</div>
            <div className="text-2xl font-bold text-white">{Object.keys(stats.ksCounts).length}</div>
          </div>
        </div>

        {/* ═════ KIRISH QISMI ═════ */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Bu bo'limda nimalarni o'rganasiz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-purple-200">
            {[
              "18 ta geometrik shakl (KS=2 → KS=12)",
              "CPK xalqaro ranglar standarti",
              "VSEPR va Kepert modellari",
              "Har bir shakl uchun 3-4 ta misol",
              "Interaktiv 3D modellar (8 ta)",
              "Sendvich birikmalar (metallosenlar)"
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5 text-xs">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═════ FILTER VA QIDIRUV ═════ */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Shakl, birikma yoki xossa bo'yicha qidirish..."
              className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-purple-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-lg"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* KS filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-purple-400 font-semibold">KS:</span>
              <button
                onClick={() => setSelectedKS("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedKS === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                Hammasi
              </button>
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map(ks => (
                stats.ksCounts[ks] && (
                  <button
                    key={ks}
                    onClick={() => setSelectedKS(String(ks))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedKS === String(ks)
                        ? "bg-purple-600 text-white"
                        : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                    }`}
                  >
                    KS={ks}
                  </button>
                )
              ))}
            </div>

            {/* 3D filter */}
            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={showOnly3D}
                onChange={(e) => setShowOnly3D(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span className="text-xs text-purple-300 font-semibold">
                Faqat 3D modellar ({stats.with3D})
              </span>
            </label>
          </div>

          {/* Result count */}
          {(searchQuery || selectedKS !== "all" || showOnly3D) && (
            <div className="text-xs text-purple-400 pt-2 border-t border-purple-700/30">
              Topildi: <span className="text-white font-semibold">{filtered.length}</span> ta shakl
            </div>
          )}
        </div>

        {/* ═════ NATIJALAR YO'Q ═════ */}
        {filtered.length === 0 && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-white mb-2">Hech narsa topilmadi</h3>
            <p className="text-purple-400 text-sm mb-4">
              Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedKS("all")
                setShowOnly3D(false)
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}

        {/* ═════ GURUHLANGAN NATIJALAR ═════ */}
        {filtered.length > 0 && (
          <div className="space-y-8">
            {grouped.map(([ks, shapes]) => (
              <div key={ks}>
                {/* KS group header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-600/30 border border-purple-500/50 px-3 py-1 rounded-lg">
                    <span className="text-xs text-purple-300 font-semibold">Koordinatsion son</span>
                    <span className="text-lg font-bold text-white ml-2">{ks}</span>
                  </div>
                  <div className="flex-1 h-px bg-purple-700/50"></div>
                  <span className="text-xs text-purple-400">{shapes.length} ta shakl</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shapes.map((s, i) => {
                    const colors = rangMap[s.rang]
                    return (
                      <Link
                        key={i}
                        href={s.href}
                        className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 hover:bg-purple-800/60 ${colors.border} transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/30 relative overflow-hidden`}
                        aria-label={`${s.title} - ${s.desc}`}
                      >
                        {/* Featured badge */}
                        {s.featured && (
                          <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full border border-yellow-500/30">
                            ⭐ Muhim
                          </div>
                        )}

                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-4xl group-hover:scale-110 transition-transform">
                            {s.icon}
                          </span>
                          <div className="flex gap-1.5">
                            {s.has3D && (
                              <span className="bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                3D
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className={`text-base font-bold text-white mb-2 ${colors.text} transition-colors`}>
                          {s.title}
                        </h3>

                        {/* Description */}
                        <p className="text-purple-300 text-xs mb-2">{s.desc}</p>

                        {/* Gibridlanish */}
                        <p className="text-purple-400 text-[11px] mb-3 italic font-mono">
                          {s.gibrid}
                        </p>

                        {/* Misollar */}
                        <div className="mb-3">
                          <p className="text-[10px] text-purple-500 mb-1.5 uppercase font-semibold tracking-wider">
                            Misollar:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {s.misollar.slice(0, 3).map((m, j) => (
                              <span
                                key={j}
                                className="text-[10px] bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700/30 font-mono"
                              >
                                {m}
                              </span>
                            ))}
                            {s.misollar.length > 3 && (
                              <span className="text-[10px] text-purple-500 px-2 py-0.5">
                                +{s.misollar.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-purple-700/30">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${colors.bg}`}>
                            {s.badge}
                          </span>
                          {s.rarity && (
                            <span className="text-[10px] text-amber-400 italic">
                              {s.rarity}
                            </span>
                          )}
                          <span className="text-purple-400 group-hover:text-white text-xs transition-colors">
                            O'qish →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═════ ILMIY IZOH ═════ */}
        <div className="mt-10 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-sm font-bold text-amber-300 mb-2">Muhim ilmiy eslatma</h3>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                Zamonaviy koordinatsion kimyoda <strong className="text-amber-300">gibridlanish tushunchasi</strong> cheklangan qo'llaniladi.
                Ko'p hollarda <strong className="text-amber-300">VSEPR modeli</strong>, <strong className="text-amber-300">Kepert modeli</strong> va
                <strong className="text-amber-300"> Kristall maydon nazariyasi</strong> aniqroq natija beradi.
                f-orbitallar ishtirokidagi gibridlanish (sp³d³f) juda kam uchraydigan holatlar uchun.
              </p>
            </div>
          </div>
        </div>

        {/* ═════ MANBA ═════ */}
        <div className="mt-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 text-center">
          <p className="text-purple-300 text-xs">
            📚 <strong>Manba:</strong> A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.3, 5.5-bo'limlar)
          </p>
        </div>
      </section>
    </main>
  )
}