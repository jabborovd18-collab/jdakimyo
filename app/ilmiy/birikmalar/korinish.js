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
    stabilityConstant: "juda barqaror (kovalent)",
    cfse: "0 (d⁰)",
    application: "Fotosintez (yorug'lik yig'ish)",
    discovery: "Pelletier & Caventou, 1817; Woodward (sintez, Nobel 1965)",
    tags: ["biologik", "porfirin", "Mg", "fotosintez", "nobel"]
  },
  {
    id: "vitamin-b12",
    slug: "vitamin-b12",
    formulaHTML: "[Co(Cor)(CN)(dmb)]",
    formulaPlain: "[Co(Cor)(CN)(dmb)]",
    iupac: "Sianokobalamin (B₁₂ vitamini)",
    commonName: "Vitamin B₁₂",
    molarMass: 1355.4,
    color: "to'q qizil",
    oxidationState: "+3",
    dElectrons: "d⁶",
    geometry: "Oktaedrik",
    pointGroup: "C₁",
    hybridization: "d²sp³",
    coordinationNumber: 6,
    ligandType: "Tetradentat (korrin) + 2 aksial",
    magnetism: "Diamagnit",
    stabilityConstant: "juda barqaror",
    cfse: "-2.4 Δₒ",
    application: "Qon hosil bo'lishi, DNA sintezi",
    discovery: "Rickes/Smith, 1948; Hodgkin (Nobel 1964)",
    tags: ["biologik", "vitamin", "oktaedrik", "Co", "nobel", "tibbiy"]
  },

  // ═══ SANOAT VA KATALIZ ═══
  {
    id: "wilkinson",
    slug: "wilkinson",
    formulaHTML: "[RhCl(PPh<sub>3</sub>)<sub>3</sub>]",
    formulaPlain: "[RhCl(PPh3)3]",
    iupac: "Xlorotris(trifenilfosfin)rodiy(I)",
    commonName: "Vilkinson katalizatori",
    molarMass: 925.22,
    color: "to'q qizil kristall",
    oxidationState: "+1",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "Monodentat (fosfin + xlorid)",
    magnetism: "Diamagnit",
    stabilityConstant: "kataliz siklida barqaror",
    cfse: "-2.4 Δsp",
    application: "Alkenlarni gidrogenlash (homogen kataliz)",
    discovery: "Geoffrey Wilkinson, 1966 (Nobel 1973)",
    tags: ["kataliz", "organometallik", "kvadrat-tekis", "Rh", "nobel", "sanoat"]
  },
  {
    id: "grubbs",
    slug: "grubbs",
    formulaHTML: "[Ru(=CHPh)Cl<sub>2</sub>(PCy<sub>3</sub>)<sub>2</sub>]",
    formulaPlain: "[Ru(=CHPh)Cl2(PCy3)2]",
    iupac: "Benziliden-bis(tritsikloheksilfosfin)diklororuteniy",
    commonName: "Grubbs katalizatori (1-avlod)",
    molarMass: 822.96,
    color: "binafsha kristall",
    oxidationState: "+2",
    dElectrons: "d⁶",
    geometry: "Kvadrat-piramidal",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp³",
    coordinationNumber: 5,
    ligandType: "Karben + fosfin + xlorid",
    magnetism: "Diamagnit",
    stabilityConstant: "havoga chidamli",
    cfse: "-2.4 Δₒ",
    application: "Olefin metatezisi (Grubbs reaksiyasi)",
    discovery: "Robert Grubbs, 1990-lar (Nobel 2005)",
    tags: ["kataliz", "organometallik", "Ru", "nobel", "metatezis"]
  },
  {
    id: "vaska",
    slug: "vaska",
    formulaHTML: "[IrCl(CO)(PPh<sub>3</sub>)<sub>2</sub>]",
    formulaPlain: "[IrCl(CO)(PPh3)2]",
    iupac: "Karbonilxlorobis(trifenilfosfin)iridiy(I)",
    commonName: "Vaska kompleksi",
    molarMass: 780.24,
    color: "sariq",
    oxidationState: "+1",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "Monodentat (aralash)",
    magnetism: "Diamagnit",
    stabilityConstant: "O₂ ni qaytar bog'laydi",
    cfse: "-2.4 Δsp",
    application: "Oksidlanish qo'shilish reaksiyasi klassikasi",
    discovery: "Lauri Vaska, 1961",
    tags: ["organometallik", "kvadrat-tekis", "Ir", "klassik", "kataliz"]
  },

  // ═══ MAXSUS VA MASHHUR ═══
  {
    id: "zeise",
    slug: "zeise",
    formulaHTML: "K[PtCl<sub>3</sub>(η²-C<sub>2</sub>H<sub>4</sub>)]",
    formulaPlain: "K[PtCl3(η2-C2H4)]",
    iupac: "Kaliy trikloro(etilen)platinat(II)",
    commonName: "Zeise tuzi",
    molarMass: 368.57,
    color: "sariq kristall",
    oxidationState: "+2",
    dElectrons: "d⁸",
    geometry: "Kvadrat-tekis",
    pointGroup: "C₂ᵥ",
    hybridization: "dsp²",
    coordinationNumber: 4,
    ligandType: "η² alken + monodentat",
    magnetism: "Diamagnit",
    stabilityConstant: "log K ≈ 4",
    cfse: "-2.4 Δsp",
    application: "Birinchi organometallik birikma, π-bog' modeli (Dewar-Chatt-Duncanson)",
    discovery: "William Zeise, 1827",
    tags: ["organometallik", "klassik", "Pt", "tarixiy", "kvadrat-tekis"]
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

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI: RANG XARITASI (birikma rangi → CSS gradient)
// ═══════════════════════════════════════════════════════════════════════════

function getColorStrip(colorText) {
  const c = colorText.toLowerCase()
  if (c.includes("sariq") && c.includes("jigar")) return "linear-gradient(90deg,#f59e0b,#78350f)"
  if (c.includes("sariq")) return "linear-gradient(90deg,#fbbf24,#f59e0b)"
  if (c.includes("binafsha")) return "linear-gradient(90deg,#a855f7,#6b21a8)"
  if (c.includes("qizil")) return "linear-gradient(90deg,#ef4444,#991b1b)"
  if (c.includes("yashil")) return "linear-gradient(90deg,#22c55e,#14532d)"
  if (c.includes("ko'k") || c.includes("kok")) return "linear-gradient(90deg,#3b82f6,#1e3a8a)"
  if (c.includes("to'q sariq") || c.includes("toq sariq")) return "linear-gradient(90deg,#f97316,#7c2d12)"
  if (c.includes("rangsiz")) return "linear-gradient(90deg,#64748b,#334155)"
  return "linear-gradient(90deg,#06b6d4,#7c3aed)"
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI: GEOMETRIYA SVG IKONKALARI
// ═══════════════════════════════════════════════════════════════════════════

function GeometryIcon({ geometry, className = "w-8 h-8" }) {
  const g = geometry.toLowerCase()
  const stroke = "currentColor"
  if (g.includes("oktaedr")) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none">
        <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke={stroke} strokeWidth="1.5"/>
        <path d="M4 20 L36 20 M20 4 L20 36" stroke={stroke} strokeWidth="1" opacity="0.5"/>
        <circle cx="20" cy="20" r="2.5" fill={stroke}/>
      </svg>
    )
  }
  if (g.includes("kvadrat-tekis") || g.includes("kvadrat tekis")) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none">
        <rect x="7" y="7" width="26" height="26" stroke={stroke} strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="2.5" fill={stroke}/>
        <circle cx="7" cy="7" r="1.5" fill={stroke}/>
        <circle cx="33" cy="7" r="1.5" fill={stroke}/>
        <circle cx="7" cy="33" r="1.5" fill={stroke}/>
        <circle cx="33" cy="33" r="1.5" fill={stroke}/>
      </svg>
    )
  }
  if (g.includes("tetraedr")) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none">
        <path d="M20 5 L35 32 L5 32 Z" stroke={stroke} strokeWidth="1.5"/>
        <path d="M20 5 L20 32 M5 32 L35 32" stroke={stroke} strokeWidth="1" opacity="0.5"/>
        <circle cx="20" cy="22" r="2.5" fill={stroke}/>
      </svg>
    )
  }
  if (g.includes("trigonal")) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none">
        <path d="M20 4 L32 20 L8 20 Z M20 36 L32 20 L8 20 Z" stroke={stroke} strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="2.5" fill={stroke}/>
      </svg>
    )
  }
  if (g.includes("sendvich")) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="10" rx="14" ry="3" stroke={stroke} strokeWidth="1.5"/>
        <ellipse cx="20" cy="30" rx="14" ry="3" stroke={stroke} strokeWidth="1.5"/>
        <line x1="20" y1="13" x2="20" y2="27" stroke={stroke} strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="2.5" fill={stroke}/>
      </svg>
    )
  }
  if (g.includes("piramid")) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none">
        <path d="M20 6 L34 32 L6 32 Z" stroke={stroke} strokeWidth="1.5"/>
        <path d="M6 32 L20 26 L34 32 M20 6 L20 26" stroke={stroke} strokeWidth="1" opacity="0.5"/>
        <circle cx="20" cy="26" r="2.5" fill={stroke}/>
      </svg>
    )
  }
  if (g.includes("kubik")) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none">
        <path d="M8 12 L28 12 L28 32 L8 32 Z M8 12 L14 6 L34 6 L28 12 M28 12 L34 6 L34 26 L28 32" stroke={stroke} strokeWidth="1.5"/>
      </svg>
    )
  }
  // default
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke={stroke} strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="2.5" fill={stroke}/>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI: METALL BEJIGI (davriy jadval uslubi)
// ═══════════════════════════════════════════════════════════════════════════

const metallInfo = {
  Co: { name: "Kobalt", z: 27, mass: "58.93" },
  Fe: { name: "Temir", z: 26, mass: "55.85" },
  Pt: { name: "Platina", z: 78, mass: "195.08" },
  Ni: { name: "Nikel", z: 28, mass: "58.69" },
  Rh: { name: "Rodiy", z: 45, mass: "102.91" },
  Ir: { name: "Iridiy", z: 77, mass: "192.22" },
  Ru: { name: "Ruteniy", z: 44, mass: "101.07" },
  Mg: { name: "Magniy", z: 12, mass: "24.31" },
  Ca: { name: "Kalsiy", z: 20, mass: "40.08" },
  K:  { name: "Kaliy",  z: 19, mass: "39.10" },
}

function MetalBadge({ symbol, size = "md" }) {
  const info = metallInfo[symbol]
  if (!info) return null
  const sizes = {
    sm: "w-10 h-10 text-[9px]",
    md: "w-14 h-14 text-[10px]",
    lg: "w-16 h-16 text-xs",
  }
  const symbolSize = { sm: "text-base", md: "text-xl", lg: "text-2xl" }
  return (
    <div className={`${sizes[size]} relative rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-400/40 flex flex-col items-center justify-center font-mono text-cyan-100 shadow-lg shadow-cyan-500/10`}>
      <div className="absolute top-0.5 left-1 text-[8px] text-cyan-300/80">{info.z}</div>
      <div className={`${symbolSize[size]} font-bold leading-none`}>{symbol}</div>
      <div className="text-[7px] text-cyan-300/70 mt-0.5">{info.mass}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// KOMPONENT: NATIJALARNI SANASH (kategoriya bo'yicha)
// ═══════════════════════════════════════════════════════════════════════════

function countByTag(tag) {
  return birikmalar.filter(b => b.tags.includes(tag)).length
}
function countByGeometry(id) {
  return birikmalar.filter(b => b.geometry.toLowerCase().includes(id)).length
}
function countByMetal(symbol) {
  return birikmalar.filter(b => b.tags.includes(symbol)).length
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════

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

  const hasActiveFilter = qidiruv || filterGeometriya !== "all" || filterMetall !== "all" || filterQollanilish !== "all"

  return (
    <main className="min-h-screen bg-[#050814] text-slate-100 relative overflow-hidden">

      {/* GLOBAL DEKORATIV FON */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-fuchsia-500/5 blur-[100px]" />
        {/* grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(148,163,184,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
      </div>

      {/* ═══ HEADER ═══ */}
      <header className="border-b border-cyan-500/10 sticky top-0 z-40 bg-[#050814]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-cyan-300 transition">jdakimyo.uz</Link>
            <span className="text-slate-600">/</span>
            <Link href="/ilmiy" className="hover:text-cyan-300 transition">ilmiy</Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-300">birikmalar</span>
          </nav>
          <div className="mt-3 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/30">
                  <span className="drop-shadow">⬡</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                    Kompleks birikmalar bazasi
                  </h1>
                  <p className="text-[11px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                    Coordination Compounds · Premium Catalog · v2.0
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-400/20 text-cyan-300">
                {birikmalar.length} birikma
              </span>
              <span className="px-2 py-1 rounded bg-violet-500/10 border border-violet-400/20 text-violet-300">
                IUPAC 2005
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-10 pb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-transparent border border-cyan-500/20 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-400/80 mb-3">
                ── Koordinatsion kimyo katalogi
              </p>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight text-white">
                Werner nazariyasidan zamonaviy <span className="text-cyan-300">bioinorganik</span> kimyoga qadar
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed text-sm md:text-base">
                Klassik ammin kompleklaridan sisplatin va Grubbs katalizatoriga qadar —
                oliy kimyoning eng muhim <span className="text-violet-300">{birikmalar.length}</span> ta kompleks birikmasi
                bir yerda. Har biri geometriya, gibridlanish, CFSE va kashfiyot tarixi bilan.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  🧬 {countByTag("biologik")} biologik
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  ⚗️ {countByTag("kataliz")} kataliz
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  🏆 {countByTag("nobel")} Nobel
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  📚 {countByTag("klassik")} klassik
                </span>
              </div>
            </div>
          </div>

          {/* MINI PERIODIC-STYLE PANEL */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-violet-900/30 to-slate-900/40 border border-violet-500/20 backdrop-blur-md">
            <p className="text-[11px] font-mono uppercase tracking-widest text-violet-300 mb-3">
              Markaziy metallar
            </p>
            <div className="grid grid-cols-4 gap-2">
              {filterKategoriyalar.metall.map(m => (
                <button
                  key={m}
                  onClick={() => setFilterMetall(m === filterMetall ? "all" : m)}
                  className={`group relative aspect-square rounded-lg border transition-all font-mono text-center ${
                    filterMetall === m
                      ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20"
                      : "bg-slate-900/60 border-slate-700/60 hover:border-cyan-400/50"
                  }`}
                  title={metallInfo[m]?.name}
                >
                  <div className="absolute top-0.5 left-1 text-[8px] text-slate-500 group-hover:text-cyan-400">{metallInfo[m]?.z}</div>
                  <div className="flex items-center justify-center h-full text-base font-bold text-white">{m}</div>
                  <div className="absolute bottom-0.5 right-1 text-[7px] text-slate-500">{countByMetal(m)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QIDIRUV + FILTERLAR ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-6">
        <div className="rounded-3xl bg-slate-900/50 border border-slate-700/40 backdrop-blur-md p-5 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/70">🔍</span>
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="Formula, IUPAC, umumiy nom yoki teg bo'yicha qidirish..."
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${
                  viewMode === "grid"
                    ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-200"
                    : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                }`}
              >
                ▦ Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${
                  viewMode === "table"
                    ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-200"
                    : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                }`}
              >
                ☰ Jadval
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${
                  showFilters
                    ? "bg-violet-500/20 border-violet-400/60 text-violet-200"
                    : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚙ Filter
              </button>
            </div>
          </div>

          {/* FILTERS */}
          {showFilters && (
            <div className="space-y-4 pt-5 mt-5 border-t border-slate-700/40">

              {/* Geometriya filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-cyan-400/80 text-[11px] font-mono uppercase tracking-wider min-w-[100px]">Geometriya</span>
                <button
                  onClick={() => setFilterGeometriya("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    filterGeometriya === "all"
                      ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-100"
                      : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Barchasi <span className="opacity-60">({birikmalar.length})</span>
                </button>
                {filterKategoriyalar.geometriya.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setFilterGeometriya(g.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filterGeometriya === g.id
                        ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-100"
                        : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {g.label} <span className="opacity-60">({countByGeometry(g.id)})</span>
                  </button>
                ))}
              </div>

              {/* Metall filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-cyan-400/80 text-[11px] font-mono uppercase tracking-wider min-w-[100px]">Metall</span>
                <button
                  onClick={() => setFilterMetall("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    filterMetall === "all"
                      ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-100"
                      : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Barchasi
                </button>
                {filterKategoriyalar.metall.map(m => (
                  <button
                    key={m}
                    onClick={() => setFilterMetall(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                      filterMetall === m
                        ? "bg-violet-500/20 border-violet-400/60 text-violet-100"
                        : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {m} <span className="opacity-60">({countByMetal(m)})</span>
                  </button>
                ))}
              </div>

              {/* Qo'llanilish filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-cyan-400/80 text-[11px] font-mono uppercase tracking-wider min-w-[100px]">Qo'llanilish</span>
                <button
                  onClick={() => setFilterQollanilish("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    filterQollanilish === "all"
                      ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-100"
                      : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Barchasi
                </button>
                {filterKategoriyalar.qollanilish.map(q => (
                  <button
                    key={q.id}
                    onClick={() => setFilterQollanilish(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filterQollanilish === q.id
                        ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-100"
                        : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {q.label} <span className="opacity-60">({countByTag(q.id)})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ NATIJALAR SONI ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-slate-400 text-sm font-mono">
            <span className="text-cyan-300 font-bold text-lg">{filtered.length}</span>
            <span className="mx-2 text-slate-600">/</span>
            <span>{birikmalar.length} birikma</span>
            {hasActiveFilter && (
              <button
                onClick={() => {
                  setQidiruv("")
                  setFilterGeometriya("all")
                  setFilterMetall("all")
                  setFilterQollanilish("all")
                }}
                className="ml-4 text-[11px] text-rose-400 hover:text-rose-300 transition"
              >
                ✕ Filterni tozalash
              </button>
            )}
          </p>
          <p className="text-[11px] font-mono text-slate-600">
            {viewMode === "grid" ? "▦ Grid ko'rinishi" : "☰ Jadval ko'rinishi"}
          </p>
        </div>
      </section>

      {/* ═══ GRID VIEW ═══ */}
      {viewMode === "grid" && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((b) => {
                const primaryMetal = filterKategoriyalar.metall.find(m => b.tags.includes(m))
                return (
                  <Link
                    key={b.id}
                    href={`/ilmiy/birikmalar/${b.slug}`}
                    className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/40 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    {/* RANG INDIKATOR CHIZIG'I */}
                    <div className="h-1.5" style={{ background: getColorStrip(b.color) }} />

                    <div className="p-5">
                      {/* HEADER: metall + geometriya */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        {primaryMetal ? (
                          <MetalBadge symbol={primaryMetal} size="md" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-500 text-xs font-mono">?</div>
                        )}
                        <div className="text-cyan-300/70 group-hover:text-cyan-300 transition">
                          <GeometryIcon geometry={b.geometry} className="w-10 h-10" />
                        </div>
                      </div>

                      {/* FORMULA */}
                      <div
                        className="font-mono text-lg md:text-xl font-bold text-white mb-1 leading-tight"
                        dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                      />

                      {/* IUPAC nom */}
                      <p className="text-[13px] text-slate-300 leading-snug mb-1">{b.iupac}</p>
                      <p className="text-[11px] text-cyan-300/80 italic mb-4">{b.commonName}</p>

                      {/* KEY SPECS */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-mono">
                        <SpecPill label="Geom." value={b.geometry} />
                        <SpecPill label="Ox." value={b.oxidationState} />
                        <SpecPill label="d-e⁻" value={b.dElectrons} />
                        <SpecPill label="CN" value={b.coordinationNumber} />
                      </div>

                      {/* APPLICATION */}
                      <div className="pt-3 border-t border-slate-700/40">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Qo'llanilish</p>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{b.application}</p>
                      </div>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {b.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/40 text-slate-400">
                            #{t}
                          </span>
                        ))}
                        {b.tags.includes("nobel") && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-400/30 text-amber-300">
                            🏆 Nobel
                          </span>
                        )}
                      </div>

                      {/* HOVER ARROW */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all">
                        <span className="text-cyan-300 text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* ═══ TABLE VIEW ═══ */}
      {viewMode === "table" && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="rounded-2xl border border-slate-700/40 overflow-hidden bg-slate-900/50 backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950/60 sticky top-0 z-10">
                    <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-cyan-300/80">
                      <th className="px-4 py-3 border-b border-slate-700/40">Formula</th>
                      <th className="px-4 py-3 border-b border-slate-700/40">IUPAC nomi</th>
                      <th className="px-4 py-3 border-b border-slate-700/40">Geometriya</th>
                      <th className="px-4 py-3 border-b border-slate-700/40">Ox.</th>
                      <th className="px-4 py-3 border-b border-slate-700/40">d-e⁻</th>
                      <th className="px-4 py-3 border-b border-slate-700/40">M<sub>r</sub></th>
                      <th className="px-4 py-3 border-b border-slate-700/40">Rang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => (
                      <tr
                        key={b.id}
                        className={`group hover:bg-cyan-500/5 transition ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}
                      >
                        <td className="px-4 py-3 border-b border-slate-800/40">
                          <Link
                            href={`/ilmiy/birikmalar/${b.slug}`}
                            className="font-mono text-white group-hover:text-cyan-300 transition"
                            dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                          />
                        </td>
                        <td className="px-4 py-3 border-b border-slate-800/40 text-slate-300 text-xs">
                          {b.iupac}
                          <div className="text-[10px] text-cyan-400/60 italic">{b.commonName}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-slate-800/40 text-slate-400 text-xs">{b.geometry}</td>
                        <td className="px-4 py-3 border-b border-slate-800/40 font-mono text-violet-300 text-xs">{b.oxidationState}</td>
                        <td className="px-4 py-3 border-b border-slate-800/40 font-mono text-cyan-300 text-xs">{b.dElectrons}</td>
                        <td className="px-4 py-3 border-b border-slate-800/40 font-mono text-slate-400 text-xs">{b.molarMass}</td>
                        <td className="px-4 py-3 border-b border-slate-800/40">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-slate-600" style={{ background: getColorStrip(b.color) }} />
                            <span className="text-[11px] text-slate-400">{b.color}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ═══ STATS BLOKI ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Jami birikmalar", value: birikmalar.length, icon: "🧪", color: "cyan", bar: 100 },
            { label: "Nobel mukofoti", value: countByTag("nobel"), icon: "🏆", color: "amber", bar: (countByTag("nobel") / birikmalar.length) * 100 },
            { label: "Biologik", value: countByTag("biologik"), icon: "🧬", color: "emerald", bar: (countByTag("biologik") / birikmalar.length) * 100 },
            { label: "Katalizatorlar", value: countByTag("kataliz"), icon: "⚗️", color: "violet", bar: (countByTag("kataliz") / birikmalar.length) * 100 },
          ].map((stat, i) => {
            const colorMap = {
              cyan:    { text: "text-cyan-300",    bar: "bg-cyan-400",    ring: "border-cyan-500/30" },
              amber:   { text: "text-amber-300",   bar: "bg-amber-400",   ring: "border-amber-500/30" },
              emerald: { text: "text-emerald-300", bar: "bg-emerald-400", ring: "border-emerald-500/30" },
              violet:  { text: "text-violet-300",  bar: "bg-violet-400",  ring: "border-violet-500/30" },
            }
            const c = colorMap[stat.color]
            return (
              <div
                key={i}
                className={`rounded-2xl p-5 bg-gradient-to-br from-slate-900/70 to-slate-900/30 border ${c.ring} backdrop-blur-md relative overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className={`text-3xl font-extrabold ${c.text} font-mono`}>{stat.value}</div>
                </div>
                <div className="text-[11px] text-slate-400 mb-2">{stat.label}</div>
                <div className="h-1 rounded-full bg-slate-800/60 overflow-hidden">
                  <div
                    className={`h-full ${c.bar} transition-all duration-1000`}
                    style={{ width: `${stat.bar}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-slate-800/50 py-8 mt-6 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-[10px]">⬡</div>
            <span className="text-sm font-semibold text-slate-300">JDA KIMYO</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">© 2026 JDA KIMYO • Koordinatsion kimyo ta'lim portali</p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">
            Manbalar: Cotton &amp; Wilkinson · Housecroft · Miessler · IUPAC 2005
          </p>
        </div>
      </footer>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI KOMPONENT: XUSUSIYAT KAPSULASI
// ═══════════════════════════════════════════════════════════════════════════

function SpecPill({ label, value }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/50 border border-slate-800/60">
      <span className="text-cyan-400/70 text-[9px] uppercase tracking-wider">{label}</span>
      <span className="text-slate-200 text-[11px] font-semibold truncate">{value}</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI KOMPONENT: NATIJA YO'Q HOLATI
// ═══════════════════════════════════════════════════════════════════════════

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700/50 bg-slate-900/30 p-12 text-center">
      <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-600/10 border border-cyan-500/20 flex items-center justify-center mb-4">
        <svg viewBox="0 0 40 40" className="w-10 h-10 text-cyan-400/60" fill="none">
          <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 20 L36 20 M20 4 L20 36" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">Birikma topilmadi</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        Qidiruv so'zi yoki filterlarni o'zgartirib ko'ring. Formula, IUPAC nomi yoki teg bo'yicha qidirishingiz mumkin.
      </p>
    </div>
  )
}
