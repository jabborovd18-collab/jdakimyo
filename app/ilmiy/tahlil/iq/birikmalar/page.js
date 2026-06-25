"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// IQ SPEKTROSKOPIYA — BIRIKMALAR KATALOGI (PREMIUM)
// 20 ta birikma — har biri uchun asosiy cho'qqilar, bog' turlari, simmetriya
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  // KLASSIK KOMPLEKSLAR
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(NH3)6]Cl3",
    iupac: "Geksaamminkobalt(III) xlorid",
    commonName: "Luteo-kobalt",
    molarMass: 267.48,
    color: "sariq",
    structure: "Oktaedr (Oh)",
    metalLigand: "Co-N",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 500, bond: "Co-N cho'zilish", intensity: "Kuchli" },
      { freq: 450, bond: "Co-N cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "Oh",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Werner nazariyasi asosi",
    tags: ["klassik", "inert", "Oh"]
  },
  {
    id: "co-nh3-5-cl-cl2",
    slug: "co-nh3-5-cl-cl2",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5Cl]Cl2",
    iupac: "Pentaamminklorokobalt(III) xlorid",
    commonName: "Purpureo-kobalt",
    molarMass: 250.44,
    color: "binafsha",
    structure: "Oktaedr (C₄ᵥ)",
    metalLigand: "Co-N, Co-Cl",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 490, bond: "Co-N cho'zilish", intensity: "Kuchli" },
      { freq: 330, bond: "Co-Cl cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "C₄ᵥ",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Ichki/tashqi Cl farqi",
    tags: ["klassik", "inert", "ichki-Cl"]
  },
  {
    id: "co-nh3-4-cl2-cl",
    slug: "co-nh3-4-cl2-cl",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>4</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "[Co(NH3)4Cl2]Cl",
    iupac: "Tetraammindiklorokobalt(III) xlorid",
    commonName: "Praseo-kobalt",
    molarMass: 233.40,
    color: "yashil",
    structure: "Oktaedr (sis/trans)",
    metalLigand: "Co-N, Co-Cl",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 490, bond: "Co-N cho'zilish", intensity: "Kuchli" },
      { freq: 330, bond: "Co-Cl cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "C₂ᵥ (sis) / D₄ₕ (trans)",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Sis-trans izomerlar",
    tags: ["sis-trans", "inert", "2-Cl"]
  },
  {
    id: "co-en3-cl3",
    slug: "co-en3-cl3",
    formulaHTML: "[Co(en)<sub>3</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(en)3]Cl3",
    iupac: "Tris(etilendiamin)kobalt(III) xlorid",
    commonName: "Tris(etilendiamin)kobalt(III)",
    molarMass: 345.52,
    color: "sariq-to'q sariq",
    structure: "Oktaedr (D₃)",
    metalLigand: "Co-N (xelat)",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 1050, bond: "C-N cho'zilish", intensity: "Kuchli" },
      { freq: 500, bond: "Co-N cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "D₃",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Xelat effekti (log β₃ = 49)",
    tags: ["xelat", "inert", "optik izomer"]
  },
  {
    id: "co-en2-cl2-cl",
    slug: "co-en2-cl2-cl",
    formulaHTML: "[Co(en)<sub>2</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "[Co(en)2Cl2]Cl",
    iupac: "Bis(etilendiamin)dixlorokobalt(III) xlorid",
    commonName: "Bis(etilendiamin)dixlorokobalt(III)",
    molarMass: 288.47,
    color: "yashil (sis) / binafsha (trans)",
    structure: "Oktaedr (sis/trans)",
    metalLigand: "Co-N (xelat), Co-Cl",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 1050, bond: "C-N cho'zilish", intensity: "Kuchli" },
      { freq: 490, bond: "Co-N cho'zilish", intensity: "Kuchli" },
      { freq: 330, bond: "Co-Cl cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "C₂ (sis) / D₂ₕ (trans)",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Sis-trans izomerlar + xelat",
    tags: ["xelat", "sis-trans", "inert"]
  },

  // LINKAGE IZOMERLAR
  {
    id: "co-nh3-5-no2-cl2",
    slug: "co-nh3-5-no2-cl2",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>NO<sub>2</sub>]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5NO2]Cl2",
    iupac: "Pentaamminnitrokobalt(III) xlorid",
    commonName: "Nitrokobalt (sariq)",
    molarMass: 278.44,
    color: "sariq",
    structure: "Oktaedr (C₄ᵥ)",
    metalLigand: "Co-N, Co-NO₂ (N-bog'langan)",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 1420, bond: "νₐₛ(NO₂)", intensity: "Kuchli" },
      { freq: 1310, bond: "νₛ(NO₂)", intensity: "Kuchli" },
      { freq: 490, bond: "Co-N cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "C₄ᵥ",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Linkage izomer (N-bog'langan)",
    tags: ["linkage", "nitro", "inert"]
  },
  {
    id: "co-nh3-5-ono-cl2",
    slug: "co-nh3-5-ono-cl2",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>ONO]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5ONO]Cl2",
    iupac: "Pentaamminnitritokobalt(III) xlorid",
    commonName: "Nitritokobalt (qizil)",
    molarMass: 278.44,
    color: "qizil",
    structure: "Oktaedr (C₄ᵥ)",
    metalLigand: "Co-N, Co-ONO (O-bog'langan)",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 1460, bond: "ν(N=O)", intensity: "Kuchli" },
      { freq: 1060, bond: "ν(N-O)", intensity: "Kuchli" },
      { freq: 490, bond: "Co-N cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "C₄ᵥ",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Linkage izomer (O-bog'langan)",
    tags: ["linkage", "nitrito", "inert"]
  },

  // SIS-TRANS IZOMERLAR
  {
    id: "cis-co-en2-cl2-cl",
    slug: "cis-co-en2-cl2-cl",
    formulaHTML: "cis-[Co(en)<sub>2</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "cis-[Co(en)2Cl2]Cl",
    iupac: "cis-Bis(etilendiamin)dixlorokobalt(III) xlorid",
    commonName: "sis-[Co(en)₂Cl₂]Cl (binafsha)",
    molarMass: 288.47,
    color: "binafsha",
    structure: "Oktaedr (C₂)",
    metalLigand: "Co-N (xelat), Co-Cl",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 490, bond: "Co-N cho'zilish", intensity: "Kuchli" },
      { freq: 330, bond: "Co-Cl cho'zilish", intensity: "O'rta" },
      { freq: 315, bond: "Co-Cl cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "C₂",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Sis-izomer (2 ta Co-Cl)",
    tags: ["sis", "xelat", "inert"]
  },
  {
    id: "trans-co-en2-cl2-cl",
    slug: "trans-co-en2-cl2-cl",
    formulaHTML: "trans-[Co(en)<sub>2</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "trans-[Co(en)2Cl2]Cl",
    iupac: "trans-Bis(etilendiamin)dixlorokobalt(III) xlorid",
    commonName: "trans-[Co(en)₂Cl₂]Cl (yashil)",
    molarMass: 288.47,
    color: "yashil",
    structure: "Oktaedr (D₂ₕ)",
    metalLigand: "Co-N (xelat), Co-Cl",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 480, bond: "Co-N cho'zilish", intensity: "Kuchli" },
      { freq: 325, bond: "Co-Cl cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "D₂ₕ",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Trans-izomer (1 ta Co-Cl)",
    tags: ["trans", "xelat", "inert"]
  },
  {
    id: "cis-pt-nh3-2-cl2",
    slug: "cis-pt-nh3-2-cl2",
    formulaHTML: "cis-[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
    formulaPlain: "cis-[Pt(NH3)2Cl2]",
    iupac: "cis-Diammindixloroplatina(II)",
    commonName: "Sisplatin (saraton dori)",
    molarMass: 300.05,
    color: "sariq",
    structure: "Kvadrat-tekis (C₂ᵥ)",
    metalLigand: "Pt-N, Pt-Cl",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 510, bond: "Pt-N cho'zilish", intensity: "Kuchli" },
      { freq: 490, bond: "Pt-N cho'zilish", intensity: "Kuchli" },
      { freq: 330, bond: "Pt-Cl cho'zilish", intensity: "O'rta" },
      { freq: 315, bond: "Pt-Cl cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "C₂ᵥ",
    magnetism: "Diamagnit (d⁸)",
    specialFeature: "Saraton dori (1978 FDA)",
    tags: ["sisplatin", "saraton", "kvadrat-tekis"]
  },
  {
    id: "trans-pt-nh3-2-cl2",
    slug: "trans-pt-nh3-2-cl2",
    formulaHTML: "trans-[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
    formulaPlain: "trans-[Pt(NH3)2Cl2]",
    iupac: "trans-Diammindixloroplatina(II)",
    commonName: "Transplatin (faol emas)",
    molarMass: 300.05,
    color: "sariq",
    structure: "Kvadrat-tekis (D₂ₕ)",
    metalLigand: "Pt-N, Pt-Cl",
    mainPeaks: [
      { freq: 3300, bond: "N-H cho'zilish", intensity: "Kuchli" },
      { freq: 500, bond: "Pt-N cho'zilish", intensity: "Kuchli" },
      { freq: 325, bond: "Pt-Cl cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "D₂ₕ",
    magnetism: "Diamagnit (d⁸)",
    specialFeature: "Saraton dori emas (faol emas)",
    tags: ["transplatin", "kvadrat-tekis", "simmetriya"]
  },

  // KARBONIL KOMPLEKSLAR
  {
    id: "fe-co-5",
    slug: "fe-co-5",
    formulaHTML: "[Fe(CO)<sub>5</sub>]",
    formulaPlain: "[Fe(CO)5]",
    iupac: "Pentakarboniltemir(0)",
    commonName: "Temir pentakarbonil",
    molarMass: 195.90,
    color: "sariq suyuqlik",
    structure: "Trigonal bipiramida (D₃ₕ)",
    metalLigand: "Fe-C, C≡O",
    mainPeaks: [
      { freq: 2057, bond: "νₐₛ(CO)", intensity: "Kuchli" },
      { freq: 2022, bond: "νₐₛ(CO)", intensity: "Kuchli" },
      { freq: 420, bond: "Fe-C cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "D₃ₕ",
    magnetism: "Diamagnit (d⁸, 18 elektron)",
    specialFeature: "18 elektron qoidasi, zaharli suyuqlik",
    tags: ["karbonil", "18-elektron", "D₃ₕ"]
  },
  {
    id: "ni-co-4",
    slug: "ni-co-4",
    formulaHTML: "[Ni(CO)<sub>4</sub>]",
    formulaPlain: "[Ni(CO)4]",
    iupac: "Tetrakarbonilnikel(0)",
    commonName: "Nikel tetrakarbonil",
    molarMass: 170.73,
    color: "rangsiz suyuqlik",
    structure: "Tetraedr (Td)",
    metalLigand: "Ni-C, C≡O",
    mainPeaks: [
      { freq: 2057, bond: "νₐₛ(CO)", intensity: "Kuchli" },
      { freq: 420, bond: "Ni-C cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "Td",
    magnetism: "Diamagnit (d¹⁰, 18 elektron)",
    specialFeature: "Juda zaharli suyuqlik, Mond jarayoni",
    tags: ["karbonil", "18-elektron", "Td"]
  },
  {
    id: "mn2-co-10",
    slug: "mn2-co-10",
    formulaHTML: "[Mn<sub>2</sub>(CO)<sub>10</sub>]",
    formulaPlain: "[Mn2(CO)10]",
    iupac: "Dekakarbonildimanganes(0)",
    commonName: "Dimanganes dekakarbonil",
    molarMass: 365.98,
    color: "sariq kristallar",
    structure: "Oktaedr-Oktaedr (D₄ₕ)",
    metalLigand: "Mn-C, C≡O, Mn-Mn",
    mainPeaks: [
      { freq: 2045, bond: "νₐₛ(CO)", intensity: "Kuchli" },
      { freq: 2014, bond: "νₐₛ(CO)", intensity: "Kuchli" },
      { freq: 420, bond: "Mn-C cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "D₄ₕ",
    magnetism: "Diamagnit (d⁷-d⁷, Mn-Mn bog')",
    specialFeature: "Metall-metall bog' (Mn-Mn)",
    tags: ["karbonil", "Mn-Mn", "18-elektron"]
  },

  // TSIANO KOMPLEKSLAR
  {
    id: "k4-fe-cn-6",
    slug: "k4-fe-cn-6",
    formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K4[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(II)",
    commonName: "Sariq qon tuzi",
    molarMass: 422.39,
    color: "sariq",
    structure: "Oktaedr (Oh)",
    metalLigand: "Fe-C, C≡N",
    mainPeaks: [
      { freq: 2044, bond: "ν(C≡N)", intensity: "Kuchli" },
      { freq: 590, bond: "Fe-C cho'zilish", intensity: "Kuchli" },
      { freq: 490, bond: "Fe-C cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "Oh",
    magnetism: "Diamagnit (d⁶ past spin)",
    specialFeature: "Prussian Blue sintezi",
    tags: ["tsiano", "diamagnit", "Oh"]
  },
  {
    id: "k3-fe-cn-6",
    slug: "k3-fe-cn-6",
    formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K3[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(III)",
    commonName: "Qizil qon tuzi",
    molarMass: 329.24,
    color: "qizil",
    structure: "Oktaedr (Oh)",
    metalLigand: "Fe-C, C≡N",
    mainPeaks: [
      { freq: 2135, bond: "ν(C≡N)", intensity: "Kuchli" },
      { freq: 590, bond: "Fe-C cho'zilish", intensity: "Kuchli" },
      { freq: 510, bond: "Fe-C cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "Oh",
    magnetism: "Paramagnit (d⁵ past spin, 1 e⁻)",
    specialFeature: "Kuchli oksidlovchi",
    tags: ["tsiano", "paramagnit", "oksidlovchi"]
  },

  // TIOTSİANATO KOMPLEKSLAR
  {
    id: "fe-scn-2-plus",
    slug: "fe-scn-2-plus",
    formulaHTML: "[Fe(SCN)]<sup>2+</sup>",
    formulaPlain: "[Fe(SCN)]2+",
    iupac: "Tiotsianatotemir(III)",
    commonName: "Temir(III) tiotsianat (qizil)",
    molarMass: 112.92,
    color: "qon qizil",
    structure: "Oktaedr",
    metalLigand: "Fe-N (N-bog'langan), C≡N, C-S",
    mainPeaks: [
      { freq: 2050, bond: "ν(C≡N)", intensity: "Kuchli" },
      { freq: 790, bond: "ν(C-S)", intensity: "O'rta" },
      { freq: 490, bond: "Fe-N cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "Past simmetriya",
    magnetism: "Paramagnit (d⁵ yuqori spin, 5 e⁻)",
    specialFeature: "Fe³⁺ aniqlash reagenti",
    tags: ["tiotsianato", "N-bog'langan", "Fe³⁺"]
  },
  {
    id: "pd-scn-4-2-minus",
    slug: "pd-scn-4-2-minus",
    formulaHTML: "[Pd(SCN)<sub>4</sub>]<sup>2-</sup>",
    formulaPlain: "[Pd(SCN)4]2-",
    iupac: "Tetratiotsianatopalladat(II)",
    commonName: "Palladiy tetratiotsianat",
    molarMass: 335.60,
    color: "sariq",
    structure: "Kvadrat-tekis (D₄ₕ)",
    metalLigand: "Pd-S (S-bog'langan), C≡N, C-S",
    mainPeaks: [
      { freq: 2120, bond: "ν(C≡N)", intensity: "Kuchli" },
      { freq: 710, bond: "ν(C-S)", intensity: "O'rta" },
      { freq: 350, bond: "Pd-S cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "D₄ₕ",
    magnetism: "Diamagnit (d⁸)",
    specialFeature: "S-bog'langan (HSAB: yumshoq Pd-S)",
    tags: ["tiotsianato", "S-bog'langan", "Pd²⁺"]
  },

  // BOSQA MUHIM KOMPLEKSLAR
  {
    id: "cu-salen",
    slug: "cu-salen",
    formulaHTML: "[Cu(salen)]",
    formulaPlain: "[Cu(salen)]",
    iupac: "N,N'-bis(salitsiliden)etilendiaminmis(II)",
    commonName: "Mis(II) salen (yashil)",
    molarMass: 325.84,
    color: "yashil",
    structure: "Kvadrat-tekis (D₂ₕ)",
    metalLigand: "Cu-N (Schiff), Cu-O (fenolat)",
    mainPeaks: [
      { freq: 1620, bond: "ν(C=N)", intensity: "Kuchli" },
      { freq: 450, bond: "Cu-N cho'zilish", intensity: "O'rta" },
      { freq: 420, bond: "Cu-O cho'zilish", intensity: "O'rta" },
    ],
    symmetry: "D₂ₕ",
    magnetism: "Paramagnit (d⁹, 1 e⁻)",
    specialFeature: "Schiff asos kompleksi, tetradentat",
    tags: ["schiff", "tetradentat", "paramagnit"]
  },
  {
    id: "fe-acac-3",
    slug: "fe-acac-3",
    formulaHTML: "[Fe(acac)<sub>3</sub>]",
    formulaPlain: "[Fe(acac)3]",
    iupac: "Tris(atsetilasetonato)temir(III)",
    commonName: "Temir(III) atsetilasetonat (qizil)",
    molarMass: 353.17,
    color: "qizil",
    structure: "Oktaedr (D₃)",
    metalLigand: "Fe-O (xelat)",
    mainPeaks: [
      { freq: 1600, bond: "ν(C=O) + ν(C=C)", intensity: "Kuchli" },
      { freq: 1520, bond: "ν(C=C) + δ(C-H)", intensity: "Kuchli" },
      { freq: 560, bond: "Fe-O cho'zilish", intensity: "Kuchli" },
      { freq: 420, bond: "Fe-O cho'zilish", intensity: "Kuchli" },
    ],
    symmetry: "D₃",
    magnetism: "Paramagnit (d⁵ yuqori spin, 5 e⁻)",
    specialFeature: "β-diketonat, 6 a'zoli xelat halqa",
    tags: ["diketonat", "xelat", "paramagnit"]
  }
]

export default function IQBirikmalarPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterTag, setFilterTag] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [activeBirikma, setActiveBirikma] = useState(null)

  // Barcha taglarni yig'ish
  const allTags = useMemo(() => {
    const tags = new Set()
    birikmalar.forEach(b => b.tags.forEach(t => tags.add(t)))
    return Array.from(tags)
  }, [])

  const filteredBirikmalar = useMemo(() => {
    let result = birikmalar

    // Filter by type
    if (filterType !== "all") {
      if (filterType === "klassik") {
        result = result.filter(b => b.tags.includes("klassik") || b.tags.includes("inert"))
      } else if (filterType === "linkage") {
        result = result.filter(b => b.tags.includes("linkage"))
      } else if (filterType === "sis-trans") {
        result = result.filter(b => b.tags.includes("sis") || b.tags.includes("trans"))
      } else if (filterType === "karbonil") {
        result = result.filter(b => b.tags.includes("karbonil"))
      } else if (filterType === "tsiano") {
        result = result.filter(b => b.tags.includes("tsiano"))
      } else if (filterType === "tiotsianato") {
        result = result.filter(b => b.tags.includes("tiotsianato"))
      } else if (filterType === "xelat") {
        result = result.filter(b => b.tags.includes("xelat"))
      }
    }

    // Filter by tag
    if (filterTag !== "all") {
      result = result.filter(b => b.tags.includes(filterTag))
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b =>
        b.formulaPlain.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.commonName.toLowerCase().includes(q) ||
        b.metalLigand.toLowerCase().includes(q)
      )
    }

    return result
  }, [searchQuery, filterType, filterTag])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/iq" className="hover:text-purple-300">IQ spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <span className="text-blue-400 font-semibold">Birikmalar</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                  <span className="text-3xl">🔍</span>
                  IQ spektroskopiya — Birikmalar katalogi
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  20 ta kompleks birikma • Cho'qqilar jadvali • Metall-ligand tebranishlari • Simmetriya
                </p>
              </div>
              <Link href="/ilmiy/tahlil/iq" className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← IQ spektroskopiya
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-blue-600 hover:bg-blue-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          {/* Qidiruv */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Birikma nomi, formula yoki M-L bog'i..."
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

          {/* Filter by type */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Tur:</span>
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Barchasi ({birikmalar.length})
            </button>
            <button
              onClick={() => setFilterType("klassik")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "klassik"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Klassik
            </button>
            <button
              onClick={() => setFilterType("linkage")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "linkage"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Linkage
            </button>
            <button
              onClick={() => setFilterType("sis-trans")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "sis-trans"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Sis-trans
            </button>
            <button
              onClick={() => setFilterType("karbonil")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "karbonil"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Karbonil
            </button>
            <button
              onClick={() => setFilterType("tsiano")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "tsiano"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Tsiano
            </button>
            <button
              onClick={() => setFilterType("tiotsianato")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "tiotsianato"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Tiotsianato
            </button>
            <button
              onClick={() => setFilterType("xelat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "xelat"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Xelat
            </button>
          </div>

          {/* Filter by tag */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Tag:</span>
            <button
              onClick={() => setFilterTag("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTag === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
              }`}
            >
              Barchasi
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterTag === tag
                    ? "bg-blue-600 text-white"
                    : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-blue-500"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* NATIJALAR SONI */}
        <div className="flex items-center justify-between">
          <p className="text-purple-300 text-sm">
            <strong className="text-blue-400">{filteredBirikmalar.length}</strong> ta birikma topildi
          </p>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBirikmalar.map((b) => (
              <Link
                key={b.id}
                href={`/ilmiy/tahlil/iq/birikmalar/${b.slug}`}
                className="group bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6 hover:bg-blue-900/60 hover:border-blue-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 group-hover:text-blue-300 transition-colors"
                      dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                    />
                    <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                    <p className="text-purple-500 text-xs mt-1">{b.commonName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-purple-400">M-L</div>
                    <div className="text-sm font-mono font-bold text-yellow-400">{b.metalLigand}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-blue-400 font-bold">{b.color}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Simmetriya:</span>
                    <span className="text-blue-400 font-bold">{b.symmetry}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Magnit:</span>
                    <span className="text-blue-400 font-bold">{b.magnetism}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-purple-400 mb-2">Asosiy cho'qqilar:</p>
                  <div className="space-y-1">
                    {b.mainPeaks.slice(0, 3).map((peak, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-yellow-400 font-mono">{peak.freq} cm⁻¹</span>
                        <span className="text-purple-300">{peak.bond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-yellow-400 italic">{b.specialFeature}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {b.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-purple-900/50 text-purple-300 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-purple-700/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-400">M = {b.molarMass} g/mol</span>
                    <span className="text-blue-400 group-hover:text-blue-300 transition-colors">Batafsil →</span>
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
                  <th className="py-3 px-4 text-blue-400">Formula</th>
                  <th className="py-3 px-4 text-blue-400">IUPAC</th>
                  <th className="py-3 px-4 text-blue-400">Rang</th>
                  <th className="py-3 px-4 text-blue-400">M-L</th>
                  <th className="py-3 px-4 text-blue-400">Simmetriya</th>
                  <th className="py-3 px-4 text-blue-400">Cho'qqilar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filteredBirikmalar.map((b) => (
                  <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4">
                      <Link 
                        href={`/ilmiy/tahlil/iq/birikmalar/${b.slug}`}
                        className="text-blue-400 font-bold hover:underline"
                        dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                      />
                    </td>
                    <td className="py-3 px-4 text-xs">{b.iupac}</td>
                    <td className="py-3 px-4 text-xs">{b.color}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{b.metalLigand}</td>
                    <td className="py-3 px-4 text-xs">{b.symmetry}</td>
                    <td className="py-3 px-4 text-xs">
                      {b.mainPeaks.slice(0, 2).map((p, i) => (
                        <div key={i} className="font-mono">{p.freq} cm⁻¹</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • IQ spektroskopiya • Birikmalar katalogi</p>
          <p className="mt-1">Manbalar: Nakamoto (Infrared and Raman Spectra of Inorganic and Coordination Compounds)</p>
        </div>
      </footer>
    </main>
  )
}