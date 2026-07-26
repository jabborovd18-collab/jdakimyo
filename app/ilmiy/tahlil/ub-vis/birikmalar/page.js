"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// UB-VIS SPEKTROSKOPIYA — BIRIKMALAR KATALOGI (PREMIUM)
// 20 ta kompleks birikma — har biri uchun λmax, ε, Δo, o'tish turi, term simvollari
// Manbalar:
//   • A. B. P. Lever — Inorganic Electronic Spectroscopy (2nd ed.)
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed.)
//   • Y. Tanabe, S. Sugano — J. Phys. Soc. Japan (1954)
//   • C. K. Jørgensen — Absorption Spectra and Chemical Bonding
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  // KLASSIK WERNER KOMPLEKSLARI
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(NH3)6]Cl3",
    iupac: "Geksaamminkobalt(III) xlorid",
    commonName: "Luteo-kobalt (sariq)",
    molarMass: 267.48,
    color: "sariq-to'q sariq",
    perceivedHex: "#FFC300",
    absorbedHex: "#8B00FF",
    structure: "Oktaedr (Oh)",
    metalCenter: "Co³⁺",
    dConfig: "d⁶ LS",
    groundTerm: "¹A₁g",
    transitions: [
      { symbol: "¹A₁g → ¹T₁g", lambda: 475, epsilon: 60, energy: 21100, type: "d-d" },
      { symbol: "¹A₁g → ¹T₂g", lambda: 340, epsilon: 55, energy: 29400, type: "d-d" },
    ],
    deltaOh: 22900,
    racahB: 615,
    beta: 0.66,
    transitionType: "d-d",
    magnetism: "Diamagnit (d⁶ LS, S=0)",
    specialFeature: "Werner klassikasi, past spin",
    tags: ["klassik", "inert", "d⁶ LS", "Oh"]
  },
  {
    id: "co-nh3-5-cl-cl2",
    slug: "co-nh3-5-cl-cl2",
    formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>",
    formulaPlain: "[Co(NH3)5Cl]Cl2",
    iupac: "Pentaamminklorokobalt(III) xlorid",
    commonName: "Purpureo-kobalt (binafsha)",
    molarMass: 250.44,
    color: "binafsha-qizil",
    perceivedHex: "#A020F0",
    absorbedHex: "#00FF00",
    structure: "Oktaedr (C₄ᵥ)",
    metalCenter: "Co³⁺",
    dConfig: "d⁶ LS",
    groundTerm: "¹A₁",
    transitions: [
      { symbol: "¹A₁ → ¹E, ¹A₂", lambda: 530, epsilon: 50, energy: 18900, type: "d-d" },
      { symbol: "¹A₁ → ¹E, ¹B₁", lambda: 370, epsilon: 45, energy: 27000, type: "d-d" },
    ],
    deltaOh: 20500,
    racahB: 600,
    beta: 0.65,
    transitionType: "d-d",
    magnetism: "Diamagnit (d⁶ LS)",
    specialFeature: "Simmetriya buzilishi (Oh → C₄ᵥ), polosa yorilishi",
    tags: ["klassik", "inert", "d⁶ LS", "C₄ᵥ"]
  },
  {
    id: "co-en3-cl3",
    slug: "co-en3-cl3",
    formulaHTML: "[Co(en)<sub>3</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Co(en)3]Cl3",
    iupac: "Tris(etilendiamin)kobalt(III) xlorid",
    commonName: "[Co(en)₃]³⁺ (sariq)",
    molarMass: 345.52,
    color: "sariq-to'q sariq",
    perceivedHex: "#FFD700",
    absorbedHex: "#8000FF",
    structure: "Oktaedr (D₃)",
    metalCenter: "Co³⁺",
    dConfig: "d⁶ LS",
    groundTerm: "¹A₁",
    transitions: [
      { symbol: "¹A₁ → ¹T₁g", lambda: 465, epsilon: 87, energy: 21500, type: "d-d" },
      { symbol: "¹A₁ → ¹T₂g", lambda: 340, epsilon: 78, energy: 29400, type: "d-d" },
    ],
    deltaOh: 23300,
    racahB: 620,
    beta: 0.67,
    transitionType: "d-d",
    magnetism: "Diamagnit (d⁶ LS)",
    specialFeature: "Xelat effekti, Δ/Λ optik izomerlar (CD spektrda faol)",
    tags: ["xelat", "inert", "d⁶ LS", "optik-izomer"]
  },

  // CROMIUM KOMPLEKSLARI
  {
    id: "cr-h2o-6-cl3",
    slug: "cr-h2o-6-cl3",
    formulaHTML: "[Cr(H<sub>2</sub>O)<sub>6</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Cr(H2O)6]Cl3",
    iupac: "Geksaakvaxrom(III) xlorid",
    commonName: "Xrom(III) geksaakva (binafsha)",
    molarMass: 266.45,
    color: "binafsha",
    perceivedHex: "#8B00FF",
    absorbedHex: "#ADFF2F",
    structure: "Oktaedr (Oh)",
    metalCenter: "Cr³⁺",
    dConfig: "d³",
    groundTerm: "⁴A₂g",
    transitions: [
      { symbol: "⁴A₂g → ⁴T₂g", lambda: 575, epsilon: 13, energy: 17400, type: "d-d", note: "Bu = Δo" },
      { symbol: "⁴A₂g → ⁴T₁g(F)", lambda: 407, epsilon: 15, energy: 24600, type: "d-d" },
      { symbol: "⁴A₂g → ⁴T₁g(P)", lambda: 265, epsilon: "kichik", energy: 37800, type: "d-d, ko'p LMCT bilan" },
    ],
    deltaOh: 17400,
    racahB: 725,
    beta: 0.79,
    transitionType: "d-d",
    magnetism: "Paramagnit (d³, S=3/2, μ=3.87 μB)",
    specialFeature: "d³ — birinchi polosa to'g'ridan-to'g'ri Δo",
    tags: ["klassik", "d³", "Oh", "akvakompleks"]
  },
  {
    id: "cr-nh3-6-cl3",
    slug: "cr-nh3-6-cl3",
    formulaHTML: "[Cr(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
    formulaPlain: "[Cr(NH3)6]Cl3",
    iupac: "Geksaamminxrom(III) xlorid",
    commonName: "[Cr(NH₃)₆]³⁺ (sariq)",
    molarMass: 260.44,
    color: "sariq",
    perceivedHex: "#FFFF00",
    absorbedHex: "#0000FF",
    structure: "Oktaedr (Oh)",
    metalCenter: "Cr³⁺",
    dConfig: "d³",
    groundTerm: "⁴A₂g",
    transitions: [
      { symbol: "⁴A₂g → ⁴T₂g", lambda: 465, epsilon: 40, energy: 21500, type: "d-d" },
      { symbol: "⁴A₂g → ⁴T₁g(F)", lambda: 350, epsilon: 35, energy: 28600, type: "d-d" },
    ],
    deltaOh: 21500,
    racahB: 657,
    beta: 0.72,
    transitionType: "d-d",
    magnetism: "Paramagnit (d³, S=3/2)",
    specialFeature: "NH₃ H₂O ga qaraganda kuchli maydon → Δo↑",
    tags: ["klassik", "d³", "Oh", "ammin"]
  },

  // TITAN KOMPLEKSI
  {
    id: "ti-h2o-6-3",
    slug: "ti-h2o-6-3",
    formulaHTML: "[Ti(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
    formulaPlain: "[Ti(H2O)6]3+",
    iupac: "Geksaakvatitan(III) ioni",
    commonName: "Titan(III) geksaakva (binafsha)",
    molarMass: 156.05,
    color: "binafsha (och)",
    perceivedHex: "#9370DB",
    absorbedHex: "#ADFF2F",
    structure: "Oktaedr (Oh, Yan-Teller buzilgan)",
    metalCenter: "Ti³⁺",
    dConfig: "d¹",
    groundTerm: "²T₂g",
    transitions: [
      { symbol: "²T₂g → ²Eg", lambda: 493, epsilon: 5, energy: 20300, type: "d-d", note: "Yan-Teller yorilishi → yelka 570 nm da" },
    ],
    deltaOh: 20300,
    racahB: null,
    beta: null,
    transitionType: "d-d",
    magnetism: "Paramagnit (d¹, S=1/2, μ=1.73 μB)",
    specialFeature: "Eng oddiy d¹ holat — Δo to'g'ridan-to'g'ri o'lchanadi",
    tags: ["d¹", "Oh", "Yan-Teller", "eng-oddiy"]
  },

  // VANADIUM KOMPLEKSI
  {
    id: "v-h2o-6-3",
    slug: "v-h2o-6-3",
    formulaHTML: "[V(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
    formulaPlain: "[V(H2O)6]3+",
    iupac: "Geksaakvavanadiy(III) ioni",
    commonName: "Vanadiy(III) geksaakva (yashil)",
    molarMass: 159.02,
    color: "yashil-havorang",
    perceivedHex: "#20B2AA",
    absorbedHex: "#DC143C",
    structure: "Oktaedr (Oh)",
    metalCenter: "V³⁺",
    dConfig: "d²",
    groundTerm: "³T₁g(F)",
    transitions: [
      { symbol: "³T₁g(F) → ³T₂g", lambda: 562, epsilon: 6, energy: 17800, type: "d-d" },
      { symbol: "³T₁g(F) → ³T₁g(P)", lambda: 389, epsilon: 8, energy: 25700, type: "d-d" },
      { symbol: "³T₁g(F) → ³A₂g", lambda: 290, epsilon: "kichik", energy: 34500, type: "d-d, LMCT bilan" },
    ],
    deltaOh: 18500,
    racahB: 620,
    beta: 0.72,
    transitionType: "d-d",
    magnetism: "Paramagnit (d², S=1, μ=2.83 μB)",
    specialFeature: "3 ta d–d polosa (F va P terminlariga bo'linadi)",
    tags: ["d²", "Oh", "akvakompleks"]
  },

  // MANGAN KOMPLEKSI
  {
    id: "mn-h2o-6-2",
    slug: "mn-h2o-6-2",
    formulaHTML: "[Mn(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    formulaPlain: "[Mn(H2O)6]2+",
    iupac: "Geksaakvamangan(II) ioni",
    commonName: "Mangan(II) geksaakva (juda och pushti)",
    molarMass: 162.98,
    color: "juda och pushti (deyarli rangsiz)",
    perceivedHex: "#FFC0CB",
    absorbedHex: "#00FF00",
    structure: "Oktaedr (Oh)",
    metalCenter: "Mn²⁺",
    dConfig: "d⁵ HS",
    groundTerm: "⁶A₁g",
    transitions: [
      { symbol: "⁶A₁g → ⁴T₁g", lambda: 528, epsilon: 0.03, energy: 18900, type: "d-d, spin-taqiq" },
      { symbol: "⁶A₁g → ⁴T₂g", lambda: 433, epsilon: 0.04, energy: 23100, type: "d-d, spin-taqiq" },
      { symbol: "⁶A₁g → ⁴A₁g/⁴Eg", lambda: 400, epsilon: 0.05, energy: 25000, type: "d-d, ingichka" },
    ],
    deltaOh: 7800,
    racahB: 786,
    beta: 0.92,
    transitionType: "d-d (spin-taqiq)",
    magnetism: "Paramagnit (d⁵ HS, S=5/2, μ=5.92 μB)",
    specialFeature: "Barcha o'tishlar HAM Laport HAM spin taqiqlangan → ε ~ 0.01",
    tags: ["d⁵ HS", "Oh", "spin-taqiq", "rangsiz"]
  },

  // TEMIR KOMPLEKSLARI
  {
    id: "fe-h2o-6-2",
    slug: "fe-h2o-6-2",
    formulaHTML: "[Fe(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    formulaPlain: "[Fe(H2O)6]2+",
    iupac: "Geksaakvatemir(II) ioni",
    commonName: "Temir(II) geksaakva (och yashil)",
    molarMass: 161.99,
    color: "och yashil",
    perceivedHex: "#90EE90",
    absorbedHex: "#FF00FF",
    structure: "Oktaedr (Oh)",
    metalCenter: "Fe²⁺",
    dConfig: "d⁶ HS",
    groundTerm: "⁵T₂g",
    transitions: [
      { symbol: "⁵T₂g → ⁵Eg", lambda: 962, epsilon: 1, energy: 10400, type: "d-d, NIR" },
    ],
    deltaOh: 10400,
    racahB: null,
    beta: null,
    transitionType: "d-d",
    magnetism: "Paramagnit (d⁶ HS, S=2, μ=5.20 μB)",
    specialFeature: "Bir polosa NIR sohada, rang zaif",
    tags: ["d⁶ HS", "Oh", "akvakompleks", "NIR"]
  },
  {
    id: "k4-fe-cn-6",
    slug: "k4-fe-cn-6",
    formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K4[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(II)",
    commonName: "Sariq qon tuzi",
    molarMass: 422.39,
    color: "sariq",
    perceivedHex: "#FFFF00",
    absorbedHex: "#0000FF",
    structure: "Oktaedr (Oh)",
    metalCenter: "Fe²⁺",
    dConfig: "d⁶ LS",
    groundTerm: "¹A₁g",
    transitions: [
      { symbol: "¹A₁g → ¹T₁g (MLCT)", lambda: 320, epsilon: 340, energy: 31250, type: "MLCT" },
      { symbol: "MLCT ikkinchi", lambda: 270, epsilon: 400, energy: 37000, type: "MLCT" },
    ],
    deltaOh: 33800,
    racahB: 460,
    beta: 0.50,
    transitionType: "MLCT",
    magnetism: "Diamagnit (d⁶ LS, S=0)",
    specialFeature: "CN⁻ juda kuchli maydon → Δo bahaybat, MLCT tasmalari",
    tags: ["tsiano", "d⁶ LS", "MLCT", "diamagnit"]
  },
  {
    id: "k3-fe-cn-6",
    slug: "k3-fe-cn-6",
    formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K3[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(III)",
    commonName: "Qizil qon tuzi",
    molarMass: 329.24,
    color: "qizil-to'q sariq",
    perceivedHex: "#FF4500",
    absorbedHex: "#00CED1",
    structure: "Oktaedr (Oh)",
    metalCenter: "Fe³⁺",
    dConfig: "d⁵ LS",
    groundTerm: "²T₂g",
    transitions: [
      { symbol: "LMCT (CN → Fe)", lambda: 420, epsilon: 1000, energy: 23800, type: "LMCT" },
      { symbol: "LMCT ikkinchi", lambda: 305, epsilon: 1500, energy: 32800, type: "LMCT" },
    ],
    deltaOh: 33800,
    racahB: 480,
    beta: 0.52,
    transitionType: "LMCT",
    magnetism: "Paramagnit (d⁵ LS, S=1/2, μ=2.4 μB)",
    specialFeature: "Kuchli oksidlovchi, LMCT rangi (qizil)",
    tags: ["tsiano", "d⁵ LS", "LMCT", "oksidlovchi"]
  },
  {
    id: "fe-scn-3",
    slug: "fe-scn-3",
    formulaHTML: "[Fe(SCN)<sub>3</sub>]",
    formulaPlain: "[Fe(SCN)3]",
    iupac: "Tris(tiosiyanato-N)temir(III)",
    commonName: "Temir(III) rodanid (qon-qizil)",
    molarMass: 230.08,
    color: "qon-qizil",
    perceivedHex: "#B22222",
    absorbedHex: "#00FF7F",
    structure: "Oktaedr (past simmetriya)",
    metalCenter: "Fe³⁺",
    dConfig: "d⁵ HS",
    groundTerm: "⁶A₁",
    transitions: [
      { symbol: "LMCT (SCN → Fe)", lambda: 480, epsilon: 5000, energy: 20800, type: "LMCT" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "LMCT",
    magnetism: "Paramagnit (d⁵ HS, S=5/2)",
    specialFeature: "Fe³⁺ analitik reagent (Volhard usuli), juda katta ε",
    tags: ["tiotsianato", "d⁵ HS", "LMCT", "analitik"]
  },

  // NIKEL KOMPLEKSLARI
  {
    id: "ni-h2o-6-2",
    slug: "ni-h2o-6-2",
    formulaHTML: "[Ni(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    formulaPlain: "[Ni(H2O)6]2+",
    iupac: "Geksaakvanikel(II) ioni",
    commonName: "Nikel(II) geksaakva (yashil)",
    molarMass: 174.75,
    color: "yashil",
    perceivedHex: "#00CC66",
    absorbedHex: "#FF3333",
    structure: "Oktaedr (Oh)",
    metalCenter: "Ni²⁺",
    dConfig: "d⁸",
    groundTerm: "³A₂g",
    transitions: [
      { symbol: "³A₂g → ³T₂g", lambda: 1176, epsilon: 2, energy: 8500, type: "d-d, NIR" },
      { symbol: "³A₂g → ³T₁g(F)", lambda: 725, epsilon: 2, energy: 13800, type: "d-d" },
      { symbol: "³A₂g → ³T₁g(P)", lambda: 395, epsilon: 5, energy: 25300, type: "d-d" },
    ],
    deltaOh: 8500,
    racahB: 940,
    beta: 0.87,
    transitionType: "d-d",
    magnetism: "Paramagnit (d⁸, S=1, μ=2.83 μB)",
    specialFeature: "3 ta d–d polosa — d⁸ ning klassik namunasi",
    tags: ["d⁸", "Oh", "akvakompleks", "3-polosa"]
  },
  {
    id: "ni-cn-4-2",
    slug: "ni-cn-4-2",
    formulaHTML: "[Ni(CN)<sub>4</sub>]<sup>2-</sup>",
    formulaPlain: "[Ni(CN)4]2-",
    iupac: "Tetratsianonikkolat(II) ioni",
    commonName: "[Ni(CN)₄]²⁻ (sariq)",
    molarMass: 162.78,
    color: "sariq",
    perceivedHex: "#FFDF00",
    absorbedHex: "#4B0082",
    structure: "Kvadrat-tekis (D₄ₕ)",
    metalCenter: "Ni²⁺",
    dConfig: "d⁸ LS",
    groundTerm: "¹A₁g",
    transitions: [
      { symbol: "MLCT (Ni → CN)", lambda: 420, epsilon: 6600, energy: 23800, type: "MLCT" },
      { symbol: "MLCT ikkinchi", lambda: 285, epsilon: 12000, energy: 35100, type: "MLCT" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "MLCT",
    magnetism: "Diamagnit (d⁸ LS, S=0)",
    specialFeature: "Kuchli maydon CN⁻ → kvadrat tekislik, diamagnit",
    tags: ["tsiano", "d⁸ LS", "MLCT", "kvadrat-tekis"]
  },

  // MIS KOMPLEKSLARI
  {
    id: "cu-h2o-6-2",
    slug: "cu-h2o-6-2",
    formulaHTML: "[Cu(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    formulaPlain: "[Cu(H2O)6]2+",
    iupac: "Geksaakvamis(II) ioni",
    commonName: "Mis(II) geksaakva (havorang)",
    molarMass: 171.66,
    color: "havorang",
    perceivedHex: "#87CEEB",
    absorbedHex: "#FF8C00",
    structure: "Oktaedr (D₄ₕ, kuchli Yan-Teller)",
    metalCenter: "Cu²⁺",
    dConfig: "d⁹",
    groundTerm: "²Eg (yorilgan)",
    transitions: [
      { symbol: "²Eg → ²T₂g (keng)", lambda: 794, epsilon: 12, energy: 12600, type: "d-d, YT" },
    ],
    deltaOh: 12600,
    racahB: null,
    beta: null,
    transitionType: "d-d",
    magnetism: "Paramagnit (d⁹, S=1/2, μ=1.73 μB)",
    specialFeature: "Kuchli Yan-Teller — keng, asimmetrik polosa (760 va 850 nm yelkalari)",
    tags: ["d⁹", "Yan-Teller", "akvakompleks", "keng-polosa"]
  },
  {
    id: "cu-nh3-4-2",
    slug: "cu-nh3-4-2",
    formulaHTML: "[Cu(NH<sub>3</sub>)<sub>4</sub>]<sup>2+</sup>",
    formulaPlain: "[Cu(NH3)4]2+",
    iupac: "Tetraamminmis(II) ioni",
    commonName: "Tetraamminmis(II) (to'q ko'k)",
    molarMass: 131.71,
    color: "to'q ko'k",
    perceivedHex: "#00008B",
    absorbedHex: "#FFFF00",
    structure: "Kvadrat-tekis buzilgan (D₄ₕ)",
    metalCenter: "Cu²⁺",
    dConfig: "d⁹",
    groundTerm: "²Eg",
    transitions: [
      { symbol: "d–d (keng)", lambda: 610, epsilon: 63, energy: 16400, type: "d-d, YT" },
    ],
    deltaOh: 16400,
    racahB: null,
    beta: null,
    transitionType: "d-d",
    magnetism: "Paramagnit (d⁹, S=1/2)",
    specialFeature: "NH₃ dan Δo yuqoriroq → batoxrom (to'q ko'kga o'zgargan)",
    tags: ["d⁹", "Yan-Teller", "ammin", "kvadrat-tekis"]
  },

  // KOBALT(II) KOMPLEKSLARI
  {
    id: "co-h2o-6-2",
    slug: "co-h2o-6-2",
    formulaHTML: "[Co(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    formulaPlain: "[Co(H2O)6]2+",
    iupac: "Geksaakvakobalt(II) ioni",
    commonName: "Kobalt(II) geksaakva (pushti)",
    molarMass: 165.05,
    color: "pushti",
    perceivedHex: "#FFB6C1",
    absorbedHex: "#00FF00",
    structure: "Oktaedr (Oh)",
    metalCenter: "Co²⁺",
    dConfig: "d⁷ HS",
    groundTerm: "⁴T₁g(F)",
    transitions: [
      { symbol: "⁴T₁g(F) → ⁴T₂g", lambda: 1250, epsilon: 2, energy: 8000, type: "d-d, NIR" },
      { symbol: "⁴T₁g(F) → ⁴A₂g", lambda: 625, epsilon: 5, energy: 16000, type: "d-d, ikki elektron" },
      { symbol: "⁴T₁g(F) → ⁴T₁g(P)", lambda: 515, epsilon: 5, energy: 19400, type: "d-d" },
    ],
    deltaOh: 9200,
    racahB: 825,
    beta: 0.85,
    transitionType: "d-d",
    magnetism: "Paramagnit (d⁷ HS, S=3/2, μ=4.90 μB)",
    specialFeature: "Pushti rang — [CoCl₄]²⁻ ga qaraganda kam intensiv",
    tags: ["d⁷ HS", "Oh", "akvakompleks", "pushti"]
  },
  {
    id: "co-cl-4-2",
    slug: "co-cl-4-2",
    formulaHTML: "[CoCl<sub>4</sub>]<sup>2-</sup>",
    formulaPlain: "[CoCl4]2-",
    iupac: "Tetraxlorokobaltat(II) ioni",
    commonName: "[CoCl₄]²⁻ (to'q ko'k)",
    molarMass: 200.75,
    color: "to'q ko'k",
    perceivedHex: "#1E3A8A",
    absorbedHex: "#F97316",
    structure: "Tetraedr (Td)",
    metalCenter: "Co²⁺",
    dConfig: "d⁷",
    groundTerm: "⁴A₂",
    transitions: [
      { symbol: "⁴A₂ → ⁴T₁(P)", lambda: 660, epsilon: 600, energy: 15150, type: "d-d, Laport-ruxsat" },
    ],
    deltaOh: null,
    deltaTd: 3300,
    racahB: 710,
    beta: 0.73,
    transitionType: "d-d",
    magnetism: "Paramagnit (d⁷, S=3/2, μ=4.6 μB)",
    specialFeature: "Td (i markaz yo'q) → Laport ruxsat → ε juda katta (600)! Rang zaif emas",
    tags: ["d⁷", "Td", "Laport-ruxsat", "to'q-ko'k"]
  },

  // KVADRAT TEKIS Pt KOMPLEKSLARI
  {
    id: "cis-pt-nh3-2-cl2",
    slug: "cis-pt-nh3-2-cl2",
    formulaHTML: "cis-[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
    formulaPlain: "cis-[Pt(NH3)2Cl2]",
    iupac: "sis-Diammindixloroplatina(II)",
    commonName: "Sisplatin (saraton dori)",
    molarMass: 300.05,
    color: "sariq",
    perceivedHex: "#FFD700",
    absorbedHex: "#0000FF",
    structure: "Kvadrat-tekis (C₂ᵥ)",
    metalCenter: "Pt²⁺",
    dConfig: "d⁸ LS",
    groundTerm: "¹A₁",
    transitions: [
      { symbol: "d–d (yelka)", lambda: 365, epsilon: 30, energy: 27400, type: "d-d" },
      { symbol: "LMCT (Cl → Pt)", lambda: 301, epsilon: 130, energy: 33200, type: "LMCT" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "d-d + LMCT",
    magnetism: "Diamagnit (d⁸ LS, S=0)",
    specialFeature: "Saraton dori (1978 FDA), DNK ga bog'lanadi",
    tags: ["sisplatin", "kvadrat-tekis", "d⁸ LS", "biologik"]
  },
  {
    id: "trans-pt-nh3-2-cl2",
    slug: "trans-pt-nh3-2-cl2",
    formulaHTML: "trans-[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
    formulaPlain: "trans-[Pt(NH3)2Cl2]",
    iupac: "trans-Diammindixloroplatina(II)",
    commonName: "Transplatin (klinik faol emas)",
    molarMass: 300.05,
    color: "och sariq",
    perceivedHex: "#FFFFE0",
    absorbedHex: "#4169E1",
    structure: "Kvadrat-tekis (D₂ₕ)",
    metalCenter: "Pt²⁺",
    dConfig: "d⁸ LS",
    groundTerm: "¹A₁g",
    transitions: [
      { symbol: "d–d", lambda: 331, epsilon: 15, energy: 30200, type: "d-d" },
      { symbol: "LMCT", lambda: 279, epsilon: 70, energy: 35800, type: "LMCT" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "d-d + LMCT",
    magnetism: "Diamagnit (d⁸ LS)",
    specialFeature: "D₂ₕ (i markaz bor) → Laport taqiqlash → ε kamroq",
    tags: ["transplatin", "kvadrat-tekis", "d⁸ LS", "D₂ₕ"]
  },

  // MISOL: OKSOANION VA PERMANGANAT
  {
    id: "kmno4",
    slug: "kmno4",
    formulaHTML: "KMnO<sub>4</sub>",
    formulaPlain: "KMnO4",
    iupac: "Kaliy permanganat",
    commonName: "Permanganat (binafsha)",
    molarMass: 158.03,
    color: "to'q binafsha",
    perceivedHex: "#8B008B",
    absorbedHex: "#90EE90",
    structure: "Tetraedr (Td)",
    metalCenter: "Mn⁷⁺",
    dConfig: "d⁰",
    groundTerm: "¹A₁",
    transitions: [
      { symbol: "LMCT (O → Mn)", lambda: 525, epsilon: 2400, energy: 19000, type: "LMCT" },
      { symbol: "LMCT ikkinchi", lambda: 545, epsilon: 2300, energy: 18300, type: "LMCT" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "LMCT (sof)",
    magnetism: "Diamagnit (d⁰)",
    specialFeature: "d⁰ — d–d o'tishlar YO'Q! Rang faqat LMCT dan",
    tags: ["d⁰", "LMCT", "Td", "oksoanion", "klassik-misol"]
  },

  // XROMAT
  {
    id: "k2cr2o7",
    slug: "k2cr2o7",
    formulaHTML: "K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub>",
    formulaPlain: "K2Cr2O7",
    iupac: "Kaliy dixromat",
    commonName: "Dixromat (to'q sariq)",
    molarMass: 294.18,
    color: "to'q sariq-qizil",
    perceivedHex: "#FF6600",
    absorbedHex: "#0080FF",
    structure: "Ikki tetraedr (Cr₂O₇²⁻)",
    metalCenter: "Cr⁶⁺",
    dConfig: "d⁰",
    groundTerm: "¹A₁",
    transitions: [
      { symbol: "LMCT (O → Cr)", lambda: 350, epsilon: 3160, energy: 28600, type: "LMCT" },
      { symbol: "LMCT ikkinchi", lambda: 257, epsilon: 3400, energy: 38900, type: "LMCT" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "LMCT",
    magnetism: "Diamagnit (d⁰)",
    specialFeature: "d⁰ — Cr⁶⁺ ning yuqori zaryadi juda kuchli LMCT ni beradi",
    tags: ["d⁰", "LMCT", "Cr(VI)", "oksidlovchi"]
  },

  // FERROSEN
  {
    id: "ferrosen",
    slug: "ferrosen",
    formulaHTML: "[Fe(C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>]",
    formulaPlain: "[Fe(C5H5)2]",
    iupac: "bis(η⁵-siklopentadienil)temir(II)",
    commonName: "Ferrosen (to'q sariq)",
    molarMass: 186.04,
    color: "to'q sariq",
    perceivedHex: "#FF8C00",
    absorbedHex: "#00CED1",
    structure: "Sendvich (D₅d)",
    metalCenter: "Fe²⁺",
    dConfig: "d⁶ LS",
    groundTerm: "¹A₁g",
    transitions: [
      { symbol: "d–d + MLCT aralash", lambda: 440, epsilon: 91, energy: 22700, type: "d-d + MLCT" },
      { symbol: "π→π* (Cp ligandi)", lambda: 325, epsilon: 55, energy: 30800, type: "IL" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "d-d + MLCT + IL",
    magnetism: "Diamagnit (d⁶ LS, 18 elektron)",
    specialFeature: "Metallosen kimyoning asosi (1951, Kealy-Pauson)",
    tags: ["metallosen", "d⁶ LS", "18-elektron", "sendvich"]
  },

  // RU-BPY
  {
    id: "ru-bpy-3-2",
    slug: "ru-bpy-3-2",
    formulaHTML: "[Ru(bpy)<sub>3</sub>]<sup>2+</sup>",
    formulaPlain: "[Ru(bpy)3]2+",
    iupac: "Tris(2,2'-bipiridin)ruteniy(II) ioni",
    commonName: "Ruteniy-tris-bipiridil (to'q qizil)",
    molarMass: 570.58,
    color: "to'q qizil-to'q sariq",
    perceivedHex: "#DC143C",
    absorbedHex: "#00FF7F",
    structure: "Oktaedr (D₃)",
    metalCenter: "Ru²⁺",
    dConfig: "d⁶ LS",
    groundTerm: "¹A₁",
    transitions: [
      { symbol: "MLCT (Ru → bpy π*)", lambda: 452, epsilon: 14600, energy: 22100, type: "MLCT" },
      { symbol: "IL π→π* (bpy)", lambda: 285, epsilon: 87000, energy: 35100, type: "IL" },
    ],
    deltaOh: 28600,
    racahB: 590,
    beta: 0.83,
    transitionType: "MLCT",
    magnetism: "Diamagnit (d⁶ LS)",
    specialFeature: "Quyosh batareya, fotokataliz, DSSC (Grätzel), lyuminessent",
    tags: ["d⁶ LS", "MLCT", "fotokataliz", "polipyridil"]
  },

  // TETRAHEDRAL Zn
  {
    id: "zn-oh-4-2",
    slug: "zn-oh-4-2",
    formulaHTML: "[Zn(OH)<sub>4</sub>]<sup>2-</sup>",
    formulaPlain: "[Zn(OH)4]2-",
    iupac: "Tetragidroksosinkat(II) ioni",
    commonName: "Tsinkat (rangsiz)",
    molarMass: 133.41,
    color: "rangsiz",
    perceivedHex: "#F5F5F5",
    absorbedHex: "#F5F5F5",
    structure: "Tetraedr (Td)",
    metalCenter: "Zn²⁺",
    dConfig: "d¹⁰",
    groundTerm: "¹A₁",
    transitions: [
      { symbol: "d–d YO'Q", lambda: null, epsilon: 0, energy: null, type: "d-d yo'q" },
    ],
    deltaOh: null,
    racahB: null,
    beta: null,
    transitionType: "yo'q (d¹⁰)",
    magnetism: "Diamagnit (d¹⁰, S=0)",
    specialFeature: "d¹⁰ — barcha d-orbital to'la → d–d o'tish YO'Q → rangsiz",
    tags: ["d¹⁰", "rangsiz", "Td", "amfoter"]
  },
]

export default function UBVisBirikmalarPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterTag, setFilterTag] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  // Barcha taglarni yig'ish
  const allTags = useMemo(() => {
    const tags = new Set()
    birikmalar.forEach(b => b.tags.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  const filteredBirikmalar = useMemo(() => {
    let result = birikmalar

    // Filter by transition type
    if (filterType !== "all") {
      if (filterType === "d-d") {
        result = result.filter(b => b.transitionType.includes("d-d"))
      } else if (filterType === "LMCT") {
        result = result.filter(b => b.transitionType.includes("LMCT"))
      } else if (filterType === "MLCT") {
        result = result.filter(b => b.transitionType.includes("MLCT"))
      } else if (filterType === "d0-d10") {
        result = result.filter(b => b.dConfig === "d⁰" || b.dConfig === "d¹⁰")
      } else if (filterType === "HS") {
        result = result.filter(b => b.dConfig.includes("HS"))
      } else if (filterType === "LS") {
        result = result.filter(b => b.dConfig.includes("LS"))
      } else if (filterType === "yan-teller") {
        result = result.filter(b => b.tags.includes("Yan-Teller"))
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
        b.metalCenter.toLowerCase().includes(q) ||
        b.color.toLowerCase().includes(q)
      )
    }

    return result
  }, [searchQuery, filterType, filterTag])

  // Statistika
  const stats = useMemo(() => {
    return {
      total: birikmalar.length,
      ddCount: birikmalar.filter(b => b.transitionType.includes("d-d")).length,
      ctCount: birikmalar.filter(b => b.transitionType.includes("LMCT") || b.transitionType.includes("MLCT")).length,
      colorlessCount: birikmalar.filter(b => b.color.includes("rangsiz")).length,
    }
  }, [])

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
              <Link href="/ilmiy/tahlil/ub-vis" className="hover:text-purple-300">UB-Vis spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <span className="text-pink-400 font-semibold">Birikmalar</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
                  <span className="text-3xl">🔍</span>
                  UB-Vis spektroskopiya — Birikmalar katalogi
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  {birikmalar.length} ta kompleks • λ<sub>max</sub>, ε, Δo qiymatlari • d–d, LMCT, MLCT tasmalar • Terminlar
                </p>
              </div>
              <Link href="/ilmiy/tahlil/ub-vis" className="text-xs bg-pink-600/80 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← UB-Vis spektroskopiya
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-pink-600 hover:bg-pink-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* STATISTIKA KARTALARI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-xl p-4">
            <div className="text-xs text-pink-400 mb-1">Jami birikmalar</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-xl p-4">
            <div className="text-xs text-purple-400 mb-1">d–d o'tishli</div>
            <div className="text-3xl font-bold text-white">{stats.ddCount}</div>
          </div>
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-700/50 rounded-xl p-4">
            <div className="text-xs text-red-400 mb-1">CT (LMCT/MLCT)</div>
            <div className="text-3xl font-bold text-white">{stats.ctCount}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 border border-gray-600/50 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">Rangsiz</div>
            <div className="text-3xl font-bold text-white">{stats.colorlessCount}</div>
          </div>
        </div>

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          {/* Qidiruv */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Birikma nomi, formula, metall yoki rang bo'yicha..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-pink-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-pink-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "compact" ? "bg-pink-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📋 Ixcham
              </button>
            </div>
          </div>

          {/* Filter by transition type */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">O'tish turi:</span>
            {[
              { key: "all", label: `Barchasi (${birikmalar.length})` },
              { key: "d-d", label: "d–d o'tishlar" },
              { key: "LMCT", label: "LMCT" },
              { key: "MLCT", label: "MLCT" },
              { key: "d0-d10", label: "d⁰ / d¹⁰ (rangsiz)" },
              { key: "HS", label: "Yuqori spin (HS)" },
              { key: "LS", label: "Past spin (LS)" },
              { key: "yan-teller", label: "Yan-Teller" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === f.key
                    ? "bg-pink-600 text-white"
                    : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-pink-500"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filter by tag */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Tag:</span>
            <button
              onClick={() => setFilterTag("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTag === "all"
                  ? "bg-pink-600 text-white"
                  : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-pink-500"
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
                    ? "bg-pink-600 text-white"
                    : "bg-purple-900/50 text-purple-300 border border-purple-700/30 hover:border-pink-500"
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
            <strong className="text-pink-400">{filteredBirikmalar.length}</strong> ta birikma topildi
          </p>
          {(searchQuery || filterType !== "all" || filterTag !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setFilterType("all"); setFilterTag("all") }}
              className="text-xs text-purple-400 hover:text-pink-400 transition-colors"
            >
              ✕ Filtrlarni tozalash
            </button>
          )}
        </div>

        {/* HECH NARSA TOPILMADI */}
        {filteredBirikmalar.length === 0 && (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300 text-sm">
              Boshqa kalit so'z bilan qidirib ko'ring yoki filtrlarni tozalang
            </p>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === "grid" && filteredBirikmalar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBirikmalar.map((b) => (
              <Link
                key={b.id}
                href={`/ilmiy/tahlil/ub-vis/birikmalar/${b.slug}`}
                className="group bg-gradient-to-br from-pink-900/30 to-purple-900/40 border border-pink-700/40 rounded-2xl p-6 hover:from-pink-900/50 hover:to-purple-900/60 hover:border-pink-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10"
              >
                {/* Sarlavha va rang chizig'i */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3
                      className="text-lg font-bold text-pink-400 group-hover:text-pink-300 transition-colors"
                      dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                    />
                    <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                    <p className="text-purple-500 text-xs mt-0.5 italic">{b.commonName}</p>
                  </div>
                  <div className="text-right ml-3">
                    <div className="flex flex-col gap-1">
                      <div className="w-10 h-10 rounded-lg border-2 border-white/30 shadow-lg" style={{background: b.perceivedHex}} title="Ko'rinuvchi rang"></div>
                      <div className="w-10 h-3 rounded" style={{background: b.absorbedHex}} title="Yutilgan rang"></div>
                    </div>
                  </div>
                </div>

                {/* Elektron konfiguratsiya va term */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-2">
                    <div className="text-[10px] text-blue-400 uppercase">Konfiguratsiya</div>
                    <div className="text-sm text-blue-300 font-mono font-bold">{b.dConfig}</div>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-2">
                    <div className="text-[10px] text-purple-400 uppercase">Yer holati</div>
                    <div className="text-sm text-purple-300 font-mono font-bold">{b.groundTerm}</div>
                  </div>
                </div>

                {/* Xususiyatlar */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-pink-400 font-semibold">{b.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Struktura:</span>
                    <span className="text-cyan-400 font-mono">{b.structure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Markazi:</span>
                    <span className="text-yellow-400 font-mono font-bold">{b.metalCenter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Magnit:</span>
                    <span className="text-green-400">{b.magnetism.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Asosiy λmax va ε */}
                <div className="mb-4">
                  <p className="text-xs text-purple-400 mb-2 font-semibold">🌈 Asosiy o'tishlar:</p>
                  <div className="space-y-1.5">
                    {b.transitions.slice(0, 3).map((t, i) => (
                      <div key={i} className="bg-purple-950/40 rounded p-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-300 font-mono">
                            {t.lambda ? `${t.lambda} nm` : "—"}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            t.type.includes("LMCT") ? "bg-red-900/40 text-red-300" :
                            t.type.includes("MLCT") ? "bg-orange-900/40 text-orange-300" :
                            t.type.includes("IL") ? "bg-cyan-900/40 text-cyan-300" :
                            "bg-purple-900/40 text-purple-300"
                          }`}>
                            {t.type}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px]">
                          <span className="text-purple-300">{t.symbol}</span>
                          <span className="text-green-300 font-mono">ε={t.epsilon}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Δo va Racah B */}
                {(b.deltaOh || b.deltaTd || b.racahB) && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {(b.deltaOh || b.deltaTd) && (
                      <div className="bg-cyan-900/20 border border-cyan-700/30 rounded p-2 text-center">
                        <div className="text-[10px] text-cyan-400">Δ{b.deltaTd ? "t" : "o"}</div>
                        <div className="text-sm text-cyan-300 font-mono font-bold">
                          {(b.deltaOh || b.deltaTd).toLocaleString()}
                        </div>
                        <div className="text-[9px] text-cyan-500">cm⁻¹</div>
                      </div>
                    )}
                    {b.racahB && (
                      <div className="bg-green-900/20 border border-green-700/30 rounded p-2 text-center">
                        <div className="text-[10px] text-green-400">Racah B (β={b.beta})</div>
                        <div className="text-sm text-green-300 font-mono font-bold">{b.racahB}</div>
                        <div className="text-[9px] text-green-500">cm⁻¹</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Maxsus xususiyat */}
                <div className="mb-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-2">
                  <p className="text-xs text-yellow-300 italic">💡 {b.specialFeature}</p>
                </div>

                {/* Taglar */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {b.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 text-[10px] border border-purple-700/30">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-purple-700/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-400 font-mono">M = {b.molarMass} g/mol</span>
                    <span className="text-pink-400 group-hover:text-pink-300 transition-colors font-semibold">
                      Batafsil →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && filteredBirikmalar.length > 0 && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-pink-400">Rang</th>
                  <th className="py-3 px-3 text-pink-400">Formula</th>
                  <th className="py-3 px-3 text-pink-400">IUPAC</th>
                  <th className="py-3 px-3 text-pink-400">Konfig.</th>
                  <th className="py-3 px-3 text-pink-400">Yer holati</th>
                  <th className="py-3 px-3 text-pink-400">λ<sub>max</sub></th>
                  <th className="py-3 px-3 text-pink-400">ε</th>
                  <th className="py-3 px-3 text-pink-400">Δo (cm⁻¹)</th>
                  <th className="py-3 px-3 text-pink-400">Tur</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filteredBirikmalar.map((b) => (
                  <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-2 px-3">
                      <div className="w-6 h-6 rounded border border-white/20" style={{background: b.perceivedHex}} title={b.color}></div>
                    </td>
                    <td className="py-2 px-3">
                      <Link
                        href={`/ilmiy/tahlil/ub-vis/birikmalar/${b.slug}`}
                        className="text-pink-400 font-bold hover:underline font-mono"
                        dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                      />
                    </td>
                    <td className="py-2 px-3 text-purple-300">{b.iupac}</td>
                    <td className="py-2 px-3 text-blue-300 font-mono">{b.dConfig}</td>
                    <td className="py-2 px-3 text-purple-300 font-mono">{b.groundTerm}</td>
                    <td className="py-2 px-3 text-yellow-300 font-mono">
                      {b.transitions[0].lambda ? `${b.transitions[0].lambda} nm` : "—"}
                    </td>
                    <td className="py-2 px-3 text-green-300 font-mono">{b.transitions[0].epsilon}</td>
                    <td className="py-2 px-3 text-cyan-300 font-mono">
                      {b.deltaOh ? b.deltaOh.toLocaleString() : (b.deltaTd ? b.deltaTd.toLocaleString() + " (Δt)" : "—")}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        b.transitionType.includes("LMCT") ? "bg-red-900/40 text-red-300" :
                        b.transitionType.includes("MLCT") ? "bg-orange-900/40 text-orange-300" :
                        b.transitionType.includes("yo'q") ? "bg-gray-700/40 text-gray-400" :
                        "bg-purple-900/40 text-purple-300"
                      }`}>
                        {b.transitionType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COMPACT VIEW */}
        {viewMode === "compact" && filteredBirikmalar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBirikmalar.map((b) => (
              <Link
                key={b.id}
                href={`/ilmiy/tahlil/ub-vis/birikmalar/${b.slug}`}
                className="group bg-purple-900/30 border border-purple-700/40 rounded-lg p-4 hover:bg-purple-800/40 hover:border-pink-500/50 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg border-2 border-white/20 flex-shrink-0 shadow-lg" style={{background: b.perceivedHex}}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className="text-sm font-bold text-pink-400 group-hover:text-pink-300 truncate"
                      dangerouslySetInnerHTML={{ __html: b.formulaHTML }}
                    />
                    <span className="text-[10px] bg-blue-900/40 border border-blue-700/50 rounded px-1.5 py-0.5 text-blue-300 font-mono flex-shrink-0">
                      {b.dConfig}
                    </span>
                  </div>
                  <p className="text-xs text-purple-400 truncate">{b.iupac}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                    <span className="text-yellow-300 font-mono">
                      λ={b.transitions[0].lambda || "—"} nm
                    </span>
                    <span className="text-green-300 font-mono">
                      ε={b.transitions[0].epsilon}
                    </span>
                    {(b.deltaOh || b.deltaTd) && (
                      <span className="text-cyan-300 font-mono">
                        Δ={(b.deltaOh || b.deltaTd).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-pink-400 group-hover:translate-x-1 transition-transform">→</div>
              </Link>
            ))}
          </div>
        )}

        {/* PASTKI KATTA JADVAL — TAQQOSLASH */}
        {filteredBirikmalar.length > 5 && (
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/40 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
              <span>📊</span> Spektral parametrlarni taqqoslash
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-blue-700/50 bg-blue-950/40">
                    <th className="py-2 px-3 text-left text-blue-400">Kompleks</th>
                    <th className="py-2 px-3 text-left text-blue-400">dⁿ</th>
                    <th className="py-2 px-3 text-left text-blue-400">Δo yoki Δt (cm⁻¹)</th>
                    <th className="py-2 px-3 text-left text-blue-400">B (cm⁻¹)</th>
                    <th className="py-2 px-3 text-left text-blue-400">β</th>
                    <th className="py-2 px-3 text-left text-blue-400">O'tish turi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBirikmalar
                    .filter(b => b.deltaOh || b.deltaTd || b.racahB)
                    .slice(0, 15)
                    .map((b, i) => (
                    <tr key={i} className="border-b border-blue-800/30 hover:bg-blue-900/20">
                      <td className="py-2 px-3">
                        <span className="text-pink-300 font-mono" dangerouslySetInnerHTML={{ __html: b.formulaHTML }} />
                      </td>
                      <td className="py-2 px-3 text-blue-300 font-mono">{b.dConfig}</td>
                      <td className="py-2 px-3 text-cyan-300 font-mono">
                        {b.deltaOh ? b.deltaOh.toLocaleString() : (b.deltaTd ? b.deltaTd.toLocaleString() + " (Δt)" : "—")}
                      </td>
                      <td className="py-2 px-3 text-green-300 font-mono">{b.racahB || "—"}</td>
                      <td className="py-2 px-3 text-yellow-300 font-mono">{b.beta || "—"}</td>
                      <td className="py-2 px-3 text-purple-300">{b.transitionType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 jdakimyo.uz — Koordinatsion birikmalar kimyosi</p>
          <p className="mt-1">Manbalar: Lever (Inorganic Electronic Spectroscopy) • Housecroft & Sharpe • Tanabe-Sugano</p>
        </div>
      </footer>
    </main>
  )
}
