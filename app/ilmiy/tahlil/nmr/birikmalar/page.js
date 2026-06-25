"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// YaMR SPEKTROSKOPIYA — BIRIKMALAR KATALOGI (PREMIUM)
// Manbalar: Jorgensen (1894), PMC9077707, ScienceDirect S0040603103003617
// Xususiyat: Linkage izomerizm, DSC, photo-salient effect, ωB97XD
// 12 ta birikma — har biri YaMR fenomeni uchun
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUNDS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1-GURUH: LINKAGE IZOMERIZM (Knowledge Base asosida)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "co-nh3-5-no2",
    slug: "co-nh3-5-no2",
    group: "Linkage Izomerizm",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>(NO<sub>2</sub>)]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5(NO2)]Cl2",
    iupac: "Pentaamminkobalt(III) nitro-izomer xlorid",
    commonName: "Nitro-pentaamminkobalt(III) (sariq)",
    molarMass: 261.44,
    casNumber: "14970-14-0",
    color: "sariq (yellow)",
    structure: "Oktaedr (C₄ᵥ)",
    metalLigand: "Co-N (NO₂, N-bonded)",
    pointGroup: "C₄ᵥ",
    electrolyteType: "1:2 elektrolit",
    molarConductivity: "~260 S·cm²/mol",
    nmrNucleus: "¹H, ¹⁵N, ⁵⁹Co",
    chemicalShift: "¹H: 3.5 ppm (NH₃), ¹⁵N: 650 ppm (NO₂, N-bonded)",
    multiplicity: "singlet",
    jCoupling: "—",
    phenomenon: "Linkage izomerizm (N-bonded), Photo-salient effect",
    nmrSignificance: "N-bog'langan izomer. ¹⁵N YaMR da 650 ppm da signal. Termik va foto-kimyoviy izomerlanish (nitro → nitrito).",
    discovery: "Jorgensen (1894)",
    dscData: "Termik izomerlanish: nitrito → nitro, ekzotermik",
    photoSalient: "UV yorug'lik ta'sirida kristall sakraydi (photo-salient effect, Naumov 2013)",
    theoryNote: "ωB97XD/6-31+G(d,p) bo'yicha: nitro → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → exo-nitrito. Pathway (1) through endo-nitrito eng past energiya yo'li."
  },
  {
    id: "co-nh3-5-ono",
    slug: "co-nh3-5-ono",
    group: "Linkage Izomerizm",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>(ONO)]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5(ONO)]Cl2",
    iupac: "Pentaamminkobalt(III) nitrito-izomer xlorid",
    commonName: "Nitrito-pentaamminkobalt(III) (qizil)",
    molarMass: 261.44,
    casNumber: "15075-33-9",
    color: "qizil (red)",
    structure: "Oktaedr (C₄ᵥ)",
    metalLigand: "Co-O (ONO, O-bonded)",
    pointGroup: "C₄ᵥ",
    electrolyteType: "1:2 elektrolit",
    molarConductivity: "~260 S·cm²/mol",
    nmrNucleus: "¹H, ¹⁵N, ⁵⁹Co",
    chemicalShift: "¹H: 3.5 ppm (NH₃), ¹⁵N: 580 ppm (ONO, O-bonded)",
    multiplicity: "singlet",
    jCoupling: "—",
    phenomenon: "Linkage izomerizm (O-bonded), endo/exo-nitrito",
    nmrSignificance: "O-bog'langan izomer. ¹⁵N YaMR da 580 ppm da signal (nitro izomerdan 70 ppm past). Termik izomerlanish: nitrito → nitro (sekin, qorong'ida).",
    discovery: "Jorgensen (1894)",
    dscData: "Termik izomerlanish: nitrito → nitro, ekzotermik (ΔH < 0). DSC orqali o'lchanadi.",
    photoSalient: "UV yorug'lik ta'sirida nitrito → nitrito foto-izomerlanish",
    theoryNote: "ωB97XD bo'yicha: nitrito izomer less stable. Intramolekulyar mexanizm orqali nitro izomerga aylanadi. endo-nitrito oraliq mahsulot."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-GURUH: DIAMAGNIT KOMPLEKSLAR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "co-nh3-6",
    slug: "co-nh3-6",
    group: "Diamagnit Komplekslar",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]³⁺",
    formulaPlain: "[Co(NH3)6]3+",
    iupac: "Geksaamminkobalt(III)",
    commonName: "Luteo-kobalt (sariq)",
    molarMass: 161.00,
    casNumber: "14695-95-5",
    color: "sariq (yellow)",
    structure: "Oktaedr (Oₕ)",
    metalLigand: "Co-N (NH₃)",
    pointGroup: "Oₕ (D₃d distorded)",
    electrolyteType: "1:3 elektrolit",
    molarConductivity: "~430 S·cm²/mol",
    nmrNucleus: "¹H, ⁵⁹Co",
    chemicalShift: "¹H: 3.5 ppm (NH₃, barcha ekvivalent), ⁵⁹Co: 8120 ppm",
    multiplicity: "singlet",
    jCoupling: "—",
    phenomenon: "Simmetrik oktaedr, inert kompleks",
    nmrSignificance: "Barcha 6 ta NH₃ ekvivalent — bitta o'tkir singlet. ⁵⁹Co YaMR da 8120 ppm da signal. Inert kompleks (sekin almashinish).",
    discovery: "Werner (Nobel 1913)",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "D₃d simmetriya D₃ yoki S₆ ga distorded (PJTE stabilization ~750 cm⁻¹). Co-N bog' uzunligi 1.97-2.01 Å. Inert kompleks — ligand almashinish juda sekin."
  },
  {
    id: "co-en-3",
    slug: "co-en-3",
    group: "Diamagnit Komplekslar",
    formulaHTML: "[Co(en)<sub>3</sub>]³⁺",
    formulaPlain: "[Co(en)3]3+",
    iupac: "Tris(etilendiamin)kobalt(III)",
    commonName: "Tris(etilendiamin)kobalt(III)",
    molarMass: 345.52,
    casNumber: "14878-43-8",
    color: "sariq-to'q sariq",
    structure: "Oktaedr (D₃)",
    metalLigand: "Co-N (en, bidentat)",
    pointGroup: "D₃",
    electrolyteType: "1:3 elektrolit",
    molarConductivity: "~430 S·cm²/mol",
    nmrNucleus: "¹H, ¹³C, ⁵⁹Co",
    chemicalShift: "¹H: 2.8-3.5 ppm (CH₂, murakkab multiplet), ¹³C: 45-50 ppm",
    multiplicity: "AB kvartet (murakkab)",
    jCoupling: "J(H-H) = 7 Hz",
    phenomenon: "Xelat effekti, xirallik (Δ va Λ)",
    nmrSignificance: "Xelat halqasi tufayli ¹H YaMR da murakkab multipletlar (AB kvartetlari). Xirallik — Δ va Λ enantiomerlar. Xelat effekti — log β₃ ≈ 49.",
    discovery: "Werner (Nobel 1913)",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "Xelat effekti — log β₃ ≈ 49 (NH₃ ga qaraganda 10¹⁴ marta barqaror). Δ va Λ enantiomerlar — xirallik. ¹H YaMR da AB kvartetlar (murakkab multipletlar)."
  },
  {
    id: "fe-cn-6",
    slug: "fe-cn-6",
    group: "Diamagnit Komplekslar",
    formulaHTML: "[Fe(CN)<sub>6</sub>]⁴⁻",
    formulaPlain: "[Fe(CN)6]4-",
    iupac: "Geksatsianoferrat(II)",
    commonName: "Sariq qon tuzi (Ferrotsianid)",
    molarMass: 211.95,
    casNumber: "13943-58-3",
    color: "sariq (yellow)",
    structure: "Oktaedr (Oₕ)",
    metalLigand: "Fe-C (CN⁻)",
    pointGroup: "Oₕ",
    electrolyteType: "4:1 elektrolit",
    molarConductivity: "~540 S·cm²/mol",
    nmrNucleus: "¹³C",
    chemicalShift: "¹³C: 177 ppm (CN⁻, barcha ekvivalent)",
    multiplicity: "singlet",
    jCoupling: "—",
    phenomenon: "Kuchli maydon ligandi (CN⁻), past spinli diamagnit",
    nmrSignificance: "¹³C YaMR da 177 ppm da bitta o'tkir singlet (barcha CN⁻ ekvivalent). Kuchli maydon ligandi — past spinli diamagnit Fe(II).",
    discovery: "—",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "Kuchli maydon ligandi (CN⁻) — past spinli diamagnit Fe(II). ¹³C YaMR da bitta o'tkir singlet (177 ppm). Oₕ simmetriya — barcha CN⁻ ekvivalent."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-GURUH: PARAMAGNIT KOMPLEKSLAR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fe-acac-3",
    slug: "fe-acac-3",
    group: "Paramagnit Komplekslar",
    formulaHTML: "[Fe(acac)<sub>3</sub>]",
    formulaPlain: "[Fe(acac)3]",
    iupac: "Tris(atsetilasetonato)temir(III)",
    commonName: "Temir(III) atsetilasetonat (qizil-jigar)",
    molarMass: 353.17,
    casNumber: "14768-11-7",
    color: "qizil-jigar (red-brown)",
    structure: "Oktaedr (D₃)",
    metalLigand: "Fe-O (acac, bidentat)",
    pointGroup: "D₃",
    electrolyteType: "Noelektrolit",
    molarConductivity: "~0 S·cm²/mol",
    nmrNucleus: "¹H",
    chemicalShift: "¹H: -60 dan +60 ppm (Contact Shift)",
    multiplicity: "kengaygan (paramagnit)",
    jCoupling: "—",
    phenomenon: "Paramagnit siljish (Contact Shift), yuqori spinli Fe(III)",
    nmrSignificance: "¹H YaMR da Contact Shift (Fermi kontakt siljishi). Signallar -60 ppm dan +60 ppm gacha tarqaladi. Yuqori spinli Fe(III) — 5 ta toq elektron.",
    discovery: "—",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "Paramagnit siljish (Contact Shift, Fermi kontakt). Signallar -60 dan +60 ppm gacha tarqaladi. Yuqori spinli Fe(III) — 5 ta toq elektron."
  },
  {
    id: "fe-phen-3",
    slug: "fe-phen-3",
    group: "Paramagnit Komplekslar",
    formulaHTML: "[Fe(phen)<sub>3</sub>]²⁺",
    formulaPlain: "[Fe(phen)3]2+",
    iupac: "Tris(1,10-fenantrolin)temir(II)",
    commonName: "Ferroin (qizil)",
    molarMass: 532.47,
    casNumber: "14768-11-7",
    color: "qizil (red)",
    structure: "Oktaedr (D₃)",
    metalLigand: "Fe-N (phen, bidentat)",
    pointGroup: "D₃",
    electrolyteType: "1:2 elektrolit",
    molarConductivity: "~260 S·cm²/mol",
    nmrNucleus: "¹H",
    chemicalShift: "¹H: 7.5-9.2 ppm (aromatik, diamagnit siljish)",
    multiplicity: "multiplet (aromatik)",
    jCoupling: "J(H-H) = 5-8 Hz",
    phenomenon: "Past spinli diamagnit, MLCT, aromatik halqalar",
    nmrSignificance: "Past spinli Fe(II) diamagnit, lekin aromatik halqalarning ¹H YaMR signallari diamagnit siljishga uchraydi. ¹H: 7.5-9.2 ppm (aromatik). MLCT (Metal-to-Ligand Charge Transfer).",
    discovery: "—",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "Past spinli Fe(II) diamagnit. MLCT (Metal-to-Ligand Charge Transfer). Aromatik halqalar — ¹H YaMR da 7.5-9.2 ppm (diamagnit siljish)."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-GURUH: METALL YADROLARI YaMR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pt-cl2-nh3-2-cis",
    slug: "pt-cl2-nh3-2-cis",
    group: "Metall Yadrolari YaMR",
    formulaHTML: "cis-[PtCl<sub>2</sub>(NH<sub>3</sub>)<sub>2</sub>]",
    formulaPlain: "cis-[PtCl2(NH3)2]",
    iupac: "cis-Diammindixloroplatina(II)",
    commonName: "Sisplatin (saraton dori)",
    molarMass: 300.05,
    casNumber: "15663-27-1",
    color: "sariq (yellow)",
    structure: "Tekis kvadrat (D₂ₕ)",
    metalLigand: "Pt-N, Pt-Cl",
    pointGroup: "C₂ᵥ",
    electrolyteType: "Noelektrolit",
    molarConductivity: "~0 S·cm²/mol",
    nmrNucleus: "¹H, ¹⁹⁵Pt",
    chemicalShift: "¹H: 4.2 ppm (NH₃, triplet), ¹⁹⁵Pt: -2100 ppm",
    multiplicity: "triplet (¹H), quintet (¹⁹⁵Pt)",
    jCoupling: "¹J(Pt-H) = 45 Hz",
    phenomenon: "Sisplatin, saraton dori, ¹⁹⁵Pt YaMR",
    nmrSignificance: "¹⁹⁵Pt YaMR da -2100 ppm. ¹H-¹⁹⁵Pt spin-spin bog'lanishi (J = 45 Hz, 'satellit' signallar). Sis-trans izomerlarni ¹⁹⁵Pt YaMR orqali aniq farqlash.",
    discovery: "Peyrone (1845)",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "Sisplatin — saraton dori. ¹⁹⁵Pt YaMR da -2100 ppm. ¹H-¹⁹⁵Pt spin-spin bog'lanishi (J = 45 Hz)."
  },
  {
    id: "pt-cl2-nh3-2-trans",
    slug: "pt-cl2-nh3-2-trans",
    group: "Metall Yadrolari YaMR",
    formulaHTML: "trans-[PtCl<sub>2</sub>(NH<sub>3</sub>)<sub>2</sub>]",
    formulaPlain: "trans-[PtCl2(NH3)2]",
    iupac: "trans-Diammindixloroplatina(II)",
    commonName: "Transplatin (samarasiz)",
    molarMass: 300.05,
    casNumber: "15663-27-1",
    color: "sariq (yellow)",
    structure: "Tekis kvadrat (D₂ₕ)",
    metalLigand: "Pt-N, Pt-Cl",
    pointGroup: "D₂ₕ",
    electrolyteType: "Noelektrolit",
    molarConductivity: "~0 S·cm²/mol",
    nmrNucleus: "¹H, ¹⁹⁵Pt",
    chemicalShift: "¹H: 3.8 ppm (NH₃, triplet), ¹⁹⁵Pt: -1850 ppm",
    multiplicity: "triplet (¹H), quintet (¹⁹⁵Pt)",
    jCoupling: "¹J(Pt-H) = 65 Hz",
    phenomenon: "Transplatin, trans-effekt, spin-spin bog'lanish farqi",
    nmrSignificance: "¹⁹⁵Pt YaMR da -1850 ppm (sis-izomerdan 250 ppm farq). Trans-izomerda ¹J(Pt-H) bog'lanish konstantasi katta (65 Hz vs 45 Hz).",
    discovery: "—",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "Transplatin — saraton dori emas (samarasiz). ¹⁹⁵Pt YaMR da -1850 ppm (sis-izomerdan 250 ppm farq)."
  },
  {
    id: "pt-cl4",
    slug: "pt-cl4",
    group: "Metall Yadrolari YaMR",
    formulaHTML: "[PtCl<sub>4</sub>]²⁻",
    formulaPlain: "[PtCl4]2-",
    iupac: "Tetraxloroplatinat(II)",
    commonName: "Tetraxloroplatinat(II)",
    molarMass: 317.82,
    casNumber: "16918-92-0",
    color: "qizil-jigar",
    structure: "Tekis kvadrat (D₄ₕ)",
    metalLigand: "Pt-Cl",
    pointGroup: "D₄ₕ",
    electrolyteType: "2:1 elektrolit",
    molarConductivity: "~270 S·cm²/mol",
    nmrNucleus: "¹⁹⁵Pt",
    chemicalShift: "¹⁹⁵Pt: 1620 ppm (referens)",
    multiplicity: "singlet",
    jCoupling: "—",
    phenomenon: "¹⁹⁵Pt YaMR referens, tekis kvadrat",
    nmrSignificance: "¹⁹⁵Pt YaMR uchun standart referens (1620 ppm). Tekis kvadrat geometriya, simmetrik muhit.",
    discovery: "—",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "¹⁹⁵Pt YaMR uchun standart referens (Na₂PtCl₆, 1620 ppm)."
  },
  {
    id: "rh-pph3-3-cl",
    slug: "rh-pph3-3-cl",
    group: "Metall Yadrolari YaMR",
    formulaHTML: "[Rh(PPh<sub>3</sub>)<sub>3</sub>Cl]",
    formulaPlain: "[Rh(PPh3)3Cl]",
    iupac: "Tris(trifenilfosfin)rodiy(I) xlorid",
    commonName: "Wilkinson katalizatori",
    molarMass: 925.33,
    casNumber: "14694-95-2",
    color: "qizil-jigar",
    structure: "Tekis kvadrat (D₂ₕ)",
    metalLigand: "Rh-P, Rh-Cl",
    pointGroup: "C₂ᵥ",
    electrolyteType: "Noelektrolit",
    molarConductivity: "~0 S·cm²/mol",
    nmrNucleus: "³¹P, ¹⁰³Rh",
    chemicalShift: "³¹P: 48 ppm (PPh₃), ¹⁰³Rh: 6700 ppm",
    multiplicity: "dublet (³¹P), multiplet (¹⁰³Rh)",
    jCoupling: "¹J(Rh-P) = 180 Hz",
    phenomenon: "Fluksionallik, VT-NMR, katalizator",
    nmrSignificance: "³¹P YaMR va ¹⁰³Rh-³¹P spin-spin bog'lanishi (dubletlar, J = 180 Hz). Fluksionallik — ligandlarning tez almashinishi.",
    discovery: "Wilkinson (Nobel 1973)",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "Wilkinson katalizatori (Nobel 1973). ³¹P YaMR va ¹⁰³Rh-³¹P spin-spin bog'lanishi (J = 180 Hz)."
  },
  {
    id: "al-h2o-6",
    slug: "al-h2o-6",
    group: "Metall Yadrolari YaMR",
    formulaHTML: "[Al(H<sub>2</sub>O)<sub>6</sub>]³⁺",
    formulaPlain: "[Al(H2O)6]3+",
    iupac: "Geksaakvaalyuminiy(III)",
    commonName: "Geksaakvaalyuminiy",
    molarMass: 111.00,
    casNumber: "—",
    color: "rangsiz",
    structure: "Oktaedr (Oₕ)",
    metalLigand: "Al-O (H₂O)",
    pointGroup: "Oₕ",
    electrolyteType: "1:3 elektrolit",
    molarConductivity: "~430 S·cm²/mol",
    nmrNucleus: "²⁷Al, ¹H",
    chemicalShift: "²⁷Al: 0 ppm (referens), ¹H: 4.8 ppm (H₂O)",
    multiplicity: "singlet",
    jCoupling: "—",
    phenomenon: "²⁷Al YaMR referens, labil almashinish",
    nmrSignificance: "²⁷Al YaMR uchun standart referens (0 ppm). Labil almashinish — tez almashinish.",
    discovery: "—",
    dscData: "—",
    photoSalient: "—",
    theoryNote: "²⁷Al YaMR uchun standart referens (0 ppm). Labil almashinish — tez almashinish."
  },
]

export default function YaMRBirikmalarPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeGroup, setActiveGroup] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("cards") // "cards" yoki "table"

  const groups = useMemo(() => {
    const uniqueGroups = ["all", ...new Set(COMPOUNDS.map(c => c.group))]
    return uniqueGroups
  }, [])

  const filteredCompounds = useMemo(() => {
    let filtered = COMPOUNDS
    if (activeGroup !== "all") {
      filtered = filtered.filter(c => c.group === activeGroup)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.formulaPlain.toLowerCase().includes(query) ||
        c.iupac.toLowerCase().includes(query) ||
        c.commonName.toLowerCase().includes(query)
      )
    }
    return filtered
  }, [activeGroup, searchQuery])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> YaMR SPEKTROSKOPIYA — BIRIKMALAR KATALOGI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">12 ta birikma</strong> — har biri YaMR spektroskopiyasining muhim fenomenini o&apos;rganish uchun maxsus tanlangan.
              Linkage izomerizm, paramagnit siljish, metall yadrolari YaMR!
            </p>

            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2">🔬 Guruhlar:</div>
                  <div className="text-purple-200">
                    <strong>Linkage Izomerizm:</strong> 2 ta birikma
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Diamagnit Komplekslar:</strong> 3 ta birikma
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Paramagnit Komplekslar:</strong> 2 ta birikma
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Metall Yadrolari YaMR:</strong> 5 ta birikma
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">📊 Yadrolar:</div>
                  <div className="text-purple-200">
                    <strong>¹H, ¹³C:</strong> Organik ligandlar
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁹⁵Pt:</strong> Platina komplekslari
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>⁵⁹Co:</strong> Kobalt komplekslari
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>³¹P, ²⁷Al:</strong> Boshqa metall yadrolari
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Knowledge Base asosida:</strong> Jorgensen (1894) kashf etgan linkage izomerlar,
                DSC termik izomerlanish, photo-salient effect (Naumov 2013), ωB97XD/6-31+G(d,p) hisob-kitoblari.
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
              aria-label="Modalni yopish"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/nmr" className="hover:text-purple-300">YaMR spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <span className="text-green-400 font-semibold">Birikmalar</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
                  <span className="text-3xl">🧲</span>
                  YaMR Spektroskopiya — Birikmalar Katalogi
                </h1>
                <p className="text-purple-400 text-sm mt-1">12 ta birikma — har biri YaMR fenomeni uchun</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">12 ta birikma</span>
                  <span className="px-2 py-1 rounded bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">¹H, ¹³C, ¹⁹⁵Pt, ⁵⁹Co</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Linkage Izomerizm</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Paramagnit Siljish</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr" className="text-xs bg-green-600/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← YaMR asosiy sahifa
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-green-600 hover:bg-green-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Yadro magnit rezonansi</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Linkage Izomerizm</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit Siljish</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Birikmalar Katalogi
            </h2>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            12 ta birikma — <span className="text-green-400 italic">&quot;YaMR spektroskopiyasining muhim fenomenlarini o&apos;rganish uchun&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            Har bir birikma YaMR spektroskopiyasining <strong className="text-green-400">ma&apos;lum bir muhim fenomenini</strong> o&apos;rganish uchun maxsus tanlangan.
            Linkage izomerizm, paramagnit siljish, fluksionallik, metall yadrolari YaMR — barchasi shu yerda!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Linkage Izomerizm</div>
              <div className="text-white font-bold">2 ta</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Diamagnit</div>
              <div className="text-white font-bold">3 ta</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Paramagnit</div>
              <div className="text-white font-bold">2 ta</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall Yadrolari</div>
              <div className="text-white font-bold">5 ta</div>
            </div>
          </div>
        </div>

        {/* QIDIRUV, FILTER VA VIEW MODE TOGGLE */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Birikma nomi, formula yoki IUPAC nomi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-green-500 outline-none transition-colors"
              />
            </div>

            {/* VIEW MODE TOGGLE */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "cards"
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <span>📱</span> Kartalar
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "table"
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <span>📊</span> Jadval
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeGroup === group
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {group === "all" ? "Barchasi" : group}
              </button>
            ))}
          </div>

          <div className="text-sm text-purple-300">
            <strong>{filteredCompounds.length}</strong> ta birikma topildi
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* JADVAL KO'RINISHI */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {viewMode === "table" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📊</span> Birikmalar jadvali (to'liq ma'lumotlar)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                    <th className="py-3 px-3 text-green-400">Formula</th>
                    <th className="py-3 px-3 text-green-400">IUPAC / Umumiy nom</th>
                    <th className="py-3 px-3 text-green-400">Rang</th>
                    <th className="py-3 px-3 text-green-400">Guruh</th>
                    <th className="py-3 px-3 text-green-400">YaMR yadrolari</th>
                    <th className="py-3 px-3 text-green-400">Kimyoviy siljish (δ, ppm)</th>
                    <th className="py-3 px-3 text-green-400">Multiplicity</th>
                    <th className="py-3 px-3 text-green-400">J (Hz)</th>
                    <th className="py-3 px-3 text-green-400">Fenomen</th>
                    <th className="py-3 px-3 text-green-400">Amallar</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {filteredCompounds.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-purple-800/30 hover:bg-purple-800/30 transition-colors ${
                        i % 2 === 0 ? "bg-purple-950/20" : ""
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-green-400 text-xs">
                        <span dangerouslySetInnerHTML={{ __html: c.formulaHTML }} />
                      </td>
                      <td className="py-3 px-3 text-xs">
                        <div className="font-bold text-green-300">{c.iupac}</div>
                        <div className="text-purple-400 text-[10px]">{c.commonName}</div>
                      </td>
                      <td className="py-3 px-3 text-xs">{c.color}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] ${
                          c.group === "Linkage Izomerizm" ? "bg-yellow-900/30 text-yellow-400 border border-yellow-600/30" :
                          c.group === "Diamagnit Komplekslar" ? "bg-blue-900/30 text-blue-400 border border-blue-600/30" :
                          c.group === "Paramagnit Komplekslar" ? "bg-red-900/30 text-red-400 border border-red-600/30" :
                          "bg-green-900/30 text-green-400 border border-green-600/30"
                        }`}>
                          {c.group}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs font-mono">{c.nmrNucleus}</td>
                      <td className="py-3 px-3 text-xs text-yellow-400 font-mono">{c.chemicalShift}</td>
                      <td className="py-3 px-3 text-xs">{c.multiplicity}</td>
                      <td className="py-3 px-3 text-xs font-mono">{c.jCoupling}</td>
                      <td className="py-3 px-3 text-xs text-purple-300">{c.phenomenon}</td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/ilmiy/tahlil/nmr/birikmalar/${c.slug}`}
                          className="px-3 py-1 bg-green-600/80 hover:bg-green-500 text-white text-xs rounded-lg transition-colors"
                        >
                          Batafsil →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* JADVAL 2: KENGAAYTIRILGAN MA'LUMOTLAR JADVALI */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {viewMode === "table" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔬</span> Kengaytirilgan ma'lumotlar (DSC, Photo-salient, Theory)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                    <th className="py-3 px-3 text-green-400">Formula</th>
                    <th className="py-3 px-3 text-green-400">Struktura</th>
                    <th className="py-3 px-3 text-green-400">Simmetriya</th>
                    <th className="py-3 px-3 text-green-400">M (g/mol)</th>
                    <th className="py-3 px-3 text-green-400">Λm (S·cm²/mol)</th>
                    <th className="py-3 px-3 text-green-400">Kashfiyotchi</th>
                    <th className="py-3 px-3 text-green-400">DSC ma'lumotlari</th>
                    <th className="py-3 px-3 text-green-400">Photo-salient</th>
                    <th className="py-3 px-3 text-green-400">Theory note (ωB97XD)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {filteredCompounds.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-purple-800/30 hover:bg-purple-800/30 transition-colors ${
                        i % 2 === 0 ? "bg-purple-950/20" : ""
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-green-400 text-xs">
                        <span dangerouslySetInnerHTML={{ __html: c.formulaHTML }} />
                      </td>
                      <td className="py-3 px-3 text-xs">{c.structure}</td>
                      <td className="py-3 px-3 text-xs font-mono">{c.pointGroup}</td>
                      <td className="py-3 px-3 text-xs font-mono">{c.molarMass}</td>
                      <td className="py-3 px-3 text-xs font-mono">{c.molarConductivity}</td>
                      <td className="py-3 px-3 text-xs">{c.discovery}</td>
                      <td className="py-3 px-3 text-xs text-yellow-400">
                        {c.dscData !== "—" ? c.dscData : <span className="text-purple-500">—</span>}
                      </td>
                      <td className="py-3 px-3 text-xs text-pink-400">
                        {c.photoSalient !== "—" ? c.photoSalient : <span className="text-purple-500">—</span>}
                      </td>
                      <td className="py-3 px-3 text-xs text-purple-300 italic">{c.theoryNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* KARTALAR KO'RINISHI */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompounds.map((compound) => (
              <Link
                key={compound.id}
                href={`/ilmiy/tahlil/nmr/birikmalar/${compound.slug}`}
                className="group bg-gradient-to-r from-purple-900/40 to-green-900/40 border border-purple-700/50 rounded-2xl p-6 hover:from-purple-900/60 hover:to-green-900/60 hover:border-green-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🧲</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">
                      {compound.iupac}
                    </h3>
                    <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                      {compound.commonName}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-purple-300 mb-2">
                    <span dangerouslySetInnerHTML={{ __html: compound.formulaHTML }} />
                  </div>
                  <div className="text-xs text-purple-400">
                    M = {compound.molarMass} g/mol • {compound.color}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-green-400 font-bold mb-2">YaMR:</div>
                  <div className="text-sm text-purple-200">{compound.nmrNucleus}</div>
                  <div className="text-sm text-yellow-400 mt-1">{compound.chemicalShift}</div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-green-400 font-bold mb-2">Fenomen:</div>
                  <div className="text-sm text-purple-200">{compound.phenomenon}</div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-1 rounded-full text-xs">
                    {compound.group}
                  </span>
                  <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-1 rounded-full text-xs">
                    {compound.multiplicity}
                  </span>
                  {compound.dscData && compound.dscData !== "—" && (
                    <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-2 py-1 rounded-full text-xs">
                      DSC
                    </span>
                  )}
                  {compound.photoSalient && compound.photoSalient !== "—" && (
                    <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-2 py-1 rounded-full text-xs">
                      Photo-salient
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Har bir birikma YaMR spektroskopiyasining <strong className="text-green-400">muhim fenomenini</strong> o&apos;rganish uchun tanlangan</li>
            <li>Linkage izomerizm — <strong className="text-green-400">Jorgensen (1894)</strong> kashfiyoti, DSC va photo-salient effect</li>
            <li>Diamagnit komplekslar — <strong className="text-green-400">o&apos;tkir signallar</strong>, tuzilish aniqlash</li>
            <li>Paramagnit komplekslar — <strong className="text-green-400">Contact Shift</strong>, signallar -60 dan +60 ppm gacha</li>
            <li>Metall yadrolari YaMR — <strong className="text-green-400">¹⁹⁵Pt, ⁵⁹Co, ³¹P, ²⁷Al</strong></li>
            <li>Knowledge Base asosida — <strong className="text-green-400">ωB97XD/6-31+G(d,p)</strong> hisob-kitoblari</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← YaMR asosiy sahifa</Link>
          <Link href="/ilmiy/tahlil/rentgen" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Rentgen difraksiyasi →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • YaMR spektroskopiya • Birikmalar katalogi</p>
          <p className="mt-1">Manbalar: Jorgensen (1894), PMC9077707, ScienceDirect S0040603103003617, ωB97XD/6-31+G(d,p)</p>
        </div>
      </footer>
    </main>
  )
}