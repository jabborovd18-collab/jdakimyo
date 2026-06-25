"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// KONDUKTOMETRIYA — BIRIKMALAR KATALOGI (PREMIUM)
// Manbalar: Vogel, Bard & Faulkner, Werner (1893, Nobel 1913)
// Xususiyat: Verner qoidasi, Λm, ionlar soni, elektrolit turi
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(NH3)6]Cl3",
    iupac: "Geksatsianoferrat(III) xlorid",
    commonName: "Luteo-kobalt (sariq)",
    molarMass: 267.48,
    casNumber: "14695-95-5",
    wernerGroup: "Verner klassik qatori",
    electrolyteType: "1:3 elektrolit",
    ions: 4,
    lm: 432,
    formula_verner: "[Co(NH₃)₆]³⁺ + 3Cl⁻",
    color: "sariq",
    desc: "Barcha 6 ta NH₃ ichki sferada, 3 ta Cl⁻ tashqi sferada. Eng yuqori o'tkazuvchanlik."
  },
  {
    id: "co-nh3-5-cl-cl2",
    slug: "co-nh3-5-cl-cl2",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5Cl]Cl2",
    iupac: "Pentaamminklorokobalt(III) xlorid",
    commonName: "Purpureo-kobalt (binafsha)",
    molarMass: 250.44,
    casNumber: "14970-14-0",
    wernerGroup: "Verner klassik qatori",
    electrolyteType: "1:2 elektrolit",
    ions: 3,
    lm: 340,
    formula_verner: "[Co(NH₃)₅Cl]²⁺ + 2Cl⁻",
    color: "binafsha",
    desc: "1 ta Cl⁻ ichki sferada, 2 ta Cl⁻ tashqi sferada."
  },
  {
    id: "co-nh3-4-cl2-cl",
    slug: "co-nh3-4-cl2-cl",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>4</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "[Co(NH3)4Cl2]Cl",
    iupac: "Tetraammindiklorokobalt(III) xlorid",
    commonName: "Praseo-kobalt (yashil)",
    molarMass: 233.40,
    casNumber: "14878-43-8",
    wernerGroup: "Verner klassik qatori",
    electrolyteType: "1:1 elektrolit",
    ions: 2,
    lm: 250,
    formula_verner: "[Co(NH₃)₄Cl₂]⁺ + Cl⁻",
    color: "yashil",
    desc: "2 ta Cl⁻ ichki sferada, 1 ta Cl⁻ tashqi sferada."
  },
  {
    id: "co-nh3-3-cl3",
    slug: "co-nh3-3-cl3",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>3</sub>Cl<sub>3</sub>]",
    formulaPlain: "[Co(NH3)3Cl3]",
    iupac: "Triammintxlorokobalt(III)",
    commonName: "Neytral kompleks",
    molarMass: 216.36,
    casNumber: "14878-43-9",
    wernerGroup: "Verner klassik qatori",
    electrolyteType: "Noelektrolit",
    ions: 0,
    lm: 0,
    formula_verner: "[Co(NH₃)₃Cl₃]⁰",
    color: "binafsha",
    desc: "Barcha 3 ta Cl⁻ ichki sferada. Neytral molekula, ionlarga parchalanmaydi."
  },
  {
    id: "co-en3-cl3",
    slug: "co-en3-cl3",
    formulaHTML: "[Co(en)<sub>3</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(en)3]Cl3",
    iupac: "Tris(etilendiamin)kobalt(III) xlorid",
    commonName: "Xelat kompleks (sariq)",
    molarMass: 343.52,
    casNumber: "14878-43-8",
    wernerGroup: "Xelat effekt guruhi",
    electrolyteType: "1:3 elektrolit",
    ions: 4,
    lm: 430,
    formula_verner: "[Co(en)₃]³⁺ + 3Cl⁻",
    color: "sariq",
    desc: "3 ta en bidentat ligand — xelat effekt. Λm ≈ [Co(NH₃)₆]Cl₃ ga teng."
  },
  {
    id: "co-en2-cl2-cl",
    slug: "co-en2-cl2-cl",
    formulaHTML: "[Co(en)<sub>2</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "[Co(en)2Cl2]Cl",
    iupac: "Bis(etilendiamin)dixlorokobalt(III) xlorid",
    commonName: "Xelat kompleks (binafsha)",
    molarMass: 287.97,
    casNumber: "14878-43-9",
    wernerGroup: "Xelat effekt guruhi",
    electrolyteType: "1:1 elektrolit",
    ions: 2,
    lm: 250,
    formula_verner: "[Co(en)₂Cl₂]⁺ + Cl⁻",
    color: "binafsha",
    desc: "2 ta en + 2 ta Cl⁻ ichki sferada, 1 ta Cl⁻ tashqi sferada."
  },
  {
    id: "k3-fe-cn6",
    slug: "k3-fe-cn6",
    formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K3[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(III)",
    commonName: "Qizil qon tuzi",
    molarMass: 329.24,
    casNumber: "13746-66-2",
    wernerGroup: "Anion kompleks guruhi",
    electrolyteType: "3:1 elektrolit",
    ions: 4,
    lm: 440,
    formula_verner: "3K⁺ + [Fe(CN)₆]³⁻",
    color: "qizil",
    desc: "Fe anion tarkibida, K⁺ tashqi sferada. 3:1 elektrolit."
  },
  {
    id: "k4-fe-cn6",
    slug: "k4-fe-cn6",
    formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K4[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(II)",
    commonName: "Sariq qon tuzi",
    molarMass: 422.39,
    casNumber: "14459-95-1",
    wernerGroup: "Anion kompleks guruhi",
    electrolyteType: "4:1 elektrolit",
    ions: 5,
    lm: 540,
    formula_verner: "4K⁺ + [Fe(CN)₆]⁴⁻",
    color: "sariq",
    desc: "Fe anion tarkibida, 4 ta K⁺ tashqi sferada. Eng yuqori o'tkazuvchanlik!"
  },
  {
    id: "k2-ptcl4",
    slug: "k2-ptcl4",
    formulaHTML: "K<sub>2</sub>[PtCl<sub>4</sub>]",
    formulaPlain: "K2[PtCl4]",
    iupac: "Kaliy tetraxloroplatinat(II)",
    commonName: "Kaliy tetraxloroplatinat",
    molarMass: 415.09,
    casNumber: "13683-63-1",
    wernerGroup: "Kvadrat-tekis guruh",
    electrolyteType: "2:1 elektrolit",
    ions: 3,
    lm: 340,
    formula_verner: "2K⁺ + [PtCl₄]²⁻",
    color: "qizil-jigar",
    desc: "Pt anion tarkibida, 2 ta K⁺ tashqi sferada. Kvadrat-tekis geometriya."
  },
  {
    id: "pt-nh3-6-cl4",
    slug: "pt-nh3-6-cl4",
    formulaHTML: "[Pt(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>4</sub>",
    formulaPlain: "[Pt(NH3)6]Cl4",
    iupac: "Geksamminplatina(IV) xlorid",
    commonName: "Geksamminplatina(IV) xlorid",
    molarMass: 415.09,
    casNumber: "13683-63-2",
    wernerGroup: "Kvadrat-tekis guruh",
    electrolyteType: "1:4 elektrolit",
    ions: 5,
    lm: 520,
    formula_verner: "[Pt(NH₃)₆]⁴⁺ + 4Cl⁻",
    color: "oq",
    desc: "Pt⁴⁺ + 6 ta NH₃ ichki sferada, 4 ta Cl⁻ tashqi sferada. 1:4 elektrolit!"
  },
  {
    id: "pt-nh3-2-cl2",
    slug: "pt-nh3-2-cl2",
    formulaHTML: "[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
    formulaPlain: "[Pt(NH3)2Cl2]",
    iupac: "Diammindixloroplatina(II)",
    commonName: "Sisplatin (saraton dori)",
    molarMass: 300.05,
    casNumber: "15663-27-1",
    wernerGroup: "Kvadrat-tekis guruh",
    electrolyteType: "Noelektrolit",
    ions: 0,
    lm: 0,
    formula_verner: "[Pt(NH₃)₂Cl₂]⁰",
    color: "sariq (cis) / binafsha (trans)",
    desc: "Neytral molekula, ionlarga parchalanmaydi. Saraton dori vositasi."
  },
  {
    id: "cu-nh3-4-so4-h2o",
    slug: "cu-nh3-4-so4-h2o",
    formulaHTML: "[Cu(NH<sub>3</sub>)<sub>4</sub>]SO<sub>4</sub>·H<sub>2</sub>O",
    formulaPlain: "[Cu(NH3)4]SO4·H2O",
    iupac: "Tetraammismis(II) sulfat monogidrat",
    commonName: "Tetraammismis(II) sulfat (to'q ko'k)",
    molarMass: 277.62,
    casNumber: "14283-20-0",
    wernerGroup: "Kvadrat-tekis guruh",
    electrolyteType: "1:2 elektrolit",
    ions: 3,
    lm: 340,
    formula_verner: "[Cu(NH₃)₄]²⁺ + SO₄²⁻",
    color: "to'q ko'k",
    desc: "4 ta NH₃ ichki sferada, SO₄²⁻ tashqi sferada. Jahn-Teller effekti."
  }
]

// Elektrolit turlari filter uchun
const electrolyteTypes = [
  { type: "Barchasi", count: birikmalar.length, color: "text-purple-400" },
  { type: "1:1 elektrolit", count: birikmalar.filter(b => b.electrolyteType === "1:1 elektrolit").length, color: "text-yellow-400" },
  { type: "1:2 elektrolit", count: birikmalar.filter(b => b.electrolyteType === "1:2 elektrolit" || b.electrolyteType === "2:1 elektrolit").length, color: "text-blue-400" },
  { type: "1:3 elektrolit", count: birikmalar.filter(b => b.electrolyteType === "1:3 elektrolit" || b.electrolyteType === "3:1 elektrolit").length, color: "text-red-400" },
  { type: "1:4 elektrolit", count: birikmalar.filter(b => b.electrolyteType === "1:4 elektrolit" || b.electrolyteType === "4:1 elektrolit").length, color: "text-pink-400" },
  { type: "Noelektrolit", count: birikmalar.filter(b => b.electrolyteType === "Noelektrolit").length, color: "text-gray-400" }
]

// Verner guruhlari
const wernerGroups = [
  { group: "Verner klassik qatori", count: birikmalar.filter(b => b.wernerGroup === "Verner klassik qatori").length },
  { group: "Xelat effekt guruhi", count: birikmalar.filter(b => b.wernerGroup === "Xelat effekt guruhi").length },
  { group: "Anion kompleks guruhi", count: birikmalar.filter(b => b.wernerGroup === "Anion kompleks guruhi").length },
  { group: "Kvadrat-tekis guruh", count: birikmalar.filter(b => b.wernerGroup === "Kvadrat-tekis guruh").length }
]

export default function KonduktometriyaBirikmalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("Barchasi")
  const [viewMode, setViewMode] = useState("grid")

  const filtered = useMemo(() => {
    let result = birikmalar
    if (filterType !== "Barchasi") {
      if (filterType === "1:2 elektrolit") {
        result = result.filter(b => b.electrolyteType === "1:2 elektrolit" || b.electrolyteType === "2:1 elektrolit")
      } else if (filterType === "1:3 elektrolit") {
        result = result.filter(b => b.electrolyteType === "1:3 elektrolit" || b.electrolyteType === "3:1 elektrolit")
      } else if (filterType === "1:4 elektrolit") {
        result = result.filter(b => b.electrolyteType === "1:4 elektrolit" || b.electrolyteType === "4:1 elektrolit")
      } else {
        result = result.filter(b => b.electrolyteType === filterType)
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.formulaPlain.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.commonName.toLowerCase().includes(q) ||
        b.formula_verner.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, filterType])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/konduktometriya" className="hover:text-purple-300">Konduktometriya</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400 font-semibold">Birikmalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-3">
                <span className="text-3xl">🔌</span>
                Konduktometrik tahlil — Birikmalar katalogi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                12 ta kompleks birikma • Molyar o'tkazuvchanlik Λm • Ionlar soni • Verner nazariyasi isboti
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/konduktometriya"
              className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              ← Konduktometriya
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
                placeholder="🔍 Birikma nomi, formula yoki IUPAC nomi..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
            </div>
          </div>

          {/* Filter — Elektrolit turi */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Elektrolit turi:</span>
            {electrolyteTypes.map((et) => (
              <button
                key={et.type}
                onClick={() => setFilterType(et.type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === et.type
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-blue-500/50"
                }`}
              >
                {et.type} ({et.count})
              </button>
            ))}
          </div>

          {/* Verner guruhlari */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Verner guruhi:</span>
            {wernerGroups.map((wg) => (
              <span
                key={wg.group}
                className="px-3 py-1.5 rounded-lg text-xs bg-purple-900/40 text-purple-300 border border-purple-700/30"
              >
                {wg.group} ({wg.count})
              </span>
            ))}
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => {
              const colors = {
                "1:1 elektrolit": { bg: "bg-yellow-600/10", border: "border-yellow-500/30", text: "text-yellow-400" },
                "1:2 elektrolit": { bg: "bg-blue-600/10", border: "border-blue-500/30", text: "text-blue-400" },
                "2:1 elektrolit": { bg: "bg-blue-600/10", border: "border-blue-500/30", text: "text-blue-400" },
                "1:3 elektrolit": { bg: "bg-red-600/10", border: "border-red-500/30", text: "text-red-400" },
                "3:1 elektrolit": { bg: "bg-red-600/10", border: "border-red-500/30", text: "text-red-400" },
                "1:4 elektrolit": { bg: "bg-pink-600/10", border: "border-pink-500/30", text: "text-pink-400" },
                "4:1 elektrolit": { bg: "bg-pink-600/10", border: "border-pink-500/30", text: "text-pink-400" },
                "Noelektrolit": { bg: "bg-gray-600/10", border: "border-gray-500/30", text: "text-gray-400" }
              }
              const colorScheme = colors[b.electrolyteType] || colors["Noelektrolit"]

              return (
                <Link
                  key={b.id}
                  href={`/ilmiy/tahlil/konduktometriya/birikmalar/${b.slug}`}
                  className={`group ${colorScheme.bg} border ${colorScheme.border} rounded-2xl p-6 hover:scale-[1.02] transition-all transform hover:shadow-xl hover:shadow-blue-500/10`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-lg font-bold ${colorScheme.text} group-hover:text-opacity-80 transition-colors`}
                        dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                      />
                      <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                      <p className="text-purple-500 text-xs mt-1">{b.commonName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-purple-400">Λm</div>
                      <div className={`text-lg font-mono font-bold ${colorScheme.text}`}>{b.lm}</div>
                      <div className="text-xs text-purple-400">S·cm²/mol</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Ionlar soni:</span>
                      <span className="text-yellow-400 font-bold">{b.ions}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Elektrolit turi:</span>
                      <span className={colorScheme.text}>{b.electrolyteType}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Verner guruhi:</span>
                      <span className="text-purple-300 text-[10px]">{b.wernerGroup}</span>
                    </div>
                  </div>

                  <div className="bg-purple-900/50 rounded-lg p-3 mb-4">
                    <p className="text-purple-300 text-xs">{b.formula_verner}</p>
                  </div>

                  <p className="text-purple-300 text-xs">{b.desc}</p>

                  <div className="mt-4 pt-4 border-t border-purple-700/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-purple-400">M = {b.molarMass} g/mol</span>
                      <span className={`text-xs ${colorScheme.text}`}>Batafsil →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-blue-300">Formula</th>
                  <th className="py-3 px-4 text-blue-300">IUPAC</th>
                  <th className="py-3 px-4 text-blue-300">Ionlar</th>
                  <th className="py-3 px-4 text-blue-300">Λm</th>
                  <th className="py-3 px-4 text-blue-300">Elektrolit turi</th>
                  <th className="py-3 px-4 text-blue-300">Verner guruhi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => {
                  const colors = {
                    "1:1 elektrolit": "text-yellow-400",
                    "1:2 elektrolit": "text-blue-400",
                    "2:1 elektrolit": "text-blue-400",
                    "1:3 elektrolit": "text-red-400",
                    "3:1 elektrolit": "text-red-400",
                    "1:4 elektrolit": "text-pink-400",
                    "4:1 elektrolit": "text-pink-400",
                    "Noelektrolit": "text-gray-400"
                  }
                  const colorText = colors[b.electrolyteType] || "text-gray-400"

                  return (
                    <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-4">
                        <Link 
                          href={`/ilmiy/tahlil/konduktometriya/birikmalar/${b.slug}`}
                          className={`${colorText} font-bold hover:underline`}
                          dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                        />
                      </td>
                      <td className="py-2 px-4 text-xs">{b.iupac}</td>
                      <td className="py-2 px-4 font-mono text-yellow-400">{b.ions}</td>
                      <td className="py-2 px-4 font-mono text-green-400">{b.lm}</td>
                      <td className={`py-2 px-4 text-xs ${colorText}`}>{b.electrolyteType}</td>
                      <td className="py-2 px-4 text-xs text-purple-300">{b.wernerGroup}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* VERNER QOIDASI IZOHI */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Verner qoidasi — Λm va ionlar soni bog'liqligi</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-300">Alfred Verner (1893, Nobel 1913)</strong> konduktometrik o'lchashlar orqali 
              koordinatsion nazariyani isbotladi. U kobalt komplekslarining molyar o'tkazuvchanligini o'lchab, 
              ularning turli xil ionlar soniga ega ekanligini ko'rsatdi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-yellow-400 font-bold text-lg">1:1 elektrolit</p>
              <p className="text-purple-300 text-xs mt-1">2 ion</p>
              <p className="text-yellow-400 font-mono mt-2">Λm ≈ 150-280</p>
              <p className="text-purple-300 text-xs mt-2">[Co(NH₃)₄Cl₂]Cl</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-400 font-bold text-lg">1:2 elektrolit</p>
              <p className="text-purple-300 text-xs mt-1">3 ion</p>
              <p className="text-blue-400 font-mono mt-2">Λm ≈ 300-380</p>
              <p className="text-purple-300 text-xs mt-2">[Co(NH₃)₅Cl]Cl₂</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <p className="text-red-400 font-bold text-lg">1:3 elektrolit</p>
              <p className="text-purple-300 text-xs mt-1">4 ion</p>
              <p className="text-red-400 font-mono mt-2">Λm ≈ 400-500</p>
              <p className="text-purple-300 text-xs mt-2">[Co(NH₃)₆]Cl₃</p>
            </div>
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <p className="text-pink-400 font-bold text-lg">1:4 elektrolit</p>
              <p className="text-purple-300 text-xs mt-1">5 ion</p>
              <p className="text-pink-400 font-mono mt-2">Λm ≈ 500-580</p>
              <p className="text-purple-300 text-xs mt-2">[Pt(NH₃)₆]Cl₄</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Konduktometriya — <strong className="text-blue-300">ionlar sonini aniqlashning eng oddiy va ishonchli usuli</strong></li>
            <li>Verner nazariyasini isbotlashda <strong className="text-blue-300">tarixiy ahamiyatga ega</strong> (Nobel 1913)</li>
            <li>Molyar o'tkazuvchanlik Λm — <strong className="text-blue-300">ionlar soniga to'g'ri proporsional</strong></li>
            <li>Tashqi va ichki sfera ionlarini <strong className="text-blue-300">aniq farqlash</strong> imkonini beradi</li>
            <li>Kompleks sintezi, kinetikasi va izomer farqlash uchun <strong className="text-blue-300">yordamchi, ammo muhim usul</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/konduktometriya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Konduktometriya</Link>
          <Link href="/ilmiy/tahlil" className="px-6 py-3 bg-blue-700/80 rounded-xl hover:bg-blue-600 text-white font-semibold">Barcha tahlil usullari →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Konduktometriya • Birikmalar katalogi</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Bard & Faulkner, Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}