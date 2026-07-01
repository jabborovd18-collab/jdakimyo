"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// KOMPLEKS BIRIKMALAR BAZASI — 25 TA (PREMIUM)
// Har bir birikma: umumiy xususiyatlar, qo'llanilish, tarixiy ahamiyat
// ═══════════════════════════════════════════════════════════════════════════

const birikmalar = [
  // ═══ KLASSIK VERNER KOMPLEKSLARI ═══
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(NH3)6]Cl3",
    iupac: "Geksaamminkobalt(III) xlorid",
    commonName: "Luteo-kobalt",
    molarMass: 267.48,
    color: "sariq-jigarrang",
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "Oₕ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Monodentat",
    magnetism: "Diamagnit",
    stabilityConstant: "log β₆ ≈ 35",
    cfse: "-2.4 Δₒ",
    application: "Werner nazariyasining asosiy isboti",
    discovery: "Alfred Werner, 1893",
    tags: ["klassik", "werner", "inert", "oktaedrik", "Co"]
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
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "C₄ᵥ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Monodentat (aralash)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β₆ ≈ 28",
    cfse: "-2.4 Δₒ",
    application: "Ichki/tashqi sfera farqini ko'rsatish",
    discovery: "Jørgensen, 1890-lar",
    tags: ["klassik", "werner", "inert", "oktaedrik", "Co", "ichki-sfera"]
  },
  {
    id: "co-nh3-4-cl2-cl",
    slug: "co-nh3-4-cl2-cl",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>4</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "[Co(NH3)4Cl2]Cl",
    iupac: "Tetraammindiklorokobalt(III) xlorid",
    commonName: "Praseo/Violeo-kobalt",
    molarMass: 233.40,
    color: "yashil (trans) / binafsha (cis)",
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "D₄ₕ / C₂ᵥ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Monodentat (aralash)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β₆ ≈ 22",
    cfse: "-2.4 Δₒ",
    application: "Cis-trans izomeriyani o'rganish",
    discovery: "Jørgensen, 1890-lar",
    tags: ["klassik", "werner", "sis-trans", "oktaedrik", "Co", "izomer"]
  },

  // ═══ XELAT KOMPLEKSLAR ═══
  {
    id: "co-en3-cl3",
    slug: "co-en3-cl3",
    formulaHTML: "[Co(en)<sub>3</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(en)3]Cl3",
    iupac: "Tris(etilendiamin)kobalt(III) xlorid",
    commonName: "Tris-en kobalt",
    molarMass: 345.52,
    color: "sariq-to'q sariq",
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "D₃",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Bidentat (xelat)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β₃ ≈ 49",
    cfse: "-2.4 Δₒ",
    application: "Xelat effektini ko'rsatish (log β >> monodentat)",
    discovery: "Werner, 1911",
    tags: ["xelat", "werner", "oktaedrik", "Co", "optik-izomer"]
  },
  {
    id: "co-en2-cl2-cl",
    slug: "co-en2-cl2-cl",
    formulaHTML: "[Co(en)<sub>2</sub>Cl<sub>2</sub>]Cl",
    formulaPlain: "[Co(en)2Cl2]Cl",
    iupac: "Bis(etilendiamin)dixlorokobalt(III) xlorid",
    commonName: "Bis-en dixloro kobalt",
    molarMass: 288.47,
    color: "binafsha (cis) / yashil (trans)",
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "C₂ / D₂ₕ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Bidentat + monodentat",
    magnetism: "Diamagnit",
    stabilityConstant: "log β₄ ≈ 35",
    cfse: "-2.4 Δₒ",
    application: "Xelat + sis-trans izomeriya kombinatsiyasi",
    discovery: "Werner, 1911",
    tags: ["xelat", "sis-trans", "oktaedrik", "Co", "izomer"]
  },
  {
    id: "ca-edta",
    slug: "ca-edta",
    formulaHTML: "[Ca(EDTA)]<sup>2-</sup>",
    formulaPlain: "[Ca(EDTA)]2-",
    iupac: "Kalsiy etilendiamintetraasetat",
    commonName: "Ca-EDTA kompleksi",
    molarMass: 372.31,
    color: "rangsiz",
    oxidationState: "+2",
    dElectrons: "d⁰",
    geometry: "Oktaedrik (buzilgan)",
    pointGroup: "C₁",
    hybridization: "sp³d²",
    coordinationNumber: 6,
    ligandType: "Geksadentat (xelat)",
    magnetism: "Diamagnit",
    stabilityConstant: "log K ≈ 10.7",
    cfse: "0 (d⁰)",
    application: "Tibbiy detoksikatsiya (og'ir metall zaharlanishi)",
    discovery: "F. Schwarzenbach, 1945",
    tags: ["xelat", "tibbiy", "geksadentat", "Ca", "detoks"]
  },

  // ═══ LINKAGE (AMBIDENTAT) IZOMERLAR ═══
  {
    id: "co-nh3-5-no2-cl2",
    slug: "co-nh3-5-no2-cl2",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>NO<sub>2</sub>]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5NO2]Cl2",
    iupac: "Pentaamminnitrokobalt(III) xlorid",
    commonName: "Nitrokobalt (sariq)",
    molarMass: 278.44,
    color: "sariq",
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "C₄ᵥ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Monodentat (ambidentat N)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β ≈ 25",
    cfse: "-2.4 Δₒ",
    application: "Linkage izomeriya klassikasi (N-bog'langan)",
    discovery: "Jørgensen, 1894",
    tags: ["linkage", "klassik", "oktaedrik", "Co", "nitro"]
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
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "C₄ᵥ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Monodentat (ambidentat O)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β ≈ 23",
    cfse: "-2.4 Δₒ",
    application: "Linkage izomeriya klassikasi (O-bog'langan)",
    discovery: "Jørgensen, 1894",
    tags: ["linkage", "klassik", "oktaedrik", "Co", "nitrito"]
  },

  // ═══ SIS-TRANS IZOMERLAR (PT) ═══
  {
    id: "cis-pt-nh3-2-cl2",
    slug: "cis-pt-nh3-2-cl2",
    formulaHTML: "cis-[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
    formulaPlain: "cis-[Pt(NH3)2Cl2]",
    iupac: "cis-Diammindixloroplatina(II)",
    commonName: "Sisplatin (saraton dori)",
    molarMass: 300.05,
    color: "sariq",
    oxidationState: "+2",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "Monodentat (aralash)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β ≈ 15",
    cfse: "-2.4 Δsp",
    application: "Saraton kasalligiga qarshi dori (1978 FDA)",
    discovery: "Peyrone, 1845; Rosenberg, 1965",
    tags: ["sisplatin", "farmatsevtik", "sis-trans", "kvadrat-tekis", "Pt", "nobel"]
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
    oxidationState: "+2",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "D₂ₕ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "Monodentat (aralash)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β ≈ 14",
    cfse: "-2.4 Δsp",
    application: "Sisplatin bilan taqqoslash (struktur-faoliyat)",
    discovery: "Peyrone, 1845",
    tags: ["sis-trans", "kvadrat-tekis", "Pt", "nazorat"]
  },

  // ═══ KARBONIL KOMPLEKSLAR ═══
  {
    id: "fe-co-5",
    slug: "fe-co-5",
    formulaHTML: "[Fe(CO)<sub>5</sub>]",
    formulaPlain: "[Fe(CO)5]",
    iupac: "Pentakarboniltemir(0)",
    commonName: "Temir pentakarbonil",
    molarMass: 195.90,
    color: "sariq suyuqlik",
    oxidationState: "0",
    dElectrons: "d⁸",
    geometry: "Trigonal bipiramida",
    pointGroup: "D₃ₕ",
    hybridization: "dsp³",
    coordinationNumber: 5,
    ligandType: "Monodentat (π-akseptor)",
    magnetism: "Diamagnit",
    stabilityConstant: "18 elektron qoida",
    cfse: "—",
    application: "Organometallik sintez, Fe nanopartikullari",
    discovery: "Mond & Quincke, 1891",
    tags: ["karbonil", "organometallik", "18-elektron", "Fe", "sanoat"]
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
    oxidationState: "0",
    dElectrons: "d¹⁰",
    geometry: "Tetraedrik",
    pointGroup: "Tₔ",
    hybridization: "sp³",
    coordinationNumber: 4,
    ligandType: "Monodentat (π-akseptor)",
    magnetism: "Diamagnit",
    stabilityConstant: "18 elektron qoida",
    cfse: "0 (tetraedrik, d¹⁰)",
    application: "Mond jarayoni (Ni tozalash), juda zaharli",
    discovery: "Ludwig Mond, 1890",
    tags: ["karbonil", "organometallik", "18-elektron", "tetraedrik", "Ni", "sanoat"]
  },

  // ═══ TSIANO KOMPLEKSLAR ═══
  {
    id: "k4-fe-cn-6",
    slug: "k4-fe-cn-6",
    formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K4[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(II)",
    commonName: "Sariq qon tuzi",
    molarMass: 368.35,
    color: "sariq",
    oxidationState: "+2",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "Oₕ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Monodentat (kuchli maydon)",
    magnetism: "Diamagnit",
    stabilityConstant: "log β₆ ≈ 35",
    cfse: "-2.4 Δₒ",
    application: "Prussian Blue sintezi, Fe³⁺ aniqlash",
    discovery: "Diesbach, 1704",
    tags: ["tsiano", "klassik", "oktaedrik", "Fe", "sanoat"]
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
    oxidationState: "+3",
    dElectrons: "d⁵",
    geometry: "Oktaedrik",
    pointGroup: "Oₕ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Monodentat (kuchli maydon)",
    magnetism: "Paramagnit (1 e⁻)",
    stabilityConstant: "log β₆ ≈ 42",
    cfse: "-2.0 Δₒ",
    application: "Kuchli oksidlovchi, analitik kimyo",
    discovery: "Gmelin, 1822",
    tags: ["tsiano", "klassik", "oktaedrik", "Fe", "oksidlovchi"]
  },

  // ═══ ORGANOMETALLIK (SENDVICH) ═══
  {
    id: "ferrosen",
    slug: "ferrosen",
    formulaHTML: "[Fe(C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>]",
    formulaPlain: "[Fe(C5H5)2]",
    iupac: "Bis(η⁵-siklopentadienil)temir(II)",
    commonName: "Ferrosen",
    molarMass: 186.04,
    color: "to'q sariq kristall",
    oxidationState: "+2",
    dElectrons: "d⁶",
    geometry: "Sendvich",
    pointGroup: "D₅ₕ",
    hybridization: "—",
    coordinationNumber: "10 (η⁵×2)",
    ligandType: "Pentadentat (π-ligand)",
    magnetism: "Diamagnit",
    stabilityConstant: "18 elektron qoida",
    cfse: "—",
    application: "Organometallik kimyo klassikasi, kataliz",
    discovery: "Kealy & Pauson; Miller, 1951",
    tags: ["organometallik", "sendvich", "18-elektron", "Fe", "klassik"]
  },

  // ═══ BIOLOGIK KOMPLEKSLAR ═══
  {
    id: "gemoglobin",
    slug: "gemoglobin",
    formulaHTML: "[Fe(Por)(His)(O<sub>2</sub>)]",
    formulaPlain: "[Fe(Por)(His)(O2)]",
    iupac: "Oksigemoglobin (Fe²⁺ porfirin)",
    commonName: "Gemoglobin (qon pigmenti)",
    molarMass: 64500,
    color: "qizil (oksi) / ko'k-qizil (deoksi)",
    oxidationState: "+2",
    dElectrons: "d⁶",
    geometry: "Oktaedrik (buzilgan)",
    pointGroup: "C₄ᵥ",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Tetradentat (Por) + 2 monodentat",
    magnetism: "Diamagnit (oksi) / Paramagnit (deoksi)",
    stabilityConstant: "P₅₀ ≈ 26 mmHg",
    cfse: "-2.4 Δₒ",
    application: "O₂ transporti (qon)",
    discovery: "Hünefeld, 1840; Perutz (struktura, Nobel 1962)",
    tags: ["biologik", "porfirin", "oktaedrik", "Fe", "tibbiy"]
  },
  {
    id: "xlorofill",
    slug: "xlorofill",
    formulaHTML: "[Mg(Chl)]",
    formulaPlain: "[Mg(Chl)]",
    iupac: "Magniy xlorofill-a",
    commonName: "Xlorofill (fotosintez pigmenti)",
    molarMass: 893.5,
    color: "yashil",
    oxidationState: "+2",
    dElectrons: "d⁰",
    geometry: "Kvadrat-piramidal",
    pointGroup: "Cₛ",
    hybridization: "sp²d",
    coordinationNumber: 5,
    ligandType: "Tetradentat (porfirin-simon)",
    magnetism: "Diamagnit",
    stabilityConstant: "log K ≈ 9",
    cfse: "0 (d⁰)",
    application: "Fotosintez — yorug'lik energiyasini yutish",
    discovery: "Pelletier & Caventou, 1817",
    tags: ["biologik", "porfirin", "Mg", "fotosintez"]
  },
  {
    id: "vitamin-b12",
    slug: "vitamin-b12",
    formulaHTML: "[Co(Corr)(DMB)(R)]",
    formulaPlain: "[Co(Corr)(DMB)(R)]",
    iupac: "Kobalamin (Vitamin B₁₂)",
    commonName: "Vitamin B₁₂",
    molarMass: 1355.4,
    color: "to'q qizil",
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik (buzilgan)",
    pointGroup: "C₁",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Tetradentat (korin) + 2 monodentat",
    magnetism: "Diamagnit",
    stabilityConstant: "log K > 20",
    cfse: "-2.4 Δₒ",
    application: "Metabolizm, qon hosil bo'lishi, DNK sintezi",
    discovery: "Rickes, 1948; Hodgkin (struktura, Nobel 1964)",
    tags: ["biologik", "korin", "oktaedrik", "Co", "tibbiy", "nobel"]
  },

  // ═══ TARIXIY MILESTONE KOMPLEKSLAR ═══
  {
    id: "zeise-tuzi",
    slug: "zeise-tuzi",
    formulaHTML: "K[PtCl<sub>3</sub>(C<sub>2</sub>H<sub>4</sub>)]",
    formulaPlain: "K[PtCl3(C2H4)]",
    iupac: "Kaliy trixloro(etilen)platinat(II)",
    commonName: "Zeise tuzi",
    molarMass: 368.6,
    color: "sariq",
    oxidationState: "+2",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "Monodentat + η²-olefin",
    magnetism: "Diamagnit",
    stabilityConstant: "log K ≈ 4",
    cfse: "-2.4 Δsp",
    application: "Birinchi organometallik birikma (1827)",
    discovery: "William Zeise, 1827",
    tags: ["organometallik", "kvadrat-tekis", "Pt", "tarixiy", "milestone"]
  },
  {
    id: "vaska-kompleksi",
    slug: "vaska-kompleksi",
    formulaHTML: "trans-[IrCl(CO)(PPh<sub>3</sub>)<sub>2</sub>]",
    formulaPlain: "trans-[IrCl(CO)(PPh3)2]",
    iupac: "Karbonilxlorobis(trifenilfosfin)iridiy(I)",
    commonName: "Vaska kompleksi",
    molarMass: 779.3,
    color: "sariq-yashil",
    oxidationState: "+1",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "Monodentat (aralash)",
    magnetism: "Diamagnit",
    stabilityConstant: "16 elektron",
    cfse: "-2.4 Δsp",
    application: "Oksidativ birikish modeli (O₂, H₂ biriktirish)",
    discovery: "Lauri Vaska, 1961",
    tags: ["organometallik", "kvadrat-tekis", "Ir", "kataliz", "O2-bog'lanish"]
  },
  {
    id: "wilkinson-katalizatori",
    slug: "wilkinson-katalizatori",
    formulaHTML: "[RhCl(PPh<sub>3</sub>)<sub>3</sub>]",
    formulaPlain: "[RhCl(PPh3)3]",
    iupac: "Xlorotris(trifenilfosfin)rodiy(I)",
    commonName: "Wilkinson katalizatori",
    molarMass: 925.2,
    color: "qizil-binafsha",
    oxidationState: "+1",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "Monodentat (aralash)",
    magnetism: "Diamagnit",
    stabilityConstant: "16 elektron",
    cfse: "-2.4 Δsp",
    application: "Alkenlarni gomogen gidrogenlash",
    discovery: "Geoffrey Wilkinson (Nobel 1973)",
    tags: ["organometallik", "kvadrat-tekis", "Rh", "kataliz", "nobel"]
  },
  {
    id: "prussian-blue",
    slug: "prussian-blue",
    formulaHTML: "Fe<sub>4</sub>[Fe(CN)<sub>6</sub>]<sub>3</sub>",
    formulaPlain: "Fe4[Fe(CN)6]3",
    iupac: "Temir(III) geksatsianoferrat(II)",
    commonName: "Prussian Blue (Berlin ko'ki)",
    molarMass: 859.2,
    color: "to'q ko'k",
    oxidationState: "+2/+3",
    dElectrons: "d⁶/d⁵",
    geometry: "Kubik panjara",
    pointGroup: "Oₕ (lokal)",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Ko'prikli CN⁻",
    magnetism: "Ferrimagnit",
    stabilityConstant: "log K ≈ 40",
    cfse: "-2.4 Δₒ",
    application: "Pigment, tibbiy (Cs/Tl detoksikatsiya), elektroxromizm",
    discovery: "Diesbach, 1704",
    tags: ["klassik", "oktaedrik", "Fe", "pigment", "tarixiy", "tibbiy"]
  },
  {
    id: "creutz-taube",
    slug: "creutz-taube",
    formulaHTML: "[(NH<sub>3</sub>)<sub>5</sub>Ru(pyz)Ru(NH<sub>3</sub>)<sub>5</sub>]<sup>5+</sup>",
    formulaPlain: "[(NH3)5Ru(pyz)Ru(NH3)5]5+",
    iupac: "Bis(pentaamminruteniy)pirazin kompleks ioni",
    commonName: "Creutz-Taube ioni",
    molarMass: 654.5,
    color: "to'q ko'k",
    oxidationState: "+2.5 / +2.5",
    dElectrons: "d⁵·⁵ × 2",
    geometry: "Ikki oktaedr (ko'prikli)",
    pointGroup: "D₂ₕ",
    hybridization: "d²sp³",
    coordinationNumber: 12,
    ligandType: "Ko'prikli pirazin",
    magnetism: "Paramagnit (1 e⁻)",
    stabilityConstant: "log K ≈ 25",
    cfse: "-2.4 Δₒ × 2",
    application: "Mixed-valence klassikasi, elektron uzatish modeli",
    discovery: "Carol Creutz & Henry Taube (Nobel 1983)",
    tags: ["klassik", "oktaedrik", "Ru", "mixed-valence", "nobel"]
  },
  {
    id: "krown-efir",
    slug: "krown-efir",
    formulaHTML: "[K(18-crown-6)]<sup>+</sup>",
    formulaPlain: "[K(18-crown-6)]+",
    iupac: "Kaliy-18-kraun-6 kompleksi",
    commonName: "Kraun-efir K⁺ kompleksi",
    molarMass: 309.4,
    color: "rangsiz",
    oxidationState: "+1",
    dElectrons: "d⁰",
    geometry: "Psevdooktaedrik",
    pointGroup: "D₃d",
    hybridization: "—",
    coordinationNumber: 6,
    ligandType: "Makrosiklik (geksadentat O)",
    magnetism: "Diamagnit",
    stabilityConstant: "log K ≈ 6 (metanol)",
    cfse: "0 (d⁰)",
    application: "Ion tashish, fazalararo kataliz, supramolekulyar",
    discovery: "Charles Pedersen (Nobel 1987)",
    tags: ["supramolekulyar", "kraun-efir", "K", "makrosiklik", "nobel"]
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// FILTER KATEGORIYALARI
// ═══════════════════════════════════════════════════════════════════════════

const filterKategoriyalar = {
  geometriya: [
    { id: "oktaedrik", label: "Oktaedrik" },
    { id: "kvadrat-tekis", label: "Kvadrat-tekis" },
    { id: "tetraedrik", label: "Tetraedrik" },
    { id: "trigonal", label: "Trigonal bipiramida" },
    { id: "sendvich", label: "Sendvich" },
  ],
  metall: ["Co", "Fe", "Pt", "Ni", "Rh", "Ir", "Ru", "Mg", "Ca", "K"],
  qollanilish: [
    { id: "tibbiy", label: "💊 Tibbiyot" },
    { id: "sanoat", label: "🏭 Sanoat" },
    { id: "kataliz", label: "⚗️ Kataliz" },
    { id: "biologik", label: "🧬 Biologik" },
    { id: "klassik", label: "📚 Klassik" },
    { id: "nobel", label: "🏆 Nobel mukofoti" },
  ]
}

export default function BirikmalarBazasi() {
  const [qidiruv, setQidiruv] = useState("")
  const [filterGeometriya, setFilterGeometriya] = useState("all")
  const [filterMetall, setFilterMetall] = useState("all")
  const [filterQollanilish, setFilterQollanilish] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(true)

  // Filterlangan birikmalar
  const filtered = useMemo(() => {
    let result = birikmalar

    if (qidiruv) {
      const q = qidiruv.toLowerCase()
      result = result.filter(b =>
        b.formulaPlain.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.commonName.toLowerCase().includes(q) ||
        b.application.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    if (filterGeometriya !== "all") {
      result = result.filter(b => b.geometry.toLowerCase().includes(filterGeometriya))
    }

    if (filterMetall !== "all") {
      result = result.filter(b => b.tags.includes(filterMetall))
    }

    if (filterQollanilish !== "all") {
      result = result.filter(b => b.tags.includes(filterQollanilish))
    }

    return result
  }, [qidiruv, filterGeometriya, filterMetall, filterQollanilish])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy bo'lim</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400 font-semibold">Kompleks birikmalar bazasi</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                <span className="text-3xl">🧪</span>
                Kompleks birikmalar bazasi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {birikmalar.length} ta birikma • IUPAC • Xususiyatlar • Qo'llanilish • Tarixiy ahamiyat
              </p>
            </div>
            <Link href="/ilmiy" className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Ilmiy bo'lim
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          
          {/* Qidiruv + View mode */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="🔍 Formula, IUPAC nom, qo'llanilishi yoki olim nomi..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {qidiruv && (
                <button
                  onClick={() => setQidiruv("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                📊 Jadval
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  showFilters ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                🔽 Filter
              </button>
            </div>
          </div>

          {/* FILTERS */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-purple-700/30">
              
              {/* Geometriya filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-purple-400 text-xs font-semibold min-w-[90px]">Geometriya:</span>
                <button
                  onClick={() => setFilterGeometriya("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterGeometriya === "all" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300 border border-purple-700/30"
                  }`}
                >
                  Barchasi
                </button>
                {filterKategoriyalar.geometriya.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setFilterGeometriya(g.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterGeometriya === g.id ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300 border border-purple-700/30"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Metall filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-purple-400 text-xs font-semibold min-w-[90px]">Metall:</span>
                <button
                  onClick={() => setFilterMetall("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterMetall === "all" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300 border border-purple-700/30"
                  }`}
                >
                  Barchasi
                </button>
                {filterKategoriyalar.metall.map(m => (
                  <button
                    key={m}
                    onClick={() => setFilterMetall(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-mono ${
                      filterMetall === m ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300 border border-purple-700/30"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Qo'llanilish filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-purple-400 text-xs font-semibold min-w-[90px]">Qo'llanilish:</span>
                <button
                  onClick={() => setFilterQollanilish("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterQollanilish === "all" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300 border border-purple-700/30"
                  }`}
                >
                  Barchasi
                </button>
                {filterKategoriyalar.qollanilish.map(q => (
                  <button
                    key={q.id}
                    onClick={() => setFilterQollanilish(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterQollanilish === q.id ? "bg-green-600 text-white" : "bg-purple-900/50 text-purple-300 border border-purple-700/30"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NATIJALAR SONI */}
        <div className="flex items-center justify-between">
          <p className="text-purple-300 text-sm">
            <strong className="text-blue-400">{filtered.length}</strong> ta birikma topildi
            {(qidiruv || filterGeometriya !== "all" || filterMetall !== "all" || filterQollanilish !== "all") && (
              <button
                onClick={() => {
                  setQidiruv("")
                  setFilterGeometriya("all")
                  setFilterMetall("all")
                  setFilterQollanilish("all")
                }}
                className="ml-3 text-xs text-red-400 hover:text-red-300"
              >
                ✕ Filterni tozalash
              </button>
            )}
          </p>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <Link
                key={b.id}
                href={`/ilmiy/birikmalar/${b.slug}`}
                className="group bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6 hover:bg-blue-900/60 hover:border-blue-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Header: Formula + Metall */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      className="text-lg font-bold text-blue-400 group-hover:text-blue-300 transition-colors"
                      dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                    />
                    <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                    <p className="text-purple-500 text-xs italic">{b.commonName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-purple-400">Metall</div>
                    <div className="text-lg font-mono font-bold text-yellow-400">{b.tags.find(t => filterKategoriyalar.metall.includes(t)) || b.tags[0]}</div>
                  </div>
                </div>

                {/* Xususiyatlar */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Oksidlanish:</span>
                    <span className="text-blue-400 font-bold font-mono">{b.oxidationState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Elektron:</span>
                    <span className="text-blue-400 font-bold font-mono">{b.dElectrons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Geometriya:</span>
                    <span className="text-blue-400 font-bold">{b.geometry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Gibridlanish:</span>
                    <span className="text-blue-400 font-bold font-mono">{b.hybridization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Simmetriya:</span>
                    <span className="text-blue-400 font-bold font-mono">{b.pointGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Magnit:</span>
                    <span className="text-blue-400 font-bold">{b.magnetism}</span>
                  </div>
                </div>

                {/* Qo'llanilishi */}
                <div className="mb-4 p-3 bg-purple-950/40 rounded-lg border border-purple-700/30">
                  <p className="text-xs text-purple-400 mb-1">💡 Qo'llanilishi:</p>
                  <p className="text-xs text-yellow-300 italic leading-relaxed">{b.application}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {b.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 text-[10px]">
                      {tag}
                    </span>
                  ))}
                  {b.tags.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-400 text-[10px]">
                      +{b.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-purple-700/30 flex justify-between items-center text-xs">
                  <span className="text-purple-400">M = {b.molarMass} g/mol</span>
                  <span className="text-blue-400 group-hover:text-blue-300 transition-colors font-semibold">
                    Batafsil →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-purple-950/60 border-b border-purple-700">
                <tr>
                  <th className="py-3 px-4 text-blue-400 font-semibold">Formula</th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">IUPAC</th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">Rang</th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">Metall</th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">Geometriya</th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">KS</th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">Magnit</th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">Qo'llanilish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        href={`/ilmiy/birikmalar/${b.slug}`}
                        className="text-blue-400 font-bold hover:underline"
                        dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                      />
                    </td>
                    <td className="py-3 px-4 text-xs">{b.iupac}</td>
                    <td className="py-3 px-4 text-xs">{b.color}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 font-bold">
                      {b.tags.find(t => filterKategoriyalar.metall.includes(t)) || b.tags[0]}
                      <span className="text-purple-400 text-xs ml-1">({b.oxidationState})</span>
                    </td>
                    <td className="py-3 px-4 text-xs">{b.geometry}</td>
                    <td className="py-3 px-4 text-xs font-mono">{b.coordinationNumber}</td>
                    <td className="py-3 px-4 text-xs">{b.magnetism}</td>
                    <td className="py-3 px-4 text-xs text-yellow-300 italic max-w-[200px] truncate" title={b.application}>
                      {b.application}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Filterlarni o'zgartirib ko'ring</p>
          </div>
        )}

        {/* STATISTIKA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Jami birikmalar", value: birikmalar.length, icon: "🧪", color: "blue" },
            { label: "Nobel mukofoti", value: birikmalar.filter(b => b.tags.includes("nobel")).length, icon: "🏆", color: "yellow" },
            { label: "Biologik", value: birikmalar.filter(b => b.tags.includes("biologik")).length, icon: "🧬", color: "green" },
            { label: "Katalizatorlar", value: birikmalar.filter(b => b.tags.includes("kataliz")).length, icon: "⚗️", color: "purple" },
          ].map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-extrabold text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-xs text-purple-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO • Koordinatsion kimyo ta'lim portali</p>
          <p className="mt-1">Manbalar: Cotton & Wilkinson, Housecroft, Miessler, IUPAC 2005</p>
        </div>
      </footer>
    </main>
  )
}