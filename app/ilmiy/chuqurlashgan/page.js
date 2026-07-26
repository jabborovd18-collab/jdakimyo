"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// MA'LUMOTLAR BAZASI — 22 ta mavzu + kategoriya + daraja + vaqt
// ═══════════════════════════════════════════════════════════════════════════
const MAVZULAR = [
  // ─── ASOSLAR ─────────────────────────────────
  {
    href: "/ilmiy/chuqurlashgan/atom-tuzilishi",
    icon: "🔬",
    title: "Atom tuzilishi va d-orbitallar",
    desc: "Shredinger tenglamasi, kvant sonlar, d-orbitallarning shakli va energiyasi, kompleks hosil qiluvchi metallarning elektron tuzilishi",
    badge: "I bob",
    badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
    category: "asoslar",
    level: "boshlangich",
    levelLabel: "Boshlang'ich",
    levelColor: "bg-green-600/20 text-green-400 border-green-600/30",
    time: "35 daqiqa",
    progress: 0,
    topics: ["Kvant sonlar", "d-orbitallar", "Elektron konfiguratsiya", "Shredinger tenglamasi"]
  },
  {
    href: "/ilmiy/chuqurlashgan/elektron-konfiguratsiya",
    icon: "📝",
    title: "Elektron konfiguratsiya va termlar",
    desc: "dⁿ konfiguratsiyalar, Russell-Saunders termlari, Hund qoidasi, asosiy holat, mikroholatlar jadvali",
    badge: "Termlar",
    badgeColor: "bg-amber-600/20 text-amber-400 border-amber-600/30",
    category: "asoslar",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "40 daqiqa",
    progress: 0,
    topics: ["Russell-Saunders", "Mikroholatlar", "Hund qoidalari", "Term belgilar"]
  },
  {
    href: "/ilmiy/chuqurlashgan/simmetriya",
    icon: "⚛️",
    title: "Molekulalar simmetriyasi",
    desc: "Nuqtali guruhlar (Oh, Td, D4h, D3h), simmetriya elementlari, xarakterlar jadvali, tebranish modlari",
    badge: "VIII bob",
    badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
    category: "asoslar",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "45 daqiqa",
    progress: 0,
    topics: ["Nuqtali guruhlar", "Simmetriya elementlari", "Xarakterlar jadvali", "Tebranish modlari"]
  },
  {
    href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish",
    icon: "🔗",
    title: "Kimyoviy bog'lanish (VB + MO)",
    desc: "Valent bog'lanish va molekulyar orbitallar nazariyalari, d²sp³/sp³d² gibridlanish, Metall-ligand σ va π bog'lar",
    badge: "III bob",
    badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    category: "asoslar",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "50 daqiqa",
    progress: 0,
    topics: ["VB nazariyasi", "MO nazariyasi", "Gibridlanish", "σ/π bog'lar"]
  },

  // ─── NAZARIYA ────────────────────────────────
  {
    href: "/ilmiy/chuqurlashgan/kristall-maydon",
    icon: "💎",
    title: "Kristall maydon nazariyasi",
    desc: "d-orbital ajralishi, Δo energiyasi, spektrokimyoviy qator, KMBE hisoblash, yuqori va quyi spinli holatlar",
    badge: "Asosiy",
    badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
    category: "nazariya",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "50 daqiqa",
    progress: 0,
    topics: ["d-orbital ajralishi", "KMBE", "Spektrokimyoviy qator", "Yuqori/past spin"]
  },
  {
    href: "/ilmiy/chuqurlashgan/ligand-maydon",
    icon: "🧩",
    title: "Ligand maydon nazariyasi",
    desc: "KMN va MO birlashmasi, σ-donor va π-akseptor ligandlar, MLCT va LMCT zaryad ko'chishi",
    badge: "Chuqur",
    badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    category: "nazariya",
    level: "ilgor",
    levelLabel: "Ilg'or",
    levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "55 daqiqa",
    progress: 0,
    topics: ["σ-donor", "π-akseptor", "MLCT", "LMCT"]
  },
  {
    href: "/ilmiy/chuqurlashgan/yan-teller",
    icon: "⚡",
    title: "Yan-Teller effekti",
    desc: "d⁴ va d⁹ konfiguratsiyalarda oktaedrik buzilish, Cu²⁺ komplekslari misolida, spektroskopik namoyon bo'lishi",
    badge: "Muhim",
    badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    category: "nazariya",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "35 daqiqa",
    progress: 0,
    topics: ["Oktaedrik buzilish", "d⁴/d⁹", "Cu²⁺ komplekslari", "Spektroskopiya"]
  },
  {
    href: "/ilmiy/chuqurlashgan/elektron-spektr",
    icon: "🎨",
    title: "Elektron spektrlari va rang",
    desc: "Term belgilar, tanlash qoidalari, Orgel va Tanabe-Sugano diagrammalari, d-d o'tishlar, komplekslarning rangi",
    badge: "VII bob",
    badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
    category: "nazariya",
    level: "ilgor",
    levelLabel: "Ilg'or",
    levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "55 daqiqa",
    progress: 0,
    topics: ["Orgel diagramma", "Tanabe-Sugano", "Tanlash qoidalari", "d-d o'tishlar"]
  },
  {
    href: "/ilmiy/chuqurlashgan/magnit",
    icon: "🧲",
    title: "Magnit xossalari",
    desc: "μeff = √n(n+2), Gui usuli, spin-orbit bog'lanish, diamagnit va paramagnit komplekslar, magnit anizotropiya",
    badge: "VI bob",
    badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
    category: "nazariya",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "40 daqiqa",
    progress: 0,
    topics: ["Spin-only formula", "GUI usuli", "Diamagnetizm", "Paramagnetizm"]
  },
  {
    href: "/ilmiy/chuqurlashgan/zaryad-kochishi",
    icon: "💫",
    title: "Zaryad ko'chishi spektrlari",
    desc: "MLCT (Ru-bipiridin), LMCT (Fe-sianid), MMCT (Prussiya ko'ki), intervalent zaryad ko'chishi (IVCT)",
    badge: "Spektr",
    badgeColor: "bg-lime-600/20 text-lime-400 border-lime-600/30",
    category: "nazariya",
    level: "ilgor",
    levelLabel: "Ilg'or",
    levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "45 daqiqa",
    progress: 0,
    topics: ["MLCT", "LMCT", "MMCT", "IVCT"]
  },

  // ─── GEOMETRIYA ──────────────────────────────
  {
    href: "/ilmiy/chuqurlashgan/koordinator-son",
    icon: "🔷",
    title: "Koordinator son va geometriya",
    desc: "KCh 2−12, poliedr modellari (VSEPR), Kepert modeli, trigonal bipiramida, kvadrat antiprizma, ikosaedr",
    badge: "Geometriya",
    badgeColor: "bg-violet-600/20 text-violet-400 border-violet-600/30",
    category: "geometriya",
    level: "boshlangich",
    levelLabel: "Boshlang'ich",
    levelColor: "bg-green-600/20 text-green-400 border-green-600/30",
    time: "35 daqiqa",
    progress: 0,
    topics: ["VSEPR", "Kepert modeli", "Poliedrlar", "KCh 2-12"]
  },
  {
    href: "/ilmiy/chuqurlashgan/izomeriya",
    icon: "🔄",
    title: "Komplekslar izomeriyasi",
    desc: "Geometrik (sis/trans, fac/mer), optik (Δ/Λ), ionlanish, bog'lanish, koordinatsion, gidrat izomeriyasi",
    badge: "IV bob",
    badgeColor: "bg-rose-600/20 text-rose-400 border-rose-600/30",
    category: "geometriya",
    level: "boshlangich",
    levelLabel: "Boshlang'ich",
    levelColor: "bg-green-600/20 text-green-400 border-green-600/30",
    time: "30 daqiqa",
    progress: 0,
    topics: ["Sis/trans", "fac/mer", "Δ/Λ optik", "Ionlanish"]
  },
  {
    href: "/ilmiy/chuqurlashgan/kop-yadroli",
    icon: "🪐",
    title: "Ko'p yadroli komplekslar",
    desc: "Metall klasterlar, M−M bog'lar ([Re₂Cl₈]²⁻), karbonil klasterlar, ko'p yadroli magnit komplekslar",
    badge: "Klaster",
    badgeColor: "bg-fuchsia-700/20 text-fuchsia-300 border-fuchsia-700/30",
    category: "geometriya",
    level: "ilgor",
    levelLabel: "Ilg'or",
    levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "50 daqiqa",
    progress: 0,
    topics: ["Metall klasterlar", "M-M bog'lar", "Karbonillar", "Ko'p yadroli magnit"]
  },

  // ─── REAKSIYALAR ─────────────────────────────
  {
    href: "/ilmiy/chuqurlashgan/kinetika",
    icon: "⏱️",
    title: "Kinetika va ligand almashinish",
    desc: "Inert va labil komplekslar, reaksiya mexanizmlari (D, A, I), Eyring tenglamasi, trans-ta'sir",
    badge: "Mexanizm",
    badgeColor: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30",
    category: "reaksiyalar",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "45 daqiqa",
    progress: 0,
    topics: ["Labil komplekslar", "D/A/I mexanizmlar", "Eyring tenglamasi", "Trans ta'sir"]
  },
  {
    href: "/ilmiy/chuqurlashgan/reaksiyalar",
    icon: "⚗️",
    title: "Komplekslar reaksiyalari",
    desc: "Ligand almashinish, oksidlanish-qaytarilish, oksidlovchi qo'shilish, katalitik sikllar (Monsanto, Wacker)",
    badge: "Reaksiya",
    badgeColor: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
    category: "reaksiyalar",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "40 daqiqa",
    progress: 0,
    topics: ["Oksidlanish-qaytarilish", "Oksidlovchi qo'shilish", "Monsanto", "Wacker"]
  },
  {
    href: "/ilmiy/chuqurlashgan/fotokimyo",
    icon: "💡",
    title: "Fotokimyo va fotofizika",
    desc: "Qo'zg'algan holat, fluoressensiya/fosforessensiya, [Ru(bpy)₃]²⁺, lantanid komplekslari, fotokataliz",
    badge: "Foton",
    badgeColor: "bg-sky-600/20 text-sky-400 border-sky-600/30",
    category: "reaksiyalar",
    level: "ilgor",
    levelLabel: "Ilg'or",
    levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "50 daqiqa",
    progress: 0,
    topics: ["Qo'zg'algan holat", "[Ru(bpy)₃]²⁺", "Fotokataliz", "Lantanidlar"]
  },

  // ─── AMALIY ──────────────────────────────────
  {
    href: "/ilmiy/chuqurlashgan/termodinamika",
    icon: "🌡️",
    title: "Termodinamika va barqarorlik",
    desc: "Barqarorlik konstantasi (Kstab), Irving-Uilyams qatori, xelat effekti, ΔH, ΔG, ΔS, HSAB nazariyasi",
    badge: "Hisoblash",
    badgeColor: "bg-teal-600/20 text-teal-400 border-teal-600/30",
    category: "amaliy",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "45 daqiqa",
    progress: 0,
    topics: ["Kstab", "Irving-Uilyams", "Xelat effekti", "HSAB"]
  },
  {
    href: "/ilmiy/chuqurlashgan/metall-dorilar",
    icon: "💊",
    title: "Metall dori vositalari",
    desc: "Sisplatin, karboplatin, oksaliplatin (Pt), NAMI-A (Ru), auranofin (Au), ferroquine (Fe) — ta'sir mexanizmlari",
    badge: "Tibbiyot",
    badgeColor: "bg-red-700/20 text-red-300 border-red-700/30",
    category: "amaliy",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "35 daqiqa",
    progress: 0,
    topics: ["Sisplatin", "Ru komplekslar", "Auranofin", "Ferroquine"]
  },
  {
    href: "/ilmiy/chuqurlashgan/bioanorganik",
    icon: "🧬",
    title: "Bioanorganik kimyo",
    desc: "Gemoglobin/mioglobin (Fe), B₁₂ koferment (Co), xlorofill (Mg), nitrogenaza (FeMoCo), karbonat angidraza (Zn)",
    badge: "Biologik",
    badgeColor: "bg-green-700/20 text-green-300 border-green-700/30",
    category: "amaliy",
    level: "orta",
    levelLabel: "O'rta",
    levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "40 daqiqa",
    progress: 0,
    topics: ["Gemoglobin", "B₁₂", "Xlorofill", "Nitrogenaza"]
  },
  {
    href: "/ilmiy/chuqurlashgan/supramolekulyar",
    icon: "🏗️",
    title: "Supramolekulyar komplekslar",
    desc: "MOF (metall-organic frameworks), metallosupramolekulyar ansambllar, host-guest kimyosi, molekulyar tanib olish",
    badge: "MOF",
    badgeColor: "bg-stone-600/20 text-stone-400 border-stone-600/30",
    category: "amaliy",
    level: "ilgor",
    levelLabel: "Ilg'or",
    levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "50 daqiqa",
    progress: 0,
    topics: ["MOF", "Host-guest", "Molekulyar tanib olish", "Ansambllar"]
  },
]

const KATEGORIYALAR = [
  { id: "barchasi", label: "📚 Barchasi", icon: "📚" },
  { id: "asoslar", label: "📖 Asoslar", icon: "📖" },
  { id: "nazariya", label: "💎 Nazariya", icon: "💎" },
  { id: "geometriya", label: "🔷 Geometriya", icon: "🔷" },
  { id: "reaksiyalar", label: "⚗️ Reaksiyalar", icon: "⚗️" },
  { id: "amaliy", label: "💊 Amaliy", icon: "💊" },
]

const DARAJALAR = [
  { id: "barchasi", label: "Barcha darajalar", icon: "🎯" },
  { id: "boshlangich", label: "🔵 Boshlang'ich", icon: "🔵" },
  { id: "orta", label: "🟡 O'rta", icon: "🟡" },
  { id: "ilgor", label: "🔴 Ilg'or", icon: "🔴" },
]

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Chuqurlashgan() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("barchasi")
  const [activeLevel, setActiveLevel] = useState("barchasi")
  const [viewMode, setViewMode] = useState("grid")
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState({})

  // LocalStorage dan progress ma'lumotlarini yuklash
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("jda-chuqurlashgan-progress")
      if (saved) setProgress(JSON.parse(saved))
    } catch (e) {}
  }, [])

  // Progressni saqlash
  const toggleProgress = (href) => {
    const newProgress = {
      ...progress,
      [href]: !progress[href]
    }
    setProgress(newProgress)
    try {
      localStorage.setItem("jda-chuqurlashgan-progress", JSON.stringify(newProgress))
    } catch (e) {}
  }

  // Filtrlangan mavzular
  const filteredMavzular = useMemo(() => {
    return MAVZULAR.filter(m => {
      const matchesSearch = searchTerm === "" || 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = activeCategory === "barchasi" || m.category === activeCategory
      const matchesLevel = activeLevel === "barchasi" || m.level === activeLevel
      
      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [searchTerm, activeCategory, activeLevel])

  // Progress statistikasi
  const stats = useMemo(() => {
    const total = MAVZULAR.length
    const completed = Object.values(progress).filter(Boolean).length
    const totalTime = MAVZULAR.reduce((sum, m) => {
      const min = parseInt(m.time) || 0
      return sum + min
    }, 0)
    const completedTime = MAVZULAR.filter(m => progress[m.href]).reduce((sum, m) => {
      return sum + (parseInt(m.time) || 0)
    }, 0)
    const byCategory = {}
    KATEGORIYALAR.filter(k => k.id !== "barchasi").forEach(k => {
      const total = MAVZULAR.filter(m => m.category === k.id).length
      const done = MAVZULAR.filter(m => m.category === k.id && progress[m.href]).length
      byCategory[k.id] = { total, done }
    })
    return { total, completed, totalTime, completedTime, byCategory }
  }, [progress])

  // Kategoriya ranglari
  const categoryColors = {
    asoslar: { bg: "from-purple-900/30 to-purple-800/20", border: "border-purple-600/30", text: "text-purple-400", dot: "bg-purple-500" },
    nazariya: { bg: "from-emerald-900/30 to-emerald-800/20", border: "border-emerald-600/30", text: "text-emerald-400", dot: "bg-emerald-500" },
    geometriya: { bg: "from-violet-900/30 to-violet-800/20", border: "border-violet-600/30", text: "text-violet-400", dot: "bg-violet-500" },
    reaksiyalar: { bg: "from-indigo-900/30 to-indigo-800/20", border: "border-indigo-600/30", text: "text-indigo-400", dot: "bg-indigo-500" },
    amaliy: { bg: "from-rose-900/30 to-rose-800/20", border: "border-rose-600/30", text: "text-rose-400", dot: "bg-rose-500" },
  }

  const categoryLabels = {
    asoslar: "📖 Asoslar",
    nazariya: "💎 Nazariya",
    geometriya: "🔷 Geometriya",
    reaksiyalar: "⚗️ Reaksiyalar",
    amaliy: "💊 Amaliy"
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link 
              href="/ilmiy" 
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-800/60 hover:bg-purple-700/80 flex items-center justify-center text-purple-300 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-purple-300 truncate flex items-center gap-2">
                <span>🔬</span>
                <span>Chuqurlashgan mavzular</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-purple-500 truncate">
                Kompleks birikmalar kimyosining fundamental asoslari • {MAVZULAR.length} ta mavzu
              </p>
            </div>
          </div>

          {/* Ko'rinish rejimi */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all text-sm ${
                viewMode === "grid" ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-400 hover:bg-purple-800/60"
              }`}
              title="Grid ko'rinishi"
            >
              ▦
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all text-sm ${
                viewMode === "list" ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-400 hover:bg-purple-800/60"
              }`}
              title="Ro'yxat ko'rinishi"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* STATISTIKA PANELI */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-300">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-purple-400 mt-1">📚 Mavzular</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-300">{stats.completed}</div>
            <div className="text-[10px] sm:text-xs text-emerald-400 mt-1">✅ O'qilgan</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-amber-300">{Math.floor(stats.totalTime / 60)} soat</div>
            <div className="text-[10px] sm:text-xs text-amber-400 mt-1">⏱️ Umumiy vaqt</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-300">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <div className="text-[10px] sm:text-xs text-cyan-400 mt-1">📊 Progress</div>
          </div>
        </div>

        {/* QIDIRUV VA FILTRLAR */}
        <div className="space-y-3 mb-6 sm:mb-8">
          {/* Qidiruv */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Mavzu, tavsif yoki kalit so'z bo'yicha qidirish..."
              className="w-full bg-purple-900/60 border border-purple-700/50 rounded-xl pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-purple-400 hover:text-white"
              >
                ✕
              </button>
            )}
            {searchTerm && (
              <div className="absolute -bottom-5 left-0 text-[10px] sm:text-xs text-purple-400">
                {filteredMavzular.length} ta natija topildi
              </div>
            )}
          </div>

          {/* Kategoriya filtrlari */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {KATEGORIYALAR.map(k => (
              <button
                key={k.id}
                onClick={() => setActiveCategory(k.id)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all border ${
                  activeCategory === k.id
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg'
                    : 'bg-purple-900/40 text-purple-300 border-purple-800/40 hover:bg-purple-800/60 hover:border-purple-600/50'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Daraja filtrlari */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {DARAJALAR.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveLevel(d.id)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all border ${
                  activeLevel === d.id
                    ? 'bg-purple-700/60 text-white border-purple-500/50 shadow-lg'
                    : 'bg-purple-950/60 text-purple-400 border-purple-800/30 hover:bg-purple-800/50'
                }`}
              >
                {d.icon} {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* ANIMATSIYALI KIRISH */}
        <div className={`bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-8 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📋</span>
            <span>Chuqurlashgan mavzular haqida</span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3 sm:mb-4">
            Bu bo'lim kompleks birikmalarning <strong className="text-yellow-400">nazariy asoslarini</strong> chuqur o'rganish uchun mo'ljallangan.
            Har bir mavzu kompleks birikmalarga moslashtirilgan va amaliy misollar bilan boyitilgan.
            Elektron tuzilishdan tortib bioanorganik kimyogacha — barcha fundamental yo'nalishlar qamrab olingan.
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs">📚 {stats.total} ta mavzu</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs">🔵 {MAVZULAR.filter(m => m.level === "boshlangich").length} ta boshlang'ich</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs">🟡 {MAVZULAR.filter(m => m.level === "orta").length} ta o'rta</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs">🔴 {MAVZULAR.filter(m => m.level === "ilgor").length} ta ilg'or</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs">⏱️ ~{Math.round(stats.totalTime / 60)} soat</span>
          </div>
          {/* Kategoriya bo'yicha progress */}
          <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
            {Object.entries(stats.byCategory).map(([cat, data]) => (
              <div key={cat} className="bg-purple-950/60 rounded-lg p-2 text-center">
                <div className="text-[10px] sm:text-xs text-purple-400 truncate">{categoryLabels[cat] || cat}</div>
                <div className="text-xs sm:text-sm font-bold text-white">{data.done}/{data.total}</div>
                <div className="w-full bg-purple-900 rounded-full h-1 mt-1">
                  <div 
                    className="bg-purple-500 h-1 rounded-full transition-all duration-500" 
                    style={{ width: data.total > 0 ? `${(data.done / data.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAVZULAR RO'YXATI */}
        {filteredMavzular.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Hech narsa topilmadi</h3>
            <p className="text-purple-400 text-sm">"{searchTerm}" bo'yicha hech qanday mavzu topilmadi. Qidiruv so'zini o'zgartirib ko'ring.</p>
            <button
              onClick={() => { setSearchTerm(""); setActiveCategory("barchasi"); setActiveLevel("barchasi") }}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-all"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID KO'RINISHI */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredMavzular.map((m, i) => (
              <div
                key={m.href}
                className={`group relative bg-gradient-to-br ${categoryColors[m.category]?.bg || "from-purple-900/40 to-purple-800/20"} border ${categoryColors[m.category]?.border || "border-purple-700/50"} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                  progress[m.href] ? 'ring-1 ring-emerald-500/30' : ''
                }`}
                style={{
                  animation: mounted ? `fadeIn 0.5s ease-out ${i * 0.05}s both` : 'none'
                }}
              >
                {/* Progress indikatori */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleProgress(m.href)
                  }}
                  className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    progress[m.href]
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-purple-600/50 hover:border-purple-400 bg-purple-950/50'
                  }`}
                  title={progress[m.href] ? "O'qilgan deb belgilash" : "O'qildi deb belgilash"}
                >
                  {progress[m.href] ? (
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : null}
                </button>

                <Link href={m.href} className="block">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="text-2xl sm:text-4xl group-hover:scale-110 transition-transform">{m.icon}</div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap ${m.badgeColor}`}>
                        {m.badge}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${m.levelColor} whitespace-nowrap`}>
                        {m.levelLabel}
                      </span>
                    </div>
                  </div>

                  {/* Sarlavha */}
                  <h3 className={`text-sm sm:text-base font-bold text-white group-hover:${categoryColors[m.category]?.text || "text-purple-400"} transition-colors mb-1 sm:mb-2 leading-tight`}>
                    {m.title}
                  </h3>

                  {/* Tavsif */}
                  <p className="text-[11px] sm:text-xs text-purple-300/80 leading-relaxed mb-2 sm:mb-3 line-clamp-3">
                    {m.desc}
                  </p>

                  {/* Kalit so'zlar */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {m.topics.slice(0, 3).map((t, ti) => (
                      <span key={ti} className="text-[8px] sm:text-[10px] px-1.5 py-0.5 bg-purple-950/60 text-purple-400 rounded-full border border-purple-800/30">
                        {t}
                      </span>
                    ))}
                    {m.topics.length > 3 && (
                      <span className="text-[8px] sm:text-[10px] px-1.5 py-0.5 text-purple-500">
                        +{m.topics.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Vaqt va kategoriya */}
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-purple-500 mt-auto pt-2 border-t border-purple-800/20">
                    <span>⏱️ {m.time}</span>
                    <span className={`${categoryColors[m.category]?.text || "text-purple-400"}`}>
                      {categoryLabels[m.category] || m.category}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-purple-950/60 rounded-full h-1 mt-2 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${progress[m.href] ? 'bg-emerald-500' : 'bg-purple-600/30'}`} 
                      style={{ width: progress[m.href] ? '100%' : '0%' }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* LIST KO'RINISHI */
          <div className="space-y-2">
            {filteredMavzular.map((m, i) => (
              <div
                key={m.href}
                className={`group bg-gradient-to-r ${categoryColors[m.category]?.bg || "from-purple-900/40 to-purple-800/20"} border ${categoryColors[m.category]?.border || "border-purple-700/50"} rounded-xl transition-all duration-500 hover:bg-purple-800/60 ${
                  progress[m.href] ? 'ring-1 ring-emerald-500/20' : ''
                }`}
                style={{
                  animation: mounted ? `fadeIn 0.5s ease-out ${i * 0.03}s both` : 'none'
                }}
              >
                <Link href={m.href} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleProgress(m.href)
                    }}
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      progress[m.href]
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-purple-600/50 hover:border-purple-400'
                    }`}
                  >
                    {progress[m.href] && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="text-xl sm:text-2xl flex-shrink-0">{m.icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-xs sm:text-sm font-bold text-white group-hover:${categoryColors[m.category]?.text || "text-purple-400"} transition-colors truncate`}>
                        {m.title}
                      </h3>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border font-semibold whitespace-nowrap ${m.badgeColor}`}>
                        {m.badge}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border ${m.levelColor} whitespace-nowrap`}>
                        {m.levelLabel}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-purple-300/70 mt-0.5 truncate">{m.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-[9px] sm:text-[10px] text-purple-500 hidden sm:block">⏱️ {m.time}</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER — manbalar */}
        <div className="mt-8 sm:mt-10 bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-[11px] sm:text-sm text-purple-300 leading-relaxed">
            📚 <strong className="text-purple-200">Manbalar:</strong> A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari |
            Molekulalar tuzilishi va kimyoviy bog'lanish | Kompleks birikmalar kimyosi
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
            <span className="text-[10px] sm:text-xs bg-purple-800/40 text-purple-300 px-2 sm:px-3 py-1 rounded-full border border-purple-700/40">
              ✅ {stats.completed}/{stats.total} o'qildi
            </span>
            <span className="text-[10px] sm:text-xs bg-purple-800/40 text-purple-300 px-2 sm:px-3 py-1 rounded-full border border-purple-700/40">
              ⏱️ {Math.round(stats.completedTime / 60)}/{Math.round(stats.totalTime / 60)} soat
            </span>
          </div>
        </div>

      </div>

      {/* CSS Animatsiyalar */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  )
}
