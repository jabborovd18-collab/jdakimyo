"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// MA'LUMOTLAR BAZASI — 20 ta tahlil usuli
// ============================================================================
const usullar = [
  // === SPEKTROSKOPIK USULLAR ===
  {
    id: "uv-vis",
    href: "/ilmiy/tahlil/ub-vis",
    icon: "🌈",
    title: "UV-Vis spektroskopiya",
    desc: "Ultrabinafsha va ko'rinadigan soha. d-d o'tishlar, LMCT/MLCT, Δo aniqlash.",
    toifa: "spektroskopiya",
    daraja: "boshlang'ich",
    aniqlaydi: ["Rang", "Δo qiymati", "Geometriya", "Spin holati"],
    bogliq: ["cd", "fluoressensiya", "titrlash"],
    tarixiy: { yil: 1852, olim: "Beer & Lambert" },
    rang: "purple",
    badge: "Eng ko'p qo'llaniladi"
  },
  {
    id: "ir",
    href: "/ilmiy/tahlil/iq",
    icon: "📊",
    title: "IQ spektroskopiya",
    desc: "Infraqizil soha. M−L bog'lari, ambidentat ligandlar, funksional guruhlar.",
    toifa: "spektroskopiya",
    daraja: "boshlang'ich",
    aniqlaydi: ["Funksional guruhlar", "M−L bog'lanishi", "Izomer farqlash"],
    bogliq: ["raman", "uv-vis"],
    tarixiy: { yil: 1800, olim: "Herschel" },
    rang: "blue",
    badge: "Molekulyar barmoq izi"
  },
  {
    id: "raman",
    href: "/ilmiy/tahlil/raman",
    icon: "🔆",
    title: "Raman spektroskopiya",
    desc: "Simmetrik tebranishlar, suvli eritmalarda IQ dan afzal, rezonans Raman.",
    toifa: "spektroskopiya",
    daraja: "o'rta",
    aniqlaydi: ["Simmetrik tebranishlar", "M−O, M−N bog'lar", "Kristallik daraja"],
    bogliq: ["ir", "uv-vis"],
    tarixiy: { yil: 1928, olim: "C.V. Raman" },
    rang: "sky",
    badge: "To'ldiruvchi tebranish"
  },
  {
    id: "nmr",
    href: "/ilmiy/tahlil/nmr",
    icon: "🧲",
    title: "YaMR spektroskopiya",
    desc: "Yadro magnit rezonansi. ¹H, ¹³C, ³¹P, paramagnit NMR, Evans usuli.",
    toifa: "spektroskopiya",
    daraja: "o'rta",
    aniqlaydi: ["Kimyoviy siljish", "Ligand almashinish", "μeff (Evans)"],
    bogliq: ["epr", "magnit"],
    tarixiy: { yil: 1946, olim: "Bloch & Purcell" },
    rang: "green",
    badge: "Tuzilish aniqlash"
  },
  {
    id: "epr",
    href: "/ilmiy/tahlil/epr",
    icon: "📡",
    title: "EPR spektroskopiya",
    desc: "Elektron paramagnit rezonans. Toq elektronli komplekslar, g-faktor, ZFS.",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["g-faktor", "Spin holati", "Hiperfin tuzilish"],
    bogliq: ["nmr", "magnit", "mossbauer"],
    tarixiy: { yil: 1944, olim: "E.K. Zavoisky" },
    rang: "lime",
    badge: "Paramagnit komplekslar"
  },
  {
    id: "mossbauer",
    href: "/ilmiy/tahlil/mossbauer",
    icon: "⚛️",
    title: "Mössbauer spektroskopiya",
    desc: "Fe, Sn komplekslari uchun. δ (isomer siljish), ΔE_Q (kvadrupol).",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["Oksidlanish", "Spin holati", "Simmetriya"],
    bogliq: ["xanes", "epr", "magnit"],
    tarixiy: { yil: 1958, olim: "R. Mössbauer" },
    rang: "teal",
    badge: "Fe komplekslari"
  },
  {
    id: "cd",
    href: "/ilmiy/tahlil/cd",
    icon: "🔄",
    title: "CD spektroskopiya",
    desc: "Circular Dichroism. Δ/Λ enantiomerlar, optik faollik, absolyut konfiguratsiya.",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["Xirallik", "Enantiomer tozaligi", "Absolyut konfiguratsiya"],
    bogliq: ["uv-vis"],
    tarixiy: { yil: 1811, olim: "Arago & Biot" },
    rang: "rose",
    badge: "Xirallik aniqlash"
  },
  {
    id: "fluoressensiya",
    href: "/ilmiy/tahlil/fluoressensiya",
    icon: "💡",
    title: "Fluoressensiya",
    desc: "Lyuminestsent komplekslar (Eu³⁺, Tb³⁺, Ru²⁺, Ir³⁺). Sensor, bioimaging.",
    toifa: "spektroskopiya",
    daraja: "o'rta",
    aniqlaydi: ["Kvant unumdorligi", "Hayot vaqti", "Antenna effekti"],
    bogliq: ["uv-vis"],
    tarixiy: { yil: 1852, olim: "G.G. Stokes" },
    rang: "amber",
    badge: "Lyuminestsensiya"
  },
  {
    id: "xps",
    href: "/ilmiy/tahlil/xps",
    icon: "🔬",
    title: "XPS spektroskopiya",
    desc: "Rentgen fotoelektron. Oksidlanish darajasi, sirt tarkibi, Auger chiziqlari.",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["Oksidlanish", "Sirt tarkibi", "Bog' energiyasi"],
    bogliq: ["xanes", "element-analiz"],
    tarixiy: { yil: 1954, olim: "K. Siegbahn" },
    rang: "stone",
    badge: "Sirt tahlili"
  },

  // === DIFRAKTSION VA MIKROSKOPIK ===
  {
    id: "rentgen",
    href: "/ilmiy/tahlil/rentgen",
    icon: "💎",
    title: "Rentgen difraksiyasi",
    desc: "SCXRD va PXRD. Panjara parametrlari, bog' uzunliklari, fazoviy guruhlar.",
    toifa: "difraksiya",
    daraja: "ilmiy",
    aniqlaydi: ["3D struktura", "Bog' uzunligi", "Fazoviy guruh"],
    bogliq: ["exafs", "neutron"],
    tarixiy: { yil: 1912, olim: "von Laue & Bragg" },
    rang: "yellow",
    badge: "Aniq struktura"
  },
  {
    id: "exafs",
    href: "/ilmiy/tahlil/exafs",
    icon: "🔮",
    title: "EXAFS / XANES",
    desc: "Rentgen yutilish. Mahalliy struktura, bog' uzunliklari, amorf namunalarda.",
    toifa: "difraksiya",
    daraja: "ilmiy",
    aniqlaydi: ["R, N, σ²", "Koordinatsion son", "Oksidlanish"],
    bogliq: ["rentgen", "xanes", "mossbauer"],
    tarixiy: { yil: 1929, olim: "Kronig & Kossel" },
    rang: "emerald",
    badge: "Mahalliy struktura"
  },

  // === MASS VA ANALITIK ===
  {
    id: "mass",
    href: "/ilmiy/tahlil/mass",
    icon: "⚖️",
    title: "Mass-spektrometriya",
    desc: "ESI, MALDI. Molekulyar massa, izotop taqsimoti, fragmentlanish.",
    toifa: "analitik",
    daraja: "o'rta",
    aniqlaydi: ["Molekulyar massa", "Izotoplar", "Fragmentlar"],
    bogliq: ["element-analiz", "icp"],
    tarixiy: { yil: 1913, olim: "J.J. Thomson" },
    rang: "pink",
    badge: "Molekulyar massa"
  },
  {
    id: "element-analiz",
    href: "/ilmiy/tahlil/element-analiz",
    icon: "🧪",
    title: "Element analiz (EA)",
    desc: "C, H, N, S foiz tarkibi. Empirik formula tasdiqlash.",
    toifa: "analitik",
    daraja: "boshlang'ich",
    aniqlaydi: ["Empirik formula", "Soflik darajasi"],
    bogliq: ["mass", "titrlash"],
    tarixiy: { yil: 1831, olim: "Liebig" },
    rang: "indigo",
    badge: "Tarkib tasdiqlash"
  },
  {
    id: "aas",
    href: "/ilmiy/tahlil/aas",
    icon: "🧯",
    title: "AAS — Atom-Absorbsion",
    desc: "Metall ionlari miqdoriy tahlili. ppb−ppm darajasida.",
    toifa: "analitik",
    daraja: "boshlang'ich",
    aniqlaydi: ["Metall konsentratsiyasi"],
    bogliq: ["icp"],
    tarixiy: { yil: 1955, olim: "A. Walsh" },
    rang: "red",
    badge: "Metall miqdori"
  },
  {
    id: "icp",
    href: "/ilmiy/tahlil/icp",
    icon: "🧬",
    title: "ICP-OES / ICP-MS",
    desc: "Ko'p elementli tahlil. ppb−ppt darajada, izotop nisbati.",
    toifa: "analitik",
    daraja: "o'rta",
    aniqlaydi: ["Ko'p elementli tarkib", "Izotoplar", "Iz miqdori"],
    bogliq: ["aas", "mass"],
    tarixiy: { yil: 1965, olim: "V.A. Fassel" },
    rang: "cyan",
    badge: "Ko'p elementli"
  },

  // === FIZIK-KIMYOVIY ===
  {
    id: "magnit",
    href: "/ilmiy/tahlil/magnit",
    icon: "🧲",
    title: "SQUID magnitometriyasi",
    desc: "χ(T), μeff, J (exchange), spin crossover, Curie-Weiss.",
    toifa: "fizik-kimyoviy",
    daraja: "ilmiy",
    aniqlaydi: ["μeff", "Spin holati", "Exchange coupling"],
    bogliq: ["epr", "nmr"],
    tarixiy: { yil: 1964, olim: "J. Zimmerman" },
    rang: "orange",
    badge: "Spin holati"
  },
  {
    id: "elektrokimyo",
    href: "/ilmiy/tahlil/elektrokimyo",
    icon: "⚡",
    title: "Elektrokimyoviy tahlil",
    desc: "CV, DPV. Oksidlanish-qaytarilish potensiallari, reversivlik.",
    toifa: "fizik-kimyoviy",
    daraja: "o'rta",
    aniqlaydi: ["E°", "Reversivlik", "Kinetika"],
    bogliq: ["uv-vis", "xps"],
    tarixiy: { yil: 1960, olim: "Adams & Nicholson" },
    rang: "cyan",
    badge: "Redoks xossalari"
  },
  {
    id: "termik",
    href: "/ilmiy/tahlil/termik",
    icon: "🔥",
    title: "Termik tahlil",
    desc: "TGA, DTA, DSC. Termik barqarorlik, gidrat suvlar, parchalanish.",
    toifa: "fizik-kimyoviy",
    daraja: "boshlang'ich",
    aniqlaydi: ["Termik barqarorlik", "Suv yo'qotish", "Fazaviy o'tish"],
    bogliq: ["rentgen", "element-analiz"],
    tarixiy: { yil: 1887, olim: "H. Le Chatelier" },
    rang: "red",
    badge: "Harorat ta'siri"
  },
  {
    id: "konduktometriya",
    href: "/ilmiy/tahlil/konduktometriya",
    icon: "🔌",
    title: "Konduktometriya",
    desc: "Elektr o'tkazuvchanlik. Ionlar soni, elektrolit turi (1:1, 1:2, 1:3).",
    toifa: "fizik-kimyoviy",
    daraja: "boshlang'ich",
    aniqlaydi: ["Ionlar soni", "Elektrolit turi"],
    bogliq: ["titrlash", "element-analiz"],
    tarixiy: { yil: 1893, olim: "A. Werner" },
    rang: "blue",
    badge: "Ionlar soni"
  },
  {
    id: "titrlash",
    href: "/ilmiy/tahlil/titrlash",
    icon: "📊",
    title: "Spektrofotometrik titrlash",
    desc: "Barqarorlik konstantalari, ligand almashinish, stoxiometriya.",
    toifa: "fizik-kimyoviy",
    daraja: "o'rta",
    aniqlaydi: ["log β", "Stoxiometriya", "Kinetika"],
    bogliq: ["uv-vis", "element-analiz"],
    tarixiy: { yil: 1908, olim: "Job & Bjerrum" },
    rang: "violet",
    badge: "Barqarorlik konstantasi"
  }
]

// ============================================================================
// RANGLAR XARITASI
// ============================================================================
const ranglar = {
  purple: { bg: "bg-purple-600/20", text: "text-purple-400", border: "border-purple-600/30", hover: "hover:border-purple-400/50", hoverText: "group-hover:text-purple-400" },
  blue: { bg: "bg-blue-600/20", text: "text-blue-400", border: "border-blue-600/30", hover: "hover:border-blue-400/50", hoverText: "group-hover:text-blue-400" },
  sky: { bg: "bg-sky-600/20", text: "text-sky-400", border: "border-sky-600/30", hover: "hover:border-sky-400/50", hoverText: "group-hover:text-sky-400" },
  green: { bg: "bg-green-600/20", text: "text-green-400", border: "border-green-600/30", hover: "hover:border-green-400/50", hoverText: "group-hover:text-green-400" },
  lime: { bg: "bg-lime-600/20", text: "text-lime-400", border: "border-lime-600/30", hover: "hover:border-lime-400/50", hoverText: "group-hover:text-lime-400" },
  teal: { bg: "bg-teal-600/20", text: "text-teal-400", border: "border-teal-600/30", hover: "hover:border-teal-400/50", hoverText: "group-hover:text-teal-400" },
  rose: { bg: "bg-rose-600/20", text: "text-rose-400", border: "border-rose-600/30", hover: "hover:border-rose-400/50", hoverText: "group-hover:text-rose-400" },
  amber: { bg: "bg-amber-600/20", text: "text-amber-400", border: "border-amber-600/30", hover: "hover:border-amber-400/50", hoverText: "group-hover:text-amber-400" },
  stone: { bg: "bg-stone-600/20", text: "text-stone-400", border: "border-stone-600/30", hover: "hover:border-stone-400/50", hoverText: "group-hover:text-stone-400" },
  yellow: { bg: "bg-yellow-600/20", text: "text-yellow-400", border: "border-yellow-600/30", hover: "hover:border-yellow-400/50", hoverText: "group-hover:text-yellow-400" },
  emerald: { bg: "bg-emerald-600/20", text: "text-emerald-400", border: "border-emerald-600/30", hover: "hover:border-emerald-400/50", hoverText: "group-hover:text-emerald-400" },
  pink: { bg: "bg-pink-600/20", text: "text-pink-400", border: "border-pink-600/30", hover: "hover:border-pink-400/50", hoverText: "group-hover:text-pink-400" },
  indigo: { bg: "bg-indigo-600/20", text: "text-indigo-400", border: "border-indigo-600/30", hover: "hover:border-indigo-400/50", hoverText: "group-hover:text-indigo-400" },
  red: { bg: "bg-red-600/20", text: "text-red-400", border: "border-red-600/30", hover: "hover:border-red-400/50", hoverText: "group-hover:text-red-400" },
  cyan: { bg: "bg-cyan-600/20", text: "text-cyan-400", border: "border-cyan-600/30", hover: "hover:border-cyan-400/50", hoverText: "group-hover:text-cyan-400" },
  orange: { bg: "bg-orange-600/20", text: "text-orange-400", border: "border-orange-600/30", hover: "hover:border-orange-400/50", hoverText: "group-hover:text-orange-400" },
  violet: { bg: "bg-violet-600/20", text: "text-violet-400", border: "border-violet-600/30", hover: "hover:border-violet-400/50", hoverText: "group-hover:text-violet-400" },
}

// ============================================================================
// TOIFALAR VA DARAJALAR
// ============================================================================
const toifalar = [
  { id: "hammasi", label: "Hammasi", icon: "🎯", soni: 20 },
  { id: "spektroskopiya", label: "Spektroskopik", icon: "🌈", soni: 9 },
  { id: "difraksiya", label: "Diffraktsion", icon: "💎", soni: 2 },
  { id: "analitik", label: "Analitik", icon: "⚖️", soni: 4 },
  { id: "fizik-kimyoviy", label: "Fizik-kimyoviy", icon: "⚡", soni: 5 }
]

const darajalar = [
  { id: "hammasi", label: "Barcha darajalar" },
  { id: "boshlang'ich", label: "🟢 Boshlang'ich" },
  { id: "o'rta", label: "🟡 O'rta" },
  { id: "ilmiy", label: "🔴 Ilmiy (chuqur)" }
]

// ============================================================================
// ASOSIY KOMPONENT
// ============================================================================
export default function TahlilUsullari() {
  const [activeToifa, setActiveToifa] = useState("hammasi")
  const [activeDaraja, setActiveDaraja] = useState("hammasi")
  const [qidiruv, setQidiruv] = useState("")
  const [selectedUsul, setSelectedUsul] = useState(null)

  const filteredUsullar = useMemo(() => {
    return usullar.filter(u => {
      const toifaMos = activeToifa === "hammasi" || u.toifa === activeToifa
      const darajaMos = activeDaraja === "hammasi" || u.daraja === activeDaraja
      const qidiruvMos = qidiruv === "" ||
        u.title.toLowerCase().includes(qidiruv.toLowerCase()) ||
        u.desc.toLowerCase().includes(qidiruv.toLowerCase()) ||
        u.aniqlaydi.some(a => a.toLowerCase().includes(qidiruv.toLowerCase()))
      return toifaMos && darajaMos && qidiruvMos
    })
  }, [activeToifa, activeDaraja, qidiruv])

  const selectedData = selectedUsul ? usullar.find(u => u.id === selectedUsul) : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <Link href="/ilmiy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Ilmiy
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-yellow-400">📊 Tahlil usullari</h1>
          <p className="text-purple-400 text-sm">20 ta zamonaviy fizik-kimyoviy usul — interaktiv katalogi</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">

        {/* STATISTIKA */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">20</div>
              <div className="text-purple-400 text-xs">tahlil usuli</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">9</div>
              <div className="text-purple-400 text-xs">spektroskopik</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">4</div>
              <div className="text-purple-400 text-xs">toifa</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">1800+</div>
              <div className="text-purple-400 text-xs">yillik tarix</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">100+</div>
              <div className="text-purple-400 text-xs">ilmiy asos</div>
            </div>
          </div>
        </div>

        {/* FILTER PANELI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold">🔍 Qidiruv:</span>
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: spin holati, bog' uzunligi..."
              className="flex-1 bg-purple-800/30 border border-purple-700/50 rounded-lg px-4 py-2 text-sm text-white placeholder-purple-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <p className="text-purple-300 text-sm mb-2 font-semibold">Toifa bo'yicha:</p>
            <div className="flex gap-2 flex-wrap">
              {toifalar.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveToifa(t.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeToifa === t.id
                      ? "bg-emerald-600/80 text-white shadow-lg"
                      : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                  }`}
                >
                  {t.icon} {t.label} <span className="opacity-70">({t.soni})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple-300 text-sm mb-2 font-semibold">Murakkablik darajasi:</p>
            <div className="flex gap-2 flex-wrap">
              {darajalar.map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDaraja(d.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeDaraja === d.id
                      ? "bg-yellow-600/80 text-white shadow-lg"
                      : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-purple-400 text-xs">
            Topildi: <span className="text-emerald-400 font-bold">{filteredUsullar.length}</span> ta usul
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {filteredUsullar.map(u => {
            const r = ranglar[u.rang]
            return (
              <Link
                key={u.id}
                href={u.href}
                className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${r.hover} transition-all transform hover:-translate-y-2 hover:shadow-xl relative`}
                onMouseEnter={() => setSelectedUsul(u.id)}
                onMouseLeave={() => setSelectedUsul(null)}
              >
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                    u.daraja === "boshlang'ich" ? "bg-green-600/20 text-green-400 border-green-600/30" :
                    u.daraja === "o'rta" ? "bg-yellow-600/20 text-yellow-400 border-yellow-600/30" :
                    "bg-red-600/20 text-red-400 border-red-600/30"
                  }`}>
                    {u.daraja}
                  </span>
                </div>

                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{u.icon}</div>
                <h3 className={`text-lg font-bold text-white ${r.hoverText} transition-colors mb-2`}>
                  {u.title}
                </h3>
                <p className="text-purple-300 text-sm mb-4 leading-relaxed min-h-[60px]">{u.desc}</p>

                <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${r.bg} ${r.text} ${r.border} font-semibold mb-3`}>
                  {u.badge}
                </span>

                <div className="flex flex-wrap gap-1 mt-3">
                  {u.aniqlaydi.slice(0, 2).map((a, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-800/50 rounded-full text-purple-200">
                      {a}
                    </span>
                  ))}
                  {u.aniqlaydi.length > 2 && (
                    <span className="text-[10px] px-2 py-0.5 bg-purple-800/50 rounded-full text-purple-400">
                      +{u.aniqlaydi.length - 2}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-purple-700/30 text-[10px] text-purple-500">
                  {u.tarixiy.yil} • {u.tarixiy.olim}
                </div>
              </Link>
            )
          })}
        </div>

        {filteredUsullar.length === 0 && (
          <div className="bg-red-900/20 border border-red-600/30 rounded-2xl p-8 text-center mb-10">
            <p className="text-red-300 text-lg">😔 Hech narsa topilmadi</p>
            <p className="text-purple-400 text-sm mt-2">Qidiruvni yoki filtrlarni o'zgartiring</p>
          </div>
        )}

        {/* USUL HAQIDA MA'LUMOT PANELI */}
        {selectedData && (
          <div className="bg-purple-900/40 border border-emerald-500/30 rounded-2xl p-6 mb-10">
            <h3 className="text-lg font-bold text-emerald-400 mb-3">
              {selectedData.icon} {selectedData.title} — batafsil ma'lumot
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-800/30 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-2">Nima aniqlaydi:</p>
                <ul className="text-purple-200 space-y-1 text-xs">
                  {selectedData.aniqlaydi.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-2">Birgalikda ishlatiladi:</p>
                <ul className="text-purple-200 space-y-1 text-xs">
                  {selectedData.bogliq.map(b => {
                    const bogliqUsul = usullar.find(u => u.id === b)
                    return bogliqUsul && <li key={b}>• {bogliqUsul.icon} {bogliqUsul.title}</li>
                  })}
                </ul>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-2">Tarixiy ma'lumot:</p>
                <p className="text-purple-200 text-xs">
                  <strong className="text-emerald-400">{selectedData.tarixiy.yil}-yil</strong> da
                  <strong> {selectedData.tarixiy.olim}</strong> tomonidan
                  ishlab chiqilgan yoki kashf etilgan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW — TO'LIQ TAHLIL KETMA-KETLIGI */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-2">🎯 Kompleks birikmani to'liq tahlil qilish ketma-ketligi</h2>
          <p className="text-purple-400 text-sm mb-6">Tadqiqot jarayonida usullar qanday tartibda qo'llaniladi:</p>

          <div className="space-y-4">
            {[
              {
                bosqich: "1-bosqich",
                nomi: "Dastlabki tekshiruv",
                usullar: ["termik", "element-analiz", "mass"],
                natija: "Empirik formula, termik barqarorlik, molekulyar massa",
                rang: "emerald"
              },
              {
                bosqich: "2-bosqich",
                nomi: "Strukturani aniqlash",
                usullar: ["rentgen", "ir", "raman"],
                natija: "3D struktura, bog' uzunliklari, ligand identifikatsiyasi",
                rang: "blue"
              },
              {
                bosqich: "3-bosqich",
                nomi: "Elektron struktura",
                usullar: ["uv-vis", "cd", "fluoressensiya"],
                natija: "Δo, spin holati, xirallik, optik xususiyatlar",
                rang: "purple"
              },
              {
                bosqich: "4-bosqich",
                nomi: "Magnit xususiyatlar",
                usullar: ["magnit", "epr", "mossbauer"],
                natija: "μeff, spin, exchange coupling, oksidlanish darajasi",
                rang: "orange"
              },
              {
                bosqich: "5-bosqich",
                nomi: "Fizik-kimyoviy xossalar",
                usullar: ["elektrokimyo", "konduktometriya", "titrlash"],
                natija: "Redoks, barqarorlik konstantalari, kinetika",
                rang: "cyan"
              },
              {
                bosqich: "6-bosqich",
                nomi: "Chuqur tahlil (maxsus holatlar)",
                usullar: ["exafs", "xps", "icp"],
                natija: "Amorf namunalar, sirt xossalari, iz miqdorlari",
                rang: "yellow"
              }
            ].map((b, i) => {
              const r = ranglar[b.rang]
              return (
                <div key={i} className={`bg-purple-800/30 border-l-4 ${b.rang === 'emerald' ? 'border-emerald-400' : b.rang === 'blue' ? 'border-blue-400' : b.rang === 'purple' ? 'border-purple-400' : b.rang === 'orange' ? 'border-orange-400' : b.rang === 'cyan' ? 'border-cyan-400' : 'border-yellow-400'} rounded-r-xl p-4`}>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div>
                      <span className="text-xs text-purple-400 font-mono">{b.bosqich}</span>
                      <h4 className="text-white font-bold">{b.nomi}</h4>
                    </div>
                    <div className="flex gap-2 flex-wrap flex-1 min-w-[200px]">
                      {b.usullar.map(uid => {
                        const u = usullar.find(x => x.id === uid)
                        return u && (
                          <span key={uid} className={`text-xs px-2 py-1 rounded border ${r.bg} ${r.text} ${r.border}`}>
                            {u.icon} {u.title}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <p className="text-purple-300 text-xs mt-2">→ {b.natija}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* TARIXIY VAQT CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-6">📜 Tahlil usullarining tarixiy rivojlanishi</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-700/50"></div>
            <div className="space-y-4">
              {[...usullar]
                .sort((a, b) => a.tarixiy.yil - b.tarixiy.yil)
                .slice(0, 8)
                .map(u => (
                <div key={u.id} className="relative pl-12">
                  <div className="absolute left-0 top-2 w-8 h-8 bg-purple-800 rounded-full border-2 border-purple-600 flex items-center justify-center text-sm">
                    {u.icon}
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-yellow-400 font-bold font-mono">{u.tarixiy.yil}</span>
                      <span className="text-white font-bold text-sm">{u.title}</span>
                      <span className="text-purple-400 text-xs">• {u.tarixiy.olim}</span>
                    </div>
                    <p className="text-purple-300 text-xs">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-purple-400 text-xs mt-6 text-center">
            ⏳ Eng qadimiysidan eng zamonaviysigacha — 200 yillik ilmiy taraqqiyot
          </p>
        </div>

        {/* QOIDALAR VA MASLAHATLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
            <h3 className="text-emerald-400 font-bold mb-3">✅ Qachon qaysi usulni tanlash kerak?</h3>
            <ul className="space-y-2 text-xs text-purple-200">
              <li>• <strong className="text-yellow-400">Kristall namuna bormi?</strong> → Rentgen (SCXRD)</li>
              <li>• <strong className="text-yellow-400">Amorf namuna?</strong> → EXAFS yoki Powder XRD</li>
              <li>• <strong className="text-yellow-400">Toq elektron bormi?</strong> → EPR yoki SQUID</li>
              <li>• <strong className="text-yellow-400">Fe kompleksimi?</strong> → Mössbauer + XANES</li>
              <li>• <strong className="text-yellow-400">Xiral kompleks?</strong> → CD spektroskopiya</li>
              <li>• <strong className="text-yellow-400">Redoks xossasi?</strong> → Siklik voltammetriya</li>
            </ul>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6">
            <h3 className="text-yellow-400 font-bold mb-3">⚠️ Cheklovlar va xatoliklar</h3>
            <ul className="space-y-2 text-xs text-purple-200">
              <li>• UV-Vis — <strong>faqat eritmalarda</strong> ishlaydi</li>
              <li>• NMR — <strong>diamagnit komplekslarda</strong> aniq</li>
              <li>• XRD — <strong>yaxshi kristall</strong> talab qiladi</li>
              <li>• Mössbauer — <strong>faqat ⁵⁷Fe, ¹¹⁹Sn</strong> uchun</li>
              <li>• EA — <strong>sof modda</strong> kerak (aralashmalar xalaqit beradi)</li>
              <li>• TGA — <strong>fazoviy o'tish</strong>larni farqlamaydi</li>
            </ul>
          </div>
        </div>

        {/* YAKUNIY XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">🎓 Asosiy qoida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Bitta usul hech qachon yetarli emas!</strong> Zamonaviy tadqiqotda
            har bir kompleks kamida <strong className="text-emerald-400">5-6 ta turli usul</strong> bilan tasdiqlanadi.
            Bular bir-birini <strong>to'ldiradi</strong>, ba'zida esa <strong>qarama-qarshi</strong> natija
            berib, yangi savollar tug'diradi.
          </p>
          <div className="bg-purple-900/50 rounded-xl p-4">
            <p className="text-sm text-purple-300">
              💡 <strong className="text-emerald-400">Maslahat:</strong> Yangi kompleks sintez qilganda,
              avvalo <strong className="text-yellow-400">EA + MS + IR</strong> (tarkib va funksional guruhlar),
              keyin <strong className="text-yellow-400">XRD</strong> (agar kristallansa),
              so'ngra <strong className="text-yellow-400">UV-Vis + magnit</strong> (elektron va spin xossalari)
              qiling.
            </p>
          </div>
        </div>

      </section>
    </main>
  )
}