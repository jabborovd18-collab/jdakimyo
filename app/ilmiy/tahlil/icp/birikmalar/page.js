"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// MA'LUMOTLAR BAZASI — ICP-OES / ICP-MS uchun 12 ta Klassik Kompleks Birikma
// Har bir birikma ICP ning aynan qaysi xususiyatini ochib berishini ko'rsatadi
// ============================================================================

const birikmalar = [
  {
    id: "k4-fe-cn6-3h2o",
    slug: "k4-fe-cn6-3h2o",
    formula: "K₄[Fe(CN)₆]·3H₂O",
    iupac: "Kaliy geksatsianoferrat(II) trihidrat",
    type: "Kompleks anion",
    metals: ["Fe²⁺", "K⁺"],
    M: 422.39,
    icpOES: { lambda_Fe: "238.2 / 259.9", lambda_K: "766.5", lod_Fe: 0.5, lod_K: 5.0 },
    icpMS: { mz_Fe: "56 (91.7%)", mz_K: "39 (93.3%)", lod_Fe: 0.5, lod_K: 50 },
    interference: "⁴⁰Ar¹⁶O⁺ → m/z=56 (Fe uchun)",
    collisionCell: "He rejimi (KED) kerak",
    internalStandard: "Sc (45) — Fe uchun, Ge (72) — K uchun",
    uniqueFeature: "Ko'p elementli: Fe va K bir vaqtda o'lchanadi. ArO⁺ interferensiyasi muammosi.",
    color: "yellow"
  },
  {
    id: "k3-fe-cn6",
    slug: "k3-fe-cn6",
    formula: "K₃[Fe(CN)₆]",
    iupac: "Kaliy geksatsianoferrat(III)",
    type: "Kompleks anion",
    metals: ["Fe³⁺", "K⁺"],
    M: 329.24,
    icpOES: { lambda_Fe: "238.2 / 259.9", lambda_K: "766.5", lod_Fe: 0.5, lod_K: 5.0 },
    icpMS: { mz_Fe: "56 (91.7%)", mz_K: "39 (93.3%)", lod_Fe: 0.5, lod_K: 50 },
    interference: "⁴⁰Ar¹⁶O⁺ → m/z=56 (Fe uchun)",
    collisionCell: "He rejimi (KED) kerak",
    internalStandard: "Sc (45) — Fe uchun",
    uniqueFeature: "ICP Fe²⁺ va Fe³⁺ ni farqlay OLMAYDI — ikkalasi ham umumiy Fe sifatida ko'rinadi.",
    color: "orange"
  },
  {
    id: "cr-h2o6-cl3",
    slug: "cr-h2o6-cl3",
    formula: "[Cr(H₂O)₆]Cl₃",
    iupac: "Geksaakvaxrom(III) xlorid",
    type: "Kompleks kation",
    metals: ["Cr³⁺"],
    M: 266.44,
    icpOES: { lambda_Cr: "267.7 / 205.6", lod_Cr: 0.5 },
    icpMS: { mz_Cr: "52 (83.8%)", lod_Cr: 0.3 },
    interference: "⁴⁰Ar¹²C⁺ → m/z=52 (Cr uchun)",
    collisionCell: "H₂ rejimi (reaktiv) yoki ⁵³Cr ishlatish",
    internalStandard: "Sc (45)",
    uniqueFeature: "ArC⁺ interferensiyasi — uglerodli matritsada muammo. H₂ rejimi yechim.",
    color: "violet"
  },
  {
    id: "cu-nh3-4-so4-h2o",
    slug: "cu-nh3-4-so4-h2o",
    formula: "[Cu(NH₃)₄]SO₄·H₂O",
    iupac: "Tetraammismis(II) sulfat monogidrat",
    type: "Kompleks kation",
    metals: ["Cu²⁺", "S"],
    M: 245.75,
    icpOES: { lambda_Cu: "324.7 / 327.4", lambda_S: "180.7", lod_Cu: 0.3, lod_S: 50 },
    icpMS: { mz_Cu: "63 (69.2%)", mz_S: "32 (95.0%)", lod_Cu: 0.2, lod_S: 500 },
    interference: "⁴⁰Ar²³Na⁺ → m/z=63 (oz ta'sir)",
    collisionCell: "Shart emas",
    internalStandard: "Ge (72)",
    uniqueFeature: "Metall + Metallmas (Cu va S) bir vaqtda. ICP-OES da S ham ko'rinadi.",
    color: "blue"
  },
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formula: "[Co(NH₃)₆]Cl₃",
    iupac: "Geksaamminkobalt(III) xlorid",
    type: "Kompleks kation",
    metals: ["Co³⁺"],
    M: 267.48,
    icpOES: { lambda_Co: "228.6 / 238.9", lod_Co: 0.5 },
    icpMS: { mz_Co: "59 (100%)", lod_Co: 0.1 },
    interference: "Interferensiyasiz — mononuklid",
    collisionCell: "Shart emas",
    internalStandard: "Sc (45)",
    uniqueFeature: "⁵⁹Co — 100% mononuklid. Hech qanday poliatomik interferensiya yo'q — ideal signal!",
    color: "pink"
  },
  {
    id: "ni-en3-cl2",
    slug: "ni-en3-cl2",
    formula: "[Ni(en)₃]Cl₂",
    iupac: "Tris(etilendiamin)nikel(II) xlorid",
    type: "Xelat kompleks (bidentat)",
    metals: ["Ni²⁺"],
    M: 309.90,
    icpOES: { lambda_Ni: "231.6 / 221.6", lod_Ni: 0.8 },
    icpMS: { mz_Ni: "58 (68.1%)", lod_Ni: 0.3 },
    interference: "⁴⁰Ar¹⁸O⁺ → m/z=58 (Ni uchun)",
    collisionCell: "He rejimi (KED) kerak",
    internalStandard: "Ge (72)",
    uniqueFeature: "Xelat effekti. Organik matritsa (C, N) ko'p — lekin 10000 K plazma ularni yo'q qiladi.",
    color: "purple"
  },
  {
    id: "k3-cr-c2o4-3-3h2o",
    slug: "k3-cr-c2o4-3-3h2o",
    formula: "K₃[Cr(C₂O₄)₃]·3H₂O",
    iupac: "Kaliy trioksalatokromat(III) trihidrat",
    type: "Xelat kompleks (oksalato)",
    metals: ["Cr³⁺", "K⁺"],
    M: 491.33,
    icpOES: { lambda_Cr: "267.7 / 205.6", lambda_K: "766.5", lod_Cr: 0.5, lod_K: 5.0 },
    icpMS: { mz_Cr: "53 (9.5%) *", lod_Cr: 2.0, mz_K: "39 (93.3%)", lod_K: 50 },
    interference: "⁴⁰Ar¹²C⁺ → m/z=52 (⁵²Cr uchun muammo)",
    collisionCell: "H₂ rejimi (reaktiv) — ⁵³Cr ishlatiladi",
    internalStandard: "Sc (45) + Ge (72)",
    uniqueFeature: "Murakkab organik matritsa (3×C₂O₄). Matritsa effekti — ichki standart majburiy.",
    color: "emerald"
  },
  {
    id: "na3-co-no2-6",
    slug: "na3-co-no2-6",
    formula: "Na₃[Co(NO₂)₆]",
    iupac: "Natriy geksanitritokobaltat(III)",
    type: "Kompleks anion",
    metals: ["Co³⁺", "Na⁺"],
    M: 403.91,
    icpOES: { lambda_Co: "228.6 / 238.9", lambda_Na: "589.0", lod_Co: 0.5, lod_Na: 1.0 },
    icpMS: { mz_Co: "59 (100%)", mz_Na: "23 (100%)", lod_Co: 0.1, lod_Na: 10 },
    interference: "Interferensiyasiz (Co, Na ikkalasi mononuklid)",
    collisionCell: "Shart emas",
    internalStandard: "Sc (45)",
    uniqueFeature: "Yuqori tuz matritsasi (3×Na) — konus tiqilib qolishi mumkin. Suyultirish kerak.",
    color: "amber"
  },
  {
    id: "pt-nh3-2-cl2",
    slug: "pt-nh3-2-cl2",
    formula: "Pt(NH₃)₂Cl₂",
    iupac: "Diammindixloroplatina(II) (sisplatin)",
    type: "Neytral kompleks",
    metals: ["Pt²⁺"],
    M: 300.05,
    icpOES: { lambda_Pt: "214.4 / 265.9", lod_Pt: 2.0 },
    icpMS: { mz_Pt: "195 (33.8%)", lod_Pt: 0.5 },
    interference: "Yuqori massa — kam interferensiya",
    collisionCell: "Shart emas",
    internalStandard: "Bi (209) — og'ir elementlar uchun",
    uniqueFeature: "Pt — 5 ta izotop. ICP-MS izotop profilini ko'rsatadi. Saraton dorisida ppt darajasida.",
    color: "gold"
  },
  {
    id: "co-nh3-5-cl-cl2",
    slug: "co-nh3-5-cl-cl2",
    formula: "[Co(NH₃)₅Cl]Cl₂",
    iupac: "Pentaamminklorokobalt(III) xlorid (purpureo)",
    type: "Ichki/Tashqi sfera (Verner)",
    metals: ["Co³⁺"],
    M: 250.44,
    icpOES: { lambda_Co: "228.6 / 238.9", lod_Co: 0.5 },
    icpMS: { mz_Co: "59 (100%)", lod_Co: 0.1 },
    interference: "Interferensiyasiz",
    collisionCell: "Shart emas",
    internalStandard: "Sc (45)",
    uniqueFeature: "Klassik Verner tajribasi: AgNO₃ bilan 2 ta Cl⁻ cho'kadi, lekin ICP barcha 3 ta Cl ni ko'rsatadi!",
    color: "rose"
  },
  {
    id: "ru-bipy3-cl2-6h2o",
    slug: "ru-bipy3-cl2-6h2o",
    formula: "[Ru(bipy)₃]Cl₂·6H₂O",
    iupac: "Tris(bipiridin)ruteniy(II) xlorid geksagidrat",
    type: "Xelat (aromatik)",
    metals: ["Ru²⁺"],
    M: 748.62,
    icpOES: { lambda_Ru: "240.3 / 267.5", lod_Ru: 1.0 },
    icpMS: { mz_Ru: "102 (31.6%)", lod_Ru: 0.5 },
    interference: "Kam interferensiya (yuqori massa)",
    collisionCell: "Shart emas",
    internalStandard: "Rh (103) — Ru ga yaqin massa",
    uniqueFeature: "Ru — 7 ta izotop. ICP-MS izotop profilini ko'rsatadi. Murakkab organik matritsa.",
    color: "red"
  },
  {
    id: "k2-ptcl4",
    slug: "k2-ptcl4",
    formula: "K₂[PtCl₄]",
    iupac: "Kaliy tetraxloroplatinat(II)",
    type: "Kompleks anion",
    metals: ["Pt²⁺", "K⁺"],
    M: 415.09,
    icpOES: { lambda_Pt: "214.4 / 265.9", lambda_K: "766.5", lod_Pt: 2.0, lod_K: 5.0 },
    icpMS: { mz_Pt: "195 (33.8%)", mz_K: "39 (93.3%)", lod_Pt: 0.5, lod_K: 50 },
    interference: "Yuqori massa (Pt) — kam interferensiya",
    collisionCell: "Shart emas",
    internalStandard: "Sc (45) — K uchun, Bi (209) — Pt uchun",
    uniqueFeature: "Yengil (K, m=39) + Og'ir (Pt, m=195) bir vaqtda. Ikki xil ichki standart kerak!",
    color: "crimson"
  }
]

// Rang sxemasi
const rangMap = {
  yellow: { bg: "bg-yellow-600/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  orange: { bg: "bg-orange-600/10", text: "text-orange-400", border: "border-orange-500/30" },
  violet: { bg: "bg-violet-600/10", text: "text-violet-400", border: "border-violet-500/30" },
  blue: { bg: "bg-blue-600/10", text: "text-blue-400", border: "border-blue-500/30" },
  pink: { bg: "bg-pink-600/10", text: "text-pink-400", border: "border-pink-500/30" },
  purple: { bg: "bg-purple-600/10", text: "text-purple-400", border: "border-purple-500/30" },
  emerald: { bg: "bg-emerald-600/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  amber: { bg: "bg-amber-600/10", text: "text-amber-400", border: "border-amber-500/30" },
  gold: { bg: "bg-yellow-500/10", text: "text-yellow-300", border: "border-yellow-400/30" },
  rose: { bg: "bg-rose-600/10", text: "text-rose-400", border: "border-rose-500/30" },
  red: { bg: "bg-red-600/10", text: "text-red-400", border: "border-red-500/30" },
  crimson: { bg: "bg-rose-700/10", text: "text-rose-300", border: "border-rose-600/30" }
}

export default function ICPBirikmalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [filterType, setFilterType] = useState("all") // all, anion, kation, xelat, neytral

  const filtered = useMemo(() => {
    let result = birikmalar
    if (filterType !== "all") {
      if (filterType === "anion") result = result.filter(b => b.type.includes("anion"))
      else if (filterType === "kation") result = result.filter(b => b.type.includes("kation"))
      else if (filterType === "xelat") result = result.filter(b => b.type.includes("Xelat"))
      else if (filterType === "neytral") result = result.filter(b => b.type.includes("Neytral"))
      else if (filterType === "verner") result = result.filter(b => b.type.includes("Verner"))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.formula.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.metals.some(m => m.toLowerCase().includes(q)) ||
        b.uniqueFeature.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, filterType])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-cyan-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/icp" className="hover:text-purple-300">ICP-OES / ICP-MS</Link>
            <span className="text-purple-600">›</span>
            <span className="text-cyan-400 font-semibold">Birikmalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-3">
                <span className="text-3xl">🧬</span>
                ICP Birikmalar Katalogi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                12 ta klassik kompleks • Ko'p elementli • ppb−ppt • Izotop nisbati • Poliatomik interferensiyalar
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/icp"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← ICP Nazariyasi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          {/* Qidiruv */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Birikma nomi, metall (Fe, Co, Pt...) yoki izotop..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
            </div>
          </div>

          {/* Filter — Kompleks turi */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Kompleks turi:</span>
            {[
              { key: "all", label: "Barchasi", count: birikmalar.length },
              { key: "anion", label: "🔻 Kompleks anion", count: birikmalar.filter(b => b.type.includes("anion")).length },
              { key: "kation", label: "🔺 Kompleks kation", count: birikmalar.filter(b => b.type.includes("kation")).length },
              { key: "xelat", label: "🔗 Xelat", count: birikmalar.filter(b => b.type.includes("Xelat")).length },
              { key: "neytral", label: "⚖ Neytral", count: birikmalar.filter(b => b.type.includes("Neytral")).length },
              { key: "verner", label: "🎓 Verner (ichki/tashqi)", count: birikmalar.filter(b => b.type.includes("Verner")).length },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === f.key
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-cyan-500/50"
                }`}
              >
                {f.label} <span className="opacity-60">({f.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => {
              const colors = rangMap[b.color]
              const mainMetal = b.metals[0]
              const hasInterference = b.interference.toLowerCase() !== "interferensiyasiz" && !b.interference.includes("kam")
              
              return (
                <Link
                  key={b.id}
                  href={`/ilmiy/tahlil/icp/birikmalar/${b.slug}`}
                  className={`group ${colors.bg} border ${colors.border} rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl block relative overflow-hidden`}
                >
                  {/* Plazma gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${colors.text}`}>{b.formula}</h3>
                      <p className="text-purple-400 text-xs mt-1 line-clamp-2">{b.iupac}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0 ml-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-600/20 text-cyan-300 border border-cyan-600/30 text-center">
                        ICP
                      </span>
                    </div>
                  </div>

                  {/* Metall va tip */}
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 bg-purple-950/40 rounded-lg p-2 border border-purple-700/30">
                      <div className="text-[9px] text-purple-400">Metall(lar)</div>
                      <div className={`text-sm font-bold ${colors.text}`}>{b.metals.join(", ")}</div>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="bg-purple-950/40 rounded-lg px-3 py-2 mb-3 border border-purple-700/20">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-purple-400">Kompleks turi:</span>
                      <span className="text-xs text-white">{b.type}</span>
                    </div>
                  </div>

                  {/* ICP parametrlari */}
                  <div className="bg-purple-950/50 rounded-lg p-3 text-xs space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-purple-500">M:</span>
                      <span className="font-mono text-white">{b.M} g/mol</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-500">ICP-OES λ:</span>
                      <span className="font-mono text-cyan-400">
                        {Object.values(b.icpOES).filter(v => typeof v === 'string')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-500">ICP-MS m/z:</span>
                      <span className="font-mono text-blue-400">
                        {Object.values(b.icpMS).filter(v => typeof v === 'string')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-500">LOD (MS):</span>
                      <span className="font-mono text-green-400">
                        {Object.values(b.icpMS).filter(v => typeof v === 'number')[0]} ng/L
                      </span>
                    </div>
                  </div>

                  {/* Interferensiya */}
                  {hasInterference && (
                    <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg px-3 py-2 mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 text-xs shrink-0">⚠️</span>
                        <span className="text-[10px] text-orange-200 line-clamp-1">{b.interference}</span>
                      </div>
                    </div>
                  )}

                  {/* O'ziga xos xususiyat */}
                  <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg px-3 py-2 border-l-2 border-cyan-500/50">
                    <p className="text-[11px] text-cyan-200 font-medium line-clamp-2">
                      ✨ {b.uniqueFeature}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-left">
                  <th className="py-3 px-3 text-cyan-300">Formula</th>
                  <th className="py-3 px-3 text-cyan-300">Metall</th>
                  <th className="py-3 px-3 text-center text-cyan-300">Turi</th>
                  <th className="py-3 px-3 text-center text-cyan-300">ICP-OES λ</th>
                  <th className="py-3 px-3 text-center text-cyan-300">ICP-MS m/z</th>
                  <th className="py-3 px-3 text-center text-cyan-300">LOD MS (ng/L)</th>
                  <th className="py-3 px-3 text-cyan-300">Interferensiya</th>
                  <th className="py-3 px-3 text-cyan-300">Collision Cell</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => {
                  const colors = rangMap[b.color]
                  const hasInterference = b.interference.toLowerCase() !== "interferensiyasiz" && !b.interference.includes("kam")
                  return (
                    <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                      <td className="py-3 px-3">
                        <Link href={`/ilmiy/tahlil/icp/birikmalar/${b.slug}`} className={`${colors.text} font-bold hover:underline text-xs`}>
                          {b.formula}
                        </Link>
                      </td>
                      <td className={`py-3 px-3 ${colors.text} font-semibold`}>{b.metals.join(", ")}</td>
                      <td className="py-3 px-3 text-center text-[10px]">{b.type}</td>
                      <td className="py-3 px-3 text-center font-mono text-cyan-400 text-[10px]">
                        {Object.values(b.icpOES).filter(v => typeof v === 'string')[0]}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-blue-400 text-[10px]">
                        {Object.values(b.icpMS).filter(v => typeof v === 'string')[0]}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-green-400">
                        {Object.values(b.icpMS).filter(v => typeof v === 'number')[0]}
                      </td>
                      <td className={`py-3 px-3 text-[10px] ${hasInterference ? 'text-orange-300' : 'text-green-300'}`}>
                        {hasInterference ? b.interference : "✓ Yo'q"}
                      </td>
                      <td className="py-3 px-3 text-[10px]">
                        {b.collisionCell === "Shart emas" ? (
                          <span className="text-green-300">—</span>
                        ) : (
                          <span className="text-cyan-300">{b.collisionCell}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ICP ning O'ZIGA XOS XUSUSIYATLARI */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
            <span>🧬</span> ICP ning kompleks birikmalar uchun o'ziga xos xususiyatlari
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-purple-950/40 rounded-lg p-4 border border-purple-700/30">
              <div className="text-cyan-400 font-bold text-sm mb-2">🎯 Ko'p elementli</div>
              <p className="text-purple-200 text-xs">
                ICP bir vaqtda <strong>60+ elementni</strong> o'lchaydi. Heterometallik komplekslarda (masalan, K₂[PtCl₄]) yengil va og'ir metallarni bir o'lchashda ko'rish.
              </p>
            </div>
            <div className="bg-purple-950/40 rounded-lg p-4 border border-purple-700/30">
              <div className="text-cyan-400 font-bold text-sm mb-2">🔬 Izotop ma'lumoti</div>
              <p className="text-purple-200 text-xs">
                ICP-MS <strong>izotop nisbatlarini</strong> ko'rsatadi. Pt ning 5 ta, Ru ning 7 ta izotopi — bu AAS da mumkin emas.
              </p>
            </div>
            <div className="bg-purple-950/40 rounded-lg p-4 border border-purple-700/30">
              <div className="text-cyan-400 font-bold text-sm mb-2">⚠️ Poliatomik interferensiya</div>
              <p className="text-purple-200 text-xs">
                Ar plazmasida <strong>ArO⁺, ArC⁺, ArCl⁺</strong> ionlari hosil bo'ladi. Collision cell (He/H₂) bilan hal qilinadi.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-orange-900/20 border border-orange-700/30 rounded-lg">
            <h4 className="text-orange-300 font-bold text-xs mb-2">📚 Klassik Verner tajribasi (Verner kompleksi [Co(NH₃)₅Cl]Cl₂):</h4>
            <p className="text-purple-200 text-xs">
              Klassik usulda AgNO₃ bilan titrlaganda faqat <strong>tashqi sferadagi 2 ta Cl⁻</strong> cho'kadi. 
              Lekin <strong>ICP barcha 3 ta Cl ni</strong> (1 ichki + 2 tashqi) ko'rsatadi! 
              Bu ICP ning strukturani "ko'ra olmasligini" — faqat umumiy tarkibni aniqlashini ko'rsatadi.
            </p>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
            <span>📝</span> ICP parametrlari izohi
          </h3>
          <ul className="text-purple-200 text-sm space-y-2 list-disc list-inside">
            <li><strong className="text-cyan-300">ICP-OES λ (nm):</strong> Atom emissiya chizig'i to'lqin uzunligi. Har bir elementda bir nechta chiziq bo'ladi — eng sezgirini tanlash.</li>
            <li><strong className="text-cyan-300">ICP-MS m/z:</strong> Mass/zaryad nisbati. Qavsda izotopning tabiiy tarqalishi (masalan, ⁵⁶Fe 91.7%).</li>
            <li><strong className="text-cyan-300">LOD (Limit of Detection):</strong> Aniqlash chegarasi. ICP-MS uchun <span className="text-green-400">ng/L (ppt)</span> darajasida.</li>
            <li><strong className="text-cyan-300">Collision Cell:</strong> ArO⁺, ArC⁺ kabi poliatomik interferensiyalarni bartaraf etish uchun <span className="text-cyan-300">He (KED)</span> yoki <span className="text-cyan-300">H₂ (reaktiv)</span> gazi.</li>
            <li><strong className="text-cyan-300">Ichki standart:</strong> Instrumental drift va matritsa effektlarini tuzatish uchun <span className="text-cyan-300">Sc (45), Ge (72), Bi (209)</span> qo'shiladi.</li>
            <li>ICP <strong className="text-orange-300">oksidlanish darajasini (Fe²⁺ vs Fe³⁺)</strong> farqlay OLMAYDI — buning uchun UV-Vis yoki Mössbauer kerak.</li>
          </ul>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • ICP-OES / ICP-MS Birikmalar Katalogi</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Abundance Data, Walsh (1955)</p>
        </div>
      </footer>
    </main>
  )
}