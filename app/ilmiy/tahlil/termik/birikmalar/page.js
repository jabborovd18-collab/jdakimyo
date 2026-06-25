"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TERMIK TAHLIL — BIRIKMALAR KATALOGI
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: 12 ta kompleks birikma — gidrat izomeriya, parchalanish bosqichlari
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

export default function TermikBirikmalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const filtered = useMemo(() => {
    let result = birikmalar
    if (filterType !== "all") {
      result = result.filter(b => b.type.toLowerCase().includes(filterType))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.formula.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.metal.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, filterType])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/termik" className="hover:text-purple-300">Termik</Link>
            <span className="text-purple-600">›</span>
            <span className="text-red-400 font-semibold">Birikmalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                Termik tahlil — Birikmalar katalogi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                12 ta kompleks birikma • Gidrat izomeriya • Parchalanish bosqichlari • Termik barqarorlik
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/termik"
              className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              ← Termik tahlil
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
                placeholder="🔍 Birikma nomi, metall yoki formula..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
            </div>
          </div>

          {/* Filter — Kompleks turi */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Kompleks turi:</span>
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "all"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-red-500/50"
              }`}
            >
              Barchasi ({birikmalar.length})
            </button>
            <button
              onClick={() => setFilterType("gidrat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "gidrat"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-red-500/50"
              }`}
            >
              💧 Gidrat izomer ({birikmalar.filter(b => b.type.toLowerCase().includes("gidrat")).length})
            </button>
            <button
              onClick={() => setFilterType("xelat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "xelat"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-red-500/50"
              }`}
            >
              🔗 Xelat ({birikmalar.filter(b => b.type.toLowerCase().includes("xelat")).length})
            </button>
            <button
              onClick={() => setFilterType("kation")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "kation"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-red-500/50"
              }`}
            >
              🔺 Kation ({birikmalar.filter(b => b.type.toLowerCase().includes("kation")).length})
            </button>
            <button
              onClick={() => setFilterType("anion")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "anion"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-red-500/50"
              }`}
            >
              🔻 Anion ({birikmalar.filter(b => b.type.toLowerCase().includes("anion")).length})
            </button>
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <Link
                key={b.id}
                href={`/ilmiy/tahlil/termik/birikmalar/${b.slug}`}
                className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-red-400">{b.formula}</h3>
                    <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-purple-400">M =</div>
                    <div className="text-sm font-mono font-bold text-yellow-400">{b.molarMass}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Metall:</span>
                    <span className="font-mono text-red-400 font-bold">{b.metal}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-purple-200">{b.color}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Turi:</span>
                    <span className="text-purple-200">{b.type}</span>
                  </div>
                </div>

                <div className="bg-purple-800/30 rounded-lg p-3 mb-3">
                  <div className="text-xs text-purple-400 mb-1">TGA bosqichlari:</div>
                  <div className="text-yellow-400 text-sm font-mono">{b.tgaSteps}</div>
                </div>

                <div className="bg-purple-800/30 rounded-lg p-3">
                  <div className="text-xs text-purple-400 mb-1">Qoldiq:</div>
                  <div className="text-yellow-400 text-sm font-mono">{b.residue}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-purple-700/50">
                  <p className="text-purple-300 text-xs italic">{b.notes}</p>
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
                  <th className="py-3 px-4 text-red-300">Formula</th>
                  <th className="py-3 px-4 text-red-300">Metall</th>
                  <th className="py-3 px-4 text-red-300">Molar M</th>
                  <th className="py-3 px-4 text-red-300">Turi</th>
                  <th className="py-3 px-4 text-red-300">TGA bosqichlari</th>
                  <th className="py-3 px-4 text-red-300">Qoldiq</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4">
                      <Link href={`/ilmiy/tahlil/termik/birikmalar/${b.slug}`} className="text-red-400 hover:underline font-mono text-sm">
                        {b.formula}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-mono text-red-400 font-bold">{b.metal}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{b.molarMass}</td>
                    <td className="py-3 px-4 text-sm">{b.type}</td>
                    <td className="py-3 px-4 text-yellow-400 text-sm">{b.tgaSteps}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{b.residue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GIDRAT IZOMERIYA INFO */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💧</span> Gidrat izomeriya — CrCl₃·6H₂O misoli
          </h2>

          <p className="text-purple-200 mb-6 leading-relaxed">
            Termik tahlil yordamida <strong className="text-yellow-400">ichki va tashqi sfera suvlari</strong> farqlanadi.
            CrCl₃·6H₂O — 3 ta gidrat izomerga ega, har biri har xil TGA xatti-harakatiga ega.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-purple-200 font-bold mb-2">[Cr(H₂O)₆]Cl₃ — binafsha</p>
              <p className="text-purple-300 text-sm">6 ta suv ichki sferada → <strong className="text-yellow-400">faqat yuqori T da ajraladi</strong> (~200°C)</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-200 font-bold mb-2">[CrCl(H₂O)₅]Cl₂·H₂O — och yashil</p>
              <p className="text-purple-300 text-sm">1 ta tashqi suv → <strong className="text-yellow-400">past T da ajraladi</strong> (~80°C)<br/>5 ta ichki suv → yuqori T da ajraladi</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-emerald-200 font-bold mb-2">[CrCl₂(H₂O)₄]Cl·2H₂O — to'q yashil</p>
              <p className="text-purple-300 text-sm">2 ta tashqi suv → past T da ajraladi<br/>4 ta ichki suv → yuqori T da ajraladi</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/termik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Termik tahlil</Link>
          <Link href="/ilmiy/tahlil" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Barcha tahlil usullari →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Termik tahlil • Birikmalar katalogi</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)</p>
        </div>
      </footer>
    </main>
  )
}