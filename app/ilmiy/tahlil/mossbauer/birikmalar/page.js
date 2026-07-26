"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// MÖSSBAUER SPEKTROSKOPIYA — BIRIKMALAR KATALOGI (PREMIUM)
// 6 ta klassik Fe kompleks — har biri uchun δ (izomer siljish), ΔE_Q (kvadrupol
// bo'linishi), H_hf (giperkichik magnit maydon), Γ (chiziq kengligi), spektr turi,
// elektron konfiguratsiya, term simvoli va spin holati.
//
// Manbalar (peer-reviewed):
//   • P. Gütlich, E. Bill, A. X. Trautwein — Mössbauer Spectroscopy and Transition
//     Metal Chemistry (Springer, 2011)
//   • N. N. Greenwood, T. C. Gibb — Mössbauer Spectroscopy (Chapman & Hall, 1971)
//   • F. Menil — J. Phys. Chem. Solids 46, 763 (1985) — δ va kimyoviy bog'lanish
//   • G. J. Long (ed.) — Mössbauer Spectroscopy Applied to Inorganic Chemistry
//   • Mössbauer Mineral Handbook — Dyar, Agresti, Schaefer (2006)
//   • R. H. Herber (ed.) — Chemical Mössbauer Spectroscopy (Plenum, 1984)
//
// Barcha δ qiymatlari α-Fe metall (RT) ga nisbatan berilgan (mm/s).
// Standart shart: T = 295 K (RT), agar boshqacha ko'rsatilmagan bo'lsa.
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. QIZIL QON TUZI — Fe(III) LS, klassik dublet
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "k3-fe-cn6",
    slug: "k3-fe-cn6",
    formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K3[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(III)",
    commonName: "Qizil qon tuzi (Ferricyanide)",
    molarMass: 329.24,
    color: "to'q qizil-to'q sariq",
    perceivedHex: "#B71C1C",
    kristallSistema: "Monoklinik, P2₁/c",
    structure: "Oktaedr (O_h, deyarli mukammal)",
    metalCenter: "Fe³⁺",
    oksidlanish: "+3",
    dConfig: "d⁵ (LS, t₂g⁵ eg⁰)",
    groundTerm: "²T₂g",
    spin: "S = 1/2 (LS)",
    magnetism: "Paramagnit (μ_eff ≈ 2.25 μB, Kotani egri chizig'i)",

    // Mössbauer parametrlari (RT = 295 K, α-Fe ga nisbatan)
    delta: -0.12,
    deltaQ: 0.28,
    H_hf: 0,
    linewidth: 0.28,
    spektrTuri: "Assimetrik dublet",
    tanlashQoidasi: "ΔI = 1, ΔmI = 0, ±1",

    parametrlarJadvali: [
      { T: 4.2,  delta: -0.05, deltaQ: 0.30, H_hf: 0,    izoh: "Past T da chiziq torroq" },
      { T: 77,   delta: -0.09, deltaQ: 0.29, H_hf: 0,    izoh: "Suyuq N₂ standart T" },
      { T: 295,  delta: -0.12, deltaQ: 0.28, H_hf: 0,    izoh: "Xona harorati (RT)" },
    ],

    fizikMano: "CN⁻ — kuchli σ-donor va π-akseptor ligand. Kuchli maydon (Δ_o ≈ 33800 cm⁻¹) → LS holat. t₂g⁵ konfiguratsiya asimmetrik (bitta g'ovak eg-orbitallarda) → nolga teng bo'lmagan EFG → dublet. Fe(III) uchun δ juda past — 3d elektronlar kam, 4s ekranlash zaif, |ψ(0)|² yuqori.",
    kimyoviyMano: "Kuchli oksidlovchi (E° = +0.36 V). Prussian ko'k sinteziga xom-ashyo. Elektronikada oksidlovchi etchant sifatida. π-back-bonding orqali Fe→CN ga elektron zichligini uzatadi.",
    alternativUsullar: "EPR (g₁ = 2.35, g₂ = 2.10, g₃ = 0.91, past T da), UV-Vis (LMCT 420 nm, ε≈1000), IR (νCN = 2135 cm⁻¹), Raman, XRD",
    tarixiy: "1822 — L. Gmelin qizil kristall sifatida ta'riflagan. Fe³⁺ + KCN yoki K₄[Fe(CN)₆] oksidlanishidan. Prussian ko'kining kelib chiqishi.",
    xavfsizlik: "Kuchli kislotalar bilan HCN ajratadi! Har doim neytral yoki asosli muhitda foydalaning.",
    specialFeature: "LS d⁵ ning klassik namunasi — δ manfiy, ΔE_Q kichik (t₂g⁵ deyarli sferik)",
    tags: ["klassik", "d⁵ LS", "oktaedr", "dublet", "Prussian ko'k prekursor"],
    rang: "red",
    href: "/ilmiy/tahlil/mossbauer/birikmalar/k3-fe-cn6"
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. SARIQ QON TUZI — Fe(II) LS, klassik singlet
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "k4-fe-cn6",
    slug: "k4-fe-cn6",
    formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]·3H<sub>2</sub>O",
    formulaPlain: "K4[Fe(CN)6]·3H2O",
    iupac: "Kaliy geksatsianoferrat(II) trigidrat",
    commonName: "Sariq qon tuzi (Ferrocyanide)",
    molarMass: 422.39,
    color: "limonli-sariq",
    perceivedHex: "#F9E076",
    kristallSistema: "Monoklinik, C2/c",
    structure: "Oktaedr (O_h, deyarli ideal)",
    metalCenter: "Fe²⁺",
    oksidlanish: "+2",
    dConfig: "d⁶ (LS, t₂g⁶ eg⁰)",
    groundTerm: "¹A₁g",
    spin: "S = 0 (LS)",
    magnetism: "Diamagnit (χ_M < 0)",

    delta: -0.04,
    deltaQ: 0.00,
    H_hf: 0,
    linewidth: 0.25,
    spektrTuri: "Singlet (deyarli mukammal)",
    tanlashQoidasi: "Faqat markazlashgan chiziq",

    parametrlarJadvali: [
      { T: 4.2,  delta: 0.05,  deltaQ: 0.00, H_hf: 0, izoh: "Barqaror singlet, past T" },
      { T: 77,   delta: 0.02,  deltaQ: 0.00, H_hf: 0, izoh: "Ikkinchi darajali Doppler siljish" },
      { T: 295,  delta: -0.04, deltaQ: 0.00, H_hf: 0, izoh: "Xona harorati" },
    ],

    fizikMano: "d⁶ LS — t₂g orbitallar to'liq to'lgan (6 elektron), eg bo'sh. Bu konfiguratsiya sferik simmetrik zaryad taqsimotini beradi → valent hissa V_zz = 0 → panjara hissa ham juda kichik (deyarli mukammal O_h) → ΔE_Q ≈ 0 → yagona singlet. δ negatif — kovalent bog'lanish kuchli, 4s ga elektron donatsiya.",
    kimyoviyMano: "Diamagnit, juda barqaror (log β₆ ≈ 35). Elektron manba (Fe²⁺ = qaytaruvchi, ammo CN⁻ stabillashadi). Oziq-ovqat sanoatida antikakkant qo'shimchasi (E535, E536, E537 — barcha Fe(CN)₆ tuzlar).",
    alternativUsullar: "¹³C NMR (170 ppm), ¹H NMR (H₂O), UV-Vis (MLCT 320 nm), IR (νCN = 2044 cm⁻¹), rentgen difraksiyasi (Fe–C = 1.90 Å)",
    tarixiy: "1706 — Diesbach tomonidan tasodifan olingan (Prussian ko'k bilan birga). \"Sariq qon tuzi\" nomi hayvon qonidan (albumin + Fe + K₂CO₃) tarixiy sintezga taalluqli.",
    xavfsizlik: "Tuz sifatida past toksik. Kuchli kislotalar bilan HCN chiqaradi.",
    specialFeature: "Singletning oltin standarti — t₂g⁶ sferik simmetriya, ΔE_Q = 0 ning bevosita namunasi",
    tags: ["klassik", "d⁶ LS", "diamagnit", "singlet", "oziq-ovqat qo'shimchasi"],
    rang: "yellow",
    href: "/ilmiy/tahlil/mossbauer/birikmalar/k4-fe-cn6"
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. GEKSAAKVATEMIR(II) — Fe(II) HS, klassik katta ΔE_Q dublet
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "fe-h2o6-2",
    slug: "fe-h2o6-2",
    formulaHTML: "[Fe(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    formulaPlain: "[Fe(H2O)6]2+",
    iupac: "Geksaakvatemir(II) ioni",
    commonName: "Temir(II) akvakompleks (och yashil)",
    molarMass: 161.99,
    color: "och yashil-havorang",
    perceivedHex: "#A8D5BA",
    kristallSistema: "FeSO₄·7H₂O — Monoklinik P2₁/c (melanterit)",
    structure: "Oktaedr (O_h, tri-gonal buzilgan)",
    metalCenter: "Fe²⁺",
    oksidlanish: "+2",
    dConfig: "d⁶ (HS, t₂g⁴ eg²)",
    groundTerm: "⁵T₂g",
    spin: "S = 2 (HS)",
    magnetism: "Paramagnit (μ_eff = 5.10–5.40 μB, spin+orbital hissa)",

    delta: 1.39,
    deltaQ: 3.19,
    H_hf: 0,
    linewidth: 0.30,
    spektrTuri: "Simmetrik dublet (juda katta ΔE_Q)",
    tanlashQoidasi: "ΔI = 1, ΔmI = 0, ±1",

    parametrlarJadvali: [
      { T: 4.2,  delta: 1.42, deltaQ: 3.30, H_hf: 0, izoh: "Maksimal ΔE_Q (T→0)" },
      { T: 77,   delta: 1.41, deltaQ: 3.28, H_hf: 0, izoh: "LN₂ standart o'lchov" },
      { T: 295,  delta: 1.39, deltaQ: 3.19, H_hf: 0, izoh: "ΔE_Q(T) — Boltzmann bo'linishi" },
      { T: 400,  delta: 1.36, deltaQ: 2.95, H_hf: 0, izoh: "Yuqori T da t₂g pastki holatlar populatsiyasi" },
    ],

    fizikMano: "H₂O — kuchsiz maydon ligand (Δ_o ≈ 10 400 cm⁻¹ < P). HS holat: t₂g⁴ eg² — g'ovak t₂g pod-qatlamda, buzilgan zaryad taqsimoti → juda katta valent EFG hissa (V_val ~ +4/7·<r⁻³>). δ ≈ 1.4 — Fe(II) HS ning eng yuqori qiymatlaridan biri: 3d⁶ elektronlar 4s ni kuchli ekranlaydi, |ψ(0)|² past. ΔE_Q(T) — haroratga bog'liq (Ingalls modeli): t₂g holatlar Boltzmann-populatsiyaga muvofiq aralashadi.",
    kimyoviyMano: "Kislotali muhitda barqaror; havoda tez oksidlanadi Fe(III) ga (yashildan sariqqa o'zgaradi). FeSO₄·7H₂O (Melanterit) — Mössbauer standart namunasi. Suvli eritmada 55.5 M H₂O ligand.",
    alternativUsullar: "UV-Vis (⁵T₂g → ⁵Eg da λ ≈ 960 nm, ε=1), EPR (yopiq, HS Fe²⁺ silent), SQUID (μ_eff), IR (νOH keng)",
    tarixiy: "FeSO₄·7H₂O — \"Yashil vitriol\", qadim davrlardan ma'lum. 1959 da S.S. Hanna tomonidan Fe uchun birinchi Mössbauer o'lchovi aynan shu birikmada bajarilgan.",
    xavfsizlik: "Havoda oksidlanadi; Ar/N₂ atmosferada saqlash tavsiya etiladi.",
    specialFeature: "Fe(II) HS ning altin standarti — δ~1.4, ΔE_Q~3.2 (jahon eng katta d–d parametrlaridan)",
    tags: ["klassik", "d⁶ HS", "oktaedr", "dublet", "haroratga-bog'liq", "yashil-vitriol"],
    rang: "green",
    href: "/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-2"
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. GEKSAAKVATEMIR(III) — Fe(III) HS, kichik ΔE_Q dublet
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "fe-h2o6-3",
    slug: "fe-h2o6-3",
    formulaHTML: "[Fe(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
    formulaPlain: "[Fe(H2O)6]3+",
    iupac: "Geksaakvatemir(III) ioni",
    commonName: "Temir(III) akvakompleks (och binafsha)",
    molarMass: 161.99,
    color: "och binafsha-sariq (pH bog'liq)",
    perceivedHex: "#C9A0DC",
    kristallSistema: "Fe(NO₃)₃·9H₂O — Monoklinik",
    structure: "Oktaedr (O_h, deyarli sferik)",
    metalCenter: "Fe³⁺",
    oksidlanish: "+3",
    dConfig: "d⁵ (HS, t₂g³ eg²)",
    groundTerm: "⁶A₁g",
    spin: "S = 5/2 (HS)",
    magnetism: "Paramagnit (μ_eff = 5.92 μB, spin-only, orbital hissa nol)",

    delta: 0.48,
    deltaQ: 0.15,
    H_hf: 0,
    linewidth: 0.32,
    spektrTuri: "Simmetrik dublet (kichik ΔE_Q, ba'zan singlet ko'rinishida)",
    tanlashQoidasi: "ΔI = 1, ΔmI = 0, ±1",

    parametrlarJadvali: [
      { T: 4.2,  delta: 0.52, deltaQ: 0.18, H_hf: "55.0 T", izoh: "Sekin relaksatsiya → sekstet paydo bo'lishi mumkin" },
      { T: 77,   delta: 0.50, deltaQ: 0.16, H_hf: 0, izoh: "LN₂ da dublet dominant" },
      { T: 295,  delta: 0.48, deltaQ: 0.15, H_hf: 0, izoh: "Xona T — tez spin-spin relaksatsiya" },
    ],

    fizikMano: "d⁵ HS — 5 ta parallel spin, har bir orbital (t₂g × 3 + eg × 2) yakka to'lgan. Zaryad taqsimoti sferik simmetrik → V_val ≈ 0. ΔE_Q kichik va deyarli faqat panjara (V_lat) hissasidan keladi. δ ≈ 0.5 — Fe(III) ning tipik qiymati; Fe(II) HS dan past, chunki 3d elektron kam. Past T da (T < 5 K) elektron spin relaksatsiyasi Larmor davridan sekinlashib qolib, ichki magnit maydon paydo bo'ladi → sekstet.",
    kimyoviyMano: "Kislotali muhitda barqaror. pH > 2 da gidroliz boshlanadi ([Fe(H₂O)₅(OH)]²⁺, dimerlar, ferrigidrit). Ferrihidrit va gyot prekursori. Analitik reagent.",
    alternativUsullar: "UV-Vis (LMCT 240 nm, kuchli), EPR (g ≈ 4.3 va 2.0, rombik Fe³⁺), SQUID (Curie qonuni), Raman",
    tarixiy: "Klassik akvakompleks, Werner nazariyasi asosida ta'riflangan. Fe(III) tabiiy suv va tuproq eritmalarida asosiy shakli.",
    xavfsizlik: "Kislotali eritma (pH < 1), teri va ko'zga tirnovchi.",
    specialFeature: "Fe(III) HS ning altin standarti — d⁵ sferik simmetriya, ΔE_Q juda kichik (0.1–0.3)",
    tags: ["klassik", "d⁵ HS", "oktaedr", "sferik", "kichik-EFG", "gidroliz"],
    rang: "orange",
    href: "/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-3"
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. TEMIR PENTAKARBONIL — Fe(0), 18-elektron, ekstremal past δ
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "fe-co5",
    slug: "fe-co5",
    formulaHTML: "[Fe(CO)<sub>5</sub>]",
    formulaPlain: "[Fe(CO)5]",
    iupac: "Pentakarboniltemir(0)",
    commonName: "Temir pentakarbonil (Mond-Berthelot suyuqligi)",
    molarMass: 195.90,
    color: "sariq-oltin suyuqlik",
    perceivedHex: "#DAA520",
    kristallSistema: "Suyuqlik (m.p. −20 °C); qattiq — monoklinik C2/c",
    structure: "Trigonal-bipiramidal (D₃ₕ)",
    metalCenter: "Fe⁰",
    oksidlanish: "0",
    dConfig: "d⁸ (18e⁻ ko'rinishida yopiq qobiq)",
    groundTerm: "¹A₁' (D₃ₕ)",
    spin: "S = 0",
    magnetism: "Diamagnit",

    delta: -0.09,
    deltaQ: 2.57,
    H_hf: 0,
    linewidth: 0.26,
    spektrTuri: "Assimetrik dublet (katta ΔE_Q, past δ)",
    tanlashQoidasi: "ΔI = 1, ΔmI = 0, ±1",

    parametrlarJadvali: [
      { T: 4.2,  delta: 0.00, deltaQ: 2.60, H_hf: 0, izoh: "Qattiq faza (m.p. = −20 °C)" },
      { T: 77,   delta: -0.03, deltaQ: 2.58, H_hf: 0, izoh: "Standart o'lchov T" },
      { T: 200,  delta: -0.09, deltaQ: 2.57, H_hf: 0, izoh: "Qattiq faza chegarasiga yaqin" },
    ],

    fizikMano: "Fe⁰ formal oksidlanish darajasi 0. CO — kuchli π-akseptor (dπ→π*(CO) back-bonding). Bu Fe dan CO ga elektron zichligini uzatadi → 3d ekranlash kamayadi → 4s zichligi |ψ(0)|² keskin oshadi → δ deyarli 0 yoki manfiy. D₃ₕ simmetriyada aksial (2 ta) va ekvatorial (3 ta) CO holatlari farq qiladi → EFG asimmetrik → katta ΔE_Q. Bu \"past δ + katta ΔE_Q\" — kovalent karbonillar uchun tipik.",
    kimyoviyMano: "Uchuvchi (b.p. = 103 °C), tez yorug'lik parchalanadi (Fe₂(CO)₉ va Fe₃(CO)₁₂ ga). Metallorganik kimyoning asosiy prekursori. IR: νCO(ekv) = 2022, νCO(aks) = 2000 cm⁻¹.",
    alternativUsullar: "IR (2 ta νCO chiziq — D₃ₕ tanlash qoidasi), ¹³C NMR (208 ppm, tez ekv/aks almashinuv), gaz-fazali elektron difraksiya (Fe–C_ax = 1.807 Å, Fe–C_eq = 1.827 Å)",
    tarixiy: "1891 — L. Mond, F. Quincke tomonidan Fe + CO reaksiyasidan kashf etilgan. Metallorganik kimyoning \"otasi\" (Ni(CO)₄ dan keyingi ikkinchi karbonil).",
    xavfsizlik: "🔴 O'ta toksik (CO ajratadi, LC₅₀ ≈ 10 ppm), pirofor, yorug'lik va havoga sezgir. Faqat argon glovebox va tumanli shkafda ishlash.",
    specialFeature: "Fe(0) — δ ~ 0 ning noyob namunasi; ekstremal π-back-bonding; D₃ₕ simmetriyasi bilan intrinsik katta EFG",
    tags: ["metallorganik", "d⁸ 18e", "diamagnit", "trigonal-bipiramidal", "π-akseptor", "past-δ"],
    rang: "amber",
    href: "/ilmiy/tahlil/mossbauer/birikmalar/fe-co5"
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. MAGNETIT — Fe₃O₄, aralash valent, ferrimagnit sekstet
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "fe3o4",
    slug: "fe3o4",
    formulaHTML: "Fe<sub>3</sub>O<sub>4</sub>  ≡  Fe<sup>3+</sup>[Fe<sup>2+</sup>Fe<sup>3+</sup>]O<sub>4</sub>",
    formulaPlain: "Fe3O4",
    iupac: "Temir(II,III) oksidi",
    commonName: "Magnetit (mineral), lodestone",
    molarMass: 231.53,
    color: "qora-metallik (mineral)",
    perceivedHex: "#1C1C1E",
    kristallSistema: "Teskari spinel (inverse spinel), Fd-3m, T_V = 120 K",
    structure: "Tetraedrik (A-sayt) + Oktaedrik (B-sayt)",
    metalCenter: "Fe³⁺ (A) + [Fe²⁺, Fe³⁺] (B)",
    oksidlanish: "+2, +3 (aralash)",
    dConfig: "Fe(A)³⁺: d⁵ HS · Fe(B)²⁺: d⁶ HS · Fe(B)³⁺: d⁵ HS",
    groundTerm: "⁶A₁g (A), ⁵T₂g (B, Fe²⁺), ⁶A₁g (B, Fe³⁺)",
    spin: "A: S=5/2 ↓  |  B: S=5/2, S=2 ↑ (antiparalel — ferrimagnit)",
    magnetism: "Ferrimagnit (T_C = 858 K, M_s = 92 emu/g, RT da)",

    // Ikki sayt uchun (T = 295 K)
    delta: 0.28,        // A-sayt (Fe³⁺ tetraedrik)
    deltaQ: 0.00,
    H_hf: 49.0,         // A-sayt
    linewidth: 0.30,
    spektrTuri: "Ikki sekstet (A + B) — RT da; past T da uch sekstet (Verwey pastida)",
    tanlashQoidasi: "6 chiziq har bir sayt uchun (I=3/2 → 1/2), 3:2:1:1:2:3 nisbat",

    parametrlarJadvali: [
      { T: 4.2,  delta: 0.37,       deltaQ: 0.00, H_hf: "51.5 T (A)",     izoh: "Verwey pastida — 3 sayt: B ajraladi Fe²⁺ va Fe³⁺" },
      { T: 4.2,  delta: 1.05,       deltaQ: 1.55, H_hf: "38.0 T (B–Fe²⁺)", izoh: "T < T_V — zaryad tartibi" },
      { T: 4.2,  delta: 0.45,       deltaQ: 0.00, H_hf: "50.0 T (B–Fe³⁺)", izoh: "T < T_V" },
      { T: 77,   delta: 0.32,       deltaQ: 0.00, H_hf: "49.8 T (A)",     izoh: "Verwey ustida — B saytda tez e⁻ atlash" },
      { T: 77,   delta: 0.66,       deltaQ: 0.00, H_hf: "46.5 T (B)",     izoh: "Fe²·⁵⁺ o'rtacha (aralash valent)" },
      { T: 295,  delta: 0.28,       deltaQ: 0.00, H_hf: "49.0 T (A)",     izoh: "A-sayt Fe³⁺ tet" },
      { T: 295,  delta: 0.66,       deltaQ: 0.00, H_hf: "46.0 T (B)",     izoh: "B-sayt aralash Fe²·⁵⁺" },
    ],

    fizikMano: "Teskari spinel AB₂O₄: A-saytda (tet) Fe³⁺, B-saytda (okt) Fe²⁺ va Fe³⁺ teng nisbatda. RT da B-saytda elektronlar tez almashinadi (hopping, ν ≈ 10¹¹ Hz > Mössbauer vaqti oynasi 10⁷ Hz), shuning uchun ikkita ta'sirlashgan Fe holatida o'rtacha \"Fe²·⁵⁺\" ko'rinadi (δ ≈ 0.66). 120 K da Verwey o'tishi — elektronlar joylashib qoladi (charge ordering), spektr uch komponentaga bo'linadi. Ferrimagnit: A (↓) va B (↑) spinlari antiparalel, lekin momentlar teng emas — natijaviy magnitlanish.",
    kimyoviyMano: "Tabiiy magnit mineral (lodestone — kompasning kelib chiqishi). Sanoatda pigment, ferroflüid, MRI kontrast (Feridex, SPION), biosensor, gipertermiya. Havoda maghemit γ-Fe₂O₃ ga oksidlanadi.",
    alternativUsullar: "XRD (spinel a₀ = 8.397 Å), SQUID (M_s, T_C, Verwey), Raman (668, 538, 306 cm⁻¹), neytron difraksiyasi (spin tartibi), TEM (nanozarrachalar uchun)",
    tarixiy: "Antik davrlardan ma'lum (Magnesia mintaqasi, Yunoniston, Turkiya). 1930-yillar — Verwey Fe₃O₄ ning kristall va elektron strukturasini o'rgangan. Mars roverlarida Mössbauer bilan aniqlangan (MIMOS-II, 2004).",
    xavfsizlik: "Barqaror mineral. Nanozarracha shaklda inhalatsiya xavfli.",
    specialFeature: "Aralash valent (Fe²⁺/Fe³⁺) + ferrimagnit sekstet + Verwey o'tishi — Mössbauer uchun eng boy tizim",
    tags: ["mineral", "aralash-valent", "ferrimagnit", "spinel", "sekstet", "Verwey", "Mars-topilma", "SPION"],
    rang: "purple",
    href: "/ilmiy/tahlil/mossbauer/birikmalar/fe3o4"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// FILTER TAGLARI
// ═══════════════════════════════════════════════════════════════════════════════

const filterTaglari = [
  { key: "hammasi",  label: "Hammasi",     icon: "◉",  color: "text-teal-400" },
  { key: "fe0",      label: "Fe⁰",         icon: "⚙",  color: "text-amber-400" },
  { key: "fe2",      label: "Fe²⁺",        icon: "◐",  color: "text-green-400" },
  { key: "fe3",      label: "Fe³⁺",        icon: "◑",  color: "text-red-400" },
  { key: "aralash",  label: "Aralash",     icon: "◍",  color: "text-purple-400" },
  { key: "ls",       label: "LS (past)",   icon: "↓",  color: "text-blue-400" },
  { key: "hs",       label: "HS (yuqori)", icon: "↑",  color: "text-orange-400" },
  { key: "singlet",  label: "Singlet",     icon: "│",  color: "text-yellow-400" },
  { key: "dublet",   label: "Dublet",      icon: "‖",  color: "text-cyan-400" },
  { key: "sekstet",  label: "Sekstet",     icon: "≡",  color: "text-pink-400" },
]

// Rang xaritalari
const rangMap = {
  red:    { border: "border-red-500/50",    hover: "hover:border-red-400",    bg: "bg-red-500/10",    text: "text-red-400",    glow: "hover:shadow-red-500/20" },
  yellow: { border: "border-yellow-500/50", hover: "hover:border-yellow-400", bg: "bg-yellow-500/10", text: "text-yellow-400", glow: "hover:shadow-yellow-500/20" },
  green:  { border: "border-green-500/50",  hover: "hover:border-green-400",  bg: "bg-green-500/10",  text: "text-green-400",  glow: "hover:shadow-green-500/20" },
  orange: { border: "border-orange-500/50", hover: "hover:border-orange-400", bg: "bg-orange-500/10", text: "text-orange-400", glow: "hover:shadow-orange-500/20" },
  amber:  { border: "border-amber-500/50",  hover: "hover:border-amber-400",  bg: "bg-amber-500/10",  text: "text-amber-400",  glow: "hover:shadow-amber-500/20" },
  purple: { border: "border-purple-500/50", hover: "hover:border-purple-400", bg: "bg-purple-500/10", text: "text-purple-400", glow: "hover:shadow-purple-500/20" },
}

// ═══════════════════════════════════════════════════════════════════════════════
// MÖSSBAUER MINI-SPEKTR (birikma kartasi ichida)
// ═══════════════════════════════════════════════════════════════════════════════
function MiniSpektr({ delta, deltaQ, H_hf, linewidth, color = "#14b8a6" }) {
  const points = useMemo(() => {
    const arr = []
    const vMin = -11, vMax = 11, steps = 240
    const numH = typeof H_hf === "string" ? parseFloat(H_hf) : H_hf

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      let abs = 0

      if (numH > 0.1) {
        // Zeeman sekstet (soddalashtirilgan, 57Fe)
        const g_g = 0.181, g_e = -0.103, muN = 0.315245
        const lines = [
          { me: -3/2, mg: -1/2, I: 3 },
          { me: -1/2, mg: -1/2, I: 2 },
          { me:  1/2, mg: -1/2, I: 1 },
          { me: -1/2, mg:  1/2, I: 1 },
          { me:  1/2, mg:  1/2, I: 2 },
          { me:  3/2, mg:  1/2, I: 3 },
        ]
        lines.forEach(l => {
          const x0 = delta + (l.me * g_e - l.mg * g_g) * muN * numH
          const hw = linewidth / 2
          abs += l.I / (1 + ((v - x0) / hw) ** 2)
        })
        abs /= 6
      } else if (deltaQ > 0.05) {
        // Dublet
        const positions = [delta - deltaQ / 2, delta + deltaQ / 2]
        positions.forEach(x0 => {
          const hw = linewidth / 2
          abs += 1 / (1 + ((v - x0) / hw) ** 2)
        })
        abs /= 2
      } else {
        // Singlet
        const hw = linewidth / 2
        abs = 1 / (1 + ((v - delta) / hw) ** 2)
      }

      arr.push({ v, y: Math.min(1, abs) })
    }
    return arr
  }, [delta, deltaQ, H_hf, linewidth])

  return (
    <svg viewBox="0 0 300 80" className="w-full h-16">
      {/* v = 0 chiziq */}
      <line x1="150" y1="10" x2="150" y2="70" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2"/>
      {/* Base line */}
      <line x1="10" y1="15" x2="290" y2="15" stroke="#4c1d95" strokeWidth="0.3"/>
      {/* Spektr */}
      <polyline
        points={points.map((p, i) => {
          const x = 10 + (i / points.length) * 280
          const y = 15 + p.y * 55 // transmissiya rejimi (past = maks yutish)
          return `${x},${y}`
        }).join(' ')}
        fill="none" stroke={color} strokeWidth="1.5"
      />
      {/* Delta marker */}
      <line x1={150 + (delta / 11) * 140} y1="8" x2={150 + (delta / 11) * 140} y2="72"
        stroke="#fbbf24" strokeWidth="0.4" strokeDasharray="1,2" opacity="0.7"/>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIRIKMA KARTASI — PREMIUM
// ═══════════════════════════════════════════════════════════════════════════════
function BirikmaKarta({ b }) {
  const c = rangMap[b.rang] || rangMap.purple

  return (
    <Link href={b.href}
      className={`group block bg-purple-900/40 border ${c.border} ${c.hover} rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${c.glow}`}>

      {/* HEADER — formula va rang */}
      <div className={`${c.bg} px-5 py-4 border-b ${c.border}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-lg ${c.text} group-hover:brightness-125 transition-all`}
              dangerouslySetInnerHTML={{__html: b.formulaHTML}}/>
            <p className="text-purple-300 text-xs mt-1">{b.iupac}</p>
            {b.commonName && (
              <p className="text-purple-400 text-[11px] italic mt-0.5">« {b.commonName} »</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="w-10 h-10 rounded-lg border border-white/20 shadow-inner"
              style={{background: b.perceivedHex}} title={b.color}/>
            <span className="text-purple-500 text-[9px] font-mono">{b.molarMass} g/mol</span>
          </div>
        </div>
      </div>

      {/* MÖSSBAUER PARAMETRLARI */}
      <div className="px-5 py-3 grid grid-cols-3 gap-2 text-center border-b border-purple-800/40">
        <div className="bg-purple-950/50 rounded-lg p-2">
          <p className="text-teal-400 text-[9px] uppercase tracking-wider">δ</p>
          <p className="text-white font-mono text-sm font-bold">{typeof b.delta === "number" ? b.delta.toFixed(2) : b.delta}</p>
          <p className="text-purple-500 text-[8px]">mm/s</p>
        </div>
        <div className="bg-purple-950/50 rounded-lg p-2">
          <p className="text-yellow-400 text-[9px] uppercase tracking-wider">ΔE_Q</p>
          <p className="text-white font-mono text-sm font-bold">{typeof b.deltaQ === "number" ? b.deltaQ.toFixed(2) : b.deltaQ}</p>
          <p className="text-purple-500 text-[8px]">mm/s</p>
        </div>
        <div className="bg-purple-950/50 rounded-lg p-2">
          <p className="text-emerald-400 text-[9px] uppercase tracking-wider">H_hf</p>
          <p className="text-white font-mono text-sm font-bold">{typeof b.H_hf === "number" ? (b.H_hf === 0 ? "0" : b.H_hf.toFixed(1)) : b.H_hf}</p>
          <p className="text-purple-500 text-[8px]">Tesla</p>
        </div>
      </div>

      {/* MINI SPEKTR */}
      <div className="px-5 py-2 bg-purple-950/30 border-b border-purple-800/40">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-[10px] font-bold ${c.text}`}>📊 {b.spektrTuri}</p>
          <p className="text-purple-500 text-[9px] font-mono">Γ = {b.linewidth} mm/s</p>
        </div>
        <MiniSpektr delta={typeof b.delta === "number" ? b.delta : parseFloat(b.delta)}
                    deltaQ={typeof b.deltaQ === "number" ? b.deltaQ : parseFloat(b.deltaQ)}
                    H_hf={b.H_hf} linewidth={b.linewidth}
                    color={b.rang === "red" ? "#ef4444" : b.rang === "yellow" ? "#eab308" :
                           b.rang === "green" ? "#22c55e" : b.rang === "orange" ? "#f97316" :
                           b.rang === "amber" ? "#f59e0b" : "#a855f7"}/>
        <div className="flex justify-between text-purple-500 text-[8px] font-mono">
          <span>−11</span><span>0</span><span>+11 mm/s</span>
        </div>
      </div>

      {/* KONFIGURATSIYA */}
      <div className="px-5 py-3 space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-purple-500 text-[9px] uppercase">Metall</span>
            <p className={`${c.text} font-bold`}>{b.metalCenter} <span className="text-purple-400 text-[10px]">({b.oksidlanish})</span></p>
          </div>
          <div>
            <span className="text-purple-500 text-[9px] uppercase">Spin</span>
            <p className="text-teal-300 font-semibold">{b.spin}</p>
          </div>
          <div>
            <span className="text-purple-500 text-[9px] uppercase">d-config</span>
            <p className="text-emerald-300 text-[11px]">{b.dConfig}</p>
          </div>
          <div>
            <span className="text-purple-500 text-[9px] uppercase">Term</span>
            <p className="text-yellow-300 text-[11px] font-serif italic">{b.groundTerm}</p>
          </div>
        </div>
        <div>
          <span className="text-purple-500 text-[9px] uppercase">Simmetriya</span>
          <p className="text-purple-200 text-[11px]">{b.structure}</p>
        </div>
        <div>
          <span className="text-purple-500 text-[9px] uppercase">Magnitizm</span>
          <p className="text-purple-200 text-[11px]">{b.magnetism}</p>
        </div>
      </div>

      {/* TAGLAR */}
      <div className="px-5 pb-4 flex flex-wrap gap-1">
        {b.tags.slice(0, 5).map((t, i) => (
          <span key={i} className={`text-[9px] px-2 py-0.5 rounded-full border ${c.border} ${c.text} bg-purple-950/40`}>
            {t}
          </span>
        ))}
      </div>

      {/* HOVER — batafsil */}
      <div className={`px-5 py-2 ${c.bg} border-t ${c.border} flex items-center justify-between text-xs`}>
        <span className={`${c.text} font-semibold`}>Batafsil tahlil</span>
        <span className={`${c.text} group-hover:translate-x-1 transition-transform`}>→</span>
      </div>
    </Link>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// δ vs ΔE_Q DIAGRAMMASI
// ═══════════════════════════════════════════════════════════════════════════════
function DeltaDeltaQDiagram() {
  // Mintaqalar (δ, ΔE_Q ma'lumot bazasi asosida)
  const mintaqalar = [
    { name: "Fe⁰",         x: -0.2, y: 0.0, w: 0.35, h: 3.0, color: "#f59e0b", op: 0.10 },
    { name: "Fe³⁺ LS",     x: -0.2, y: 0.0, w: 0.5,  h: 3.0, color: "#ef4444", op: 0.10 },
    { name: "Fe²⁺ LS",     x: -0.1, y: 0.0, w: 0.6,  h: 1.5, color: "#eab308", op: 0.10 },
    { name: "Fe³⁺ HS",     x: 0.25, y: 0.0, w: 0.4,  h: 0.9, color: "#f97316", op: 0.10 },
    { name: "Fe²⁺ HS",     x: 0.85, y: 1.5, w: 0.7,  h: 2.5, color: "#22c55e", op: 0.10 },
  ]

  // Birikmalar koordinatalarga
  const nuqtalar = birikmalar.map(b => {
    const dNum = typeof b.delta === "number" ? b.delta : parseFloat(b.delta)
    const qNum = typeof b.deltaQ === "number" ? b.deltaQ : parseFloat(b.deltaQ)
    return {
      slug: b.slug,
      formulaHTML: b.formulaHTML,
      commonName: b.commonName,
      delta: dNum,
      deltaQ: qNum,
      rang: b.rang,
      hexColor: rangMap[b.rang]?.text || "text-purple-400",
    }
  })

  // δ diapazoni: -0.4 ..... 1.7 (x)
  // ΔE_Q diapazoni: 0 ..... 3.5 (y)
  const xToPx = (d) => 55 + ((d + 0.4) / 2.1) * 420
  const yToPx = (q) => 340 - (q / 3.5) * 300

  return (
    <div className="bg-gradient-to-br from-teal-900/20 to-purple-900/30 border border-teal-700/40 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span>📊</span> δ vs ΔE<sub>Q</sub> — Fe holatlari xaritasi
      </h2>
      <p className="text-purple-300 text-sm mb-4">
        Har bir nuqta — birikma. Mintaqalar Fe oksidlanish darajasi va spin holatining tipik parametrlar oralig&apos;i.
      </p>

      <div className="bg-purple-950/50 rounded-xl p-4 overflow-x-auto">
        <svg viewBox="0 0 520 400" className="w-full min-w-[500px]" style={{minHeight: "380px"}}>
          {/* MINTAQALAR */}
          {mintaqalar.map((m, i) => (
            <g key={i}>
              <rect x={xToPx(m.x)} y={yToPx(m.y + m.h)}
                width={xToPx(m.x + m.w) - xToPx(m.x)}
                height={yToPx(m.y) - yToPx(m.y + m.h)}
                fill={m.color} opacity={m.op} rx="6"/>
              <text x={xToPx(m.x) + 5} y={yToPx(m.y + m.h) + 12}
                fill={m.color} fontSize="10" fontWeight="bold" opacity="0.8">{m.name}</text>
            </g>
          ))}

          {/* GRID va O'QLAR */}
          <line x1="55" y1="340" x2="475" y2="340" stroke="#a78bfa" strokeWidth="1.2"/>
          <line x1="55" y1="40"  x2="55"  y2="340" stroke="#a78bfa" strokeWidth="1.2"/>

          {[-0.4, 0, 0.4, 0.8, 1.2, 1.6].map(v => (
            <g key={v}>
              <line x1={xToPx(v)} y1="340" x2={xToPx(v)} y2="345" stroke="#a78bfa" strokeWidth="1"/>
              <line x1={xToPx(v)} y1="40"  x2={xToPx(v)} y2="340" stroke="#4c1d95" strokeWidth="0.3" strokeDasharray="2,3"/>
              <text x={xToPx(v)} y="358" fill="#c4b5fd" fontSize="10" textAnchor="middle">{v}</text>
            </g>
          ))}
          {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].map(v => (
            <g key={v}>
              <line x1="50" y1={yToPx(v)} x2="55" y2={yToPx(v)} stroke="#a78bfa" strokeWidth="1"/>
              <line x1="55" y1={yToPx(v)} x2="475" y2={yToPx(v)} stroke="#4c1d95" strokeWidth="0.3" strokeDasharray="2,3"/>
              <text x="45" y={yToPx(v) + 3} fill="#c4b5fd" fontSize="10" textAnchor="end">{v.toFixed(1)}</text>
            </g>
          ))}

          <text x="265" y="380" fill="#5eead5" fontSize="12" textAnchor="middle" fontWeight="bold">δ (mm/s) — izomer siljish (α-Fe ga nisbatan)</text>
          <text x="18" y="190" fill="#fde047" fontSize="12" textAnchor="middle" fontWeight="bold" transform="rotate(-90, 18, 190)">ΔE_Q (mm/s) — kvadrupol bo&apos;linishi</text>

          {/* NUQTALAR */}
          {nuqtalar.map((n, i) => {
            const fill = n.rang === "red" ? "#ef4444" : n.rang === "yellow" ? "#eab308" :
                         n.rang === "green" ? "#22c55e" : n.rang === "orange" ? "#f97316" :
                         n.rang === "amber" ? "#f59e0b" : "#a855f7"
            return (
              <g key={i}>
                {/* Halo */}
                <circle cx={xToPx(n.delta)} cy={yToPx(n.deltaQ)} r="10" fill={fill} opacity="0.25"/>
                {/* Asosiy nuqta */}
                <circle cx={xToPx(n.delta)} cy={yToPx(n.deltaQ)} r="5" fill={fill} stroke="white" strokeWidth="1.5"/>
                {/* Yorliq */}
                <text x={xToPx(n.delta) + 10} y={yToPx(n.deltaQ) - 6}
                  fill={fill} fontSize="9" fontWeight="bold">{n.commonName?.split(" ")[0] || `#${i+1}`}</text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* LEGENDA — mintaqalar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 text-[10px]">
        {mintaqalar.map((m, i) => (
          <div key={i} className="flex items-center gap-2 bg-purple-950/40 rounded px-2 py-1">
            <div className="w-3 h-3 rounded" style={{background: m.color, opacity: 0.6}}/>
            <span className="text-purple-200">{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAYANCH JADVAL — Fe holatlari uchun tipik δ va ΔE_Q
// ═══════════════════════════════════════════════════════════════════════════════
function TayanchJadval() {
  const qatorlar = [
    { holat: "Fe(0), d⁸ (18e⁻)",       delta: "−0.20 ÷ +0.05", deltaQ: "0.0 ÷ 2.6",  spektr: "Singlet / dublet", misol: "[Fe(CO)₅]", rang: "amber" },
    { holat: "Fe(II) LS, t₂g⁶",         delta: "−0.10 ÷ +0.50", deltaQ: "0.0 ÷ 1.0",  spektr: "Singlet",          misol: "K₄[Fe(CN)₆]", rang: "yellow" },
    { holat: "Fe(II) HS, t₂g⁴eg²",      delta: "+0.90 ÷ +1.50", deltaQ: "2.0 ÷ 3.5",  spektr: "Katta dublet",     misol: "[Fe(H₂O)₆]²⁺", rang: "green" },
    { holat: "Fe(III) LS, t₂g⁵",        delta: "−0.15 ÷ +0.30", deltaQ: "0.4 ÷ 3.0",  spektr: "Dublet",           misol: "K₃[Fe(CN)₆]", rang: "red" },
    { holat: "Fe(III) HS, d⁵",          delta: "+0.30 ÷ +0.60", deltaQ: "0.0 ÷ 0.8",  spektr: "Kichik dublet",    misol: "[Fe(H₂O)₆]³⁺", rang: "orange" },
    { holat: "Aralash Fe²⁺/Fe³⁺",       delta: "ikki komponent", deltaQ: "har xil",  spektr: "Ikki sekstet + H_hf", misol: "Fe₃O₄", rang: "purple" },
  ]

  return (
    <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span>📋</span> Tayanch jadval — Fe holatlarining tipik Mössbauer parametrlari
      </h2>
      <p className="text-purple-300 text-sm mb-4">Barcha qiymatlar α-Fe (RT) ga nisbatan, T = 295 K uchun tipik.</p>

      <div className="overflow-x-auto rounded-lg border border-purple-700/40">
        <table className="w-full text-xs min-w-[600px]">
          <thead className="bg-purple-950/60">
            <tr className="border-b border-teal-500/30">
              <th className="text-left p-3 text-yellow-400">Elektron holat</th>
              <th className="text-left p-3 text-teal-400">δ (mm/s)</th>
              <th className="text-left p-3 text-emerald-400">ΔE_Q (mm/s)</th>
              <th className="text-left p-3 text-cyan-400">Spektr shakli</th>
              <th className="text-left p-3 text-purple-400">Tipik misol</th>
            </tr>
          </thead>
          <tbody>
            {qatorlar.map((q, i) => {
              const c = rangMap[q.rang]
              return (
                <tr key={i} className={`border-b border-purple-800/40 hover:${c.bg} transition-colors`}>
                  <td className={`p-3 font-bold ${c.text}`}>{q.holat}</td>
                  <td className="p-3 font-mono text-white">{q.delta}</td>
                  <td className="p-3 font-mono text-white">{q.deltaQ}</td>
                  <td className="p-3 text-purple-200">{q.spektr}</td>
                  <td className="p-3 text-purple-300 font-mono text-[11px]">{q.misol}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-purple-400 text-[11px] mt-3 italic">
        💡 <strong>Manba:</strong> Gütlich, Bill, Trautwein (2011); Greenwood &amp; Gibb (1971); Menil (1985).
        Aniq qiymatlar ligand maydonining kuchi (spektrokimyoviy qator), koordinatsion soni, kristall
        panjarasi va haroratga bog&apos;liq — jadval faqat tayanch ma&apos;lumot beradi.
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function MossbauerBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")
  const [filter, setFilter] = useState("hammasi")

  // Filter va qidiruv
  const filtered = useMemo(() => {
    let results = birikmalar

    if (filter !== "hammasi") {
      if (filter === "fe0")      results = results.filter(b => b.oksidlanish === "0")
      else if (filter === "fe2") results = results.filter(b => b.metalCenter === "Fe²⁺")
      else if (filter === "fe3") results = results.filter(b => b.metalCenter === "Fe³⁺")
      else if (filter === "aralash") results = results.filter(b => b.oksidlanish.includes(","))
      else if (filter === "ls")  results = results.filter(b => b.spin.includes("LS") || b.spin === "S = 0")
      else if (filter === "hs")  results = results.filter(b => b.spin.includes("HS"))
      else if (filter === "singlet") results = results.filter(b => b.spektrTuri.toLowerCase().includes("singlet"))
      else if (filter === "dublet")  results = results.filter(b => b.spektrTuri.toLowerCase().includes("dublet"))
      else if (filter === "sekstet") results = results.filter(b => b.spektrTuri.toLowerCase().includes("sekstet"))
    }

    if (qidiruv.trim()) {
      const q = qidiruv.toLowerCase()
      results = results.filter(b =>
        b.formulaPlain.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        (b.commonName && b.commonName.toLowerCase().includes(q)) ||
        b.metalCenter.toLowerCase().includes(q) ||
        b.dConfig.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    return results
  }, [qidiruv, filter])

  // Statistika
  const stats = useMemo(() => ({
    total: birikmalar.length,
    fe0:  birikmalar.filter(b => b.oksidlanish === "0").length,
    fe2:  birikmalar.filter(b => b.metalCenter === "Fe²⁺").length,
    fe3:  birikmalar.filter(b => b.metalCenter === "Fe³⁺").length,
    aralash: birikmalar.filter(b => b.oksidlanish.includes(",")).length,
    ls:   birikmalar.filter(b => b.spin.includes("LS") || b.spin === "S = 0").length,
    hs:   birikmalar.filter(b => b.spin.includes("HS")).length,
    singlet: birikmalar.filter(b => b.spektrTuri.toLowerCase().includes("singlet")).length,
    dublet:  birikmalar.filter(b => b.spektrTuri.toLowerCase().includes("dublet")).length,
    sekstet: birikmalar.filter(b => b.spektrTuri.toLowerCase().includes("sekstet")).length,
  }), [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* HEADER */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 sticky top-0 bg-purple-950/80 backdrop-blur-md z-10">
        <Link href="/ilmiy/tahlil/mossbauer" className="text-purple-400 hover:text-purple-300 text-lg transition-colors">
          ← Mössbauer spektroskopiya
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-teal-400 flex items-center gap-2">
            ⚛️ Birikmalar katalogi — Mössbauer tahlili
          </h1>
          <p className="text-purple-400 text-xs">
            ⁵⁷Fe komplekslari · δ (izomer siljish) · ΔE<sub>Q</sub> (kvadrupol) · H<sub>hf</sub> (magnit)
          </p>
        </div>
        <div className="hidden md:flex gap-2 text-[10px]">
          <span className="bg-teal-600/20 text-teal-400 border border-teal-600/40 px-2 py-1 rounded-full">{birikmalar.length} birikma</span>
          <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/40 px-2 py-1 rounded-full">RT ma&apos;lumot</span>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-teal-900/40 via-purple-900/30 to-blue-900/40 border border-teal-500/40 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">⚛️</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-teal-400 mb-2">Kompleks birikmalar Mössbauer parametrlari</h2>
              <p className="text-purple-100 text-sm leading-relaxed">
                Ushbu katalog <strong className="text-teal-300">6 ta klassik ⁵⁷Fe kompleks birikma</strong>ning
                Mössbauer parametrlarini birlashtiradi: izomer siljish δ, kvadrupol bo&apos;linishi ΔE<sub>Q</sub>,
                giperkichik magnit maydon H<sub>hf</sub>, chiziq kengligi Γ. Har bir birikma uchun elektron
                konfiguratsiya (d<sup>n</sup>), term simvoli, koordinatsion simmetriya, spin holati (HS/LS),
                magnit xossalari, alternativ tahlil usullari va tarixiy kontekst berilgan.
              </p>
              <p className="text-purple-200 text-sm leading-relaxed mt-2">
                Barcha qiymatlar <strong className="text-yellow-300">α-Fe (RT)</strong> ga nisbatan mm/s da
                keltirilgan. Har birikma uchun haroratga bog&apos;liq (T = 4.2, 77, 295 K) parametrlar jadvali
                mavjud. Manba: peer-reviewed adabiyotlar (Gütlich, Greenwood, Menil).
              </p>
            </div>
          </div>
        </div>

        {/* STATISTIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
          <h3 className="text-yellow-400 font-bold text-sm mb-3 flex items-center gap-2">
            <span>📈</span> Katalog statistikasi
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            <div className="bg-teal-600/20 border border-teal-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-teal-400">{stats.total}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Jami</div>
            </div>
            <div className="bg-amber-600/20 border border-amber-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-amber-400">{stats.fe0}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Fe⁰</div>
            </div>
            <div className="bg-green-600/20 border border-green-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-green-400">{stats.fe2}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Fe²⁺</div>
            </div>
            <div className="bg-red-600/20 border border-red-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-red-400">{stats.fe3}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Fe³⁺</div>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-purple-400">{stats.aralash}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Aralash</div>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-blue-400">{stats.ls}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">LS</div>
            </div>
            <div className="bg-orange-600/20 border border-orange-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-orange-400">{stats.hs}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">HS</div>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-yellow-400">{stats.singlet}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Singlet</div>
            </div>
            <div className="bg-cyan-600/20 border border-cyan-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-cyan-400">{stats.dublet}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Dublet</div>
            </div>
            <div className="bg-pink-600/20 border border-pink-500/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-extrabold text-pink-400">{stats.sekstet}</div>
              <div className="text-purple-400 text-[9px] uppercase tracking-wider">Sekstet</div>
            </div>
          </div>
        </div>

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          {/* Qidiruv */}
          <div className="relative">
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="🔍 Qidirish: formula, IUPAC, ion, konfiguratsiya, tag (masalan: cn, HS, spinel, Prussian)..."
              className="w-full bg-purple-950/60 border border-purple-700/50 focus:border-teal-500/70 rounded-xl px-4 py-3 text-sm text-white placeholder-purple-500 outline-none transition-colors"
            />
            {qidiruv && (
              <button onClick={() => setQidiruv("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-sm">
                ✕
              </button>
            )}
          </div>

          {/* Filterlar */}
          <div className="flex flex-wrap gap-2">
            {filterTaglari.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  filter === f.key
                    ? "bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/30"
                    : `bg-purple-950/50 ${f.color} border-purple-700/40 hover:bg-purple-800/50`
                }`}>
                <span className="mr-1">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Natija hisobi */}
          <div className="text-purple-400 text-xs">
            <strong className="text-teal-400">{filtered.length}</strong> ta birikma topildi
            {qidiruv && <span className="ml-2 italic">&quot;{qidiruv}&quot; bo&apos;yicha</span>}
          </div>
        </div>

        {/* BIRIKMALAR GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(b => <BirikmaKarta key={b.id} b={b}/>)}
          </div>
        ) : (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-3">🔍</div>
            <p className="text-purple-300 text-lg">Hech qanday birikma topilmadi</p>
            <p className="text-purple-500 text-xs mt-2">Filterni o&apos;zgartiring yoki qidiruvni tozalang</p>
            <button onClick={() => { setQidiruv(""); setFilter("hammasi") }}
              className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm transition-colors">
              Filterlarni tozalash
            </button>
          </div>
        )}

        {/* δ vs ΔE_Q DIAGRAMMASI */}
        <DeltaDeltaQDiagram/>

        {/* TAYANCH JADVAL */}
        <TayanchJadval/>

        {/* HOLATLAR TA'RIFI */}
        <div className="bg-gradient-to-r from-teal-600/10 to-purple-600/10 border border-teal-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Nima uchun aynan bu 6 ta birikma?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-200">
            <div className="bg-purple-950/40 rounded-lg p-3">
              <p className="text-red-400 font-bold text-xs mb-1">1️⃣ K₃[Fe(CN)₆] — Fe(III) LS</p>
              <p className="text-[11px]">Kuchli maydon CN⁻ ning ta&apos;siri, LS holatning klassik dublet spektri va manfiy δ ning misoli.</p>
            </div>
            <div className="bg-purple-950/40 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-1">2️⃣ K₄[Fe(CN)₆] — Fe(II) LS</p>
              <p className="text-[11px]">t₂g⁶ sferik simmetriya ⇒ ΔE_Q = 0 ning mukammal namunasi. Singletning oltin standarti.</p>
            </div>
            <div className="bg-purple-950/40 rounded-lg p-3">
              <p className="text-green-400 font-bold text-xs mb-1">3️⃣ [Fe(H₂O)₆]²⁺ — Fe(II) HS</p>
              <p className="text-[11px]">t₂g⁴eg² ning katta EFG i, δ~1.4, ΔE_Q~3.2 — d-elektron asimmetriyaning maksimal ta&apos;siri.</p>
            </div>
            <div className="bg-purple-950/40 rounded-lg p-3">
              <p className="text-orange-400 font-bold text-xs mb-1">4️⃣ [Fe(H₂O)₆]³⁺ — Fe(III) HS</p>
              <p className="text-[11px]">d⁵ yarim-to&apos;lgan holat, sferik simmetriya, kichik ΔE_Q — Fe(III) HS ning yetakchi mezoni.</p>
            </div>
            <div className="bg-purple-950/40 rounded-lg p-3">
              <p className="text-amber-400 font-bold text-xs mb-1">5️⃣ [Fe(CO)₅] — Fe(0) 18e⁻</p>
              <p className="text-[11px]">Ekstremal past δ (π-back-bonding), D₃ₕ simmetriya intrinsik ΔE_Q beradi. Metallorganik klassik.</p>
            </div>
            <div className="bg-purple-950/40 rounded-lg p-3">
              <p className="text-purple-400 font-bold text-xs mb-1">6️⃣ Fe₃O₄ — Aralash valent</p>
              <p className="text-[11px]">Ferrimagnit sekstet, ikki (RT) yoki uch (Verwey pastida) komponent, H_hf ~49 T. Xoreografik.</p>
            </div>
          </div>
        </div>

        {/* ADABIYOTLAR */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-2xl p-6">
          <h3 className="text-teal-400 font-bold mb-3 flex items-center gap-2">
            <span>📚</span> Manba adabiyotlar
          </h3>
          <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside">
            <li><strong>P. Gütlich, E. Bill, A. X. Trautwein</strong> — <em>Mössbauer Spectroscopy and Transition Metal Chemistry: Fundamentals and Applications</em>. Springer, 2011.</li>
            <li><strong>N. N. Greenwood, T. C. Gibb</strong> — <em>Mössbauer Spectroscopy</em>. Chapman &amp; Hall, London, 1971 (klassik ma&apos;lumotnoma).</li>
            <li><strong>F. Menil</strong> — Systematic trends of the ⁵⁷Fe Mössbauer isomer shifts. <em>J. Phys. Chem. Solids</em> <strong>46</strong>, 763 (1985).</li>
            <li><strong>G. J. Long (ed.)</strong> — <em>Mössbauer Spectroscopy Applied to Inorganic Chemistry</em>, Vol. 1–3, Plenum Press.</li>
            <li><strong>M. D. Dyar, D. G. Agresti et al.</strong> — Mössbauer spectroscopy of Earth and planetary materials. <em>Ann. Rev. Earth Planet. Sci.</em> <strong>34</strong>, 83 (2006).</li>
            <li><strong>R. H. Herber (ed.)</strong> — <em>Chemical Mössbauer Spectroscopy</em>. Plenum Press, 1984.</li>
            <li><strong>G. Klingelhöfer et al.</strong> — MIMOS-II Mars Rover Mössbauer results. <em>J. Geophys. Res.</em> <strong>108</strong>, 8067 (2003).</li>
          </ul>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer"
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all hover:border-purple-400 flex items-center gap-2">
            <span>←</span>
            <div className="text-left">
              <div className="text-[10px] text-purple-400">Umumiy nazariya:</div>
              <div className="font-bold">Mössbauer spektroskopiya</div>
            </div>
          </Link>
          <Link href="/ilmiy/tahlil"
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-teal-500/30">
            <div className="text-right">
              <div className="text-[10px] text-teal-100">Barcha:</div>
              <div>Tahlil usullari</div>
            </div>
            <span>→</span>
          </Link>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/50 mt-12 py-6 px-6 text-center">
        <p className="text-purple-400 text-xs">
          <strong className="text-teal-400">jdakimyo.uz</strong> — o&apos;zbek tilida ilmiy kompleks birikmalar platformasi
        </p>
        <p className="text-purple-500 text-[10px] mt-1">
          Mössbauer spektroskopiyasi · Birikmalar katalogi · {birikmalar.length} ta ⁵⁷Fe kompleks
        </p>
      </footer>
    </main>
  )
}
