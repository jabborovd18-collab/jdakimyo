"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// SPEKTROFOTOMETRIK TITRLASH — BIRIKMALAR KATALOGI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry)
// Xususiyat: Barqarorlik konstantalari, Job metodi, izosbestik nuqtalar
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  {
    id: "cu-nh3-4",
    slug: "cu-nh3-4",
    formulaHTML: "[Cu(NH<sub>3</sub>)<sub>4</sub>]<sup>2+</sup>",
    formulaPlain: "[Cu(NH3)4]2+",
    iupac: "Tetraamminmis(II)",
    formulaExpanded: "CuN₄H₁₂",
    commonName: "Tetraamminmis(II) (to'q ko'k)",
    molarMass: 159.61,
    casNumber: "14970-14-0",
    color: "to'q ko'k (deep blue)",
    stability: "Yuqori barqarorlik",
    lambdaMax: 620,
    logBeta: 13.3,
    stox: "1:4",
    molarAbsorptivity: 65,
    isosbesticPoints: "480, 540 nm",
    jobMethod: "xL = 0.80 → 1:4 (ML₄)",
    notes: "Klassik mis-ammiak kompleksi. Jahn-Teller effekti kuzatiladi."
  },
  {
    id: "fe-scn",
    slug: "fe-scn",
    formulaHTML: "[Fe(SCN)]<sup>2+</sup>",
    formulaPlain: "[Fe(SCN)]2+",
    iupac: "Tiotsianato-temir(III)",
    formulaExpanded: "FeSCN",
    commonName: "Temir(III) tiotsianat (qizil)",
    molarMass: 112.92,
    casNumber: "24479-37-8",
    color: "qizil (blood red)",
    stability: "Past barqarorlik",
    lambdaMax: 447,
    logBeta: 2.3,
    stox: "1:1",
    molarAbsorptivity: 4700,
    isosbesticPoints: "380, 520 nm",
    jobMethod: "xL = 0.50 → 1:1 (ML)",
    notes: "Temir(III) uchun rangli reaksiya. Analitik kimyoda keng qo'llaniladi."
  },
  {
    id: "fe-phen-3",
    slug: "fe-phen-3",
    formulaHTML: "[Fe(phen)<sub>3</sub>]<sup>2+</sup>",
    formulaPlain: "[Fe(phen)3]2+",
    iupac: "Tris(1,10-fenantrolin)temir(II)",
    formulaExpanded: "FeC₃₆H₂₄N₆",
    commonName: "Ferroin (qizil)",
    molarMass: 532.47,
    casNumber: "14768-11-7",
    color: "qizil (red)",
    stability: "Juda yuqori barqarorlik",
    lambdaMax: 510,
    logBeta: 21.3,
    stox: "1:3",
    molarAbsorptivity: 11100,
    isosbesticPoints: "420, 510 nm",
    jobMethod: "xL = 0.75 → 1:3 (ML₃)",
    notes: "Eng keng tarqalgan redoks indikatori. E° = +1.06 V."
  },
  {
    id: "ni-en-3",
    slug: "ni-en-3",
    formulaHTML: "[Ni(en)<sub>3</sub>]<sup>2+</sup>",
    formulaPlain: "[Ni(en)3]2+",
    iupac: "Tris(etilendiamin)nikel(II)",
    formulaExpanded: "NiC₆H₂₄N₆",
    commonName: "Tris(etilendiamin)nikel(II) (binafsha)",
    molarMass: 309.90,
    casNumber: "14878-43-8",
    color: "binafsha (violet)",
    stability: "Juda yuqori barqarorlik",
    lambdaMax: 540,
    logBeta: 18.6,
    stox: "1:3",
    molarAbsorptivity: 85,
    isosbesticPoints: "420, 540 nm",
    jobMethod: "xL = 0.75 → 1:3 (ML₃)",
    notes: "Xelat effekti. Oktaedr geometriya."
  },
  {
    id: "cu-phen-3",
    slug: "cu-phen-3",
    formulaHTML: "[Cu(phen)<sub>3</sub>]<sup>2+</sup>",
    formulaPlain: "[Cu(phen)3]2+",
    iupac: "Tris(1,10-fenantrolin)mis(II)",
    formulaExpanded: "CuC₃₆H₂₄N₆",
    commonName: "Mis(II) fenantroli (qizil)",
    molarMass: 536.99,
    casNumber: "14768-11-8",
    color: "qizil (red)",
    stability: "Yuqori barqarorlik",
    lambdaMax: 510,
    logBeta: 16.7,
    stox: "1:3",
    molarAbsorptivity: 7800,
    isosbesticPoints: "420, 510 nm",
    jobMethod: "xL = 0.75 → 1:3 (ML₃)",
    notes: "Fenantrolin kompleksi. Redoks xususiyatlar."
  },
  {
    id: "co-nh3-6",
    slug: "co-nh3-6",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]<sup>3+</sup>",
    formulaPlain: "[Co(NH3)6]3+",
    iupac: "Geksaamminkobalt(III)",
    formulaExpanded: "CoN₆H₁₈",
    commonName: "Luteo-kobalt (sariq)",
    molarMass: 240.01,
    casNumber: "14695-95-5",
    color: "sariq (yellow)",
    stability: "Juda yuqori barqarorlik",
    lambdaMax: 475,
    logBeta: 35.0,
    stox: "1:6",
    molarAbsorptivity: 55,
    isosbesticPoints: "380, 475 nm",
    jobMethod: "xL = 0.86 → 1:6 (ML₆)",
    notes: "Inert kompleks. Diamagnit (d⁶, past spin)."
  },
  {
    id: "fe-cn-6",
    slug: "fe-cn-6",
    formulaHTML: "[Fe(CN)<sub>6</sub>]<sup>4-</sup>",
    formulaPlain: "[Fe(CN)6]4-",
    iupac: "Geksatsianoferrat(II)",
    formulaExpanded: "FeC₆N₆",
    commonName: "Ferrotsianid (sariq)",
    molarMass: 211.95,
    casNumber: "13943-58-3",
    color: "sariq (yellow)",
    stability: "Juda yuqori barqarorlik",
    lambdaMax: 420,
    logBeta: 35.4,
    stox: "1:6",
    molarAbsorptivity: 1010,
    isosbesticPoints: "380, 420 nm",
    jobMethod: "xL = 0.86 → 1:6 (ML₆)",
    notes: "Prussian Blue sintezida ishlatiladi. Diamagnit."
  },
  {
    id: "ag-nh3-2",
    slug: "ag-nh3-2",
    formulaHTML: "[Ag(NH<sub>3</sub>)<sub>2</sub>]<sup>+</sup>",
    formulaPlain: "[Ag(NH3)2]+",
    iupac: "Diamminkumush(I)",
    formulaExpanded: "AgN₂H₆",
    commonName: "Diamminkumush (rangsiz)",
    molarMass: 141.98,
    casNumber: "14873-01-9",
    color: "rangsiz (colorless)",
    stability: "O'rtacha barqarorlik",
    lambdaMax: 240,
    logBeta: 7.2,
    stox: "1:2",
    molarAbsorptivity: 120,
    isosbesticPoints: "220, 240 nm",
    jobMethod: "xL = 0.67 → 1:2 (ML₂)",
    notes: "Kumush ionining ammiak kompleksi. Chiziqli geometriya."
  },
  {
    id: "cu-en-2",
    slug: "cu-en-2",
    formulaHTML: "[Cu(en)<sub>2</sub>]<sup>2+</sup>",
    formulaPlain: "[Cu(en)2]2+",
    iupac: "Bis(etilendiamin)mis(II)",
    formulaExpanded: "CuC₄H₁₆N₄",
    commonName: "Mis(II) etilendiamin (ko'k)",
    molarMass: 215.68,
    casNumber: "14878-43-9",
    color: "ko'k (blue)",
    stability: "Yuqori barqarorlik",
    lambdaMax: 540,
    logBeta: 10.6,
    stox: "1:2",
    molarAbsorptivity: 65,
    isosbesticPoints: "420, 540 nm",
    jobMethod: "xL = 0.67 → 1:2 (ML₂)",
    notes: "Xelat effekti. Kvadrat-tekis geometriya."
  },
  {
    id: "zn-phen-3",
    slug: "zn-phen-3",
    formulaHTML: "[Zn(phen)<sub>3</sub>]<sup>2+</sup>",
    formulaPlain: "[Zn(phen)3]2+",
    iupac: "Tris(1,10-fenantrolin)rux(II)",
    formulaExpanded: "ZnC₃₆H₂₄N₆",
    commonName: "Rux(II) fenantroli (rangsiz)",
    molarMass: 541.52,
    casNumber: "14768-11-8",
    color: "rangsiz (colorless)",
    stability: "Yuqori barqarorlik",
    lambdaMax: 265,
    logBeta: 17.6,
    stox: "1:3",
    molarAbsorptivity: 2800,
    isosbesticPoints: "240, 265 nm",
    jobMethod: "xL = 0.75 → 1:3 (ML₃)",
    notes: "Diamagnit kompleks (d¹⁰). UV sohasida yutiladi."
  },
  {
    id: "fe-acac-3",
    slug: "fe-acac-3",
    formulaHTML: "[Fe(acac)<sub>3</sub>]",
    formulaPlain: "[Fe(acac)3]",
    iupac: "Tris(atsetilasetonato)temir(III)",
    formulaExpanded: "FeC₁₅H₂₁O₆",
    commonName: "Temir(III) atsetilasetonat (qizil)",
    molarMass: 353.17,
    casNumber: "14284-95-2",
    color: "qizil (red)",
    stability: "Yuqori barqarorlik",
    lambdaMax: 450,
    logBeta: 21.0,
    stox: "1:3",
    molarAbsorptivity: 2850,
    isosbesticPoints: "380, 450 nm",
    jobMethod: "xL = 0.75 → 1:3 (ML₃)",
    notes: "β-diketonat kompleksi. Paramagnit (d⁵)."
  },
  {
    id: "cu-salen",
    slug: "cu-salen",
    formulaHTML: "[Cu(salen)]",
    formulaPlain: "[Cu(salen)]",
    iupac: "N,N'-bis(salitsiliden)etilendiaminmis(II)",
    formulaExpanded: "CuC₁₆H₁₆N₂O₂",
    commonName: "Mis(II) salen (yashil)",
    molarMass: 325.84,
    casNumber: "14284-95-2",
    color: "yashil (green)",
    stability: "Yuqori barqarorlik",
    lambdaMax: 540,
    logBeta: 22.0,
    stox: "1:1",
    molarAbsorptivity: 320,
    isosbesticPoints: "420, 540 nm",
    jobMethod: "xL = 0.50 → 1:1 (ML)",
    notes: "Tetradentat ligand. Kvadrat-tekis geometriya."
  }
]

export default function SpektrofotometrikTitrlashBirikmalar() {
  const [showHeader, setShowHeader] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStability, setFilterStability] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const filtered = useMemo(() => {
    let result = birikmalar
    if (filterStability !== "all") {
      result = result.filter(b => b.stability.includes(filterStability))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.formulaPlain.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.commonName.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, filterStability])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-violet-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
              <Link href="/" className="hover:text-purple-300">🏠</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/titrlash" className="hover:text-purple-300">Spektrofotometrik titrlash</Link>
              <span className="text-purple-600">›</span>
              <span className="text-violet-400 font-semibold">Birikmalar</span>
            </nav>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Spektrofotometrik titrlash — Birikmalar katalogi
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  12 ta kompleks birikma • Barqarorlik konstantalari • Job metodi • Izosbestik nuqtalar
                </p>
              </div>
              <Link 
                href="/ilmiy/tahlil/titrlash"
                className="text-xs bg-violet-600/80 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                ← Spektrofotometrik titrlash
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* HEADER TOGGLE BUTTON */}
      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-violet-600 hover:bg-violet-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

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
                placeholder="🔍 Birikma nomi, formula yoki IUPAC nomi..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
            </div>
          </div>

          {/* Filter — Barqarorlik */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Barqarorlik:</span>
            <button
              onClick={() => setFilterStability("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStability === "all"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-violet-500/50"
              }`}
            >
              Barchasi ({birikmalar.length})
            </button>
            <button
              onClick={() => setFilterStability("Juda yuqori")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStability === "Juda yuqori"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-violet-500/50"
              }`}
            >
              Juda yuqori ({birikmalar.filter(b => b.stability.includes("Juda yuqori")).length})
            </button>
            <button
              onClick={() => setFilterStability("Yuqori")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStability === "Yuqori"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-violet-500/50"
              }`}
            >
              Yuqori ({birikmalar.filter(b => b.stability.includes("Yuqori")).length})
            </button>
            <button
              onClick={() => setFilterStability("O'rtacha")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStability === "O'rtacha"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-violet-500/50"
              }`}
            >
              O'rtacha ({birikmalar.filter(b => b.stability.includes("O'rtacha")).length})
            </button>
            <button
              onClick={() => setFilterStability("Past")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStability === "Past"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-violet-500/50"
              }`}
            >
              Past ({birikmalar.filter(b => b.stability.includes("Past")).length})
            </button>
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <Link
                key={b.id}
                href={`/ilmiy/tahlil/titrlash/birikmalar/${b.slug}`}
                className="group bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6 hover:bg-violet-900/60 hover:border-violet-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-violet-400 group-hover:text-violet-300 transition-colors"
                      dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                    />
                    <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                    <p className="text-purple-500 text-xs mt-1">{b.commonName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-purple-400">log βn</div>
                    <div className="text-lg font-mono font-bold text-violet-400">{b.logBeta}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Stoxiometriya:</span>
                    <span className="text-violet-400 font-bold">{b.stox}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">λmax:</span>
                    <span className="text-violet-400 font-bold">{b.lambdaMax} nm</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">ε (M⁻¹cm⁻¹):</span>
                    <span className="text-violet-400 font-bold">{b.molarAbsorptivity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-violet-400 font-bold">{b.color}</span>
                  </div>
                </div>

                <div className="bg-violet-900/30 rounded-lg p-3 mb-4">
                  <p className="text-violet-300 text-xs">
                    <strong>Izosbestik nuqtalar:</strong> {b.isosbesticPoints}
                  </p>
                </div>

                <p className="text-purple-300 text-xs">{b.notes}</p>

                <div className="mt-4 pt-4 border-t border-purple-700/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-400">M = {b.molarMass} g/mol</span>
                    <span className="text-violet-400 group-hover:text-violet-300 transition-colors">Batafsil →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-violet-400">Formula</th>
                  <th className="py-3 px-4 text-violet-400">IUPAC</th>
                  <th className="py-3 px-4 text-violet-400">Stoxiometriya</th>
                  <th className="py-3 px-4 text-violet-400">log βn</th>
                  <th className="py-3 px-4 text-violet-400">λmax</th>
                  <th className="py-3 px-4 text-violet-400">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4">
                      <Link 
                        href={`/ilmiy/tahlil/titrlash/birikmalar/${b.slug}`}
                        className="text-violet-400 font-bold hover:underline"
                        dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                      />
                    </td>
                    <td className="py-3 px-4 text-xs">{b.iupac}</td>
                    <td className="py-3 px-4 font-mono text-violet-400">{b.stox}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{b.logBeta}</td>
                    <td className="py-3 px-4 font-mono text-violet-400">{b.lambdaMax} nm</td>
                    <td className="py-3 px-4">{b.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrofotometrik titrlash — <strong className="text-violet-400">barqarorlik konstantalarini aniqlashning asosiy usuli</strong></li>
            <li>Umumiy barqarorlik konstantasi βn — <strong className="text-violet-400">kompleks mustahkamligini</strong> ko'rsatadi</li>
            <li>Job metodi — <strong className="text-violet-400">metall-ligand stoxiometriyasini</strong> grafik aniqlaydi</li>
            <li>Izosbestik nuqtalar — <strong className="text-violet-400">muvozanatdagi shakllar sonini</strong> ko'rsatadi</li>
            <li>ΔG° = −RT·ln(βn) — <strong className="text-violet-400">kompleks hosil bo'lish erkin energiyasi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/titrlash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Spektrofotometrik titrlash</Link>
          <Link href="/ilmiy/tahlil" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">Barcha tahlil usullari →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Spektrofotometrik titrlash • Birikmalar katalogi</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry), Job (1928)</p>
        </div>
      </footer>
    </main>
  )
}