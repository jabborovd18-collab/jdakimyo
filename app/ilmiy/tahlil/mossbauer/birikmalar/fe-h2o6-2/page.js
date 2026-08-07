"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(H₂O)₆]²⁺ — MÖSSBAUER SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • Gütlich P., Bill E., Trautwein A.X. — Mössbauer Spectroscopy and Transition
//     Metal Chemistry: Fundamentals and Applications (Springer, 2011)
//   • Greenwood N.N., Gibb T.C. — Mössbauer Spectroscopy (Chapman & Hall, 1971)
//   • Ingalls R. — Phys. Rev. 133, A787 (1964) — ΔE_Q(T) modeli, Fe(II) HS uchun
//   • Menil F. — J. Phys. Chem. Solids 46, 763 (1985)
//   • Kerler W. — Z. Physik 173, 321 (1963) — FeSO₄·7H₂O Mössbauer
//   • Hanna S.S. — Phys. Rev. Lett. 4, 177 (1960) — ⁵⁷Fe birinchi Mössbauer
//   • Herber R.H. (ed.) — Chemical Mössbauer Spectroscopy (Plenum, 1984)
// Xususiyat: Fe(II) HS ning ALTIN STANDARTI — δ ≈ 1.4, ΔE_Q ≈ 3.2 mm/s ekstremumlar
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
  formulaPlain: "[Fe(H2O)6]2+",
  iupac: "Geksaakvatemir(II) ioni",
  commonName: "Temir(II) akvakompleks (och yashil-havorang)",
  parentCompound: "FeSO₄·7H₂O (Melanterit — mineral shakli)",
  molarMass: 161.99,
  molarMassParent: 278.02,
  casNumber: "15365-81-8 (ion)",
  casParent: "7782-63-0 (FeSO₄·7H₂O)",
  color: "och yashil-havorang (tuz shaklida), suvli eritma och yashil",
  structure: "Oktaedr (Oh, tri-gonal buzilgan)",
  metalLigand: "Fe–OH₂",
  spaceGroup: "P2₁/c (Melanterit — monoklinik)",
  crystalSystem: "Monoklinik (FeSO₄·7H₂O)",
  pointGroup: "D₃d (real) / Oh (ideal)",
  bondLengthFeO: "2.12 Å (o'rtacha; 2 uzun + 4 qisqa — Jahn-Teller emas, trigonal)",
  bondLengthOH: "0.98 Å (H₂O)",
  bondAngle: "89−91° (biroz buzilgan)",
  cfseValue: "-0.4 Δo (t₂g⁴ eg² — kichik CFSE)",
  deltaOh: "10 400 cm⁻¹ (~124 kJ/mol) — H₂O kuchsiz maydon",
  pairingEnergy: "~17 600 cm⁻¹ (P > Δo → HS)",
  spinState: "d⁶ yuqori spin (t₂g⁴ eg²) — 4 yakka, 2 juftlangan",
  spin: "S = 2 (paramagnit)",
  magnet: "Paramagnit (μ_eff = 5.10−5.40 μB, spin+orbital hissa)",
  solubility: "FeSO₄·7H₂O: 260 g/L (20°C) — yaxshi eriydi",
  aciditypH: "pH ≈ 4−5 (kuchsiz kislotali)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// MÖSSBAUER PARAMETRLARI — batafsil ilmiy izohlar bilan
// ═══════════════════════════════════════════════════════════════════════════════
const mossbauerParams = [
  {
    param: "δ", paramName: "Izomer siljish",
    value: "+1.39", unit: "mm/s",
    reference: "α-Fe (RT) ga nisbatan — Fe(II) HS ning ENG YUQORI qiymatlaridan",
    physicalMeaning: "Yadro va s-elektron zichligining elektrostatik o'zaro ta'siri — |ψ(0)|² ga to'g'ri proporsional",
    formula: "δ = (2π/3)Ze²[|ψ_A(0)|² − |ψ_S(0)|²](ΔR/R)",
    diagnostic: "Fe²⁺ HS uchun tayanch (+0.90 ÷ +1.50 mm/s diapazoni)",
    interpretation: "Yuqori musbat δ — |ψ(0)|² PAST — Fe(II) HS ning 6 ta d-elektroni 4s ni kuchli ekranlaydi",
    intensity: "Juda muhim", intensityCode: 4,
    freeIon: "Fe²⁺(gaz): ~+1.9 mm/s (ekstrapolyatsiya); kompleksda −0.5 mm/s siljish",
    coordShift: "H₂O kuchsiz maydon + ion bog'lanish → δ maksimalga yaqin (+1.4)",
    theoryNote: "[Fe(H₂O)₆]²⁺ da δ = +1.39 mm/s — bu Fe(II) HS holatning butun kimyoda ENG YUQORI qiymatlaridan biri. Sabab: (1) H₂O — KUCHSIZ maydon ligand (Δo ≈ 10 400 cm⁻¹ < P ≈ 17 600) → HS holat majburiy; (2) HS d⁶ konfiguratsiya (t₂g⁴ eg²) — 6 ta d-elektronning barchasi mavjud (4 t₂g + 2 eg), bu 3d qatlam 4s orbitalni maksimal ekranlaydi; (3) Fe–O bog'lanish asosan IONLI (kovalent ulush kichik) — 4s ga elektron donatsiya minimal; (4) π-back-donation YO'Q (H₂O π-akseptor emas). Barcha omillar |ψ(0)|² ni PASAYTIRADI → δ yuqori. Bu δ K₃[Fe(CN)₆] (−0.12) dan 1.51 mm/s yuqori, K₄[Fe(CN)₆] (−0.04) dan 1.43 mm/s yuqori — Mössbauer skalada eng katta o'zgarishlardan biri.",
    tag: "isomerShift"
  },
  {
    param: "ΔE_Q", paramName: "Kvadrupol bo'linishi",
    value: "+3.19", unit: "mm/s",
    reference: "T = 295 K — Fe(II) HS uchun ENG KATTA qiymatlaridan",
    physicalMeaning: "Yadroning kvadrupol momenti Q va elektr maydon gradienti (EFG) o'zaro ta'siri",
    formula: "ΔE_Q = ½·e·Q·V_zz·√(1 + η²/3);  V_val ≈ +4/7·<r⁻³>·e",
    diagnostic: "t₂g⁴ eg² — DEYARLI MAKSIMAL EFG (bitta t₂g yakka o'ldirilmagan) — Fe(II) HS diagnostikasi",
    interpretation: "V_val yuqori (t₂g asimmetrik) + V_lat kichik → JUDA KATTA dublet",
    intensity: "Juda muhim", intensityCode: 4,
    freeIon: "Fe(II) HS: 2.0 − 3.5 mm/s (jahonda eng katta d–d parametrlaridan)",
    coordShift: "Ideal HS d⁶ — t₂g⁴ (4 elektron 3 orbitalda asimmetrik taqsimlangan)",
    theoryNote: "[Fe(H₂O)₆]²⁺ ning ΔE_Q ≈ +3.2 mm/s — Fe(II) HS ning KLASSIK qiymati va Mössbauer da uchraydigan ENG KATTA d-d parametrlaridan biri. Fizik sabab: HS d⁶ konfiguratsiyada 4 ta elektron t₂g (dxy, dxz, dyz) uchta orbitalga tarqalgan, bittasida QO'SHIMCHA elektron — asimmetrik zaryad taqsimoti. Bu nolga teng bo'lmagan V_val = +4/7·<r⁻³>·e beradi (belgi MUSBAT — <3z²−r²> chizmali ustunlik). Bunga qo'shimcha, ⁵⁷Fe uchun Q = +0.16 barn (musbat), shuning uchun ΔE_Q juda katta chiqadi. Aksincha: Fe(III) HS (d⁵ sferik) uchun V_val ≈ 0, ΔE_Q < 0.5. Fe(II) LS (t₂g⁶ sferik) uchun ham V_val = 0, ΔE_Q = 0. Faqat Fe(II) HS bu ekstremum qiymatni beradi.",
    tag: "quadrupole"
  },
  {
    param: "ΔE_Q(T)", paramName: "Haroratga bog'liqlik",
    value: "3.19 → 2.95", unit: "mm/s (295→400 K)",
    reference: "Ingalls modeli — HS Fe(II) uchun klassik",
    physicalMeaning: "T² qonuni bilan qisqarishi: yuqori t₂g pod-holatlarning Boltzmann populatsiyasi",
    formula: "ΔE_Q(T) = ΔE_Q(0) · F(T/Δ), Δ = t₂g bo'linishi",
    diagnostic: "ΔE_Q(T) egri chizig'i Fe(II) HS uchun UNIKAL — buzilish parametri Δ ni beradi",
    interpretation: "T oshsa yuqori t₂g orbital populatsiyalanadi → asimmetriya kamayadi → ΔE_Q pasayadi",
    intensity: "Nozik parametr", intensityCode: 3,
    freeIon: "Fe(II) HS: ΔΔE_Q ≈ 0.4-0.6 mm/s (RT→400 K)",
    coordShift: "trigonal buzilish (2 uzun + 4 qisqa Fe–O) → Δ ≈ 500 cm⁻¹",
    theoryNote: "Fe(II) HS ning ΔE_Q qattiq HARORATGA BOG'LIQ — bu R. Ingalls (1964) tomonidan izohlangan. Sabab: HS d⁶ da t₂g pod-qatlam koordinatsion muhit tomonidan biroz bo'linadi (trigonal yoki tetragonal buzilish, Δ ≈ 500 cm⁻¹). Past T da (T « Δ/k_B) faqat eng past t₂g orbital to'lgan → maksimal asimmetriya → ΔE_Q maksimal. Yuqori T da (T » Δ/k_B) barcha 3 t₂g orbital teng populatsiyalangan → sferik → ΔE_Q → 0. Bu 'ΔE_Q(T)' egri chizig'i quyidagi ma'lumotni beradi: (a) buzilish parametri Δ (t₂g bo'linishi), (b) buzilish yo'nalishi (trigonal vs tetragonal), (c) η asimmetriya parametri. [Fe(H₂O)₆]²⁺ uchun 4.2 K → RT o'zgarishi ~0.11 mm/s, bu Δ ≈ 400-500 cm⁻¹ ga mos.",
    tag: "temperature"
  },
  {
    param: "H_hf", paramName: "Giperkichik magnit maydon",
    value: "0 → ~24 T", unit: "Tesla (T)",
    reference: "RT: 0 T; 4.2 K + 9T tashqi: ~24 T induced",
    physicalMeaning: "Yadro spini I ning ichki magnit maydonda Zeeman parchalanishi",
    formula: "H_hf = H_F + H_L + H_D + H_dip + H_ext;  Fe(II) HS: |H_F| ≈ 15-25 T",
    diagnostic: "Paramagnit — RT da sekstet YO'Q; past T + tashqi maydonda sekstet",
    interpretation: "S=2 katta spin, lekin tez relaksatsiya → RT da nol; 4.2 K da spin qamashadi",
    intensity: "Muhim", intensityCode: 3,
    freeIon: "Fe(II) HS teoretik: H_F ≈ −20 dan −25 T (spin S=2 uchun)",
    coordShift: "H₂O ligand — spin relaksatsiya tez, 4.2 K da sekinlashadi",
    theoryNote: "[Fe(H₂O)₆]²⁺ paramagnit (S = 2), lekin RT da elektron spin relaksatsiyasi juda tez (τ_e ≈ 10⁻¹¹ s), Larmor davri (10⁻⁸ s) dan qisqa. Shuning uchun yadro o'rtacha NOL maydon 'ko'radi' va sekstet ko'rinmaydi. Ammo bir necha sharoitda H_hf paydo bo'ladi: (1) T &lt; 5 K + katta suyultirish (spin-spin interaction zaif) — sekin relaksatsiya, sekstet paydo bo'ladi; (2) Tashqi qo'llangan maydon (5-9 T superkonduktivli magnit) — S=2 elektron spinlari qamashadi (spin-orbit kuchi ostida), induced H_hf ≈ 20-25 T ko'rinadi; (3) 'Applied field' Mössbauer o'lchovlari V_zz belgi va η asimmetriya parametrini aniqlashda muhim. FeSO₄·7H₂O 4.2 K + 9 T da tashqi maydon o'lchovlarida H_hf(induced) ≈ 24 T topilgan (Chappert 1972).",
    tag: "magnetic"
  },
  {
    param: "Γ", paramName: "Chiziq kengligi (FWHM)",
    value: "0.30", unit: "mm/s",
    reference: "T = 77 K, ⁵⁷Co/Rh manba",
    physicalMeaning: "Tabiiy chiziq kengligi + jihoz + spin relaksatsiya kengayishi",
    formula: "Γ_exp = Γ_manba + Γ_absorbent + Γ_geom + Γ_relax",
    diagnostic: "Γ ≈ 3.1·Γ_nat — spin-fluktuatsiya kengayishi (paramagnit)",
    interpretation: "Diamagnit K₄ (0.24) dan biroz keng — spin-spin ta'sirlashuv",
    intensity: "Sifat ko'rsatkichi", intensityCode: 3,
    freeIon: "Γ_nat(⁵⁷Fe) = 0.097 mm/s (Heisenberg limiti)",
    coordShift: "Yaxshi kristallik FeSO₄·7H₂O uchun 0.28-0.32 mm/s",
    theoryNote: "[Fe(H₂O)₆]²⁺ (FeSO₄·7H₂O sifatida) uchun Γ ≈ 0.30 mm/s (77 K) — Heisenberg limitidan 3.1× keng. Bu K₄[Fe(CN)₆] (0.24 mm/s) dan biroz kattaroq, sabablari: (1) PARAMAGNIT (S=2) — spin fluktuatsiyalari yadro chizig'ini biroz kengaytiradi; (2) H₂O ligandlarning dinamik xarakteri — kristall panjarada suv molekulalari aylanishi. Ammo Γ hanuz mesuradlar uchun etarli darajada tor. RT da Γ biroz kengroq (0.32 mm/s) — termik effekt va SOD. 4.2 K da eng tor (Γ ≈ 0.28 mm/s) — termik jarayonlar sekinlashadi.",
    tag: "linewidth"
  },
  {
    param: "f_LM", paramName: "Lamb–Mössbauer omili",
    value: "0.65 (77 K), 0.35 (RT)", unit: "(o'lchamsiz)",
    reference: "FeSO₄·7H₂O, θ_D ≈ 280 K",
    physicalMeaning: "Recoil-free rezonans yutish ehtimoli",
    formula: "f_LM = exp[−(6E_R/k_Bθ_D)(¼ + (T/θ_D)²·π²/6)]",
    diagnostic: "f > 0.3 — o'lchov mumkin; 7 ta H₂O kristall panjarani kuchsizlashtiradi",
    interpretation: "Melanterit — nozik kristall (7 ta H₂O molekulasi), θ_D past-o'rtacha",
    intensity: "O'lchov sharti", intensityCode: 2,
    freeIon: "Suv eritma: f = 0 (rezonans YO'Q — muzlagan holat kerak)",
    coordShift: "Muzlagan suvli eritma (77 K) yoki qattiq tuz — Mössbauer mumkin",
    theoryNote: "FeSO₄·7H₂O da f_LM K₃/K₄ dan pastroq (0.65 vs 0.72-0.78 pri 77 K) — bu 7 ta kristall suvi tufayli panjaraning nisbatan yumshoq bo'lishi. θ_D ≈ 280 K — o'rtacha qattiq kristall. RT da f = 0.35 hali ham mesuralarga imkon beradi. AGAR namuna dehidrat qilingan bo'lsa (FeSO₄, bezsuv), θ_D oshadi (~380 K) va f ham oshadi, ammo panjara buzilib δ va ΔE_Q o'zgaradi. Suvli ERITMA — Mössbauer ishlamaydi (f=0). Faqat MUZLAGAN eritma (77 K yoki past) yoki qattiq kristallda kuzatiladi. Bu Fe(II) HS tabiiy suv sistemalarini o'rganishning eng mashaqqatli tomonidir.",
    tag: "lambMossbauer"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HARORATGA BOG'LIQ PARAMETRLAR (T = 4.2, 77, 295, 400 K)
// ═══════════════════════════════════════════════════════════════════════════════
const tempData = [
  { T: 4.2,  delta: 1.44, deltaQ: 3.30, H_hf: "0 (0T) / 24 (9T)", fLM: 0.88, gamma: 0.28, izoh: "LHe — ΔE_Q maksimal (t₂g eng past holat)" },
  { T: 20,   delta: 1.43, deltaQ: 3.29, H_hf: 0,                  fLM: 0.86, gamma: 0.28, izoh: "Past T — deyarli barcha t₂g eng past" },
  { T: 77,   delta: 1.42, deltaQ: 3.28, H_hf: 0,                  fLM: 0.65, gamma: 0.30, izoh: "LN₂ standart — Fe(II) HS ideal shart" },
  { T: 200,  delta: 1.40, deltaQ: 3.24, H_hf: 0,                  fLM: 0.48, gamma: 0.30, izoh: "Oraliq T — Boltzmann boshlanadi" },
  { T: 295,  delta: 1.39, deltaQ: 3.19, H_hf: 0,                  fLM: 0.35, gamma: 0.31, izoh: "Xona harorati — standart adabiyot qiymati" },
  { T: 400,  delta: 1.36, deltaQ: 2.95, H_hf: 0,                  fLM: 0.15, gamma: 0.36, izoh: "Yuqori T — 7H₂O yo'qolish boshi, ΔE_Q pasayadi" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AKVAKOMPLEKSLAR QATORI — Fe(II)/Fe(III) taqqoslash
// ═══════════════════════════════════════════════════════════════════════════════
const aquaSeries = [
  { formula: "[Fe(H₂O)₆]²⁺",      trad: "Fe(II) akva HS",  color: "och yashil",       delta: "+1.39", deltaQ: "3.19", spektr: "KATTA dublet",   spin: "S=2 HS",    oxid: "+2", current: true,  ionRadius: "0.83 Å (HS)" },
  { formula: "[Fe(H₂O)₆]³⁺",      trad: "Fe(III) akva HS", color: "och binafsha",     delta: "+0.48", deltaQ: "0.15", spektr: "Kichik dublet",  spin: "S=5/2 HS",  oxid: "+3", current: false, ionRadius: "0.65 Å (HS)" },
  { formula: "K₄[Fe(CN)₆]",        trad: "Sariq qon tuzi",  color: "sariq",            delta: "−0.04", deltaQ: "0.00", spektr: "SINGLET",        spin: "S=0 LS",    oxid: "+2", current: false, ionRadius: "0.61 Å (LS)" },
  { formula: "K₃[Fe(CN)₆]",        trad: "Qizil qon tuzi",  color: "ruby-qizil",       delta: "−0.12", deltaQ: "0.28", spektr: "Dublet",         spin: "S=1/2 LS",  oxid: "+3", current: false, ionRadius: "0.55 Å (LS)" },
  { formula: "[Fe(NH₃)₆]²⁺",       trad: "Fe(II) ammin HS", color: "quyuq yashil",     delta: "+1.25", deltaQ: "2.30", spektr: "Katta dublet",   spin: "S=2 HS",    oxid: "+2", current: false, ionRadius: "0.83 Å" },
  { formula: "FeSO₄·7H₂O",         trad: "Melanterit",      color: "yashil-havorang",  delta: "+1.39", deltaQ: "3.19", spektr: "Katta dublet",   spin: "S=2 HS",    oxid: "+2", current: false, ionRadius: "kristall shakli" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// NAMUNA TAYYORLASH USULLARI — Fe(II) HS uchun MAXSUS
// ═══════════════════════════════════════════════════════════════════════════════
const techniques = [
  {
    name: "FeSO₄·7H₂O (Melanterit) poroshok",
    description: "Eng oddiy va standart usul. Yangi tayyorlangan FeSO₄·7H₂O kristallari 20−40 mg⁵⁷Fe/cm² tabletka sifatida bosiladi. Havodan izolatsiya majburiy (glove-box yoki argon oqim).",
    advantages: ["Klassik standart namuna (1958-yildan)", "Barqaror kristall (T < 50 °C)", "Aniq spektroskopik parametrlar", "Kalibrlash uchun ideal (Fe(II) HS uchun)"],
    disadvantages: ["Havoda tez oksidlanadi (Fe²⁺ → Fe³⁺, jangalanish)", "T > 60 °C — suv yo'qotish", "Argon atmosfera majburiy", "Fresh namuna kerak (1 hafta ichida)"],
    bestFor: "Standart Fe(II) HS o'lchov, spektrometr kalibrlash, referens qiymatlar",
    freqRange: "±5 mm/s (RT), ±10 mm/s (past T)", resolution: "0.28−0.32 mm/s", samplePrep: "15−30 daq + glove-box"
  },
  {
    name: "Muzlagan suvli eritma (froznen aqua)",
    description: "0.5−1.0 M FeSO₄ suvli eritma tez muzlash (LN₂ da tomchi tashlash — snap freeze). Bu suvli eritma [Fe(H₂O)₆]²⁺ ni to'g'ridan-to'g'ri o'rganishga imkon beradi.",
    advantages: ["ERITMA holatida Fe(II) HS to'g'ridan-to'g'ri", "In vivo simulatsiya (biologik sharoit)", "pH nazorati oson", "Aralashmalar yo'q (toza akvaion)"],
    disadvantages: ["Faqat past T (T < 77 K)", "f_LM past (~0.4, 77 K)", "Muz kristalligi anizotropiya beradi", "Uzoq o'lchov vaqti (24−72 soat)"],
    bestFor: "Biologik model, biokimyoviy Fe(II), Fe-metaloproteinlar prekursorlari",
    freqRange: "±5 mm/s", resolution: "0.32 mm/s", samplePrep: "5 daq muzlash + 24 soat o'lchov"
  },
  {
    name: "Katta bir kristall (Melanterit)",
    description: "FeSO₄·7H₂O tabiiy yoki laboratoriyada o'stirilgan bir kristall (o'lcham > 3 mm). Kristallografik yo'nalish bo'yicha anizotropik o'lchov.",
    advantages: ["V_zz tenzor yo'nalishi aniqlanadi", "η asimmetriya parametri to'g'ridan-to'g'ri", "Goldanskii–Karyagin effekti", "Kristall dinamikasi (f_LM anizotropiya)"],
    disadvantages: ["Katta kristall o'stirish 2−4 hafta", "Aniq orientatsiya goniometr bilan", "Yorug'lik va havoga sezgir", "Rezolyutsiya 0.5° tartibida"],
    bestFor: "Fundamental tadqiqot, kristall dinamika, EFG tenzor yo'nalishi",
    freqRange: "±5 mm/s", resolution: "0.28 mm/s", samplePrep: "2−4 hafta (kristall) + 12−24 soat"
  },
  {
    name: "Tashqi maydon Mössbauer (Applied field MS)",
    description: "Namuna superkonduktivli magnit hujrasiga qo'yiladi (5−9 T tashqi maydon), 4.2 K da o'lchov olinadi. S=2 spin qamashadi, induced H_hf ~24 T ko'rinadi.",
    advantages: ["V_zz belgi aniqlanadi (musbat/manfiy)", "η asimmetriya parametri", "Induced H_hf spin dinamikasi", "Fe(II) HS ning to'liq elektron strukturasi"],
    disadvantages: ["Maxsus jihoz kerak (superkonduktivli magnit + LHe)", "Juda qimmat (~$500K)", "Faqat past T (T < 5 K)", "O'lchov vaqti 3−7 kun"],
    bestFor: "Fundamental fizika, EFG tenzor, spin dinamika",
    freqRange: "±15 mm/s (magnit hisoblab)", resolution: "0.28 mm/s", samplePrep: "1 hafta"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR — Fe(II) HS SPETSIFIK
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  { source: "Fe(II) → Fe(III) OKSIDLANISHI (eng katta muammo!)", freqRange: "K₃ o'xshash dublet paydo bo'ladi", effect: "Havoda O₂ + H₂O ta'sirida Fe²⁺ → Fe³⁺ oksidlanadi (yashildan qora-jangaligacha). Spektrda ikki komponent: Fe(II) HS (δ=1.39, ΔE_Q=3.19) va Fe(III) HS (δ=0.48, ΔE_Q~0.15) hosil bo'ladi. Bir necha kunda 50% Fe(III) ga o'tishi mumkin!", severity: "Yuqori", solution: "MAJBURIY: Glove-box (Ar/N₂ atmosfera, O₂ < 1 ppm). Freshli sintez (2−7 kun ichida ishlatish). Askorbin kislotasi qo'shish (reduktant). Namunani polimer folga bilan qoplash. Fit ikki komponent bilan va Fe(III) ulushini kuzatib borish (agar > 5% — namuna toza emas)." },
  { source: "Trigidrat/geptagidrat suvining yo'qotilishi", freqRange: "Butun spektr o'zgaradi", effect: "FeSO₄·7H₂O → FeSO₄·H₂O (T > 60 °C) → FeSO₄ (T > 200 °C) o'tganda δ va ΔE_Q keskin o'zgaradi. Bezsuv FeSO₄: δ=1.29, ΔE_Q=2.60 (7H₂O dan 0.6 mm/s farq!)", severity: "Yuqori", solution: "T < 40 °C da saqlash. Vakuumdan qochish. TGA (termogravimetriya) bilan suv miqdorini nazorat qilish. Xona sharoitida saqlash (nam havo 50−70% RH). Muzlagan holat (77 K) da saqlash mumkin." },
  { source: "Ikkinchi darajali Doppler siljish (SOD)", freqRange: "δ ga qo'shimcha (T-bog'liq)", effect: "Fe(II) HS uchun SOD katta: ~−3·10⁻⁴ mm/s/K (K₃ dan 20% kattaroq, chunki termik tebranish yuqori). RT dan 400 K gacha δ 0.03 mm/s ga siljydi.", severity: "O'rta", solution: "Aniq harorat nazorati (±0.5 K). Barcha spektrlarni bir T da olish. SOD tuzatishni qo'llash: δ_true = δ_obs + <v²>/2c. Debye modeli bilan hisoblash (θ_D ≈ 280 K)." },
  { source: "ΔE_Q(T) — Ingalls effekti (Fe(II) HS ga xos!)", freqRange: "ΔE_Q qattiq T-bog'liq", effect: "Fe(II) HS ning ΔE_Q(T) t₂g pod-qatlam Boltzmann bo'linishi bilan qisqaradi. 4.2 K da 3.30 → RT da 3.19 → 400 K da 2.95 (0.35 mm/s farq!)", severity: "O'rta", solution: "Bu HALAQIT emas, balki INFORMATSIYA! ΔE_Q(T) egri chizig'idan trigonal buzilish parametri Δ ≈ 400−500 cm⁻¹ ni chiqarish mumkin. Barcha T ni bir spektrometrda o'lchash (sistematik xato bir xil). Ingalls modelini qo'llash." },
  { source: "Spin-spin relaksatsiya kengayishi", freqRange: "Γ oshadi", effect: "Kontsentrlangan Fe(II) namuna (Fe−Fe masofa < 0.5 nm) spin-spin ta'sirlashadi → chiziq kengayadi (Γ 0.30 → 0.40+). Suyultirilgan tuzda (Zn(H₂O)₆ da Fe suyultirilgan) chiziq torroq.", severity: "Past", solution: "Suyultirish (Fe:Zn = 1:100 masalan, ZnSO₄·7H₂O da). Namunani muzlatilgan eritma sifatida tayyorlash. Past T da o'lchash (spin relaksatsiya sekinlashadi)." },
  { source: "Kalibrlash xatosi (v shkalasi)", freqRange: "δ va ΔE_Q ga siljish", effect: "α-Fe folga kalibrlash to'g'ri bo'lmasa, ΔE_Q ~3.2 kabi katta qiymatlar 5−10% xato beradi (0.15−0.30 mm/s!)", severity: "Yuqori", solution: "Har o'lchovda 25 µm α-Fe folga bilan kalibrlash. Sekstet oralig'i 10.657 mm/s ekanligini tekshirish. FeSO₄·7H₂O bilan ikkinchi kalibrlash (δ = 1.39 tekshirish). Vibrator amplitudasi to'g'ri bo'lishi." },
  { source: "Anizotropiya (bir kristall)", freqRange: "Chiziq intensivligi 1:1 emas", effect: "Bir kristall yoki kuchli teksturali poroshok — Goldanskii–Karyagin effekt. Dublet chiziqlari 1:1 emas, balki 2:1 yoki 1:2 chiqadi.", severity: "O'rta", solution: "Poroshokni yaxshilab maydalash (5 µm dan kichik zarrachalar). Turli yo'nalishlardan o'lchash. Bir kristall uchun 3 asosiy o'q bo'yicha o'lchash. Fit da anisotropy hisobga olish." },
  { source: "Boshqa Fe fazalari (aralashmalar)", freqRange: "Qo'shimcha chiziqlar", effect: "Sintez xatosi yoki eskirgan namunada Fe₂O₃, Fe(OH)₃, FeSO₄ (bezsuv), Fe metall qoldiqlari — har biri o'z Mössbauer 'imzosini' beradi", severity: "O'rta", solution: "Yangi sintez qilish. XRD bilan fazovi tekshirish. Rekristallizatsiya (2 marta). UV-Vis bilan Fe(III) qoldiqni tekshirish (λ = 240 nm LMCT — bo'lmasligi kerak)." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY-KIMYOVIY KONTEKST
// ═══════════════════════════════════════════════════════════════════════════════
const historyEvents = [
  { year: "Qadim davrlar", event: "\"Yashil vitriol\"", desc: "FeSO₄·7H₂O qadimgi davrlardan ma'lum — Rim va Yunon alximikilari uni \"vitriolum viride\" deb atashgan. Rangli bo'yoq va davo vositasi sifatida ishlatilgan." },
  { year: "1670", event: "Kimyoviy sintez", desc: "Johann Rudolph Glauber FeSO₄·7H₂O ni Fe + H₂SO₄ reaksiyasidan sintez qilib, tuzning tabiatini birinchi bor ilmiy tavsifladi." },
  { year: "1789", event: "Fransuz nomenklaturasi", desc: "Antoine Lavoisier \"copperas\" (vitriolum viride) ni FeSO₄ deb qayta nomladi va Fe(II) tuzlar oilasining boshi sifatida qayd etdi." },
  { year: "1893", event: "Werner nazariyasi", desc: "Alfred Werner [Fe(H₂O)₆]²⁺ ni koordinatsion birikma sifatida ta'rifladi — kompleks anioni emas, balki katioidan iborat aqua kompleks. Ichki koordinatsion sohada 6 ta H₂O." },
  { year: "1929", event: "Bethe kristall maydon", desc: "H. Bethe kristall maydon nazariyasini yaratdi. H₂O — KUCHSIZ maydon ligand deb ta'rifladi (Δo ~10 000 cm⁻¹), Fe(II) uchun HS holat majburiyligini isbotladi." },
  { year: "1958", event: "Mössbauer effekti", desc: "R. Mössbauer ¹⁹¹Ir uchun rezonansni kashf etdi. Nobel mukofoti (1961)." },
  { year: "1959", event: "S.S. Hanna — birinchi ⁵⁷Fe Mössbauer", desc: "Sherwood Hanna va boshqalar ⁵⁷Fe uchun BIRINCHI Mössbauer spektrini olishdi (Phys. Rev. Lett. 4, 177). Namuna: FeSO₄·7H₂O! Bu tarixiy o'lchov Fe(II) HS ning katta ΔE_Q ni ochib berdi." },
  { year: "1963", event: "W. Kerler batafsil tahlil", desc: "W. Kerler FeSO₄·7H₂O ni to'liq tahlil qildi (Z. Physik 173, 321): δ = +1.32, ΔE_Q = +3.20 mm/s. Fe(II) HS ning klassik parametrlari." },
  { year: "1964", event: "R. Ingalls modeli", desc: "R. Ingalls Fe(II) HS uchun ΔE_Q(T) modelini ishlab chiqdi (Phys. Rev. 133, A787). t₂g pod-qatlam bo'linishi Δ va η asimmetriya parametri asoslari yaratildi." },
  { year: "1970-yillar", event: "Biokimyoviy tatbiq", desc: "Ehrenberg, Debrunner Fe(II) HS ning gemoglobin va mioglobinni Mössbauer bilan o'rganish. [Fe(H₂O)₆]²⁺ — biologik Fe(II) uchun referens." },
  { year: "1980-yillar", event: "Ferredoksin va Fe−S", desc: "[Fe(H₂O)₆]²⁺ parametrlari [2Fe−2S] va [4Fe−4S] klasterlarni tahlil qilishda referens sifatida ishlatildi." },
  { year: "2000-yillar", event: "Nanozarrachalar", desc: "Fe(II) akvakomplekslari Fe₃O₄ va γ-Fe₂O₃ nanozarrachalar sinteziga prekursor sifatida. MRI kontrast agentlari." },
  { year: "2020-yillar", event: "Fe-ion batareyalar", desc: "Fe(II) suvli elektrolit batareyalar (aqueous Fe-ion) — [Fe(H₂O)₆]²⁺ ↔ [Fe(H₂O)₆]³⁺ redoks juftidan foydalanish. Yashil energiya." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TANLASH QOIDALARI (⁵⁷Fe) — Fe(II) HS UCHUN MAXSUS
// ═══════════════════════════════════════════════════════════════════════════════
const selectionRules = [
  { rule: "ΔI = ±1", desc: "Yadro spin o'zgarishi: I=1/2 (asosiy) → I=3/2 (qo'zg'algan)" },
  { rule: "Δm_I = 0, ±1", desc: "Yadro magnit kvant sonining o'zgarishi (M1 magnit dipol o'tish)" },
  { rule: "L = 1 (M1)", desc: "Fotonning orbital burchak momenti — magnit dipol xarakter" },
  { rule: "Π_e·Π_g = +1", desc: "Yadro juftlik (parity) saqlanadi (M1 uchun)" },
  { rule: "V_zz ≠ 0 (Fe(II) HS)", desc: "t₂g⁴ eg² asimmetrik → EFG mavjud → DUBLET spektri" },
  { rule: "V_zz > 0 (musbat)", desc: "HS d⁶: dz² eg orbital + t₂g pastki holat → V_zz musbat" },
  { rule: "S = 2 tez relaksatsiya", desc: "τ_e < 10⁻⁸ s (RT) — sekstet YO'Q, faqat tashqi maydonda" },
  { rule: "Δv ≤ ±5 mm/s", desc: "ΔE_Q ~3.2 uchun ±5 mm/s Doppler diapazoni etarli" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TAJRIBA PARAMETRLARI TAVSIYALAR
// ═══════════════════════════════════════════════════════════════════════════════
const experimentalParams = [
  { param: "⁵⁷Co manba", value: "10−100 mCi", note: "Rh yoki Pd matrisa; t½ = 271 kun" },
  { param: "Optimal Fe qalinligi", value: "15−25 mg⁵⁷Fe/cm² (yoki 60−80 mg tabiiy)", note: "Fe(II) HS uchun katta qalinlik (chiziqlar keng)" },
  { param: "Vibrator turi", value: "Elektromagnit (Kankeleit)", note: "Sinusoidal, ±5 mm/s uchun sozlangan" },
  { param: "Detektor", value: "Kr−CH₄ gaz proporsional (14.4 keV)", note: "Yoki NaI(Tl) sintillator, MCA 1024 kanal" },
  { param: "MCA kanallar", value: "1024 (dublet uchun) — juda muhim", note: "Har kanal ≈ 0.01 mm/s (±5 mm/s uchun)" },
  { param: "Sanoq statistikasi", value: "≥ 2·10⁶ sanoq/kanal", note: "Katta ΔE_Q chuqurligini aniq o'lchash uchun" },
  { param: "O'lchov vaqti", value: "6−24 soat", note: "RT — tez, 4.2 K — uzoqroq (kriostat)" },
  { param: "Namuna T", value: "77 K (standart) yoki 4.2 K (ΔE_Q(T) uchun)", note: "295 K — RT, 4.2 K — Ingalls modeli uchun" },
  { param: "Kalibrlash", value: "α-Fe folga + FeSO₄·7H₂O ikkinchi", note: "FeSO₄·7H₂O δ = 1.39, ΔE_Q = 3.19 tekshirish" },
  { param: "Ma'lumot tahlil", value: "WinNormos, Mosswinn, Recoil, MossA", note: "Ikki Lorentzian (dublet) fit, χ² < 1.2 — a'lo" },
  { param: "Atmosfera", value: "Argon glove-box (O₂ < 1 ppm)", note: "Fe(II) → Fe(III) oksidlanishidan qochish MAJBURIY" },
  { param: "Namuna saqlash", value: "Argon glove-box + qorong'i, 4 °C", note: "Freshli sintez 1−2 hafta ichida ishlatish" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// FE(II) HS vs FE(II) LS TAQQOSLASH — Fe(II) ning ikki qiyofasi
// ═══════════════════════════════════════════════════════════════════════════════
const hsVsLs = [
  { param: "Fe oksidlanish",       hs: "+2",                 ls: "+2",                 farq: "Bir xil — faqat spin farqi" },
  { param: "d-konfiguratsiya",     hs: "t₂g⁴ eg² (4+2)",    ls: "t₂g⁶ eg⁰ (6+0)",    farq: "Elektron taqsimlash — eng muhim farq" },
  { param: "Spin S",               hs: "S = 2",              ls: "S = 0",              farq: "HS: 4 yakka spin; LS: barcha juft" },
  { param: "Magnitizm",            hs: "Paramagnit",         ls: "Diamagnit",          farq: "μ_eff: 5.20 vs 0 μB" },
  { param: "Ligand maydon",        hs: "H₂O (kuchsiz)",     ls: "CN⁻ (kuchli)",      farq: "Δo < P vs Δo > P" },
  { param: "Δo (cm⁻¹)",           hs: "~10 400",            ls: "~33 800",            farq: "3× farq — spektrokimyoviy qator" },
  { param: "δ (mm/s)",             hs: "+1.39 (yuqori)",    ls: "−0.04 (past)",       farq: "1.43 mm/s farq — ENG KATTA" },
  { param: "ΔE_Q (mm/s)",         hs: "+3.19 (KATTA)",     ls: "0.00 (SINGLET)",     farq: "V_val: t₂g⁴ asimmetrik vs t₂g⁶ sferik" },
  { param: "Spektr shakli",       hs: "Katta dublet",       ls: "Singlet",            farq: "Bir qarash bilan aniqlanadi" },
  { param: "Ion radiusi",         hs: "0.83 Å",             ls: "0.61 Å",             farq: "HS ion kattaroq (eg to'lgan)" },
  { param: "Fe−L bog' uzunligi",  hs: "2.12 Å (Fe−O)",     ls: "1.90 Å (Fe−C)",      farq: "HS uzunroq — eg antibond" },
  { param: "Rang sababi",         hs: "d−d (⁵T₂g→⁵Eg, 1000 nm)", ls: "MLCT (320 nm)", farq: "HS: kuchsiz, LS: kuchli" },
  { param: "Amaliyot",            hs: "Fe(II) biologik",    ls: "Kalibrlash",         farq: "HS: mioglobin oksigen; LS: Mössbauer standart" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONENT: MINI-SPEKTR CHIZUVCHI (KATTA DUBLET UCHUN)
// ═══════════════════════════════════════════════════════════════════════════════
function InteraktivSpektr({ delta = 1.39, deltaQ = 3.19, gamma = 0.30 }) {
  const spektr = useMemo(() => {
    const arr = []
    const vMin = -5, vMax = 5, steps = 400
    const positions = deltaQ > 0.02 ? [delta - deltaQ / 2, delta + deltaQ / 2] : [delta]

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      let abs = 0
      positions.forEach(x0 => {
        const hw = gamma / 2
        abs += 1 / (1 + Math.pow((v - x0) / hw, 2))
      })
      abs /= positions.length
      arr.push({ v, T: 100 - abs * 25 })
    }
    return arr
  }, [delta, deltaQ, gamma])

  const minT = Math.min(...spektr.map(p => p.T))
  const vToX = (v) => 60 + ((v + 5) / 10) * 620
  const tToY = (T) => 40 + ((100 - T) / (100 - minT + 1)) * 240

  return (
    <svg viewBox="0 0 720 340" className="w-full h-auto">
      {/* Fon */}
      <rect x="60" y="40" width="620" height="240" fill="#0f0a1e" opacity="0.4" rx="4"/>

      {/* Grid */}
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(v => (
        <g key={v}>
          <line x1={vToX(v)} y1="40" x2={vToX(v)} y2="280" stroke="#4c1d95" strokeWidth="0.4" strokeDasharray="2,3"/>
          <text x={vToX(v)} y="300" fill="#a78bfa" fontSize="11" textAnchor="middle">{v}</text>
        </g>
      ))}
      {[100, 95, 90, 85, 80, 75].map(t => (
        <g key={t}>
          <line x1="60" y1={40 + ((100 - t) / 25) * 240} x2="680" y2={40 + ((100 - t) / 25) * 240}
            stroke="#4c1d95" strokeWidth="0.4" strokeDasharray="2,3"/>
          <text x="50" y={44 + ((100 - t) / 25) * 240} fill="#a78bfa" fontSize="11" textAnchor="end">{t}</text>
        </g>
      ))}

      {/* O'qlar */}
      <line x1="60" y1="40" x2="60" y2="280" stroke="#a78bfa" strokeWidth="1.5"/>
      <line x1="60" y1="280" x2="680" y2="280" stroke="#a78bfa" strokeWidth="1.5"/>

      {/* v=0 chiziq */}
      <line x1={vToX(0)} y1="40" x2={vToX(0)} y2="280" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="3,3" opacity="0.5"/>

      {/* Spektr chizig'i (Fe(II) HS — yashil-emerald) */}
      <polyline
        points={spektr.map(p => `${vToX(p.v)},${tToY(p.T)}`).join(' ')}
        fill="none" stroke="#10b981" strokeWidth="2.2"
      />

      {/* Chiziq belgilari */}
      {deltaQ > 0.02 && (
        <>
          <line x1={vToX(delta - deltaQ/2)} y1={tToY(100 - 25)} x2={vToX(delta - deltaQ/2)} y2="40"
            stroke="#34d399" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.7"/>
          <text x={vToX(delta - deltaQ/2)} y="35" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">
            {(delta - deltaQ/2).toFixed(2)}
          </text>
          <line x1={vToX(delta + deltaQ/2)} y1={tToY(100 - 25)} x2={vToX(delta + deltaQ/2)} y2="40"
            stroke="#34d399" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.7"/>
          <text x={vToX(delta + deltaQ/2)} y="35" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">
            {(delta + deltaQ/2).toFixed(2)}
          </text>

          {/* ΔE_Q ko'rsatkichi */}
          <line x1={vToX(delta - deltaQ/2)} y1="20" x2={vToX(delta + deltaQ/2)} y2="20"
            stroke="#fde047" strokeWidth="1.2" markerEnd="url(#arr)" markerStart="url(#arr2)"/>
          <text x={vToX(delta)} y="16" fill="#fde047" fontSize="11" textAnchor="middle" fontWeight="bold">
            ΔE_Q = {deltaQ.toFixed(2)} mm/s
          </text>
        </>
      )}

      {/* Delta markazi */}
      <line x1={vToX(delta)} y1={tToY(100)} x2={vToX(delta)} y2="280"
        stroke="#f87171" strokeWidth="0.4" strokeDasharray="1,2" opacity="0.6"/>
      <text x={vToX(delta)} y={295} fill="#f87171" fontSize="10" textAnchor="middle" fontWeight="bold">
        δ = {delta.toFixed(2)}
      </text>

      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fde047"/>
        </marker>
        <marker id="arr2" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 10 0 L 0 5 L 10 10 z" fill="#fde047"/>
        </marker>
      </defs>

      {/* O'q nomlari */}
      <text x="370" y="322" fill="#c4b5fd" fontSize="13" textAnchor="middle" fontStyle="italic" fontWeight="bold">
        Doppler tezligi v (mm/s) — α-Fe (RT) ga nisbatan
      </text>
      <text x="20" y="160" fill="#c4b5fd" fontSize="13" textAnchor="middle" fontStyle="italic" fontWeight="bold" transform="rotate(-90, 20, 160)">
        Transmissiya T (%)
      </text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function FeH2O6Plus2Sahifasi() {
  const [selectedParam, setSelectedParam] = useState(0)
  const [selectedTemp, setSelectedTemp] = useState(2) // 77 K default
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    parameters: true,
    spectrum: true,
    temperature: true,
    selectionRules: true,
    hsVsLs: true,
    aqua: true,
    experimental: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  })

  // Simulyator
  const [simDelta, setSimDelta] = useState(1.39)
  const [simDeltaQ, setSimDeltaQ] = useState(3.19)
  const [simGamma, setSimGamma] = useState(0.30)

  const t = tempData[selectedTemp]
  const p = mossbauerParams[selectedParam]

  // ═══════════════════════════════════════════════════════════════════════════
  // PDF EKSPORT
  // ═══════════════════════════════════════════════════════════════════════════
  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim()
  }

  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const { PDFDocument, rgb } = await import("pdf-lib")
      const fontkit = (await import("@pdf-lib/fontkit")).default

      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular font"); return r.arrayBuffer() })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold font"); return r.arrayBuffer() })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic font"); return r.arrayBuffer() })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch (fontErr) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false)
        return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98),
        purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        teal: rgb(0.08, 0.72, 0.65),
        tealDeep: rgb(0.05, 0.55, 0.50),
        green: rgb(0.06, 0.73, 0.51),
        greenDeep: rgb(0.03, 0.53, 0.36),
        emerald: rgb(0.15, 0.68, 0.38),
        emeraldDeep: rgb(0.08, 0.47, 0.31),
        yellow: rgb(0.85, 0.65, 0.05),
        yellowDeep: rgb(0.65, 0.48, 0.02),
        red: rgb(0.86, 0.15, 0.15),
        redDeep: rgb(0.65, 0.10, 0.10),
        textDark: rgb(0.08, 0.08, 0.16),
        textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0),
        blue: rgb(0.08, 0.31, 0.55),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0),
        bgTeal: rgb(0.94, 1.0, 0.99),
        bgGreen: rgb(0.94, 1.0, 0.96),
        bgEmerald: rgb(0.92, 0.99, 0.95),
        bgYellow: rgb(1.0, 0.98, 0.92),
        bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgRed: rgb(1.0, 0.95, 0.95),
        bgAbstract: rgb(0.96, 0.94, 1.0),
        white: rgb(1, 1, 1),
      }

      const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 50
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30, HEADER_H = 65

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (text, font, size) => font.widthOfTextAtSize(String(text), size)
      const truncate = (text, font, size, maxWidth) => {
        const s = String(text)
        if (measure(s, font, size) <= maxWidth) return s
        let lo = 0, hi = s.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(s.slice(0, mid) + "…", font, size) <= maxWidth) lo = mid
          else hi = mid - 1
        }
        return s.slice(0, lo) + "…"
      }
      const wrapText = (text, font, size, maxWidth) => {
        if (!text) return [""]
        const words = String(text).split(/\s+/)
        const lines = []
        let current = ""
        for (const word of words) {
          const test = current ? current + " " + word : word
          if (measure(test, font, size) > maxWidth && current) {
            lines.push(current); current = word
          } else current = test
          if (measure(current, font, size) > maxWidth) {
            let piece = ""
            for (const ch of current) {
              if (measure(piece + ch, font, size) > maxWidth) { lines.push(piece); piece = ch }
              else piece += ch
            }
            current = piece
          }
        }
        if (current) lines.push(current)
        return lines
      }
      const safeText = (text, opts) => {
        const { x, y: ty, size = 10, font = regularFont, color = C.textDark, align = "left", maxWidth = null } = opts
        const s = cleanText(text)
        const limit = maxWidth ?? (PAGE_W - MARGIN - x)
        const finalText = truncate(s, font, size, limit)
        let fx = x
        const w = measure(finalText, font, size)
        if (align === "center") fx = x - w / 2
        else if (align === "right") fx = x - w
        page.drawText(finalText, { x: fx, y: ty, size, font, color })
      }
      const drawCenteredText = (text, cy, size, font, color, maxW = CONTENT_W) => {
        const lines = wrapText(cleanText(text), font, size, maxW)
        lines.forEach((line, i) => {
          const w = measure(line, font, size)
          page.drawText(line, { x: (PAGE_W - w) / 2, y: cy - i * (size + 3), size, font, color })
        })
        return lines.length * (size + 3)
      }
      const drawWrappedText = (text, opts) => {
        const { x, y: sy, size = 9.5, font = regularFont, color = C.textDark, maxWidth, lineHeight = null } = opts
        const lines = wrapText(cleanText(text), font, size, maxWidth)
        const lh = lineHeight ?? size + 3
        lines.forEach((line, i) => {
          page.drawText(line, { x, y: sy - i * lh, size, font, color })
        })
        return lines.length * lh
      }

      const addFooter = () => {
        const leftText = truncate(
          `JDA-Kimyo Mössbauer Tahlili  •  [Fe(H₂O)₆]²⁺ (FeSO₄·7H₂O — Melanterit)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine,
        })
      }
      const addNewPage = () => {
        addFooter()
        page = pdfDoc.addPage([PAGE_W, PAGE_H])
        pageNum++
        y = PAGE_H - MARGIN
      }
      const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }

      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.emerald })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.emeraldDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }

      const drawTableRow = (label, value, bgColor = C.bgEmerald, labelColor = C.emeraldDeep) => {
        const rowH = 20
        const labelW = 200
        const valueX = MARGIN + labelW + 6
        const valueMaxW = CONTENT_W - labelW - 12
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
        page.drawText(finalVal, { x: valueX, y: y - 13, size: 9, font: regularFont, color: C.textDark })
        y -= rowH
      }

      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10
        const maxW = CONTENT_W - 2 * padding
        const lines = wrapText(cleanText(text), regularFont, 9, maxW)
        const boxH = lines.length * 12 + 2 * padding
        checkPageBreak(boxH + 8)
        page.drawRectangle({
          x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
          color: bgColor, borderColor: borderColor, borderWidth: 0.8,
        })
        lines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN + padding, y: y - padding - 10 - i * 12,
            size: 9, font: regularFont, color: textColor,
          })
        })
        y -= boxH + 10
      }

      // SARLAVHA POLOSASI
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  Mössbauer Spektroskopiyasi  •  Vol. 3, Son 3", {
        x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight, maxWidth: CONTENT_W * 0.65,
      })
      safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
        x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9,
        font: regularFont, color: C.purpleLight, align: "right", maxWidth: CONTENT_W * 0.3,
      })
      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
        thickness: 1, color: C.purpleMid,
      })
      safeText("Koordinatsion Kimyo — Fe(II) Yuqori Spin Akvakompleks", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.mossbauer.2026.003", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      drawCenteredText(`[Fe(H₂O)₆]²⁺ — ⁵⁷Fe Mössbauer Spektroskopik Tahlili`, y, 18, boldFont, C.textDark)
      y -= 26
      drawCenteredText("Geksaakvatemir(II) ioni  •  FeSO₄·7H₂O (Melanterit)", y, 12, italicFont, C.purpleSoft)
      y -= 20
      drawCenteredText(
        `Simmetriya: Oh (D₃d)  •  Fe²⁺, d⁶ HS (t₂g⁴ eg²)  •  S = 2, paramagnit  •  M = 278.02 g/mol`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ABSTRACT
      const abstract =
        `Geksaakvatemir(II) ioni [Fe(H₂O)₆]²⁺ — Fe(II) yuqori spin (HS) holatining KLASSIK ALTIN STANDARTI ` +
        `Mössbauer amaliyotida. FeSO₄·7H₂O (Melanterit, ma'dandagi shakli) ⁵⁷Fe uchun 1959 yilda birinchi ` +
        `Mössbauer o'lchov qilingan tarixiy namunadir (S.S. Hanna, Phys. Rev. Lett. 4, 177). ⁵⁷Fe Mössbauer ` +
        `o'lchovi quyidagi ekstremum giperkichik parametrlarni beradi: izomer siljish δ = +1.39 mm/s (α-Fe ga ` +
        `nisbatan, RT) — Fe(II) HS ning ENG YUQORI qiymatlaridan; kvadrupol bo'linishi ΔE_Q = +3.19 mm/s — ` +
        `Mössbauer da uchraydigan ENG KATTA d-d parametrlaridan biri. Bu ekstremum qiymatlar HS d⁶ (t₂g⁴ eg²) ` +
        `konfiguratsiyaning asimmetrik zaryad taqsimoti (V_val = +4/7·<r⁻³>·e katta), H₂O ning kuchsiz maydon ` +
        `ligand (Δo « P) va Fe−O bog'lanishning kovalent ulushi kichikligining natijasidir. Haroratga bog'liq ` +
        `ΔE_Q(T) egri chizig'i Ingalls modelini qanoatlantiradi va t₂g pod-qatlam trigonal buzilish parametri ` +
        `Δ ≈ 400−500 cm⁻¹ ni beradi. Bu birikma Fe(II) HS uchun KALIBRLASH tayanchi sifatida ishlatiladi.`

      const absPadding = 12
      const absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8
      checkPageBreak(boxH + 20)
      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purple, maxWidth: absInnerW,
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark,
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // 1. IDENTIFIKATSIYA
      if (pdfSections.identification) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
        const idData = [
          ["Formula (ion)", "[Fe(H₂O)₆]²⁺"],
          ["Formula (kristall)", "FeSO₄·7H₂O (Melanterit)"],
          ["IUPAC nomi", "Geksaakvatemir(II) ioni"],
          ["An'anaviy nomi", "Temir(II) akvakompleks / \"Yashil vitriol\""],
          ["CAS raqami", "15365-81-8 (ion) / 7782-63-0 (FeSO₄·7H₂O)"],
          ["Molar massa", "161.99 g/mol (ion) / 278.02 g/mol (FeSO₄·7H₂O)"],
          ["Rangi", "Och yashil-havorang (tuz shakli)"],
          ["Kristall tizim (FeSO₄·7H₂O)", "Monoklinik (P2₁/c fazoviy guruh)"],
          ["Kompleks anion simmetriyasi", "Oh (real: D₃d — trigonal buzilish)"],
          ["Koordinatsion son", "6 (oktaedrik)"],
          ["Metall ioni", "Fe²⁺ (d⁶ HS, t₂g⁴ eg²)"],
          ["Ligand tipi", "H₂O (kuchsiz maydon, σ-donor)"],
          ["Fe–O bog' uzunligi", "2.12 Å (o'rtacha; 2 uzun + 4 qisqa)"],
          ["Δo (10Dq)", "10 400 cm⁻¹ (~124 kJ/mol)"],
          ["Pairing energiya P", "~17 600 cm⁻¹ (P > Δo → HS majburiy)"],
          ["Ion radiusi (Fe²⁺ HS)", "0.83 Å"],
          ["Suvda eruvchanligi", "260 g/L (20°C, FeSO₄·7H₂O)"],
          ["Standart potensial E°", "Fe³⁺/Fe²⁺ = +0.77 V"],
          ["pH (0.1 M eritma)", "≈ 4−5 (kuchsiz kislotali, gidroliz)"],
          ["Magnitizm", "Paramagnit (μ_eff = 5.10−5.40 μB)"],
        ]
        idData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgGreen : C.white, C.emeraldDeep)
        })
        y -= 15
      }

      // 2. NAZARIY ASOS
      if (pdfSections.theory) {
        drawSectionHeader(sectionNum++, "Mössbauer Spektroskopiyasining Nazariy Asosi")
        drawWrappedText(
          "Mössbauer spektroskopiyasi qattiq jismdagi atom yadrolarining qaytishsiz (recoil-free) gamma-kvant rezonans yutish hodisasiga asoslangan. FeSO₄·7H₂O 1959 yilda S.S. Hanna tomonidan ⁵⁷Fe uchun BIRINCHI Mössbauer o'lchov qilingan tarixiy namunadir (Phys. Rev. Lett. 4, 177). W. Kerler 1963 da to'liq tahlil qildi: δ = +1.32, ΔE_Q = +3.20 mm/s.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Mössbauer spektroskopiyasi qattiq jismdagi atom yadrolarining qaytishsiz (recoil-free) gamma-kvant rezonans yutish hodisasiga asoslangan. FeSO₄·7H₂O 1959 yilda S.S. Hanna tomonidan ⁵⁷Fe uchun BIRINCHI Mössbauer o'lchov qilingan tarixiy namunadir (Phys. Rev. Lett. 4, 177). W. Kerler 1963 da to'liq tahlil qildi: δ = +1.32, ΔE_Q = +3.20 mm/s.", regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "1) Recoil-free rezonans: E_R = E_γ²/(2Mc²) ≈ 1.96·10⁻³ eV. FeSO₄·7H₂O uchun θ_D ≈ 280 K (7 ta kristall suvi tufayli o'rtacha qattiq), Lamb–Mössbauer omili f_LM = 0.65 (77 K), 0.35 (RT).",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "2) Doppler tezligi: Manba (⁵⁷Co/Rh) ±5 mm/s tezlik bilan yurgiziladi. [Fe(H₂O)₆]²⁺ da katta ΔE_Q (~3.2) tufayli chiziqlar juda uzoq: v₁ = δ − ΔE_Q/2 = −0.21 mm/s va v₂ = δ + ΔE_Q/2 = +2.99 mm/s.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "3) Uch giperkichik parametr: (a) δ = +1.39 (YUQORI!); (b) ΔE_Q = +3.19 (KATTA!); (c) H_hf = 0 (paramagnit, RT). Bu QARAMA-QARSHI ekstremum qiymatlar Fe(II) HS holatning uniqueligini yaratadi.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "4) [Fe(H₂O)₆]²⁺ uchun natijalar: H₂O kuchsiz maydon → Fe²⁺ HS (t₂g⁴ eg²) → asimmetrik zaryad taqsimoti + katta CFSE. Ideal referens birikma Fe(II) HS uchun.",
          C.bgYellow, C.yellow, C.textDark
        )
      }

      // 3. MÖSSBAUER PARAMETRLARI
      if (pdfSections.parameters) {
        drawSectionHeader(sectionNum++, "Mössbauer Parametrlari — Batafsil Tahlil")
        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.emeraldDeep })
        const headers = ["Parametr", "Qiymat", "Fizik ma'no", "Diagnostik"]
        const colW = [80, 100, 175, 140]
        let cx = MARGIN + 6
        headers.forEach((h, i) => {
          safeText(h, { x: cx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: colW[i] - 4 })
          cx += colW[i]
        })
        y -= 20

        mossbauerParams.forEach((p, idx) => {
          checkPageBreak(45)
          const bg = idx % 2 === 0 ? C.bgGreen : C.white
          page.drawRectangle({ x: MARGIN, y: y - 42, width: CONTENT_W, height: 42, color: bg })

          safeText(`${p.param}`, { x: MARGIN + 6, y: y - 14, size: 12, font: boldFont, color: C.emeraldDeep, maxWidth: colW[0] - 4 })
          safeText(p.paramName, { x: MARGIN + 6, y: y - 30, size: 7.5, font: italicFont, color: C.textMuted, maxWidth: colW[0] - 4 })

          safeText(`${p.value} ${p.unit}`, { x: MARGIN + 6 + colW[0], y: y - 14, size: 10, font: boldFont, color: C.greenDeep, maxWidth: colW[1] - 4 })
          safeText(p.reference, { x: MARGIN + 6 + colW[0], y: y - 30, size: 7, font: italicFont, color: C.textMuted, maxWidth: colW[1] - 4 })

          const meaningLines = wrapText(cleanText(p.physicalMeaning), regularFont, 8, colW[2] - 8)
          meaningLines.slice(0, 2).forEach((line, i) => {
            page.drawText(line, { x: MARGIN + 6 + colW[0] + colW[1], y: y - 14 - i * 10, size: 8, font: regularFont, color: C.textDark })
          })

          const diagLines = wrapText(cleanText(p.diagnostic), italicFont, 8, colW[3] - 8)
          diagLines.slice(0, 2).forEach((line, i) => {
            page.drawText(line, { x: MARGIN + 6 + colW[0] + colW[1] + colW[2], y: y - 14 - i * 10, size: 8, font: italicFont, color: C.emeraldDeep })
          })
          y -= 44
        })
        y -= 6

        drawInfoBox(
          "Umumiy xulosa: [Fe(H₂O)₆]²⁺ ning parametrlari EKSTREMUM: δ ENG YUQORI (+1.39), ΔE_Q ENG KATTA (+3.19). Bu Mössbauer amaliyotida Fe(II) HS uchun 'tuning fork' — barcha Fe(II) HS komplekslar bu tayanchda solishtiriladi.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 4. SPEKTR TALQINI
      if (pdfSections.spectrum) {
        drawSectionHeader(sectionNum++, "Mössbauer Spektri — Katta Dublet Talqini")
        drawWrappedText(
          "[Fe(H₂O)₆]²⁺ ning Mössbauer spektri KATTA SIMMETRIK DUBLET shakliga ega — ikki Lorentzian chiziq, orasi ΔE_Q = 3.19 mm/s. Chiziqlar joylashuvi: v₁ = δ − ΔE_Q/2 = −0.21 mm/s va v₂ = δ + ΔE_Q/2 = +2.99 mm/s. Bu Mössbauer da uchraydigan ENG KATTA d-d parametrlaridan biri.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("[Fe(H₂O)₆]²⁺ ning Mössbauer spektri KATTA SIMMETRIK DUBLET shakliga ega — ikki Lorentzian chiziq, orasi ΔE_Q = 3.19 mm/s. Chiziqlar joylashuvi: v₁ = δ − ΔE_Q/2 = −0.21 mm/s va v₂ = δ + ΔE_Q/2 = +2.99 mm/s. Bu Mössbauer da uchraydigan ENG KATTA d-d parametrlaridan biri.", regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "V_val yuqori (VALENT hissa): t₂g⁴ eg² konfiguratsiyasida 4 elektron 3 orbitalga tarqalgan — bittada QO'SHIMCHA elektron → asimmetrik → V_val = +4/7·<r⁻³>·e (juda katta).",
          C.bgYellow, C.yellow, C.textDark
        )
        drawInfoBox(
          "V_lat kichik (PANJARA hissa): D₃d simmetriyada 2 uzun + 4 qisqa Fe−O bog'lar — biroz buzilgan Oh. V_lat qo'shimcha ~15% hissa qo'shadi, lekin V_val hukmronlik qiladi.",
          C.bgYellow, C.yellow, C.textDark
        )
        drawInfoBox(
          "V_zz belgi MUSBAT: Applied field Mössbauer (9T, 4.2 K) o'lchovlari V_zz > 0 ekanligini tasdiqladi. Bu HS d⁶ da eg orbitalning dz² dominant to'lgan holatiga mos.",
          C.bgTeal, C.teal, C.textDark
        )
        drawInfoBox(
          "Chiziq intensivligi: Ideal poroshok namunada 1:1 nisbat kutiladi. Amaliyotda 1.02:1 gacha assimetriya (Goldanskii–Karyagin — anizotropik f_LM). Bir kristallda 3:1 gacha bo'lishi mumkin.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 5. HARORAT
      if (pdfSections.temperature) {
        drawSectionHeader(sectionNum++, "Haroratga Bog'liq O'lchovlar — Ingalls Effekti")
        drawWrappedText(
          "[Fe(H₂O)₆]²⁺ ning ΔE_Q(T) qattiq HARORATGA BOG'LIQ — bu R. Ingalls (1964) tomonidan izohlangan Fe(II) HS ga xos effekt. t₂g pod-qatlam trigonal buzilish tufayli Δ ≈ 400−500 cm⁻¹ ga bo'linadi. Past T da faqat eng past t₂g orbital to'lgan → maksimal ΔE_Q. Yuqori T da barcha t₂g teng populatsiyalangan → ΔE_Q kamayadi.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("[Fe(H₂O)₆]²⁺ ning ΔE_Q(T) qattiq HARORATGA BOG'LIQ — bu R. Ingalls (1964) tomonidan izohlangan Fe(II) HS ga xos effekt. t₂g pod-qatlam trigonal buzilish tufayli Δ ≈ 400−500 cm⁻¹ ga bo'linadi. Past T da faqat eng past t₂g orbital to'lgan → maksimal ΔE_Q. Yuqori T da barcha t₂g teng populatsiyalangan → ΔE_Q kamayadi.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.emeraldDeep })
        const thead = ["T (K)", "δ (mm/s)", "ΔE_Q (mm/s)", "f_LM", "Γ (mm/s)", "Izoh"]
        const twcol = [55, 65, 80, 55, 60, 180]
        let tx = MARGIN + 6
        thead.forEach((h, i) => {
          safeText(h, { x: tx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: twcol[i] - 4 })
          tx += twcol[i]
        })
        y -= 20

        tempData.forEach((td, idx) => {
          checkPageBreak(20)
          const bg = idx % 2 === 0 ? C.bgGreen : C.white
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx3 = MARGIN + 6
          const cells = [String(td.T), String(td.delta), String(td.deltaQ), String(td.fLM), String(td.gamma), td.izoh]
          cells.forEach((cell, i) => {
            const font = i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.emeraldDeep : C.textDark
            safeText(cell, { x: cx3, y: y - 12, size: 8.5, font, color, maxWidth: twcol[i] - 4 })
            cx3 += twcol[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Xulosa: (a) δ trendi ~−3·10⁻⁴ mm/s/K (SOD). (b) ΔE_Q 4.2 K da 3.30 → 400 K da 2.95 (0.35 mm/s farq!) — Ingalls modelidan Δ ≈ 400 cm⁻¹. (c) f_LM 0.88 → 0.15 keskin pasayish (θ_D ≈ 280 K). (d) T > 350 K da 7H₂O yo'qolish boshi — panjara buziladi.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 6. TANLASH QOIDALARI
      if (pdfSections.selectionRules) {
        drawSectionHeader(sectionNum++, "Tanlash Qoidalari — ⁵⁷Fe (Fe(II) HS uchun maxsus)")
        drawWrappedText(
          "⁵⁷Fe uchun asosiy Mössbauer o'tishi 14.4125 keV — bu I=1/2 va I=3/2 orasidagi magnit dipol (M1) o'tishdir. [Fe(H₂O)₆]²⁺ uchun MAXSUS qoidalar:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("⁵⁷Fe uchun asosiy Mössbauer o'tishi 14.4125 keV — bu I=1/2 va I=3/2 orasidagi magnit dipol (M1) o'tishdir. [Fe(H₂O)₆]²⁺ uchun MAXSUS qoidalar:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        selectionRules.forEach((sr, idx) => {
          checkPageBreak(22)
          const bg = idx % 2 === 0 ? C.bgPurple : C.white
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          safeText(sr.rule, { x: MARGIN + 6, y: y - 13, size: 10, font: boldFont, color: C.purple, maxWidth: 130 })
          safeText(sr.desc, { x: MARGIN + 140, y: y - 13, size: 8.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W - 150 })
          y -= 20
        })
        y -= 6

        drawInfoBox(
          "Fe(II) HS uchun 4 o'tish yo'li: (±3/2 → ±1/2) va (±3/2 → ∓1/2) bir chiziqda, (±1/2 → ±1/2) va (±1/2 → ∓1/2) ikkinchi chiziqda. Poroshok — 1:1 nisbat. Katta ΔE_Q sabab chiziqlar yaxshi ajraladi.",
          C.bgBlue, C.blue, C.textDark
        )
      }

      // 7. HS vs LS TAQQOSLASH
      if (pdfSections.hsVsLs) {
        drawSectionHeader(sectionNum++, "Fe(II) HS vs Fe(II) LS — Ikki Qiyofa")
        drawWrappedText(
          "[Fe(H₂O)₆]²⁺ (HS) va K₄[Fe(CN)₆] (LS) — Fe²⁺ ning IKKI ekstremumi. Oksidlanish darajasi bir xil (+2), ammo LIGAND MAYDONI farqli ligandlar bilan Fe(II) ning ikki qiyofasi ochiladi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("[Fe(H₂O)₆]²⁺ (HS) va K₄[Fe(CN)₆] (LS) — Fe²⁺ ning IKKI ekstremumi. Oksidlanish darajasi bir xil (+2), ammo LIGAND MAYDONI farqli ligandlar bilan Fe(II) ning ikki qiyofasi ochiladi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const hHeaders = ["Parametr", "Fe(II) HS ← BU", "Fe(II) LS (K₄)", "Ahamiyat"]
        const hColW = [110, 110, 100, 175]
        let hcx = MARGIN + 6
        hHeaders.forEach((h, i) => {
          safeText(h, { x: hcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: hColW[i] - 4 })
          hcx += hColW[i]
        })
        y -= 20

        hsVsLs.forEach((k, idx) => {
          checkPageBreak(20)
          const bg = idx % 2 === 0 ? C.bgPurple : C.white
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx5 = MARGIN + 6
          safeText(k.param, { x: cx5, y: y - 12, size: 8.5, font: boldFont, color: C.purple, maxWidth: hColW[0] - 4 })
          cx5 += hColW[0]
          safeText(k.hs, { x: cx5, y: y - 12, size: 8.5, font: boldFont, color: C.emeraldDeep, maxWidth: hColW[1] - 4 })
          cx5 += hColW[1]
          safeText(k.ls, { x: cx5, y: y - 12, size: 8.5, font: boldFont, color: C.yellowDeep, maxWidth: hColW[2] - 4 })
          cx5 += hColW[2]
          safeText(k.farq, { x: cx5, y: y - 12, size: 8, font: italicFont, color: C.textDark, maxWidth: hColW[3] - 4 })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Asosiy xulosa: Fe(II) ning oksidlanish darajasi bir xil (+2), lekin ligand maydonining kuchi (H₂O vs CN⁻) natijasida ikki tur elektron holat — HS va LS. Mössbauer parametrlari bu farqni jahonda hech qanday boshqa spektroskopiyadan aniqroq beradi: δ 1.43 mm/s farq, ΔE_Q — SINGLET (LS) vs KATTA DUBLET (HS).",
          C.bgPurple, C.purple, C.textDark
        )
      }

      // 8. AKVAKOMPLEKSLAR QATORI
      if (pdfSections.aqua) {
        drawSectionHeader(sectionNum++, "Akvakomplekslar va Fe(II) Oilasi")
        drawWrappedText(
          "[Fe(H₂O)₆]²⁺ — Fe(II) akvakomplekslarning boshi. Uni Fe(III) akva va boshqa Fe(II) komplekslar bilan taqqoslash Fe oksidlanish darajasi va spin holatini aniqlash imkonini beradi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("[Fe(H₂O)₆]²⁺ — Fe(II) akvakomplekslarning boshi. Uni Fe(III) akva va boshqa Fe(II) komplekslar bilan taqqoslash Fe oksidlanish darajasi va spin holatini aniqlash imkonini beradi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const wHeaders = ["Kompleks", "Nomi", "δ", "ΔE_Q", "Spektr"]
        const wColW = [130, 130, 55, 60, 120]
        let wcx = MARGIN + 6
        wHeaders.forEach((h, i) => {
          safeText(h, { x: wcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: wColW[i] - 4 })
          wcx += wColW[i]
        })
        y -= 20

        aquaSeries.forEach((w, idx) => {
          checkPageBreak(22)
          const bg = w.current ? C.bgGreen : (idx % 2 === 0 ? C.bgPurple : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx4 = MARGIN + 6
          const cells = [w.formula, w.trad, w.delta, w.deltaQ, w.spektr]
          cells.forEach((cell, i) => {
            const font = w.current ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = w.current ? C.emeraldDeep : (i === 0 ? C.purple : C.textDark)
            safeText(cell, { x: cx4, y: y - 13, size: 8.5, font, color, maxWidth: wColW[i] - 4 })
            cx4 += wColW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "Diagnostik trend: Fe(II) HS (δ~1.4, ΔE_Q~3.2) → Fe(III) HS (δ~0.5, ΔE_Q~0.2). Oksidlanish +2 dan +3 ga o'zgarganda δ 1 mm/s pasayadi (3d elektron kamayishi) VA ΔE_Q keskin kamayadi (d⁵ sferikroq). Bu ikki parametr birgalikda Fe oksidlanish darajasini AJRATIB berish uchun ideal.",
          C.bgPurple, C.purple, C.textDark
        )
      }

      // 9. TAJRIBA PARAMETRLARI
      if (pdfSections.experimental) {
        drawSectionHeader(sectionNum++, "Tavsiya Etilgan Tajriba Parametrlari")
        experimentalParams.forEach((e, i) => {
          drawTableRow(e.param, `${e.value}  —  ${e.note}`, i % 2 === 0 ? C.bgGreen : C.white, C.emeraldDeep)
        })
        y -= 10
      }

      // 10. TEXNIKALAR
      if (pdfSections.techniques) {
        drawSectionHeader(sectionNum++, "O'lchov Rejimlari va Namuna Tayyorlash")
        techniques.forEach((t, idx) => {
          checkPageBreak(160)
          page.drawRectangle({
            x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.blue,
          })
          safeText(`${idx + 1}. ${t.name}`, {
            x: MARGIN + 8, y: y - 14, size: 10, font: boldFont, color: C.white, maxWidth: CONTENT_W - 16,
          })
          y -= 20

          const h = drawWrappedText(t.description, {
            x: MARGIN + 8, y: y - 12, size: 9, font: italicFont, color: C.textMuted,
            maxWidth: CONTENT_W - 16, lineHeight: 12,
          })
          y -= h + 8

          const colBoxW = (CONTENT_W - 10) / 2
          checkPageBreak(75)

          page.drawRectangle({
            x: MARGIN, y: y - 68, width: colBoxW, height: 68,
            color: C.bgGreen, borderColor: C.green, borderWidth: 0.5,
          })
          safeText("✓ Afzalliklar", {
            x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.green, maxWidth: colBoxW - 12,
          })
          t.advantages.forEach((adv, i) => {
            safeText(`• ${adv}`, {
              x: MARGIN + 6, y: y - 26 - i * 10, size: 7.5,
              font: regularFont, color: C.textDark, maxWidth: colBoxW - 12,
            })
          })

          page.drawRectangle({
            x: MARGIN + colBoxW + 10, y: y - 68, width: colBoxW, height: 68,
            color: C.bgRed, borderColor: C.red, borderWidth: 0.5,
          })
          safeText("✗ Kamchiliklar", {
            x: MARGIN + colBoxW + 16, y: y - 12, size: 9, font: boldFont, color: C.red, maxWidth: colBoxW - 12,
          })
          t.disadvantages.forEach((dis, i) => {
            safeText(`• ${dis}`, {
              x: MARGIN + colBoxW + 16, y: y - 26 - i * 10, size: 7.5,
              font: regularFont, color: C.textDark, maxWidth: colBoxW - 12,
            })
          })

          y -= 74

          safeText(
            `Diapazon: ${t.freqRange}  •  Ruxsat: ${t.resolution}  •  Tayyorlash: ${t.samplePrep}`,
            { x: MARGIN, y, size: 8, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W }
          )
          y -= 12
          safeText(`Eng yaxshi qo'llanish: ${t.bestFor}`, {
            x: MARGIN, y, size: 8, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W,
          })
          y -= 16
        })
      }

      // 11. HALAQITLAR
      if (pdfSections.interferences) {
        drawSectionHeader(sectionNum++, "Mössbauer Tahliliga Halaqit Beruvchi Omillar")
        drawWrappedText(
          "[Fe(H₂O)₆]²⁺ o'lchovlari eng murakkab Mössbauer eksperimentlaridan biridir — asosiy muammo Fe(II) → Fe(III) HAVODA OKSIDLANISHIDIR. Quyidagi jadval bu va boshqa muammolarni va yechimlarini keltiradi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("[Fe(H₂O)₆]²⁺ o'lchovlari eng murakkab Mössbauer eksperimentlaridan biridir — asosiy muammo Fe(II) → Fe(III) HAVODA OKSIDLANISHIDIR. Quyidagi jadval bu va boshqa muammolarni va yechimlarini keltiradi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        interferences.forEach((iv, idx) => {
          checkPageBreak(60)
          const sevColor = iv.severity === "Yuqori" ? C.red : (iv.severity === "O'rta" ? C.orange : C.green)
          const sevBg = iv.severity === "Yuqori" ? C.bgRed : (iv.severity === "O'rta" ? C.bgOrange : C.bgGreen)
          page.drawRectangle({
            x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: sevBg,
          })
          safeText(`${idx + 1}. ${iv.source}`, {
            x: MARGIN + 6, y: y - 12, size: 9.5, font: boldFont, color: sevColor, maxWidth: CONTENT_W * 0.5,
          })
          safeText(`Ta'sir: ${iv.freqRange}`, {
            x: MARGIN + CONTENT_W * 0.52, y: y - 12, size: 8.5,
            font: regularFont, color: C.textDark, maxWidth: CONTENT_W * 0.28,
          })
          safeText(`[${iv.severity}]`, {
            x: PAGE_W - MARGIN - 6, y: y - 12, size: 8.5,
            font: boldFont, color: sevColor, align: "right", maxWidth: CONTENT_W * 0.15,
          })
          y -= 20

          const h1 = drawWrappedText(`Ta'sir: ${iv.effect}`, {
            x: MARGIN + 8, y, size: 8.5, font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - 16, lineHeight: 11,
          })
          y -= h1 + 4
          const h2 = drawWrappedText(`Yechim: ${iv.solution}`, {
            x: MARGIN + 8, y, size: 8.5, font: italicFont, color: C.emeraldDeep,
            maxWidth: CONTENT_W - 16, lineHeight: 11,
          })
          y -= h2 + 10
        })
      }

      // 12. XULOSALAR
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar")
        const conclusions = [
          "[Fe(H₂O)₆]²⁺ (FeSO₄·7H₂O) Mössbauer spektri KATTA SIMMETRIK DUBLET — Fe(II) HS d⁶ (t₂g⁴ eg²) konfiguratsiyaning klassik namunasi va Fe(II) HS altin standarti.",
          "δ = +1.39 mm/s — Fe(II) HS ning ENG YUQORI qiymatlaridan. Sabab: 6 ta 3d elektron 4s ni maksimal ekranlaydi + H₂O kuchsiz maydon + ionli bog'lanish + π-back-bonding yo'q → |ψ(0)|² past.",
          "ΔE_Q = +3.19 mm/s — Mössbauer da uchraydigan ENG KATTA d-d parametrlaridan. t₂g⁴ asimmetrik konfiguratsiya → V_val = +4/7·<r⁻³>·e katta musbat.",
          "V_zz > 0 (musbat) — 'applied field' Mössbauer bilan tasdiqlangan (9T, 4.2 K, H_hf induced ~24 T).",
          "H_hf = 0 (RT) — paramagnit S=2, ammo spin relaksatsiya tez (τ_e ≈ 10⁻¹¹ s). Faqat tashqi maydonda yoki past T da induced sekstet.",
          "ΔE_Q(T) qattiq bog'liq (Ingalls effekti): 4.2 K da 3.30 → 400 K da 2.95. Bu t₂g pod-qatlam trigonal buzilish parametri Δ ≈ 400−500 cm⁻¹ ni beradi.",
          "Tarixiy ahamiyat: FeSO₄·7H₂O 1959 yilda S.S. Hanna tomonidan ⁵⁷Fe uchun BIRINCHI Mössbauer o'lchov qilingan namunadir (Phys. Rev. Lett. 4, 177).",
          "K₄[Fe(CN)₆] (Fe(II) LS, singlet) bilan taqqoslash Fe(II) ning ikki qiyofasini ochib beradi: ligand maydon kuchi (H₂O vs CN⁻) → spin holati (HS vs LS) → δ 1.43 mm/s va ΔE_Q 3.19 mm/s farqi.",
          "Amaliyot: Fe(II) HS biologik sistemalarda (deoksigemoglobin, [4Fe-4S] ferredoksin), Fe-ion batareyalar, MRI kontrast agentlari (SPION prekursorlari) uchun referens birikma."
        ]
        conclusions.forEach((c, i) => {
          checkPageBreak(30)
          const boxH = wrapText(cleanText(c), regularFont, 9.5, CONTENT_W - 30).length * 12 + 12
          page.drawRectangle({
            x: MARGIN, y: y - boxH, width: CONTENT_W,
            height: boxH, color: i % 2 === 0 ? C.bgGreen : C.white,
          })
          page.drawCircle({
            x: MARGIN + 12, y: y - 12, size: 8,
            color: C.emeraldDeep,
          })
          safeText(`${i + 1}`, {
            x: MARGIN + 12, y: y - 15, size: 8, font: boldFont, color: C.white, align: "center",
          })
          drawWrappedText(c, {
            x: MARGIN + 26, y: y - 12, size: 9.5,
            font: regularFont, color: C.textDark, maxWidth: CONTENT_W - 32, lineHeight: 12,
          })
          y -= boxH + 4
        })
      }

      addFooter()
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Fe-H2O-6-2plus-Mossbauer-Tahlili-${new Date().toISOString().split("T")[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error(err)
      alert("PDF yaratishda xatolik: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* HEADER */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 sticky top-0 bg-purple-950/80 backdrop-blur-md z-20">
        <Link href="/ilmiy/tahlil/mossbauer/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg transition-colors">
          ← Birikmalar
        </Link>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-emerald-400 flex items-center gap-2">
            ⚛️ [Fe(H₂O)₆]²⁺ — Mössbauer tahlili
          </h1>
          <p className="text-purple-400 text-xs">Geksaakvatemir(II) · Fe²⁺ HS · d⁶ t₂g⁴eg² · Fe(II) HS altin standarti</p>
        </div>
        <button
          onClick={() => setPdfModalOpen(true)}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-lg text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <span>📥</span> PDF eksport
        </button>
      </header>

      {/* PDF MODAL */}
      {pdfModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-purple-950 border border-purple-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-400">📄 PDF eksport — bo&apos;limlarni tanlang</h2>
              <button onClick={() => setPdfModalOpen(false)}
                className="text-purple-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { key: "identification", label: "1. Birikma identifikatsiyasi", desc: "Formula, IUPAC, CAS, XRD ma'lumotlar (20 qator)" },
                { key: "theory", label: "2. Nazariy asos", desc: "Recoil-free rezonans, Hanna 1959, Kerler 1963" },
                { key: "parameters", label: "3. Mössbauer parametrlari", desc: "6 ta parametr (δ, ΔE_Q, ΔE_Q(T), H_hf, Γ, f_LM)" },
                { key: "spectrum", label: "4. Katta dublet talqini", desc: "V_val, V_lat, V_zz belgi, chiziq intensivligi" },
                { key: "temperature", label: "5. Ingalls effekti (ΔE_Q(T))", desc: "6 ta harorat qiymati (4.2−400 K)" },
                { key: "selectionRules", label: "6. Tanlash qoidalari", desc: "Fe(II) HS uchun maxsus (8 ta qoida)" },
                { key: "hsVsLs", label: "7. Fe(II) HS vs LS", desc: "13 qatorli batafsil taqqoslash jadvali" },
                { key: "aqua", label: "8. Akvakomplekslar qatori", desc: "6 ta Fe kompleks — HS, LS, akva, ammin" },
                { key: "experimental", label: "9. Tajriba parametrlari", desc: "12 ta amaliy tavsiyalar" },
                { key: "techniques", label: "10. O'lchov rejimlari", desc: "4 ta rejim — glove-box, muzlagan eritma va h.k." },
                { key: "interferences", label: "11. Halaqit beruvchi omillar", desc: "8 ta omil va yechimlari" },
                { key: "conclusions", label: "12. Asosiy xulosalar", desc: "9 ta ilmiy xulosa" },
              ].map(s => (
                <label
                  key={s.key}
                  className="flex items-start gap-3 p-3 bg-purple-800/30 border border-purple-700/40 rounded-lg hover:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={pdfSections[s.key]}
                    onChange={(e) => setPdfSections({ ...pdfSections, [s.key]: e.target.checked })}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="text-emerald-300 font-semibold text-sm">{s.label}</div>
                    <div className="text-purple-300 text-xs mt-0.5">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 mb-4">
              <p className="text-emerald-200 text-xs">
                <strong>⚠ Eslatma:</strong> PDF Unicode (δ, ΔE_Q, α, ⁵⁷Fe, ⁻¹) qo&apos;llash uchun{" "}
                <code className="bg-purple-950 px-1 rounded">/public/fonts/</code> papkasida DejaVuSans*.ttf fayllari bo&apos;lishi kerak. Kutilgan hajm: ~6−8 sahifa A4.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPdfModalOpen(false)}
                className="flex-1 py-3 rounded-lg border border-purple-500 text-purple-300 hover:bg-purple-800/40 transition-colors text-sm"
              >
                Bekor qilish
              </button>
              <button
                onClick={generatePDF}
                disabled={pdfGenerating || !Object.values(pdfSections).some(v => v)}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF ni yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════ 1. HERO KARTASI ═══════════ */}
        <div className="bg-gradient-to-br from-emerald-900/30 via-purple-900/30 to-blue-900/30 border border-emerald-500/40 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">⚛️</span>
                <div>
                  <div className="text-emerald-400 text-2xl md:text-3xl font-bold" dangerouslySetInnerHTML={{__html: COMPOUND.formulaHTML}}/>
                  <p className="text-purple-300 text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-purple-400 text-xs italic">« FeSO₄·7H₂O — Melanterit »</p>
                </div>
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                <strong className="text-emerald-300">[Fe(H₂O)₆]²⁺</strong> — Fe(II) yuqori spin (HS) holatining
                <strong className="text-yellow-300"> KLASSIK ALTIN STANDARTI</strong> Mössbauer amaliyotida.
                H₂O — kuchsiz maydon ligand (Δo ≈ 10 400 cm⁻¹ &lt; P), shu sababli HS holat majburiy:
                t₂g⁴ eg² konfiguratsiya (4 yakka spin, S = 2). Asimmetrik zaryad taqsimoti tufayli
                <strong className="text-orange-300"> ENG KATTA</strong> d-d parametrlarini beradi:
                δ = +1.39 va ΔE_Q = +3.19 mm/s. FeSO₄·7H₂O (Melanterit) 1959-yilda S.S. Hanna
                tomonidan ⁵⁷Fe uchun <strong className="text-yellow-200">BIRINCHI Mössbauer</strong> o&apos;lchov qilingan tarixiy namunadir.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-xl border-2 border-emerald-500/30 shadow-inner flex items-center justify-center text-xs text-white/80 font-mono font-bold"
                style={{background: "linear-gradient(135deg, #a8d5ba, #6ee7b7, #34d399)"}}>
                Och yashil-havorang
              </div>
              <div className="bg-purple-950/60 rounded-lg p-2 text-[10px] space-y-0.5">
                <p><span className="text-purple-400">M (7H₂O):</span> <span className="text-white font-mono">278.02 g/mol</span></p>
                <p><span className="text-purple-400">CAS:</span> <span className="text-white font-mono">7782-63-0</span></p>
                <p><span className="text-purple-400">Fe–O:</span> <span className="text-white font-mono">2.12 Å</span></p>
                <p><span className="text-purple-400">μ_eff:</span> <span className="text-white font-mono">5.10−5.40 μB</span></p>
              </div>
            </div>
          </div>

          {/* Asosiy parametrlar */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6">
            <div className="bg-emerald-600/20 border border-emerald-500/40 rounded-lg p-3 text-center">
              <p className="text-emerald-400 text-[10px] uppercase tracking-wider">δ (izomer siljish)</p>
              <p className="text-white font-mono text-lg font-bold">+1.39</p>
              <p className="text-purple-400 text-[9px]">mm/s — ENG YUQORI</p>
            </div>
            <div className="bg-orange-600/20 border border-orange-500/40 rounded-lg p-3 text-center">
              <p className="text-orange-400 text-[10px] uppercase tracking-wider">ΔE_Q (kvadrupol)</p>
              <p className="text-white font-mono text-lg font-bold">+3.19</p>
              <p className="text-purple-400 text-[9px]">mm/s — ENG KATTA</p>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/40 rounded-lg p-3 text-center">
              <p className="text-blue-400 text-[10px] uppercase tracking-wider">H_hf (magnit)</p>
              <p className="text-white font-mono text-lg font-bold">0</p>
              <p className="text-purple-400 text-[9px]">T (paramag, RT)</p>
            </div>
            <div className="bg-teal-600/20 border border-teal-500/40 rounded-lg p-3 text-center">
              <p className="text-teal-400 text-[10px] uppercase tracking-wider">Γ (kenglik)</p>
              <p className="text-white font-mono text-lg font-bold">0.30</p>
              <p className="text-purple-400 text-[9px]">mm/s (77 K)</p>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-lg p-3 text-center">
              <p className="text-yellow-400 text-[10px] uppercase tracking-wider">Spektr</p>
              <p className="text-white font-mono text-base font-bold">KATTA</p>
              <p className="text-purple-400 text-[9px]">dublet</p>
            </div>
          </div>

          {/* Maxsus xususiyat — Fe(II) HS ALTIN STANDART */}
          <div className="mt-4 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/50 rounded-xl p-4">
            <p className="text-emerald-200 text-sm flex items-start gap-2">
              <span className="text-2xl">🏆</span>
              <span>
                <strong className="text-emerald-300">Tarixiy maqom:</strong> FeSO₄·7H₂O — <strong className="text-yellow-300">1959 yilda ⁵⁷Fe uchun BIRINCHI</strong> Mössbauer o&apos;lchov qilingan namuna (S.S. Hanna, Phys. Rev. Lett. 4, 177). Butun Fe komplekslari Mössbauer amaliyoti aynan shu birikmadan boshlangan. Fe(II) HS uchun <strong className="text-orange-300">ALTIN STANDART</strong>.
              </span>
            </p>
          </div>
        </div>

        {/* ═══════════ 2. INTERAKTIV SPEKTR ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-xl font-bold text-white">Interaktiv Mössbauer spektr simulyatori</h2>
              <p className="text-purple-400 text-xs">Fe(II) HS ning katta dublet spektrini o&apos;zgartirib kuzating</p>
            </div>
          </div>

          {/* Boshqaruv */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-bold">δ (izomer siljish):</span>
                <span className="text-white font-mono">{simDelta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="-0.5" max="2.0" step="0.01" value={simDelta}
                onChange={(e) => setSimDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>Kovalent (−0.5)</span>
                <span>Fe(III) (~0.5)</span>
                <span>Fe(II) HS (+1.4)</span>
              </div>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-orange-400 font-bold">ΔE_Q (kvadrupol):</span>
                <span className="text-white font-mono">{simDeltaQ.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0" max="3.5" step="0.02" value={simDeltaQ}
                onChange={(e) => setSimDeltaQ(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>Singlet (0)</span>
                <span>K₃ (0.28)</span>
                <span>Fe(II) HS (3.2)</span>
              </div>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-teal-400 font-bold">Γ (kenglik):</span>
                <span className="text-white font-mono">{simGamma.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.15" max="0.8" step="0.01" value={simGamma}
                onChange={(e) => setSimGamma(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>Tabiiy (0.19)</span>
                <span>Fe(II) HS (0.30)</span>
                <span>Kengaygan (0.8)</span>
              </div>
            </div>
          </div>

          {/* Preset tugmalari */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setSimDelta(1.39); setSimDeltaQ(3.19); setSimGamma(0.30) }}
              className="px-3 py-1 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-full text-xs hover:bg-emerald-600/50 transition-colors">
              🏆 [Fe(H₂O)₆]²⁺ (RT)
            </button>
            <button onClick={() => { setSimDelta(1.42); setSimDeltaQ(3.28); setSimGamma(0.28) }}
              className="px-3 py-1 bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-full text-xs hover:bg-blue-600/50 transition-colors">
              ❄ [Fe(H₂O)₆]²⁺ (77 K)
            </button>
            <button onClick={() => { setSimDelta(1.44); setSimDeltaQ(3.30); setSimGamma(0.28) }}
              className="px-3 py-1 bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-full text-xs hover:bg-cyan-600/50 transition-colors">
              🥶 (4.2 K, maks ΔE_Q)
            </button>
            <button onClick={() => { setSimDelta(0.48); setSimDeltaQ(0.15); setSimGamma(0.32) }}
              className="px-3 py-1 bg-orange-600/30 border border-orange-500/40 text-orange-300 rounded-full text-xs hover:bg-orange-600/50 transition-colors">
              🟠 [Fe(H₂O)₆]³⁺ (taqqoslash)
            </button>
            <button onClick={() => { setSimDelta(-0.04); setSimDeltaQ(0.00); setSimGamma(0.24) }}
              className="px-3 py-1 bg-yellow-600/30 border border-yellow-500/40 text-yellow-300 rounded-full text-xs hover:bg-yellow-600/50 transition-colors">
              🟡 K₄[Fe(CN)₆] (Fe(II) LS)
            </button>
            <button onClick={() => { setSimDelta(1.29); setSimDeltaQ(2.60); setSimGamma(0.35) }}
              className="px-3 py-1 bg-red-600/30 border border-red-500/40 text-red-300 rounded-full text-xs hover:bg-red-600/50 transition-colors">
              🔴 FeSO₄ (bezsuv, buzilgan)
            </button>
          </div>

          {/* Spektr */}
          <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/40">
            <InteraktivSpektr delta={simDelta} deltaQ={simDeltaQ} gamma={simGamma}/>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4 text-sm text-purple-200">
            <p><strong className="text-emerald-300">📖 Kuzatishlar:</strong></p>
            <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
              <li><strong>ΔE_Q ~3.2 mm/s</strong> — Mössbauer da uchraydigan eng katta d-d parametrlaridan (Fe(II) HS)</li>
              <li><strong>δ = +1.4 mm/s</strong> — Fe(II) HS ning ENG yuqori qiymatlaridan (Fe(II) LS dan 1.43 mm/s farq!)</li>
              <li><strong>Chiziqlar orasi 3+ mm/s</strong> — kalibrlash uchun ideal (K₄ 0, K₃ 0.28)</li>
              <li><strong>Ekstremum ikkilik</strong>: HS d⁶ da t₂g⁴ ↔ eg² asimmetriya + kuchsiz maydon → maksimal effektlar</li>
            </ul>
          </div>
        </div>

        {/* ═══════════ 3. PARAMETRLAR ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎛️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Giperkichik parametrlar — batafsil ilmiy tahlil</h2>
              <p className="text-purple-400 text-xs">6 ta parametr (δ, ΔE_Q, ΔE_Q(T), H_hf, Γ, f_LM) — har birini tanlab batafsil</p>
            </div>
          </div>

          {/* Parametr tanlagichi */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {mossbauerParams.map((p, i) => (
              <button key={i} onClick={() => setSelectedParam(i)}
                className={`px-2 py-3 rounded-xl text-left transition-all ${
                  selectedParam === i
                    ? "bg-emerald-600/30 border-2 border-emerald-400"
                    : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
                }`}>
                <div className={`font-bold text-sm ${selectedParam === i ? "text-emerald-300" : "text-emerald-400"}`}>{p.param}</div>
                <div className="text-purple-300 text-[9px] mt-0.5 leading-tight">{p.paramName}</div>
              </button>
            ))}
          </div>

          {/* Tanlangan parametr batafsil */}
          <div className="bg-purple-800/30 border border-emerald-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-baseline gap-4 flex-wrap">
              <div>
                <span className="text-emerald-400 text-3xl md:text-4xl font-bold">{p.param}</span>
                <span className="text-purple-300 text-sm ml-2">= </span>
                <span className="text-orange-400 text-xl md:text-2xl font-mono font-bold">{p.value}</span>
                <span className="text-purple-400 text-sm ml-1">{p.unit}</span>
              </div>
              <span className="text-purple-500 text-xs italic bg-purple-950/50 px-2 py-1 rounded">{p.reference}</span>
            </div>

            <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/20 text-center">
              <p className="text-emerald-300 font-mono text-xs md:text-sm">{p.formula}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-purple-950/40 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">📌 Fizik ma&apos;no</p>
                <p className="text-purple-200 text-xs">{p.physicalMeaning}</p>
              </div>
              <div className="bg-purple-950/40 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">🔬 Diagnostik ma&apos;no</p>
                <p className="text-purple-200 text-xs">{p.diagnostic}</p>
              </div>
              <div className="bg-purple-950/40 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">💡 Talqin</p>
                <p className="text-purple-200 text-xs">{p.interpretation}</p>
              </div>
              <div className="bg-purple-950/40 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">📊 Erkin ion / referens</p>
                <p className="text-purple-200 text-xs">{p.freeIon}</p>
              </div>
            </div>

            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-emerald-300 font-bold text-xs mb-2">🎓 Nazariy tushuntirish:</p>
              <p className="text-purple-100 text-xs leading-relaxed">{p.theoryNote}</p>
            </div>
          </div>

          {/* Barcha parametrlar tez jadval */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-emerald-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Qiymat</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Formula</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Diagnostik</th>
                </tr>
              </thead>
              <tbody>
                {mossbauerParams.map((mp, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3">
                      <div className="text-emerald-300 font-bold text-lg">{mp.param}</div>
                      <div className="text-purple-400 text-[10px]">{mp.paramName}</div>
                    </td>
                    <td className="py-2 px-3 font-mono">
                      <span className="text-orange-400 font-bold">{mp.value}</span>
                      <span className="text-purple-400 text-[10px] ml-1">{mp.unit}</span>
                    </td>
                    <td className="py-2 px-3 text-purple-300 text-[10px] font-mono">{mp.formula}</td>
                    <td className="py-2 px-3 text-purple-200 text-[11px]">{mp.diagnostic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════ 4. HARORAT — INGALLS EFFEKTI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌡️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Haroratga bog&apos;liq o&apos;lchovlar — Ingalls effekti</h2>
              <p className="text-purple-400 text-xs">4.2 K dan 400 K gacha ΔE_Q(T) trendi va t₂g pod-qatlam buzilishi</p>
            </div>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4 text-sm">
            <p className="text-emerald-300 font-bold text-xs mb-2">📖 Ingalls modeli (1964):</p>
            <p className="text-purple-100 text-xs leading-relaxed">
              Fe(II) HS ning ΔE_Q qattiq haroratga bog&apos;liqdir. Sabab: t₂g pod-qatlam koordinatsion muhit
              tomonidan biroz bo&apos;linadi (trigonal buzilish, Δ ≈ 400−500 cm⁻¹). Past T da (T « Δ/k_B) faqat
              eng past t₂g orbital to&apos;lgan → maksimal asimmetriya → ΔE_Q maksimal. Yuqori T da (T » Δ/k_B)
              barcha 3 t₂g orbital teng populatsiyalangan → sferikroq → ΔE_Q → 0. Bu egri chizik trigonal
              buzilish parametrini beradi.
            </p>
          </div>

          {/* Harorat tanlagichi */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {tempData.map((td, i) => (
              <button key={i} onClick={() => setSelectedTemp(i)}
                className={`px-3 py-2 rounded-lg text-center transition-all ${
                  selectedTemp === i
                    ? "bg-emerald-600/40 border-2 border-emerald-400"
                    : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
                }`}>
                <div className={`font-bold ${selectedTemp === i ? "text-emerald-300" : "text-emerald-400"}`}>{td.T} K</div>
              </button>
            ))}
          </div>

          {/* Tanlangan harorat detali */}
          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5">
            <h3 className="text-emerald-400 font-bold mb-3 text-sm">T = {t.T} K — {t.izoh}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <p className="text-emerald-400 text-[10px] uppercase">δ</p>
                <p className="text-white font-mono text-xl">{t.delta.toFixed(2)}</p>
                <p className="text-purple-500 text-[9px]">mm/s</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <p className="text-orange-400 text-[10px] uppercase">ΔE_Q</p>
                <p className="text-white font-mono text-xl">{t.deltaQ.toFixed(2)}</p>
                <p className="text-purple-500 text-[9px]">mm/s</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <p className="text-blue-400 text-[10px] uppercase">H_hf</p>
                <p className="text-white font-mono text-sm">{t.H_hf}</p>
                <p className="text-purple-500 text-[9px]">Tesla</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <p className="text-green-400 text-[10px] uppercase">f_LM</p>
                <p className="text-white font-mono text-xl">{t.fLM.toFixed(2)}</p>
                <p className="text-purple-500 text-[9px]">o&apos;lchamsiz</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <p className="text-teal-400 text-[10px] uppercase">Γ</p>
                <p className="text-white font-mono text-xl">{t.gamma.toFixed(2)}</p>
                <p className="text-purple-500 text-[9px]">mm/s</p>
              </div>
            </div>
          </div>

          {/* ΔE_Q(T) GRAFIK */}
          <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/40">
            <h4 className="text-emerald-400 font-bold text-xs mb-2">📈 ΔE_Q(T) egri chizig&apos;i — Ingalls modeli</h4>
            <svg viewBox="0 0 600 260" className="w-full h-auto">
              {/* Fon va grid */}
              <rect x="60" y="20" width="520" height="200" fill="#0f0a1e" opacity="0.4" rx="4"/>
              {[0, 100, 200, 300, 400].map(T => (
                <g key={T}>
                  <line x1={60 + (T / 400) * 520} y1="20" x2={60 + (T / 400) * 520} y2="220"
                    stroke="#4c1d95" strokeWidth="0.4" strokeDasharray="2,3"/>
                  <text x={60 + (T / 400) * 520} y="238" fill="#a78bfa" fontSize="10" textAnchor="middle">{T}</text>
                </g>
              ))}
              {[2.9, 3.0, 3.1, 3.2, 3.3, 3.4].map(EQ => (
                <g key={EQ}>
                  <line x1="60" y1={20 + ((3.4 - EQ) / 0.5) * 200} x2="580" y2={20 + ((3.4 - EQ) / 0.5) * 200}
                    stroke="#4c1d95" strokeWidth="0.4" strokeDasharray="2,3"/>
                  <text x="50" y={24 + ((3.4 - EQ) / 0.5) * 200} fill="#a78bfa" fontSize="10" textAnchor="end">{EQ.toFixed(1)}</text>
                </g>
              ))}

              {/* Egri chizig'i */}
              <polyline
                points={tempData.map(td => `${60 + (td.T / 400) * 520},${20 + ((3.4 - td.deltaQ) / 0.5) * 200}`).join(' ')}
                fill="none" stroke="#10b981" strokeWidth="2.5"
              />

              {/* Nuqtalar */}
              {tempData.map((td, i) => (
                <g key={i}>
                  <circle cx={60 + (td.T / 400) * 520} cy={20 + ((3.4 - td.deltaQ) / 0.5) * 200}
                    r={selectedTemp === i ? "7" : "5"}
                    fill={selectedTemp === i ? "#fbbf24" : "#10b981"}
                    stroke="white" strokeWidth="1.5"/>
                  <text x={60 + (td.T / 400) * 520} y={15 + ((3.4 - td.deltaQ) / 0.5) * 200}
                    fill="#fde047" fontSize="9" textAnchor="middle" fontWeight="bold">{td.deltaQ.toFixed(2)}</text>
                </g>
              ))}

              {/* O'q nomlari */}
              <text x="320" y="255" fill="#c4b5fd" fontSize="11" textAnchor="middle" fontWeight="bold">T (K)</text>
              <text x="20" y="120" fill="#c4b5fd" fontSize="11" textAnchor="middle" fontWeight="bold" transform="rotate(-90, 20, 120)">ΔE_Q (mm/s)</text>
            </svg>
          </div>

          {/* To'liq jadval */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-emerald-500/30 bg-purple-950/50">
                  <th className="py-2 px-3 text-emerald-300 text-xs uppercase">T (K)</th>
                  <th className="py-2 px-3 text-emerald-300 text-xs uppercase">δ (mm/s)</th>
                  <th className="py-2 px-3 text-emerald-300 text-xs uppercase">ΔE_Q</th>
                  <th className="py-2 px-3 text-emerald-300 text-xs uppercase">f_LM</th>
                  <th className="py-2 px-3 text-emerald-300 text-xs uppercase">Γ</th>
                  <th className="py-2 px-3 text-emerald-300 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {tempData.map((td, i) => (
                  <tr key={i} className={`border-b border-purple-800/40 ${selectedTemp === i ? "bg-emerald-900/20" : "hover:bg-purple-800/20"}`}>
                    <td className="py-2 px-3 text-emerald-400 font-bold">{td.T}</td>
                    <td className="py-2 px-3 font-mono text-white">{td.delta.toFixed(2)}</td>
                    <td className="py-2 px-3 font-mono text-white">{td.deltaQ.toFixed(2)}</td>
                    <td className="py-2 px-3 font-mono text-white">{td.fLM.toFixed(2)}</td>
                    <td className="py-2 px-3 font-mono text-white">{td.gamma.toFixed(2)}</td>
                    <td className="py-2 px-3 text-purple-200 text-[11px]">{td.izoh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-teal-600/10 border border-teal-500/30 rounded-xl p-4 text-sm">
            <p className="text-teal-300 font-bold text-xs mb-2">⚡ Trendlar:</p>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>δ(T):</strong> chiziqli kamayadi (~−3·10⁻⁴ mm/s/K — SOD)</li>
              <li><strong>ΔE_Q(T):</strong> Ingalls trend — 4.2 K da 3.30 → 400 K da 2.95 (0.35 farq!)</li>
              <li><strong>f_LM(T):</strong> eksponentsial pasayish (θ_D ≈ 280 K — o&apos;rtacha kristall)</li>
              <li><strong>T &gt; 350 K:</strong> 7H₂O yo&apos;qolish, panjara buziladi, spektr o&apos;zgaradi</li>
            </ul>
          </div>
        </div>

        {/* ═══════════ 5. HS vs LS TAQQOSLASH ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚖️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fe(II) HS vs Fe(II) LS — Ikki qiyofa</h2>
              <p className="text-purple-400 text-xs">Bir xil oksidlanish darajasi, LIGAND MAYDONI farqi bilan boshqa dunyo!</p>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 text-sm text-purple-200">
            <p>[Fe(H₂O)₆]²⁺ (HS) va K₄[Fe(CN)₆] (LS) — Fe²⁺ ning IKKI ekstremumi. Oksidlanish darajasi
              <strong className="text-yellow-300"> bir xil (+2)</strong>, ammo ligand maydonining kuchi (H₂O
              vs CN⁻) Fe(II) ning ikki qiyofasini ochib beradi:</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Fe(II) HS ← BU</th>
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Fe(II) LS (K₄)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Ahamiyat</th>
                </tr>
              </thead>
              <tbody>
                {hsVsLs.map((k, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3 text-purple-300 font-bold text-xs">{k.param}</td>
                    <td className="py-2 px-3 text-emerald-300 font-mono text-xs">{k.hs}</td>
                    <td className="py-2 px-3 text-yellow-300 font-mono text-xs">{k.ls}</td>
                    <td className="py-2 px-3 text-purple-200 text-[11px] italic">{k.farq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-emerald-300 font-bold text-sm mb-2">🟢 [Fe(H₂O)₆]²⁺ — Fe(II) HS</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>t₂g⁴ eg²</strong> — 4 elektron t₂g da, 2 ta eg da → <strong className="text-orange-300">S=2, PARAMAGNIT</strong>.
                Asimmetrik zaryad taqsimoti → V_val juda katta → <strong className="text-orange-300">KATTA DUBLET</strong>.
                6 ta 3d elektron 4s ni ekranlaydi → |ψ(0)|² past → δ ENG YUQORI (+1.39).
                Rangi d-d (⁵T₂g → ⁵Eg) NIR sohada (1000 nm) → sariqroq nur so&apos;radi → yashilroq ko&apos;rinadi.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-300 font-bold text-sm mb-2">🟡 K₄[Fe(CN)₆] — Fe(II) LS</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>t₂g⁶ eg⁰</strong> — 6 elektron t₂g da juftlangan → <strong className="text-orange-300">S=0, DIAMAGNIT</strong>.
                Sferik simmetriya → V_val = 0 → <strong className="text-orange-300">SINGLET</strong>.
                Kovalent Fe-C bog&apos;lanish + π-back-donation → |ψ(0)|² yuqori → δ ENG PAST (−0.04).
                Rangi MLCT (Fe→CN) 320 nm da → sariq.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 6. AKVAKOMPLEKSLAR QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💧</span>
            <div>
              <h2 className="text-xl font-bold text-white">Akvakomplekslar qatori va Fe(II)/Fe(III)</h2>
              <p className="text-purple-400 text-xs">Fe ionlarining oksidlanish darajasi va spin holatini ajratish</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Nomi</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Oksid.</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">δ</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ΔE_Q</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Spektr</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Ion radius</th>
                </tr>
              </thead>
              <tbody>
                {aquaSeries.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/40 ${c.current ? "bg-emerald-900/20 border-emerald-500/30" : "hover:bg-purple-800/20"}`}>
                    <td className={`py-3 px-3 font-bold ${c.current ? "text-emerald-300" : "text-purple-200"}`}>{c.formula}</td>
                    <td className="py-3 px-3 text-purple-300 text-xs">{c.trad}</td>
                    <td className="py-3 px-3 text-purple-200 text-xs">{c.oxid}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{c.delta}</td>
                    <td className="py-3 px-3 font-mono text-orange-400">{c.deltaQ}</td>
                    <td className="py-3 px-3 text-teal-300 text-xs">{c.spektr}</td>
                    <td className="py-3 px-3 text-purple-300 text-xs">{c.ionRadius}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-emerald-300 font-bold text-sm mb-2">💧 Fe(II) HS oilasi</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>[Fe(H₂O)₆]²⁺ / [Fe(NH₃)₆]²⁺ / FeSO₄·7H₂O</strong> — barchasi kuchsiz maydon ligand
                (H₂O, NH₃) bilan Fe(II) HS holat. δ ≈ 1.2−1.4, ΔE_Q ≈ 2.3−3.2. NH₃ H₂O dan biroz kuchliroq
                maydon → ΔE_Q kichikroq (2.30 vs 3.19).
              </p>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4">
              <p className="text-orange-300 font-bold text-sm mb-2">🟠 [Fe(H₂O)₆]³⁺ — taqqoslash</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Fe(II) → Fe(III) o&apos;tganda:</strong> δ 1.39 → 0.48 (0.91 mm/s pasayadi — 3d elektron
                kamayadi). ΔE_Q 3.19 → 0.15 (KESKIN pasayish — d⁵ sferik). Bu ikki parametr Fe(II) va
                Fe(III) ni AJRATISHNING eng aniq usulidir.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 7. TANLASH QOIDALARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📐</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tanlash qoidalari — ⁵⁷Fe (Fe(II) HS uchun maxsus)</h2>
              <p className="text-purple-400 text-xs">Fe(II) HS spektroskopik xususiyatlari uchun tanlash qoidalari</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectionRules.map((sr, i) => (
              <div key={i} className="bg-purple-800/30 border border-purple-700/40 rounded-lg p-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-emerald-300 font-mono font-bold text-base">{sr.rule}</span>
                </div>
                <p className="text-purple-300 text-xs mt-1">{sr.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-sm">
            <p className="text-blue-300 font-bold text-xs mb-2">💡 Fe(II) HS uchun 4 o&apos;tish yo&apos;li → 2 chiziqli dublet:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-purple-200">
              <div className="bg-purple-950/40 rounded p-2 font-mono">±3/2 → ±1/2 (chap chiziq)</div>
              <div className="bg-purple-950/40 rounded p-2 font-mono">±3/2 → ∓1/2</div>
              <div className="bg-purple-950/40 rounded p-2 font-mono">±1/2 → ±1/2 (o&apos;ng chiziq)</div>
              <div className="bg-purple-950/40 rounded p-2 font-mono">±1/2 → ∓1/2</div>
            </div>
            <p className="text-purple-200 text-xs mt-2">Katta ΔE_Q sabab chiziqlar yaxshi ajraladi va poroshok
              namuna uchun ideal intensivlik nisbati <strong className="text-yellow-300">1:1</strong>.</p>
          </div>
        </div>

        {/* ═══════════ 8. TAJRIBA PARAMETRLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tavsiya etilgan tajriba parametrlari</h2>
              <p className="text-purple-400 text-xs">Fe(II) HS Mössbauer o&apos;lchov uchun 12 ta amaliy tavsiya</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-emerald-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Qiymat / tavsiya</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {experimentalParams.map((e, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3 text-emerald-300 font-bold text-xs">{e.param}</td>
                    <td className="py-2 px-3 text-white font-mono text-xs">{e.value}</td>
                    <td className="py-2 px-3 text-purple-300 text-[11px] italic">{e.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════ 9. O'LCHOV REJIMLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h2 className="text-xl font-bold text-white">O&apos;lchov rejimlari va namuna tayyorlash</h2>
              <p className="text-purple-400 text-xs">4 xil texnika — Fe(II) HS ga xos qiyinliklar bilan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {techniques.map((t, idx) => (
              <div key={idx} className="bg-purple-800/30 border border-purple-700/40 rounded-xl overflow-hidden">
                <div className="bg-blue-600/30 px-4 py-2 border-b border-blue-500/30">
                  <h3 className="text-blue-300 font-bold text-sm">{idx + 1}. {t.name}</h3>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-purple-200 text-xs italic leading-relaxed">{t.description}</p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-bold text-xs mb-1">✓ Afzalliklar</p>
                      <ul className="text-purple-200 text-[10px] space-y-0.5 list-disc list-inside">
                        {t.advantages.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-300 font-bold text-xs mb-1">✗ Kamchiliklar</p>
                      <ul className="text-purple-200 text-[10px] space-y-0.5 list-disc list-inside">
                        {t.disadvantages.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-950/50 rounded-lg p-2 text-[10px] space-y-0.5">
                    <p><span className="text-yellow-400">Diapazon:</span> <span className="text-purple-200 font-mono">{t.freqRange}</span></p>
                    <p><span className="text-yellow-400">Ruxsat:</span> <span className="text-purple-200 font-mono">{t.resolution}</span></p>
                    <p><span className="text-yellow-400">Tayyorlash:</span> <span className="text-purple-200 font-mono">{t.samplePrep}</span></p>
                    <p><span className="text-yellow-400">Eng yaxshi:</span> <span className="text-teal-300 italic">{t.bestFor}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════ 10. HALAQIT OMILLAR ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Halaqit beruvchi omillar va yechimlari</h2>
              <p className="text-purple-400 text-xs">Fe(II) HS ga xos — eng katta muammo: HAVODA OKSIDLANISH</p>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/40 rounded-xl p-4">
            <p className="text-red-300 font-bold text-sm mb-2 flex items-center gap-2">
              <span className="text-2xl">🚨</span> ENG KATTA MUAMMO: Fe(II) → Fe(III) OKSIDLANISHI
            </p>
            <p className="text-purple-100 text-xs">
              [Fe(H₂O)₆]²⁺ ni o&apos;lchashda ASOSIY muammo — havoda O₂ va H₂O ta&apos;sirida Fe²⁺ → Fe³⁺
              oksidlanadi. Bir necha kunda 50% Fe(III) ga o&apos;tishi mumkin! MAJBURIY: glove-box (Ar/N₂,
              O₂ &lt; 1 ppm), freshli sintez, askorbin kislotasi. Bu ehtiyot ishlar bilan boshlash kerak.
            </p>
          </div>

          <div className="space-y-3">
            {interferences.map((iv, i) => {
              const sevColors = {
                "Yuqori": { border: "border-red-500/40", bg: "bg-red-900/20", text: "text-red-400" },
                "O'rta":  { border: "border-orange-500/40", bg: "bg-orange-900/20", text: "text-orange-400" },
                "Past":   { border: "border-green-500/40", bg: "bg-green-900/20", text: "text-green-400" },
              }
              const c = sevColors[iv.severity] || sevColors["O'rta"]
              return (
                <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`${c.text} font-bold text-sm`}>{i + 1}. {iv.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-xs font-mono">{iv.freqRange}</span>
                      <span className={`${c.text} font-bold text-xs bg-black/30 px-2 py-0.5 rounded`}>[{iv.severity}]</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-purple-200"><strong className="text-red-300">Ta&apos;sir:</strong> {iv.effect}</p>
                    <p className="text-purple-200"><strong className="text-emerald-300">Yechim:</strong> <em className="text-emerald-200">{iv.solution}</em></p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ═══════════ 11. TARIXIY KONTEKST ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tarixiy kontekst — FeSO₄·7H₂O va Mössbauer</h2>
              <p className="text-purple-400 text-xs">Qadim davrlardan kvant batareyalargacha — 2000+ yillik yo&apos;l</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-purple-500 to-teal-500"></div>
            <div className="space-y-3">
              {historyEvents.map((h, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 border-2 border-purple-950"></div>
                  <div className="bg-purple-800/30 rounded-lg p-3 border border-purple-700/40">
                    <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                      <span className="text-emerald-400 font-bold text-sm font-mono">{h.year}</span>
                      <span className="text-teal-300 font-semibold text-sm">{h.event}</span>
                    </div>
                    <p className="text-purple-200 text-xs">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ 12. XULOSALAR ═══════════ */}
        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/30 rounded-2xl p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <h2 className="text-xl font-bold text-white">Asosiy xulosalar</h2>
          </div>
          <ol className="space-y-2 text-purple-200 text-sm list-decimal list-inside leading-relaxed">
            <li>[Fe(H₂O)₆]²⁺ (FeSO₄·7H₂O) Mössbauer spektri <strong className="text-emerald-300">KATTA SIMMETRIK DUBLET</strong> — Fe(II) HS d⁶ (t₂g⁴ eg²) konfiguratsiyasining klassik namunasi va Fe(II) HS altin standarti.</li>
            <li><strong className="text-emerald-300">δ = +1.39 mm/s</strong> — Fe(II) HS ning ENG YUQORI qiymatlaridan. Sabab: 6 ta 3d elektron 4s ni maksimal ekranlaydi + H₂O kuchsiz maydon + ionli bog&apos;lanish + π-back-bonding yo&apos;q → |ψ(0)|² past.</li>
            <li><strong className="text-orange-300">ΔE_Q = +3.19 mm/s</strong> — Mössbauer da uchraydigan ENG KATTA d-d parametrlaridan. t₂g⁴ asimmetrik konfiguratsiya → V_val = +4/7·&lt;r⁻³&gt;·e katta musbat.</li>
            <li><strong className="text-yellow-300">V_zz &gt; 0 (musbat)</strong> — &apos;applied field&apos; Mössbauer bilan tasdiqlangan (9T, 4.2 K, H_hf induced ~24 T).</li>
            <li><strong className="text-blue-300">H_hf = 0 (RT)</strong> — paramagnit S=2, ammo spin relaksatsiya tez (τ_e ≈ 10⁻¹¹ s). Faqat tashqi maydonda yoki past T da induced sekstet.</li>
            <li><strong className="text-teal-300">ΔE_Q(T) qattiq bog&apos;liq</strong> (Ingalls effekti): 4.2 K da 3.30 → 400 K da 2.95. Bu t₂g pod-qatlam trigonal buzilish parametri Δ ≈ 400−500 cm⁻¹ ni beradi.</li>
            <li><strong className="text-yellow-200">Tarixiy ahamiyat:</strong> FeSO₄·7H₂O 1959 yilda S.S. Hanna tomonidan ⁵⁷Fe uchun BIRINCHI Mössbauer o&apos;lchov qilingan namunadir (Phys. Rev. Lett. 4, 177).</li>
            <li>K₄[Fe(CN)₆] (Fe(II) LS, singlet) bilan taqqoslash Fe(II) ning ikki qiyofasini ochib beradi: ligand maydon kuchi (H₂O vs CN⁻) → spin holati (HS vs LS) → <strong className="text-orange-300">δ 1.43 mm/s va ΔE_Q 3.19 mm/s farqi</strong>.</li>
            <li>Amaliyot: Fe(II) HS biologik sistemalarda (deoksigemoglobin, [4Fe-4S] ferredoksin), Fe-ion batareyalar, MRI kontrast agentlari (SPION prekursorlari) uchun referens birikma.</li>
          </ol>
        </div>

        {/* ═══════════ 13. ADABIYOTLAR ═══════════ */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-2xl p-6 space-y-3">
          <h3 className="text-emerald-400 font-bold flex items-center gap-2 text-lg">
            <span>📚</span> Manba adabiyotlar
          </h3>
          <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>P. Gütlich, E. Bill, A. X. Trautwein</strong> — <em>Mössbauer Spectroscopy and Transition Metal Chemistry: Fundamentals and Applications</em>. Springer, 2011.</li>
            <li><strong>N. N. Greenwood, T. C. Gibb</strong> — <em>Mössbauer Spectroscopy</em>. Chapman &amp; Hall, London, 1971 (klassik).</li>
            <li><strong>S. S. Hanna et al.</strong> — Direct evidence for the dipole character of the 14.4-keV gamma-ray from ⁵⁷Fe. <em>Phys. Rev. Lett.</em> <strong>4</strong>, 177 (1960) — birinchi ⁵⁷Fe Mössbauer!</li>
            <li><strong>W. Kerler</strong> — Untersuchung des Isomerieshifts an Eisen-Verbindungen. <em>Z. Physik</em> <strong>173</strong>, 321 (1963) — FeSO₄·7H₂O to&apos;liq tahlil.</li>
            <li><strong>R. Ingalls</strong> — Electric field gradient tensor in ferrous compounds. <em>Phys. Rev.</em> <strong>133</strong>, A787 (1964) — ΔE_Q(T) modeli.</li>
            <li><strong>F. Menil</strong> — Systematic trends of the ⁵⁷Fe Mössbauer isomer shifts. <em>J. Phys. Chem. Solids</em> <strong>46</strong>, 763 (1985).</li>
            <li><strong>R. L. Mössbauer</strong> — Kernresonanzfluoreszenz von Gammastrahlung in Ir¹⁹¹. <em>Z. Physik</em> <strong>151</strong>, 124 (1958) — asl kashfiyot.</li>
            <li><strong>R. H. Herber (ed.)</strong> — <em>Chemical Mössbauer Spectroscopy</em>. Plenum Press, 1984.</li>
            <li><strong>J. Chappert</strong> — Ferrous ammonium sulfate applied field Mössbauer study. <em>J. Physique</em> <strong>33</strong>, C6-229 (1972) — V_zz belgi.</li>
          </ul>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/k4-fe-cn6"
            className="px-6 py-3 border border-yellow-500 rounded-xl hover:bg-yellow-800/30 text-yellow-300 transition-all hover:border-yellow-400 flex items-center gap-2">
            <span>←</span>
            <div className="text-left">
              <div className="text-[10px] text-yellow-400">Oldingi:</div>
              <div className="font-bold">K₄[Fe(CN)₆] — Sariq qon</div>
            </div>
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar"
            className="px-6 py-3 bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500 rounded-xl text-purple-200 font-semibold transition-all flex items-center gap-2">
            <span>◉</span>
            <div className="text-center">
              <div className="text-[10px] text-purple-400">Barcha:</div>
              <div>Birikmalar katalogi</div>
            </div>
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-3"
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30">
            <div className="text-right">
              <div className="text-[10px] text-orange-100">Keyingi:</div>
              <div>[Fe(H₂O)₆]³⁺ Fe(III) HS</div>
            </div>
            <span>→</span>
          </Link>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/50 mt-12 py-6 px-6 text-center">
        <p className="text-purple-400 text-xs">
          <strong className="text-emerald-400">jdakimyo.uz</strong> — o&apos;zbek tilida ilmiy kompleks birikmalar platformasi
        </p>
        <p className="text-purple-500 text-[10px] mt-1">
          Mössbauer spektroskopiyasi · [Fe(H₂O)₆]²⁺ · FeSO₄·7H₂O (Melanterit) · Fe(II) HS altin standarti
        </p>
      </footer>
    </main>
  )
}