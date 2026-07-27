"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₄[Fe(CN)₆]·3H₂O — MÖSSBAUER SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • Gütlich P., Bill E., Trautwein A.X. — Mössbauer Spectroscopy and Transition
//     Metal Chemistry: Fundamentals and Applications (Springer, 2011)
//   • Greenwood N.N., Gibb T.C. — Mössbauer Spectroscopy (Chapman & Hall, 1971)
//   • Menil F. — J. Phys. Chem. Solids 46, 763 (1985) — δ va kimyoviy bog'lanish
//   • Mössbauer R.L. — Z. Physik 151, 124 (1958) — asl kashfiyot
//   • Duncan J.F., Golding R.M. — Q. Rev. Chem. Soc. 19, 36 (1965) — sianoferratlar
//   • Kerler W., Neuwirth W. — Z. Physik 167, 176 (1962) — K₄[Fe(CN)₆] birinchi spektri
//   • Herber R.H. (ed.) — Chemical Mössbauer Spectroscopy (Plenum, 1984)
// Xususiyat: Sariq qon tuzi — Mössbauer amaliyotining "0 kalibrlash" birikmasi
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]·3H<sub>2</sub>O",
  formulaPlain: "K4[Fe(CN)6]·3H2O",
  iupac: "Kaliy geksatsianoferrat(II) trigidrat",
  commonName: "Sariq qon tuzi (Ferrocyanide)",
  molarMass: 422.39,
  molarMassAnhydrous: 368.35,
  casNumber: "14459-95-1",
  casAnhydrous: "13943-58-3",
  color: "limonli-sariq (och sariq) shaffof kristall",
  structure: "Oktaedr (Oh, [Fe(CN)6]⁴⁻ ioni)",
  metalLigand: "Fe–C≡N",
  spaceGroup: "C2/c (monoklinik) — trigidrat",
  crystalSystem: "Monoklinik",
  pointGroup: "Oh (kompleks anioni uchun, deyarli ideal)",
  bondLengthFeC: "1.900 Å (K₄ da qisqaroq — π-back-bonding kuchliroq)",
  bondLengthCN: "1.157 Å",
  bondAngle: "89.9° / 180° (N-Fe-N — deyarli mukammal)",
  cfseValue: "-2.4 Δo (t₂g⁶)",
  deltaOh: "33 800 cm⁻¹ (~404 kJ/mol) — CN⁻ eng kuchli maydon ligand",
  pairingEnergy: "~17 600 cm⁻¹ (Fe²⁺ uchun)",
  spinState: "d⁶ past spin (t₂g⁶ eg⁰) — to'liq to'lgan",
  spin: "S = 0 (diamagnit)",
  magnet: "Diamagnit (χ_M < 0, μ_eff = 0) — noyob Fe(II) LS ning izohi",
  solubility: "289 g/L (20°C) — yaxshi eriydi",
  logBeta: "log β₆ ≈ 35 — juda barqaror",
}

// ═══════════════════════════════════════════════════════════════════════════════
// MÖSSBAUER PARAMETRLARI — batafsil ilmiy izohlar bilan
// ═══════════════════════════════════════════════════════════════════════════════
const mossbauerParams = [
  {
    param: "δ", paramName: "Izomer siljish",
    value: "−0.04", unit: "mm/s",
    reference: "α-Fe (RT) ga nisbatan",
    physicalMeaning: "Yadro va s-elektron zichligining elektrostatik o'zaro ta'siri — |ψ(0)|² ga to'g'ri proporsional",
    formula: "δ = (2π/3)Ze²[|ψ_A(0)|² − |ψ_S(0)|²](ΔR/R)",
    diagnostic: "Fe²⁺ LS uchun tipik (−0.10 ÷ +0.50 mm/s diapazoni)",
    interpretation: "Manfiy δ — |ψ(0)|² juda yuqori — t₂g⁶ to'liq to'lgan + kovalent bog'lanish + π-back-bonding CN⁻ ga",
    intensity: "Juda muhim", intensityCode: 4,
    freeIon: "Fe²⁺(gaz): +1.4 mm/s (ekstrapolyatsiya) — kompleksda −1.44 mm/s siljish!",
    coordShift: "Erkin Fe²⁺ HS → CN⁻ bilan LS + kovalent → δ 1.5 mm/s pastga siljigan",
    theoryNote: "K₄[Fe(CN)₆] da izomer siljish deyarli 0 ga yaqin (−0.04 mm/s) — bu Fe²⁺ LS holatning eng past δ qiymatlaridan biri. Bu holatga uch omil hissa qo'shadi: (1) t₂g⁶ to'liq to'lgan — barcha 6 elektron t₂g da, eg bo'sh, 4s ekranlash minimal; (2) CN⁻ kuchli σ-donor — Fe(4s) ga elektron zichligini oshiradi; (3) CN⁻ kuchli π-akseptor — Fe(3d) → π*(CN) back-donation orqali 3d dan tashqariga elektron ketadi, |ψ(0)|² yanada oshadi. Natijada K₄[Fe(CN)₆] δ ≈ 0 shkalasining tayanchi sifatida ishlatiladi.",
    tag: "isomerShift"
  },
  {
    param: "ΔE_Q", paramName: "Kvadrupol bo'linishi",
    value: "0.00", unit: "mm/s",
    reference: "T = 295 K (RT) — noyob singlet",
    physicalMeaning: "Yadroning kvadrupol momenti Q va elektr maydon gradienti (EFG) o'zaro ta'siri",
    formula: "ΔE_Q = ½·e·Q·V_zz·√(1 + η²/3)",
    diagnostic: "t₂g⁶ to'liq to'lgan — barcha orbital juftlangan → V_val = 0",
    interpretation: "V_val = 0 (elektron sferik) + Oh ideal → V_lat = 0 → ΔE_Q = 0",
    intensity: "Juda muhim", intensityCode: 4,
    freeIon: "Fe(II) LS umumiy: 0.0 − 1.5 mm/s (odatda kichik)",
    coordShift: "Mukammal Oh + t₂g⁶ sferik → ΔE_Q ning eng past qiymati (~0)",
    theoryNote: "K₄[Fe(CN)₆] Mössbauer amaliyotining noyob birikmasidir — bu Fe(II) LS d⁶ konfiguratsiyada t₂g⁶ orbital to'liq to'lgan, barcha 6 elektron juftlangan (S=0), elektron zaryad taqsimoti mukammal sferik simmetrik. Bu holatda VALENT hissa V_val = 0 (chunki t₂g uchta orbitalning har biri 2 elektronli, jamlansa sferik) VA PANJARA hissa V_lat ≈ 0 (chunki [Fe(CN)₆]⁴⁻ oktaedri deyarli mukammal Oh simmetriyaga ega). Natijada elektr maydon gradienti (EFG) nolga teng va yadroning ±1/2, ±3/2 subholatlari parchalanmaydi → SPEKTR SINGLET (bitta chiziq). Bu klassik singletning tayanchi va Mössbauer o'lchovlarida ΔE_Q = 0 ekanligini tekshirish uchun standart.",
    tag: "quadrupole"
  },
  {
    param: "H_hf", paramName: "Giperkichik magnit maydon",
    value: "0", unit: "Tesla",
    reference: "Barcha T da (S=0 — diamagnit)",
    physicalMeaning: "Yadro spini I ning ichki magnit maydonda Zeeman parchalanishi",
    formula: "H_hf = H_F + H_L + H_D + H_dip + H_ext",
    diagnostic: "S = 0 (diamagnit) → intrinsik magnit moment YO'Q → sekstet YO'Q",
    interpretation: "Diamagnit (LS d⁶, t₂g⁶) — hech qanday elektron spin — H_hf strukturaviy nol",
    intensity: "Muhim", intensityCode: 3,
    freeIon: "Diamagnit ionlar uchun H_hf = 0 (tashqi maydon qo'llanmagan holda)",
    coordShift: "Faqat tashqi H_ext ta'sirida kichik chizik parchalanishi",
    theoryNote: "K₃[Fe(CN)₆] paramagnit (S=1/2) bo'lgan holda K₄[Fe(CN)₆] DIAMAGNIT (S=0) — t₂g⁶ konfiguratsiyada barcha 6 elektron juftlangan, jami spin momenti nol. Shuning uchun Fermi kontakt hissa H_F = 0, orbital H_L = 0 va spin-dipol H_D = 0. Faqat tashqi qo'llangan maydon H_ext (masalan, 9 T superkonduktivli magnit) sekstet berishi mumkin — bu 'applied field' Mössbauer o'lchovi. Bunday sharoitda H_hf ni intrinsik bo'lmagan (indutsirlangan) qiymati o'lchanadi va V_zz belgisini aniqlash imkoni beriladi (chunki qo'llangan maydon EFG bilan interferentsiya beradi).",
    tag: "magnetic"
  },
  {
    param: "Γ", paramName: "Chiziq kengligi (FWHM)",
    value: "0.24", unit: "mm/s",
    reference: "T = 77 K, ⁵⁷Co/Rh manba — eng tor",
    physicalMeaning: "Tabiiy chiziq kengligi + jihoz + namuna kengayishi. Yakuniy Γ_exp ≈ 2·Γ_nat da to'yinadi",
    formula: "Γ_exp = Γ_manba + Γ_absorbent + Γ_geom + Γ_kalinlik",
    diagnostic: "Γ ≈ 2.5·Γ_nat — tabiiy chegaraga eng yaqin (ideal singlet)",
    interpretation: "Diamagnit + Oh simmetriya + monofazali — jahon eng tor Mössbauer chiziqlaridan",
    intensity: "Sifat ko'rsatkichi", intensityCode: 4,
    freeIon: "Γ_nat(⁵⁷Fe) = 0.097 mm/s (Heisenberg limiti, 2/τ)",
    coordShift: "Kalibrlash uchun ideal — tor va simmetrik chiziq",
    theoryNote: "K₄[Fe(CN)₆] Mössbauer chizig'i istisnoli darajada TOR (Γ ≈ 0.24 mm/s, 77 K) — Heisenberg limitidan atigi 2.5× keng. Bu bir necha noyob xususiyat tufayli: (a) SINGLET — hech qanday parchalanish yo'q, ikki chiziqning kesishishi ham yo'q; (b) DIAMAGNIT — spin-spin relaksatsiya kengayishi yo'q; (c) MUKAMMAL KRISTALL — trigidrat monoklinik panjarasida bir kristallografik sayt; (d) DEBYE θ_D YUQORI (~350 K) — termik kengayish kichik. Bu sabab K₄[Fe(CN)₆] Mössbauer spektrometrlarining kalibrlash namunasi sifatida ishlatiladi (α-Fe folga bilan birga).",
    tag: "linewidth"
  },
  {
    param: "f_LM", paramName: "Lamb–Mössbauer omili",
    value: "0.78", unit: "(o'lchamsiz)",
    reference: "T = 77 K, θ_D ≈ 350 K (K₃ dan yuqoriroq!)",
    physicalMeaning: "Recoil-free rezonans yutish ehtimoli",
    formula: "f_LM = exp[−(6E_R/k_Bθ_D)(¼ + (T/θ_D)²·π²/6)]",
    diagnostic: "f > 0.5 — a'lo o'lchov shartlari; RT da ham 0.45 — kuchli signal",
    interpretation: "K₄[Fe(CN)₆] — qattiq kristall (θ_D ≈ 350 K), yaxshi rezonans yutuvchi",
    intensity: "O'lchov sharti", intensityCode: 3,
    freeIon: "Gaz/suyuqlik: f = 0 (rezonans YO'Q)",
    coordShift: "Kristallografik trigidrat — K⁺ va H₂O panjarani mustahkamlaydi",
    theoryNote: "K₄[Fe(CN)₆]·3H₂O da f_LM K₃[Fe(CN)₆] dan biroz yuqori (0.78 vs 0.72, 77 K da) — bu monoklinik panjarada H₂O molekulalari K⁺ ionlari bilan vodorod bog'lash orqali kristall qattiqligini oshiradi. Bu θ_D ni ~350 K ga ko'taradi (K₃ da ~300 K). Amaliyot uchun bu foydali — xona haroratida ham f ≈ 0.45 bo'lib, yaxshi signal berish mumkin. Ammo agar namuna vakuumga tushib qolsa yoki qattiq isitilsa (>60 °C), suv chiqib panjara buziladi va f keskin pasayadi — shuning uchun namuna quruq desikatorda saqlanmasligi kerak.",
    tag: "lambMossbauer"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HARORATGA BOG'LIQ PARAMETRLAR (T = 4.2, 77, 295 K)
// ═══════════════════════════════════════════════════════════════════════════════
const tempData = [
  { T: 4.2,  delta:  0.06, deltaQ: 0.00, H_hf: 0, fLM: 0.94, gamma: 0.22, izoh: "LHe temperature — eng aniq, tor chiziq" },
  { T: 20,   delta:  0.05, deltaQ: 0.00, H_hf: 0, fLM: 0.92, gamma: 0.23, izoh: "Past kriostat T" },
  { T: 77,   delta:  0.02, deltaQ: 0.00, H_hf: 0, fLM: 0.78, gamma: 0.24, izoh: "LN₂ standart o'lchov T — kalibrlash uchun ideal" },
  { T: 200,  delta: -0.02, deltaQ: 0.00, H_hf: 0, fLM: 0.58, gamma: 0.26, izoh: "Oraliq T" },
  { T: 295,  delta: -0.04, deltaQ: 0.00, H_hf: 0, fLM: 0.45, gamma: 0.27, izoh: "Xona harorati (RT) — standart adabiyot qiymati" },
  { T: 350,  delta: -0.07, deltaQ: 0.00, H_hf: 0, fLM: 0.32, gamma: 0.32, izoh: "Suv yo'qotish boshlanishi — panjara buziladi" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TO'LIQ SPEKTR NUQTALARI (Lorentzian singlet)
// ═══════════════════════════════════════════════════════════════════════════════
const mossbauerSpectrum = (function() {
  const points = []
  const delta = -0.04, gamma = 0.24
  const vMin = -4, vMax = 4, steps = 400

  for (let i = 0; i <= steps; i++) {
    const v = vMin + (i / steps) * (vMax - vMin)
    const hw = gamma / 2
    const abs = 1 / (1 + Math.pow((v - delta) / hw, 2))
    points.push({ v, transmittance: 100 - abs * 28 })
  }
  return points
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SIANOFERRATLAR QATORI — Werner-Prussian ko'k qatori
// ═══════════════════════════════════════════════════════════════════════════════
const cyanoferrateSeries = [
  { formula: "K₄[Fe(CN)₆]·3H₂O", trad: "Sariq qon tuzi",     color: "limonli-sariq",    delta: "−0.04", deltaQ: "0.00", spektr: "SINGLET",         spin: "S=0 (diamag)", oxid: "+2", current: true },
  { formula: "K₃[Fe(CN)₆]",      trad: "Qizil qon tuzi",     color: "ruby-qizil",       delta: "−0.12", deltaQ: "0.28", spektr: "Dublet",          spin: "S=1/2 LS",     oxid: "+3", current: false },
  { formula: "Fe₄[Fe(CN)₆]₃",    trad: "Prussian ko'k",      color: "to'q ko'k",        delta: "−0.02 / +0.36", deltaQ: "0.30 / 0.40", spektr: "Ikki komponent", spin: "aralash",  oxid: "+2/+3", current: false },
  { formula: "Na₂[Fe(CN)₅NO]·2H₂O", trad: "Natriy nitroprussid", color: "quyuq qizil",  delta: "−0.17", deltaQ: "1.76", spektr: "Katta dublet",    spin: "S=0 (formal)", oxid: "+2 (formal)", current: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// NAMUNA TAYYORLASH USULLARI
// ═══════════════════════════════════════════════════════════════════════════════
const techniques = [
  {
    name: "Poroshok tabletka (BN yoki plastik matrisa)",
    description: "Namuna kubik bor-nitrid (BN) yoki polietilen bilan aralashtirilib, 10−40 mg⁵⁷Fe/cm² kalinlikda tabletka bosiladi. Sariq qon tuzi uchun ideal — havoga barqaror, suvda erishga qarshi tabletka polimer bilan qoplanadi.",
    advantages: ["Standart transmissiya rejimi", "K₄[Fe(CN)₆] havoga barqaror", "Kvantitativ tahlil ideal (singlet)", "Kalibrlash uchun tavsiya etilgan"],
    disadvantages: ["Trigidrat suvini yo'qotmasligi kerak (T < 60 °C)", "Bosim ostida panjara buzilishi mumkin", "Namuna 20−100 mg kerak", "Vakuumga chidamsiz — suv chiqadi"],
    bestFor: "Standart RT/LN₂/LHe o'lchov, spektrometr kalibrlash, sanoat sifat nazorati",
    freqRange: "±5 mm/s (kimyoviy uchun etarli — singlet)", resolution: "0.20−0.28 mm/s", samplePrep: "10−20 daq"
  },
  {
    name: "Bir kristall Mössbauer (SCM)",
    description: "K₄[Fe(CN)₆]·3H₂O — kristall o'sadi (o'lcham > 2 mm), bir kristall Mössbauer o'lchovlari uchun ajoyib. Kristall orientatsiyasi bilan tekstura ta'siri o'rganiladi.",
    advantages: ["Anizotropiya to'g'ridan-to'g'ri", "Goldanskii–Karyagin effekti kuzatiladi", "f_LM tenzori aniqlanadi", "Panjara dinamikasini o'rganish"],
    disadvantages: ["Katta bir kristall o'stirish (1−2 hafta)", "Aniq orientatsiya kerak (goniometr)", "Kristall qalinligi juda muhim", "Rezolyutsiya 0.5° tartibida"],
    bestFor: "Fundamental tadqiqot, kristall dinamikasi, f_LM anizotropiya",
    freqRange: "±5 mm/s", resolution: "0.24 mm/s (eng yaxshi)", samplePrep: "1−2 hafta (kristall o'stirish)"
  },
  {
    name: "In-situ elektrokimyoviy Mössbauer (SEC-MS)",
    description: "K₄[Fe(CN)₆] eritmasi elektrokimyoviy hujraga qo'yiladi, potensial berilganda Fe(II) ↔ Fe(III) o'tishi Mössbauer bilan real vaqtda kuzatiladi. Muhim: qattiq holatga o'tishi shart.",
    advantages: ["Redoks jarayonini kuzatish", "K₃ ↔ K₄ o'tishini real vaqtda", "Batareya elektrodlari uchun model", "SP potensial (+0.36 V) tasdiqlash"],
    disadvantages: ["Maxsus hujra kerak (mumsimon polimer)", "Qattiq faza majburiy (recoil-free)", "Suyuq eritmada Mössbauer YO'Q", "Sekin (12−48 soat/ shart)"],
    bestFor: "Elektrokimyo, redoks kataliz, batareya materiallari",
    freqRange: "±10 mm/s", resolution: "0.30 mm/s", samplePrep: "2−4 kun"
  },
  {
    name: "Sinxrotron Mössbauer (SMS/NFS)",
    description: "SPring-8, ESRF, APS sinxrotronlarida nuclear forward scattering — vaqt bo'yicha ajratilgan o'lchov. K₄[Fe(CN)₆] eng oson analizatorlardan biri (singlet — Fourier transform sodda).",
    advantages: ["Yuqori intensivlik (~10¹⁰× rad manba)", "Mikro-namuna (10−100 µg)", "Vaqt-boy tahlil (ns)", "Yuqori bosim (>50 GPa) — DAC"],
    disadvantages: ["Beamtime raqobat", "Ma'lumot Fourier tahlil murakkab", "Yuqori xarajat", "1−2 yil kuzatish loyihalar"],
    bestFor: "Ekstremal shartlar, dinamik jarayonlar, biomineralar",
    freqRange: "Time-domain (ns)", resolution: "0.05−0.10 mm/s ekvivalent", samplePrep: "1−3 kun"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  { source: "Trigidrat suvining yo'qotilishi (T > 60°C)", freqRange: "Butun spektr o'zgaradi", effect: "K₄[Fe(CN)₆]·3H₂O → K₄[Fe(CN)₆] (bezsuv) o'tganda panjara buziladi, ΔE_Q ~0.2 mm/s ga oshadi, chiziq kengayadi", severity: "Yuqori", solution: "Namunani 40 °C dan yuqorida saqlamang. Vakuum sharoitida ishlamang. TGA (termogravimetriya) bilan suv miqdorini nazorat qiling. Xona sharoitida saqlash (nam havo 40−60% RH)." },
  { source: "Havoda Fe(II) → Fe(III) oksidlanishi", freqRange: "K₃[Fe(CN)₆] dubleti paydo bo'ladi", effect: "Yorug'lik + havo ta'sirida sirt qatlami Fe(III) LS ga o'tadi (rangi biroz to'q sariq bo'ladi), spektrda K₃[Fe(CN)₆] dubleti (δ=−0.12, ΔE_Q=0.28) qo'shiladi", severity: "O'rta", solution: "Qorong'ida saqlash. O'lchovdan oldin qayta kristallizatsiya. Sirt qatlami olib tashlash. Ideal — freshli sintez qilingan namuna (1 hafta ichida ishlatish)." },
  { source: "Kalibrlash xatosi (v shkalasi)", freqRange: "δ absolyut qiymati siljydi", effect: "K₄[Fe(CN)₆] o'zi kalibrlash uchun tavsiya etilgan, ammo α-Fe folga bilan tekshirish shart. Aks holda δ 0.05−0.10 mm/s ga siljydi.", severity: "Yuqori", solution: "Har o'lchovda 25 µm α-Fe folga bilan kalibrlash. K₄[Fe(CN)₆] pozitsiyasini α-Fe ga nisbatan tekshirish (bo'lishi kerak −0.04 mm/s ± 0.02). Standart deviatsiya < 0.01 mm/s bo'lsa — a'lo." },
  { source: "Namuna qalinligi noto'g'ri", freqRange: "Chiziq kengayadi va to'yinadi", effect: "t = μd > 5 bo'lsa singlet chuqurligi 15% dan katta bo'lib, Lorentzian dan cheklovga uchraydi", severity: "O'rta", solution: "Optimal t = μd ≈ 3 tanlash. K₄[Fe(CN)₆] uchun 10−15 mg⁵⁷Fe/cm² (yoki 45 mg tabiiy). Bir necha kalinlik bilan tekshirish (0.5t, t, 1.5t)." },
  { source: "Ikkinchi darajali Doppler siljish (SOD)", freqRange: "δ ga qo'shimcha (T-bog'liq)", effect: "Harorat oshsa δ ~2·10⁻⁴ mm/s/K pastroq ko'rinadi. Turli T dagi o'lchovlarni solishtirishda xatolik.", severity: "O'rta", solution: "Aniq harorat nazorati (±1 K). Barcha spektrlarni bir xil T da olish. SOD tuzatishni qo'llash: δ_true = δ_obs + <v²>/2c. Debye modeli bilan hisoblash." },
  { source: "K₄ va K₃ aralashuvi (sintez xatosi)", freqRange: "Singlet + dublet aralashadi", effect: "Sintez to'liq bo'lmasa (Cl₂ bilan qismli oksidlanish), K₃[Fe(CN)₆] qoldig'i singlet ostida dublet berib qo'shadi", severity: "Yuqori", solution: "Freshli sintez: Fe²⁺ + 6 KCN + suv. Qayta kristallizatsiya 2 marta. UV-Vis (K₃ da LMCT 420 nm — bo'lmasligi kerak). Fit ikki komponent bilan: agar dublet ≥ 5% chiqsa, namuna toza emas." },
  { source: "Manba yoshi (⁵⁷Co yemirilishi)", freqRange: "Signal intensivligi kamayadi", effect: "⁵⁷Co t½ = 271 kun. 1 yildan keyin faollik 2× kamayadi → o'lchov vaqti 4× oshadi", severity: "O'rta", solution: "Manbani 2 yilda bir marta yangilash (10−100 mCi). Yosh manbani hisobga olib namuna qalinligini o'zgartirish. MCA sanoq statistikasini nazorat qilish (≥ 10⁶ sanoq/kanal)." },
  { source: "⁵⁷Fe past mo'lligi (tabiiy 2.12%)", freqRange: "Signal intensivligi", effect: "Tabiiy Fe da faqat 2.12% ⁵⁷Fe — o'lchov vaqti 47× uzun bo'ladi (boyitilganga qaraganda)", severity: "O'rta", solution: "Nozik namunalar uchun ⁵⁷Fe (90−95%) boyitilgan reagent ishlatish. K₄[⁵⁷Fe(CN)₆] tayyorlash: ⁵⁷FeSO₄ + 6 KCN → K₄[⁵⁷Fe(CN)₆] + K₂SO₄." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY-KIMYOVIY KONTEKST
// ═══════════════════════════════════════════════════════════════════════════════
const historyEvents = [
  { year: "1706", event: "Prussian ko'k kashfiyoti", desc: "Berlin bo'yoq ishlab chiqaruvchi Johann Jacob Diesbach kokinel qizil bo'yoq tayyorlashga urinib, tasodifan Prussian ko'k va K₄[Fe(CN)₆] hosil qildi. Hayvon qonini K₂CO₃ va Fe bilan qizdirdi." },
  { year: "1749", event: "Ilmiy tavsif", desc: "Pierre Joseph Macquer K₄[Fe(CN)₆] va Prussian ko'k orasidagi bog'liqlikni birinchi bor ilmiy asoslar bilan tavsifladi." },
  { year: "1783", event: "Sianid ajratilishi", desc: "Carl Wilhelm Scheele K₄[Fe(CN)₆] dan HCN gazini ajratdi va yangi kislota (sianid) sifatida ta'rifladi." },
  { year: "1811", event: "Sianid nazariyasi", desc: "Joseph-Louis Gay-Lussac CN⁻ radikal tabiatini asoslab berdi. K₄[Fe(CN)₆] koordinatsion nazariyaga birinchi kuchli dalil." },
  { year: "1893", event: "Werner nazariyasi", desc: "Alfred Werner K₄[Fe(CN)₆] va K₃[Fe(CN)₆] taqqosini ichki/tashqi koordinatsion sfera nazariyasi uchun asosiy misol sifatida keltirdi." },
  { year: "1929", event: "Bethe kristall maydon", desc: "H. Bethe CN⁻ ni kuchli maydon ligand deb ta'rifladi. K₄[Fe(CN)₆] LS d⁶ (t₂g⁶) tushunish orqali diamagnitizmini isbotladi." },
  { year: "1958", event: "Mössbauer effekti", desc: "R. Mössbauer ¹⁹¹Ir uchun rezonansni kashf etdi. Kimyo uchun ⁵⁷Fe (14.4 keV) 1959 da ochildi." },
  { year: "1961", event: "Nobel mukofoti", desc: "R. Mössbauer 32 yoshida Fizika bo'yicha Nobel oldi." },
  { year: "1962", event: "K₄[Fe(CN)₆] Mössbauer", desc: "W. Kerler va W. Neuwirth K₄[Fe(CN)₆]·3H₂O ning birinchi to'liq Mössbauer spektrini nashr etdi (Z. Physik 167, 176). Singlet, δ ≈ 0, ΔE_Q = 0 tasdiqlangan." },
  { year: "1965", event: "Duncan-Golding tahlili", desc: "J.F. Duncan va R.M. Golding barcha ma'lum sianoferratlarni sistematik Mössbauer bilan o'rgandi (Q. Rev. Chem. Soc. 19, 36). K₄[Fe(CN)₆] referens sifatida qabul qilindi." },
  { year: "1980-yillar", event: "Elektronika standarti", desc: "K₄[Fe(CN)₆] Mössbauer spektrometrlari uchun standart kalibrlash namunasi sifatida qabul qilindi (α-Fe folga bilan birga). ISO tavsiyasi." },
  { year: "2000-yillar", event: "Batareya materiallari", desc: "Prussian ko'k analoglari Na-ion va K-ion batareyalar uchun operando Mössbauer bilan o'rganilmoqda. K₄[Fe(CN)₆] — model tizim." },
  { year: "2020-yillar", event: "Kvantovaya kompyuting", desc: "Cianoferrat qatlamlari qubit materiallari sifatida sinovdan o'tkazilmoqda. K₄[Fe(CN)₆] diamagnit tayanch — kvantovaya interferentsiya o'lchovlari." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TANLASH QOIDALARI (⁵⁷Fe)
// ═══════════════════════════════════════════════════════════════════════════════
const selectionRules = [
  { rule: "ΔI = ±1", desc: "Yadro spin o'zgarishi: I=1/2 (asosiy) → I=3/2 (qo'zg'algan)" },
  { rule: "Δm_I = 0, ±1", desc: "Yadro magnit kvant sonining o'zgarishi (M1 magnit dipol o'tish)" },
  { rule: "L = 1 (M1)", desc: "Fotonning orbital burchak momenti — magnit dipol xarakter" },
  { rule: "Π_e·Π_g = +1", desc: "Yadro juftlik (parity) saqlanadi (M1 uchun)" },
  { rule: "E_γ = 14.4125 keV", desc: "⁵⁷Fe qat'iy rezonans energiyasi (aniqlik 10⁻¹³)" },
  { rule: "Δv ≤ ±5 mm/s", desc: "K₄[Fe(CN)₆] singlet — kichik Doppler diapazoni yetarli" },
  { rule: "V_zz = 0 (bu holda)", desc: "Sferik simmetriya → EFG yo'q → 4 o'tish yo'li birlashadi" },
  { rule: "S = 0 → H_hf = 0", desc: "Diamagnit — Fermi kontakt hissa yo'q" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TAJRIBA PARAMETRLARI TAVSIYALAR
// ═══════════════════════════════════════════════════════════════════════════════
const experimentalParams = [
  { param: "⁵⁷Co manba", value: "10−100 mCi", note: "Rh yoki Pd matrisa; t½ = 271 kun" },
  { param: "Optimal Fe qalinligi", value: "10−15 mg⁵⁷Fe/cm² (yoki 45 mg tabiiy)", note: "t = μd ≈ 3 uchun (singlet uchun kichikroq)" },
  { param: "Vibrator turi", value: "Elektromagnit (Kankeleit)", note: "Sinusoidal yoki uchburchak, kichik amplituda" },
  { param: "Detektor", value: "Kr−CH₄ gaz proporsional (14.4 keV)", note: "Yoki NaI(Tl) sintillator, kompyuter MCA" },
  { param: "MCA kanallar", value: "512 (singlet uchun) yoki 1024", note: "Har kanal ≈ 0.02 mm/s (±5 mm/s uchun)" },
  { param: "Sanoq statistikasi", value: "≥ 10⁶ sanoq/kanal", note: "Chuqurlik 10−15% — ideal kalibrlash uchun" },
  { param: "O'lchov vaqti", value: "2−12 soat", note: "K₃ dan qisqaroq — singlet + f_LM yuqori" },
  { param: "Namuna T", value: "77 K (kalibrlash uchun standart)", note: "RT ham mumkin, LHe uchun eng aniq" },
  { param: "Kalibrlash", value: "K₄[Fe(CN)₆]·3H₂O + α-Fe folga", note: "K₄ pozitsiyasi α-Fe ga nisbatan −0.04 ± 0.02 mm/s" },
  { param: "Ma'lumot tahlil", value: "WinNormos, Mosswinn, Recoil, MossA", note: "Bir Lorentzian yoki Voigt profil, χ² < 1.1 — a'lo" },
  { param: "Namuna saqlash", value: "Xona T, 40−60% RH, qorong'i", note: "Vakuumdan qochish — suv yo'qolmasin" },
  { param: "Fon materiallari", value: "BN yoki polietilen matrisa", note: "Nujol yoki paraffin ishlatmang (⁵⁷Fe qoldig'i mumkin)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// MISCELLANY — K₄ vs K₃ farqlari
// ═══════════════════════════════════════════════════════════════════════════════
const k4vsK3 = [
  { param: "Fe oksidlanish", k4: "+2 (ferrous)", k3: "+3 (ferric)", ahamiyat: "1 elektron farqi — asosiy holat" },
  { param: "d-konfiguratsiya", k4: "d⁶ (t₂g⁶eg⁰)", k3: "d⁵ (t₂g⁵eg⁰)", ahamiyat: "t₂g to'liq vs bir yakka" },
  { param: "Spin", k4: "S = 0 (diamagnit)", k3: "S = 1/2 (paramagnit)", ahamiyat: "Diamagnitlik → H_hf = 0" },
  { param: "Simmetriya", k4: "sferik (t₂g⁶)", k3: "buzilgan (t₂g⁵)", ahamiyat: "EFG uchun asosiy farq" },
  { param: "δ (mm/s)", k4: "−0.04", k3: "−0.12", ahamiyat: "K₃ yanada past — Fe(III) elektron kam" },
  { param: "ΔE_Q (mm/s)", k4: "0.00 (singlet)", k3: "0.28 (dublet)", ahamiyat: "Eng aniq diagnostik farq" },
  { param: "H_hf (T)", k4: "0", k3: "0 (T > 5 K)", ahamiyat: "Ikkalasida ham sekstet yo'q" },
  { param: "Rang", k4: "limonli-sariq", k3: "ruby-qizil", ahamiyat: "Vizual identifikatsiya" },
  { param: "Rangi sababi", k4: "MLCT (320 nm)", k3: "LMCT (420 nm)", ahamiyat: "Elektron o'tish yo'nalishi" },
  { param: "log β₆", k4: "35", k3: "44 (yanada barqaror)", ahamiyat: "K₃ kompleks yanada mustahkam" },
  { param: "E° (V)", k4: "reference (0)", k3: "+0.36 (vs K₄)", ahamiyat: "Standart redoks pari" },
  { param: "νCN (IR, cm⁻¹)", k4: "2044", k3: "2135", ahamiyat: "K₃ da CN kuchli — Fe→CN back yo'q" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONENT: MINI-SPEKTR CHIZUVCHI
// ═══════════════════════════════════════════════════════════════════════════════
function InteraktivSpektr({ delta = -0.04, deltaQ = 0.00, gamma = 0.24 }) {
  const spektr = useMemo(() => {
    const arr = []
    const vMin = -4, vMax = 4, steps = 400
    const positions = deltaQ > 0.02 ? [delta - deltaQ / 2, delta + deltaQ / 2] : [delta]

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      let abs = 0
      positions.forEach(x0 => {
        const hw = gamma / 2
        abs += 1 / (1 + Math.pow((v - x0) / hw, 2))
      })
      abs /= positions.length
      arr.push({ v, T: 100 - abs * 28 })
    }
    return arr
  }, [delta, deltaQ, gamma])

  const minT = Math.min(...spektr.map(p => p.T))
  const vToX = (v) => 60 + ((v + 4) / 8) * 620
  const tToY = (T) => 40 + ((100 - T) / (100 - minT + 1)) * 240

  return (
    <svg viewBox="0 0 720 340" className="w-full h-auto">
      {/* Fon */}
      <rect x="60" y="40" width="620" height="240" fill="#0f0a1e" opacity="0.4" rx="4"/>

      {/* Grid */}
      {[-3, -2, -1, 0, 1, 2, 3].map(v => (
        <g key={v}>
          <line x1={vToX(v)} y1="40" x2={vToX(v)} y2="280" stroke="#4c1d95" strokeWidth="0.4" strokeDasharray="2,3"/>
          <text x={vToX(v)} y="300" fill="#a78bfa" fontSize="11" textAnchor="middle">{v}</text>
        </g>
      ))}
      {[100, 95, 90, 85, 80, 75, 70].map(t => (
        <g key={t}>
          <line x1="60" y1={40 + ((100 - t) / 30) * 240} x2="680" y2={40 + ((100 - t) / 30) * 240}
            stroke="#4c1d95" strokeWidth="0.4" strokeDasharray="2,3"/>
          <text x="50" y={44 + ((100 - t) / 30) * 240} fill="#a78bfa" fontSize="11" textAnchor="end">{t}</text>
        </g>
      ))}

      {/* O'qlar */}
      <line x1="60" y1="40" x2="60" y2="280" stroke="#a78bfa" strokeWidth="1.5"/>
      <line x1="60" y1="280" x2="680" y2="280" stroke="#a78bfa" strokeWidth="1.5"/>

      {/* v=0 chiziq */}
      <line x1={vToX(0)} y1="40" x2={vToX(0)} y2="280" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="3,3" opacity="0.5"/>

      {/* Spektr chizig'i */}
      <polyline
        points={spektr.map(p => `${vToX(p.v)},${tToY(p.T)}`).join(' ')}
        fill="none" stroke="#eab308" strokeWidth="2.2"
      />

      {/* Delta marker */}
      <line x1={vToX(delta)} y1={tToY(100 - 28)} x2={vToX(delta)} y2="40"
        stroke="#facc15" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.6"/>
      <text x={vToX(delta)} y="35" fill="#facc15" fontSize="10" textAnchor="middle" fontWeight="bold">
        δ = {delta.toFixed(2)}
      </text>

      {/* Singlet label */}
      {deltaQ < 0.02 && (
        <text x={vToX(delta)} y={tToY(minT) + 20} fill="#fde047" fontSize="11" textAnchor="middle" fontWeight="bold">
          SINGLET (ΔE_Q = 0)
        </text>
      )}

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
export default function K4FeCN6Sahifasi() {
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
    k4vsk3: true,
    cyanoferrate: true,
    experimental: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  })

  // Simulyator uchun state
  const [simDelta, setSimDelta] = useState(-0.04)
  const [simDeltaQ, setSimDeltaQ] = useState(0.00)
  const [simGamma, setSimGamma] = useState(0.24)

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
        yellow: rgb(0.85, 0.65, 0.05),
        yellowDeep: rgb(0.65, 0.48, 0.02),
        yellowSoft: rgb(0.55, 0.45, 0.10),
        red: rgb(0.86, 0.15, 0.15),
        redDeep: rgb(0.65, 0.10, 0.10),
        textDark: rgb(0.08, 0.08, 0.16),
        textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0),
        green: rgb(0.08, 0.47, 0.31),
        greenDark: rgb(0.05, 0.35, 0.22),
        blue: rgb(0.08, 0.31, 0.55),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0),
        bgTeal: rgb(0.94, 1.0, 0.99),
        bgYellow: rgb(1.0, 0.98, 0.92),
        bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98),
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
          `JDA-Kimyo Mössbauer Tahlili  •  K₄[Fe(CN)₆]·3H₂O (Sariq qon tuzi)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.yellow })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.yellowDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }

      const drawTableRow = (label, value, bgColor = C.bgYellow, labelColor = C.yellowDeep) => {
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
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  Mössbauer Spektroskopiyasi  •  Vol. 3, Son 2", {
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
      safeText("Koordinatsion Kimyo — Yadro Rezonans Spektroskopiyasi", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.mossbauer.2026.002", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      drawCenteredText(`K₄[Fe(CN)₆]·3H₂O — ⁵⁷Fe Mössbauer Spektroskopik Tahlili`, y, 18, boldFont, C.textDark)
      y -= 26
      drawCenteredText("Kaliy geksatsianoferrat(II) trigidrat  •  «Sariq qon tuzi»", y, 12, italicFont, C.purpleSoft)
      y -= 20
      drawCenteredText(
        `Simmetriya: Oh  •  Fe²⁺, d⁶ LS (t₂g⁶)  •  S=0, DIAMAGNIT  •  M = 422.39 g/mol`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ABSTRACT
      const abstract =
        `Kaliy geksatsianoferrat(II) trigidrat K₄[Fe(CN)₆]·3H₂O — Werner koordinatsion nazariyasining ` +
        `klassik Fe(II) namunasi va Mössbauer spektroskopiyasi amaliyotining KALIBRLASH BIRIKMASI. ` +
        `⁵⁷Fe Mössbauer o'lchovi (E_γ = 14.4125 keV) quyidagi giperkichik parametrlarni beradi: ` +
        `izomer siljish δ = −0.04 mm/s (α-Fe ga nisbatan, RT), kvadrupol bo'linishi ΔE_Q = 0.00 mm/s ` +
        `(NOYOB SINGLET!), chiziq kengligi Γ = 0.24 mm/s (T = 77 K — Heisenberg limitidan atigi 2.5×). ` +
        `Deyarli nol δ CN⁻ ligandning kuchli π-akseptor xarakteri va t₂g⁶ ning kovalentligini isbotlaydi. ` +
        `ΔE_Q = 0 t₂g⁶ ning MUKAMMAL SFERIK simmetriyasi + Oh oktaedr panjaraning natijasidir. ` +
        `H_hf = 0 (barcha T da) — DIAMAGNIT S=0 holatining bevosita ko'rsatkichi. Bu birikma butun ` +
        `Mössbauer amaliyotida δ=0 shkalasining tayanchi sifatida (α-Fe folga bilan birga) ishlatiladi.`

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
          ["Formula", "K₄[Fe(CN)₆]·3H₂O"],
          ["IUPAC nomi", "Kaliy geksatsianoferrat(II) trigidrat"],
          ["An'anaviy nomi", "Sariq qon tuzi (Ferrocyanide)"],
          ["CAS raqami", "14459-95-1 (trigidrat) / 13943-58-3 (bezsuv)"],
          ["Molar massa", "422.39 g/mol (trigidrat) / 368.35 g/mol (bezsuv)"],
          ["Rangi", "Limonli-sariq shaffof kristall"],
          ["Kristall tizim", "Monoklinik (C2/c fazoviy guruh) — trigidrat"],
          ["Kompleks anion simmetriyasi", "Oh (deyarli ideal)"],
          ["Koordinatsion son", "6 (oktaedrik)"],
          ["Metall ioni", "Fe²⁺ (d⁶ LS, t₂g⁶eg⁰)"],
          ["Ligand tipi", "CN⁻ (kuchli maydon, σ+π akseptor)"],
          ["Fe–C bog' uzunligi", "1.900 Å (K₃ dan 0.026 Å qisqaroq — π-back-bonding kuchliroq)"],
          ["C≡N bog' uzunligi", "1.157 Å"],
          ["Δo (10Dq)", "33 800 cm⁻¹ (~404 kJ/mol)"],
          ["Suvda eruvchanligi", "289 g/L (20°C)"],
          ["log β₆ (barqarorlik)", "≈ 35 (juda mustahkam)"],
          ["Standart potensial", "0 V (K₄/K₃ juftida referens)"],
          ["Magnitizm", "DIAMAGNIT (χ_M < 0, μ_eff = 0)"],
          ["Oziq-ovqat kodi", "E535/E536/E537 (antikaking agent)"],
        ]
        idData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgYellow : C.white, C.yellowDeep)
        })
        y -= 15
      }

      // 2. NAZARIY ASOS
      if (pdfSections.theory) {
        drawSectionHeader(sectionNum++, "Mössbauer Spektroskopiyasining Nazariy Asosi")
        drawWrappedText(
          "Mössbauer spektroskopiyasi qattiq jismdagi atom yadrolarining qaytishsiz (recoil-free) gamma-kvant rezonans yutish hodisasiga asoslangan. Kashfiyot 1958 yilda R. Mössbauer tomonidan (Nobel mukofoti 1961). Kimyoda asosan ⁵⁷Fe izotopi (2.119% tabiiy mo'lligi) ishlatiladi. K₄[Fe(CN)₆] birinchi bor 1962 da W. Kerler tomonidan Mössbauer bilan tahlil qilingan.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Mössbauer spektroskopiyasi qattiq jismdagi atom yadrolarining qaytishsiz (recoil-free) gamma-kvant rezonans yutish hodisasiga asoslangan. Kashfiyot 1958 yilda R. Mössbauer tomonidan (Nobel mukofoti 1961). Kimyoda asosan ⁵⁷Fe izotopi (2.119% tabiiy mo'lligi) ishlatiladi. K₄[Fe(CN)₆] birinchi bor 1962 da W. Kerler tomonidan Mössbauer bilan tahlil qilingan.", regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "1) Recoil-free rezonans: E_R = E_γ²/(2Mc²) ≈ 1.96·10⁻³ eV. K₄[Fe(CN)₆]·3H₂O da suv molekulalari K⁺ ionlari bilan vodorod bog'lash orqali panjarani mustahkamlaydi, natijada θ_D ≈ 350 K (K₃ dan yuqoriroq!), Lamb–Mössbauer omili f_LM = 0.78 (77 K).",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "2) Doppler tezligi orqali rezonans: Manba (⁵⁷Co/Rh) ±5 mm/s tezlik bilan yurgiziladi (singlet uchun kichik diapazon yetarli). K₄[Fe(CN)₆] namunasi δ = −0.04 mm/s tezlikda rezonans yutadi.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "3) Uch giperkichik parametr: (a) δ — s-elektron zichligi; (b) ΔE_Q — EFG asimmetriya; (c) H_hf — magnit maydon. K₄[Fe(CN)₆] uchun ULARNING BARCHASI NOL YAQIN! Bu noyob birikmani yaratadi.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "4) K₄[Fe(CN)₆] uchun natijalar: CN⁻ kuchli maydon → Fe²⁺ LS t₂g⁶ (barcha juftlangan, S=0 diamagnit) → sferik simmetriya → SINGLET. Bu ideal 'nol' referens — Mössbauer spektrometrlarining KALIBRLASH namunasi.",
          C.bgYellow, C.yellow, C.textDark
        )
      }

      // 3. MÖSSBAUER PARAMETRLARI
      if (pdfSections.parameters) {
        drawSectionHeader(sectionNum++, "Mössbauer Parametrlari — Batafsil Tahlil")
        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.yellowDeep })
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
          const bg = idx % 2 === 0 ? C.bgYellow : C.white
          page.drawRectangle({ x: MARGIN, y: y - 42, width: CONTENT_W, height: 42, color: bg })

          safeText(`${p.param}`, { x: MARGIN + 6, y: y - 14, size: 12, font: boldFont, color: C.yellowDeep, maxWidth: colW[0] - 4 })
          safeText(p.paramName, { x: MARGIN + 6, y: y - 30, size: 7.5, font: italicFont, color: C.textMuted, maxWidth: colW[0] - 4 })

          safeText(`${p.value} ${p.unit}`, { x: MARGIN + 6 + colW[0], y: y - 14, size: 10, font: boldFont, color: C.orange, maxWidth: colW[1] - 4 })
          safeText(p.reference, { x: MARGIN + 6 + colW[0], y: y - 30, size: 7, font: italicFont, color: C.textMuted, maxWidth: colW[1] - 4 })

          const meaningLines = wrapText(cleanText(p.physicalMeaning), regularFont, 8, colW[2] - 8)
          meaningLines.slice(0, 2).forEach((line, i) => {
            page.drawText(line, { x: MARGIN + 6 + colW[0] + colW[1], y: y - 14 - i * 10, size: 8, font: regularFont, color: C.textDark })
          })

          const diagLines = wrapText(cleanText(p.diagnostic), italicFont, 8, colW[3] - 8)
          diagLines.slice(0, 2).forEach((line, i) => {
            page.drawText(line, { x: MARGIN + 6 + colW[0] + colW[1] + colW[2], y: y - 14 - i * 10, size: 8, font: italicFont, color: C.greenDark })
          })
          y -= 44
        })
        y -= 6

        drawInfoBox(
          "Umumiy xulosa: K₄[Fe(CN)₆] barcha 5 ta parametri bir birikmani xarakterlash uchun ideal 'nol' beradi. δ ≈ 0, ΔE_Q = 0, H_hf = 0 — bu Mössbauer amaliyotining refereni. Bu holat noyobdir: aksariyat birikmalarda kamida bittasi noldan farq qiladi.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 4. SPEKTR TALQINI
      if (pdfSections.spectrum) {
        drawSectionHeader(sectionNum++, "Mössbauer Spektri — Singlet Talqini")
        drawWrappedText(
          "K₄[Fe(CN)₆]·3H₂O ning Mössbauer spektri klassik SINGLET shakliga ega — bitta Lorentzian chiziq δ = −0.04 mm/s markazida. Bu Fe(II) LS ning t₂g⁶ konfiguratsiyaning bevosita natijasidir: to'liq to'lgan t₂g uchta orbitalning har biri 2 elektronli, jamlansa elektron zaryad taqsimoti mukammal SFERIK simmetrik. Bu holatda:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("K₄[Fe(CN)₆]·3H₂O ning Mössbauer spektri klassik SINGLET shakliga ega — bitta Lorentzian chiziq δ = −0.04 mm/s markazida. Bu Fe(II) LS ning t₂g⁶ konfiguratsiyaning bevosita natijasidir: to'liq to'lgan t₂g uchta orbitalning har biri 2 elektronli, jamlansa elektron zaryad taqsimoti mukammal SFERIK simmetrik. Bu holatda:", regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "V_val = 0 (VALENT hissa): t₂g⁶ barcha orbitallar teng to'lgan → elektron zaryad taqsimoti sferik. Aksincha, K₃ [Fe(CN)₆] da t₂g⁵ (bitta yakka to'ldirilmagan) → V_val ≠ 0.",
          C.bgYellow, C.yellow, C.textDark
        )
        drawInfoBox(
          "V_lat ≈ 0 (PANJARA hissa): [Fe(CN)₆]⁴⁻ oktaedri deyarli mukammal Oh (89.9° / 180° burchak). Trigidrat panjarada K⁺ va H₂O molekulalari simmetrik joylashgan.",
          C.bgYellow, C.yellow, C.textDark
        )
        drawInfoBox(
          "Natija: ΔE_Q = ½·e·Q·V_zz = 0 → parchalanish yo'q → SINGLET. Bu Mössbauer da uchraydigan eng oz sonli, eng tor chiziqli spektrlardan biri (Γ = 0.24 mm/s, 77 K).",
          C.bgTeal, C.teal, C.textDark
        )
        drawInfoBox(
          "Kalibrlash tayanchi: K₄[Fe(CN)₆] pozitsiyasi α-Fe folga sekstet markaziga nisbatan aynan −0.04 mm/s (RT) yoki +0.02 mm/s (77 K). Bu qiymatlar barcha Mössbauer laboratoriyalarida standart.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 5. HARORAT
      if (pdfSections.temperature) {
        drawSectionHeader(sectionNum++, "Haroratga Bog'liq O'lchovlar")
        drawWrappedText(
          "K₄[Fe(CN)₆]·3H₂O parametrlar ma'lum trendlarga ega. δ(T) ikkinchi darajali Doppler siljish (SOD) natijasida chiziqli kamayadi, ΔE_Q barcha T da barqaror 0 bo'lib qoladi (chunki t₂g⁶ Boltzmann bo'linishi mumkin emas), f_LM(T) Debye modelini qanoatlantiradi. T > 60 °C da trigidrat suvi chiqib ketadi — bezsuv panjarada ΔE_Q ~0.2 mm/s ga oshadi (Oh buziladi).",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("K₄[Fe(CN)₆]·3H₂O parametrlar ma'lum trendlarga ega. δ(T) ikkinchi darajali Doppler siljish (SOD) natijasida chiziqli kamayadi, ΔE_Q barcha T da barqaror 0 bo'lib qoladi (chunki t₂g⁶ Boltzmann bo'linishi mumkin emas), f_LM(T) Debye modelini qanoatlantiradi. T > 60 °C da trigidrat suvi chiqib ketadi — bezsuv panjarada ΔE_Q ~0.2 mm/s ga oshadi (Oh buziladi).", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.yellowDeep })
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
          const bg = idx % 2 === 0 ? C.bgYellow : C.white
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx3 = MARGIN + 6
          const cells = [String(td.T), String(td.delta), String(td.deltaQ), String(td.fLM), String(td.gamma), td.izoh]
          cells.forEach((cell, i) => {
            const font = i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.yellowDeep : C.textDark
            safeText(cell, { x: cx3, y: y - 12, size: 8.5, font, color, maxWidth: twcol[i] - 4 })
            cx3 += twcol[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Xulosa: δ(T) chiziqli SOD trendi ~−2·10⁻⁴ mm/s/K. ΔE_Q(T) = 0 barcha T da (t₂g⁶ mutlaq sferik). f_LM 4.2 K da 0.94 dan 350 K da 0.32 gacha pasayadi (θ_D ≈ 350 K). 350 K dan yuqori — suv yo'qolishi bilan spektr sifati keskin buziladi.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 6. TANLASH QOIDALARI
      if (pdfSections.selectionRules) {
        drawSectionHeader(sectionNum++, "Tanlash Qoidalari — ⁵⁷Fe (K₄ uchun maxsus)")
        drawWrappedText(
          "⁵⁷Fe ning 14.4125 keV o'tishi I=1/2 va I=3/2 orasidagi M1 (magnit dipol) o'tishdir. K₄[Fe(CN)₆] uchun QO'SHIMCHA soddalashtiruvchi shartlar mavjud:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("⁵⁷Fe ning 14.4125 keV o'tishi I=1/2 va I=3/2 orasidagi M1 (magnit dipol) o'tishdir. K₄[Fe(CN)₆] uchun QO'SHIMCHA soddalashtiruvchi shartlar mavjud:", regularFont, 9.5, CONTENT_W).length * 13 + 10

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
          "Singlet holati: V_zz = 0 tufayli 4 ta o'tish yo'li (±3/2 → ±1/2, ±3/2 → ∓1/2, ±1/2 → ±1/2, ±1/2 → ∓1/2) birlashadi va bir energetik pozitsiyada joylashadi. Natijada bir chiziqli spektr — SINGLET. Bu Mössbauer da uchraydigan eng oddiy va nazariy jihatdan eng shaffof holat.",
          C.bgBlue, C.blue, C.textDark
        )
      }

      // 7. K4 vs K3 TAQQOSLASH
      if (pdfSections.k4vsk3) {
        drawSectionHeader(sectionNum++, "K₄[Fe(CN)₆] vs K₃[Fe(CN)₆] — To'liq Taqqoslash")
        drawWrappedText(
          "Sariq va qizil qon tuzlari Werner koordinatsion kimyoning asosiy ta'qqoslash juftligidir. Ular faqat BITTA elektron farqi bilan farq qiladi (Fe²⁺/Fe³⁺), lekin bu farq Mössbauer va boshqa parametrlarda dramatik o'zgarishlarga olib keladi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Sariq va qizil qon tuzlari Werner koordinatsion kimyoning asosiy ta'qqoslash juftligidir. Ular faqat BITTA elektron farqi bilan farq qiladi (Fe²⁺/Fe³⁺), lekin bu farq Mössbauer va boshqa parametrlarda dramatik o'zgarishlarga olib keladi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const kHeaders = ["Parametr", "K₄[Fe(CN)₆]", "K₃[Fe(CN)₆]", "Ahamiyat"]
        const kColW = [110, 100, 100, 185]
        let kcx = MARGIN + 6
        kHeaders.forEach((h, i) => {
          safeText(h, { x: kcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: kColW[i] - 4 })
          kcx += kColW[i]
        })
        y -= 20

        k4vsK3.forEach((k, idx) => {
          checkPageBreak(20)
          const bg = idx % 2 === 0 ? C.bgPurple : C.white
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx5 = MARGIN + 6
          safeText(k.param, { x: cx5, y: y - 12, size: 8.5, font: boldFont, color: C.purple, maxWidth: kColW[0] - 4 })
          cx5 += kColW[0]
          safeText(k.k4, { x: cx5, y: y - 12, size: 8.5, font: boldFont, color: C.yellowDeep, maxWidth: kColW[1] - 4 })
          cx5 += kColW[1]
          safeText(k.k3, { x: cx5, y: y - 12, size: 8.5, font: boldFont, color: C.redDeep, maxWidth: kColW[2] - 4 })
          cx5 += kColW[2]
          safeText(k.ahamiyat, { x: cx5, y: y - 12, size: 8, font: italicFont, color: C.textDark, maxWidth: kColW[3] - 4 })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Eng aniq diagnostik: ΔE_Q = 0 (K₄, singlet) vs ΔE_Q = 0.28 (K₃, dublet). Mössbauer spektri shaklidan bir qarashda Fe(II) LS va Fe(III) LS ni ajratish mumkin. Prussian ko'k Fe₄[Fe(CN)₆]₃ da ikkalasi ham bor va Mössbauer bu ikki komponentli spektrni ideal beradi.",
          C.bgPurple, C.purple, C.textDark
        )
      }

      // 8. SIANOFERRATLAR QATORI
      if (pdfSections.cyanoferrate) {
        drawSectionHeader(sectionNum++, "Sianoferratlar Qatori — Werner-Prussian")
        drawWrappedText(
          "K₄[Fe(CN)₆] barcha sianoferratlar oilasining asosiy vakili. Ular Prussian ko'k pigmentining prekursorlaridir. Quyidagi jadval sianoferratlar oilasining Mössbauer taqqosini keltiradi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("K₄[Fe(CN)₆] barcha sianoferratlar oilasining asosiy vakili. Ular Prussian ko'k pigmentining prekursorlaridir. Quyidagi jadval sianoferratlar oilasining Mössbauer taqqosini keltiradi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const wHeaders = ["Kompleks", "An'anaviy nom", "δ", "ΔE_Q", "Spektr"]
        const wColW = [150, 120, 60, 65, 100]
        let wcx = MARGIN + 6
        wHeaders.forEach((h, i) => {
          safeText(h, { x: wcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: wColW[i] - 4 })
          wcx += wColW[i]
        })
        y -= 20

        cyanoferrateSeries.forEach((w, idx) => {
          checkPageBreak(22)
          const bg = w.current ? C.bgYellow : (idx % 2 === 0 ? C.bgPurple : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx4 = MARGIN + 6
          const cells = [w.formula, w.trad, w.delta, w.deltaQ, w.spektr]
          cells.forEach((cell, i) => {
            const font = w.current ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = w.current ? C.yellowDeep : (i === 0 ? C.purple : C.textDark)
            safeText(cell, { x: cx4, y: y - 13, size: 8.5, font, color, maxWidth: wColW[i] - 4 })
            cx4 += wColW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "Natriy nitroprussid Na₂[Fe(CN)₅NO] — noyob birikma: formal Fe(II) LS bo'lsa ham, NO⁺ ligand C₄ᵥ simmetriya beradi (bir Fe–NO aksial, 5 ta Fe–C tenglama ekvatorial), natijada juda katta ΔE_Q = 1.76 mm/s. Bu tibbiyotda vazodilyator sifatida ishlatiladi.",
          C.bgYellow, C.yellow, C.textDark
        )
      }

      // 9. TAJRIBA PARAMETRLARI
      if (pdfSections.experimental) {
        drawSectionHeader(sectionNum++, "Tavsiya Etilgan Tajriba Parametrlari")
        experimentalParams.forEach((e, i) => {
          drawTableRow(e.param, `${e.value}  —  ${e.note}`, i % 2 === 0 ? C.bgYellow : C.white, C.yellowDeep)
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
          "K₄[Fe(CN)₆]·3H₂O nisbatan barqaror birikma, ammo bir necha spetsifik halaqit omillar mavjud (asosan trigidrat suvi bilan bog'liq):",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("K₄[Fe(CN)₆]·3H₂O nisbatan barqaror birikma, ammo bir necha spetsifik halaqit omillar mavjud (asosan trigidrat suvi bilan bog'liq):", regularFont, 9.5, CONTENT_W).length * 13 + 10

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
            x: MARGIN + 8, y, size: 8.5, font: italicFont, color: C.greenDark,
            maxWidth: CONTENT_W - 16, lineHeight: 11,
          })
          y -= h2 + 10
        })
      }

      // 12. XULOSALAR
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar")
        const conclusions = [
          "K₄[Fe(CN)₆]·3H₂O Mössbauer spektri klassik SINGLET — bitta Lorentzian chiziq δ = −0.04 mm/s markazida (RT). Bu Fe(II) LS d⁶ (t₂g⁶) konfiguratsiyaning bevosita natijasi.",
          "ΔE_Q = 0 (mukammal singlet) — VALENT hissa V_val = 0 (t₂g⁶ sferik) + PANJARA hissa V_lat ≈ 0 (deyarli mukammal Oh) → EFG = 0.",
          "Izomer siljish δ ≈ 0 (−0.04 mm/s) — kovalent Fe–C bog'lanish + CN⁻ ning kuchli π-akseptor xarakteri (Fe→CN back-bonding) tufayli |ψ(0)|² juda yuqori.",
          "H_hf = 0 (barcha T da) — DIAMAGNIT (S=0) holatning bevosita ko'rsatkichi. Fermi kontakt, orbital va spin-dipol hissalarning barchasi nol.",
          "Γ = 0.24 mm/s (77 K) — Heisenberg limitidan atigi 2.5× keng. Bu Mössbauer da uchraydigan eng tor chiziqli spektrlardan biri.",
          "Haroratga bog'liqlik: δ(T) chiziqli SOD trend (~−2·10⁻⁴ mm/s/K), ΔE_Q(T) = 0 barcha T da (t₂g⁶ Boltzmann bo'linishi mumkin emas), f_LM(T) Debye qonuni (θ_D ≈ 350 K).",
          "K₄[Fe(CN)₆] Mössbauer spektrometrlarining KALIBRLASH namunasi sifatida qabul qilingan (α-Fe folga bilan birga). Pozitsiya standart: −0.04 mm/s (RT), +0.02 mm/s (77 K).",
          "K₃[Fe(CN)₆] (Fe³⁺ LS, dublet) bilan taqqoslash Fe(II)/Fe(III) juftini AJRATISHNING eng aniq yo'li — Werner nazariyasining Mössbauer tasdig'i.",
          "Alternativ tasdiqlash: ¹³C NMR (170 ppm), ¹H NMR (suvli eritma), UV-Vis (MLCT 320 nm), IR (νCN = 2044 cm⁻¹), rentgen difraksiya (Fe–C = 1.900 Å).",
        ]
        conclusions.forEach((c, i) => {
          checkPageBreak(30)
          const boxH = wrapText(cleanText(c), regularFont, 9.5, CONTENT_W - 30).length * 12 + 12
          page.drawRectangle({
            x: MARGIN, y: y - boxH, width: CONTENT_W,
            height: boxH, color: i % 2 === 0 ? C.bgYellow : C.white,
          })
          page.drawCircle({
            x: MARGIN + 12, y: y - 12, size: 8,
            color: C.yellowDeep,
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
      link.download = `K4-FeCN6-Mossbauer-Tahlili-${new Date().toISOString().split("T")[0]}.pdf`
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
          <h1 className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center gap-2">
            ⚛️ K₄[Fe(CN)₆]·3H₂O — Mössbauer tahlili
          </h1>
          <p className="text-purple-400 text-xs">Sariq qon tuzi · Fe²⁺ LS · d⁶ t₂g⁶ · Kalibrlash birikmasi</p>
        </div>
        <button
          onClick={() => setPdfModalOpen(true)}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-lg text-white font-semibold text-sm transition-all shadow-lg shadow-yellow-500/20"
        >
          <span>📥</span> PDF eksport
        </button>
      </header>

      {/* PDF MODAL */}
      {pdfModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-purple-950 border border-purple-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-yellow-400">📄 PDF eksport — bo&apos;limlarni tanlang</h2>
              <button onClick={() => setPdfModalOpen(false)}
                className="text-purple-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { key: "identification", label: "1. Birikma identifikatsiyasi", desc: "Formula, IUPAC, CAS, XRD ma'lumotlar (19 qator)" },
                { key: "theory", label: "2. Nazariy asos", desc: "Recoil-free rezonans, Doppler, 3 hyperfine parametr" },
                { key: "parameters", label: "3. Mössbauer parametrlari", desc: "δ, ΔE_Q, H_hf, Γ, f_LM batafsil (5 ta parametr)" },
                { key: "spectrum", label: "4. Singlet talqini", desc: "V_val = 0, V_lat = 0, kalibrlash tayanchi" },
                { key: "temperature", label: "5. Haroratga bog'liqlik", desc: "6 ta harorat qiymati (4.2−350 K)" },
                { key: "selectionRules", label: "6. Tanlash qoidalari", desc: "⁵⁷Fe M1 o'tishlari + K₄ maxsus qoidalar (7 ta)" },
                { key: "k4vsk3", label: "7. K₄ vs K₃ taqqoslash", desc: "12 qatorli batafsil jadval — asosiy diagnostik" },
                { key: "cyanoferrate", label: "8. Sianoferratlar qatori", desc: "4 ta klassik kompleks taqqoslash" },
                { key: "experimental", label: "9. Tajriba parametrlari", desc: "12 ta amaliy tavsiyalar" },
                { key: "techniques", label: "10. O'lchov rejimlari", desc: "4 ta rejim — afzallik/kamchilik" },
                { key: "interferences", label: "11. Halaqit beruvchi omillar", desc: "8 ta omil va yechimlari" },
                { key: "conclusions", label: "12. Asosiy xulosalar", desc: "9 ta ilmiy xulosa" },
              ].map(s => (
                <label
                  key={s.key}
                  className="flex items-start gap-3 p-3 bg-purple-800/30 border border-purple-700/40 rounded-lg hover:border-yellow-500/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={pdfSections[s.key]}
                    onChange={(e) => setPdfSections({ ...pdfSections, [s.key]: e.target.checked })}
                    className="mt-1 accent-yellow-500"
                  />
                  <div className="flex-1">
                    <div className="text-yellow-300 font-semibold text-sm">{s.label}</div>
                    <div className="text-purple-300 text-xs mt-0.5">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
              <p className="text-yellow-200 text-xs">
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
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF ni yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════ 1. HERO KARTASI ═══════════ */}
        <div className="bg-gradient-to-br from-yellow-900/30 via-purple-900/30 to-blue-900/30 border border-yellow-500/40 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">⚛️</span>
                <div>
                  <div className="text-yellow-400 text-2xl md:text-3xl font-bold" dangerouslySetInnerHTML={{__html: COMPOUND.formulaHTML}}/>
                  <p className="text-purple-300 text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-purple-400 text-xs italic">« {COMPOUND.commonName} »</p>
                </div>
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                <strong className="text-yellow-300">K₄[Fe(CN)₆]·3H₂O</strong> — Fe(II) past spin holatining
                <strong className="text-orange-300"> klassik referens birikmasi</strong> va Mössbauer spektroskopiyasi
                amaliyotining <strong className="text-yellow-200">KALIBRLASH namunasi</strong>. CN⁻ kuchli maydon ligand
                tufayli Δo ≈ 33 800 cm⁻¹ &gt; P — LS holat barqaror, t₂g⁶ to&apos;liq to&apos;lgan (S=0, diamagnit).
                Elektron zaryad taqsimoti mukammal sferik simmetrik → EFG = 0 → <strong>SINGLET</strong> spektri.
                δ ≈ 0 — CN⁻ ning π-akseptor xarakteri va kovalent bog&apos;lanish natijasi.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-xl border-2 border-yellow-500/30 shadow-inner flex items-center justify-center text-xs text-purple-900/80 font-mono font-bold"
                style={{background: "linear-gradient(135deg, #f9e076, #fbbf24, #f9e076)"}}>
                Limonli-sariq
              </div>
              <div className="bg-purple-950/60 rounded-lg p-2 text-[10px] space-y-0.5">
                <p><span className="text-purple-400">M:</span> <span className="text-white font-mono">{COMPOUND.molarMass} g/mol</span></p>
                <p><span className="text-purple-400">CAS:</span> <span className="text-white font-mono">{COMPOUND.casNumber}</span></p>
                <p><span className="text-purple-400">Fe–C:</span> <span className="text-white font-mono">1.900 Å</span></p>
                <p><span className="text-purple-400">Space grp:</span> <span className="text-white font-mono">C2/c</span></p>
              </div>
            </div>
          </div>

          {/* Asosiy parametrlar */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6">
            <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-lg p-3 text-center">
              <p className="text-yellow-400 text-[10px] uppercase tracking-wider">δ (izomer siljish)</p>
              <p className="text-white font-mono text-lg font-bold">−0.04</p>
              <p className="text-purple-400 text-[9px]">mm/s (RT)</p>
            </div>
            <div className="bg-orange-600/20 border border-orange-500/40 rounded-lg p-3 text-center">
              <p className="text-orange-400 text-[10px] uppercase tracking-wider">ΔE_Q (kvadrupol)</p>
              <p className="text-white font-mono text-lg font-bold">0.00</p>
              <p className="text-purple-400 text-[9px]">mm/s (SINGLET!)</p>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/40 rounded-lg p-3 text-center">
              <p className="text-blue-400 text-[10px] uppercase tracking-wider">H_hf (magnit)</p>
              <p className="text-white font-mono text-lg font-bold">0</p>
              <p className="text-purple-400 text-[9px]">T (diamag)</p>
            </div>
            <div className="bg-teal-600/20 border border-teal-500/40 rounded-lg p-3 text-center">
              <p className="text-teal-400 text-[10px] uppercase tracking-wider">Γ (kenglik)</p>
              <p className="text-white font-mono text-lg font-bold">0.24</p>
              <p className="text-purple-400 text-[9px]">mm/s (eng tor)</p>
            </div>
            <div className="bg-green-600/20 border border-green-500/40 rounded-lg p-3 text-center">
              <p className="text-green-400 text-[10px] uppercase tracking-wider">Spektr</p>
              <p className="text-white font-mono text-base font-bold">SINGLET</p>
              <p className="text-purple-400 text-[9px]">bitta chiziq</p>
            </div>
          </div>

          {/* Maxsus xususiyat — kalibrlash */}
          <div className="mt-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/50 rounded-xl p-4">
            <p className="text-yellow-200 text-sm flex items-start gap-2">
              <span className="text-2xl">🎯</span>
              <span>
                <strong className="text-yellow-300">Noyob maqom:</strong> K₄[Fe(CN)₆]·3H₂O — Mössbauer spektrometrlarining
                <strong className="text-orange-300"> STANDART KALIBRLASH NAMUNASI</strong> (α-Fe folga bilan birga).
                Butun jahon Mössbauer laboratoriyalarida bu birikmaning pozitsiyasi tayanch nuqta sifatida ishlatiladi.
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
              <p className="text-purple-400 text-xs">δ, ΔE_Q, Γ parametrlarini o&apos;zgartirib singlet ↔ dublet o&apos;zgarishini kuzating</p>
            </div>
          </div>

          {/* Boshqaruv */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">δ (izomer siljish):</span>
                <span className="text-white font-mono">{simDelta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="-0.5" max="0.5" step="0.01" value={simDelta}
                onChange={(e) => setSimDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-yellow-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>Kovalent (−0.5)</span>
                <span>K₄ (−0.04)</span>
                <span>Ionli (+0.5)</span>
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
                <span>K₄ SINGLET (0)</span>
                <span>K₃ (0.28)</span>
                <span>Assimetrik (3.5)</span>
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
                <span>K₄ ideal (0.24)</span>
                <span>Kengaygan (0.8)</span>
              </div>
            </div>
          </div>

          {/* Preset tugmalari */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setSimDelta(-0.04); setSimDeltaQ(0.00); setSimGamma(0.24) }}
              className="px-3 py-1 bg-yellow-600/30 border border-yellow-500/40 text-yellow-300 rounded-full text-xs hover:bg-yellow-600/50 transition-colors">
              🎯 K₄[Fe(CN)₆] (RT)
            </button>
            <button onClick={() => { setSimDelta(0.02); setSimDeltaQ(0.00); setSimGamma(0.24) }}
              className="px-3 py-1 bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-full text-xs hover:bg-blue-600/50 transition-colors">
              ❄ K₄[Fe(CN)₆] (77 K)
            </button>
            <button onClick={() => { setSimDelta(-0.12); setSimDeltaQ(0.28); setSimGamma(0.28) }}
              className="px-3 py-1 bg-red-600/30 border border-red-500/40 text-red-300 rounded-full text-xs hover:bg-red-600/50 transition-colors">
              🔴 K₃[Fe(CN)₆] (taqqoslash)
            </button>
            <button onClick={() => { setSimDelta(-0.17); setSimDeltaQ(1.76); setSimGamma(0.30) }}
              className="px-3 py-1 bg-purple-600/30 border border-purple-500/40 text-purple-300 rounded-full text-xs hover:bg-purple-600/50 transition-colors">
              💊 Na₂[Fe(CN)₅NO] nitroprussid
            </button>
            <button onClick={() => { setSimDelta(0.06); setSimDeltaQ(0.00); setSimGamma(0.22) }}
              className="px-3 py-1 bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-full text-xs hover:bg-cyan-600/50 transition-colors">
              🥶 K₄ (4.2 K, eng tor)
            </button>
          </div>

          {/* Spektr */}
          <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/40">
            <InteraktivSpektr delta={simDelta} deltaQ={simDeltaQ} gamma={simGamma}/>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-purple-200">
            <p><strong className="text-yellow-300">📖 Kuzatishlar:</strong></p>
            <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
              <li><strong>ΔE_Q = 0 → SINGLET</strong> (bitta chiziq). K₄[Fe(CN)₆] noyob holati!</li>
              <li><strong>ΔE_Q &gt; 0.02 → DUBLET</strong> (ikki chiziq). Ligand yoki d-elektron asimmetriya</li>
              <li><strong>δ = 0 belgi</strong> — K₄ Mössbauer spektrometrlarining kalibrlash tayanchi</li>
              <li><strong>Γ eng tor</strong> — diamagnit + sferik + monofazali kristall</li>
            </ul>
          </div>
        </div>

        {/* ═══════════ 3. MÖSSBAUER PARAMETRLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎛️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Giperkichik parametrlar — batafsil ilmiy tahlil</h2>
              <p className="text-purple-400 text-xs">5 ta asosiy parametr — har birini tanlab batafsil ma&apos;lumot oling</p>
            </div>
          </div>

          {/* Parametr tanlagichi */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {mossbauerParams.map((p, i) => (
              <button key={i} onClick={() => setSelectedParam(i)}
                className={`px-3 py-3 rounded-xl text-left transition-all ${
                  selectedParam === i
                    ? "bg-yellow-600/30 border-2 border-yellow-400"
                    : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
                }`}>
                <div className={`font-bold text-lg ${selectedParam === i ? "text-yellow-300" : "text-yellow-400"}`}>{p.param}</div>
                <div className="text-purple-300 text-[10px] mt-0.5 leading-tight">{p.paramName}</div>
              </button>
            ))}
          </div>

          {/* Tanlangan parametr batafsil */}
          <div className="bg-purple-800/30 border border-yellow-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-baseline gap-4 flex-wrap">
              <div>
                <span className="text-yellow-400 text-4xl font-bold">{p.param}</span>
                <span className="text-purple-300 text-sm ml-2">= </span>
                <span className="text-orange-400 text-2xl font-mono font-bold">{p.value}</span>
                <span className="text-purple-400 text-sm ml-1">{p.unit}</span>
              </div>
              <span className="text-purple-500 text-xs italic bg-purple-950/50 px-2 py-1 rounded">{p.reference}</span>
            </div>

            <div className="bg-black/30 rounded-lg p-3 border border-yellow-500/20 text-center">
              <p className="text-yellow-300 font-mono text-sm">{p.formula}</p>
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

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-300 font-bold text-xs mb-2">🎓 Nazariy tushuntirish:</p>
              <p className="text-purple-100 text-xs leading-relaxed">{p.theoryNote}</p>
            </div>
          </div>

          {/* Barcha parametrlar tez jadval */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-yellow-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Qiymat</th>
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Formula</th>
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Diagnostik</th>
                </tr>
              </thead>
              <tbody>
                {mossbauerParams.map((mp, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3">
                      <div className="text-yellow-300 font-bold text-lg">{mp.param}</div>
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

        {/* ═══════════ 4. HARORAT ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌡️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Haroratga bog&apos;liq o&apos;lchovlar</h2>
              <p className="text-purple-400 text-xs">4.2 K dan 350 K gacha K₄[Fe(CN)₆]·3H₂O parametrlari</p>
            </div>
          </div>

          {/* Harorat tanlagichi */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {tempData.map((td, i) => (
              <button key={i} onClick={() => setSelectedTemp(i)}
                className={`px-3 py-2 rounded-lg text-center transition-all ${
                  selectedTemp === i
                    ? "bg-yellow-600/40 border-2 border-yellow-400"
                    : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
                }`}>
                <div className={`font-bold ${selectedTemp === i ? "text-yellow-300" : "text-yellow-400"}`}>{td.T} K</div>
              </button>
            ))}
          </div>

          {/* Tanlangan harorat detali */}
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-3 text-sm">T = {t.T} K — {t.izoh}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <p className="text-yellow-400 text-[10px] uppercase">δ</p>
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
                <p className="text-white font-mono text-xl">{t.H_hf}</p>
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

          {/* To'liq jadval */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-yellow-500/30 bg-purple-950/50">
                  <th className="py-2 px-3 text-yellow-300 text-xs uppercase">T (K)</th>
                  <th className="py-2 px-3 text-yellow-300 text-xs uppercase">δ (mm/s)</th>
                  <th className="py-2 px-3 text-yellow-300 text-xs uppercase">ΔE_Q</th>
                  <th className="py-2 px-3 text-yellow-300 text-xs uppercase">f_LM</th>
                  <th className="py-2 px-3 text-yellow-300 text-xs uppercase">Γ</th>
                  <th className="py-2 px-3 text-yellow-300 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {tempData.map((td, i) => (
                  <tr key={i} className={`border-b border-purple-800/40 ${selectedTemp === i ? "bg-yellow-900/20" : "hover:bg-purple-800/20"}`}>
                    <td className="py-2 px-3 text-yellow-400 font-bold">{td.T}</td>
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
            <p className="text-teal-300 font-bold text-xs mb-2">⚡ Haroratga bog&apos;liqlik xulosalari:</p>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>δ trend:</strong> T oshgach chiziqli kamayadi (SOD effekt, ~−2·10⁻⁴ mm/s/K)</li>
              <li><strong>ΔE_Q = 0 barcha T da:</strong> t₂g⁶ mutlaq sferik, Boltzmann bo&apos;linishi mumkin emas</li>
              <li><strong>f_LM eksponentsial pasayish:</strong> θ_D ≈ 350 K (K₃ dan yuqori!)</li>
              <li><strong>350 K dan yuqori — muammo:</strong> trigidrat suvi chiqadi, panjara buziladi, ΔE_Q ~0.2 ga oshadi</li>
            </ul>
          </div>
        </div>

        {/* ═══════════ 5. K4 vs K3 TAQQOSLAMA ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚖️</span>
            <div>
              <h2 className="text-xl font-bold text-white">K₄[Fe(CN)₆] vs K₃[Fe(CN)₆] — Werner klassik jufti</h2>
              <p className="text-purple-400 text-xs">BITTA elektron farqi — DRAMATIK o&apos;zgarishlar</p>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 text-sm text-purple-200">
            <p>Sariq va qizil qon tuzlari koordinatsion kimyoning eng klassik taqqoslash juftidir. Ular
              faqat <strong className="text-orange-300">bir elektron farqi</strong> bilan farq qiladi (Fe²⁺ vs Fe³⁺),
              lekin bu farq quyidagi dramatik o&apos;zgarishlarga olib keladi:</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">K₄[Fe(CN)₆] (bu)</th>
                  <th className="py-3 px-3 text-red-300 text-xs uppercase">K₃[Fe(CN)₆]</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Ahamiyat</th>
                </tr>
              </thead>
              <tbody>
                {k4vsK3.map((k, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3 text-purple-300 font-bold text-xs">{k.param}</td>
                    <td className="py-2 px-3 text-yellow-300 font-mono text-xs">{k.k4}</td>
                    <td className="py-2 px-3 text-red-300 font-mono text-xs">{k.k3}</td>
                    <td className="py-2 px-3 text-purple-200 text-[11px] italic">{k.ahamiyat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-300 font-bold text-sm mb-2">🟡 K₄[Fe(CN)₆] — Fe(II) LS</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>t₂g⁶ eg⁰</strong> — barcha 6 elektron t₂g da juftlangan → <strong className="text-orange-300">S=0, DIAMAGNIT</strong>.
                Sferik simmetriya → V_val = 0 → <strong className="text-orange-300">SINGLET</strong>. Rangi
                MLCT (Fe→CN) 320 nm da → sariq. νCN = 2044 cm⁻¹ (Fe(II)→CN π-back kuchli, C≡N zaiflashadi).
              </p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 font-bold text-sm mb-2">🔴 K₃[Fe(CN)₆] — Fe(III) LS</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>t₂g⁵ eg⁰</strong> — 5 elektron, bittasi yakka to&apos;ldirilmagan → <strong className="text-yellow-300">S=1/2, paramagnit</strong>.
                Asimmetrik zaryad taqsimoti → V_val ≠ 0 → <strong className="text-yellow-300">DUBLET</strong>.
                Rangi LMCT (CN→Fe) 420 nm da → qizil. νCN = 2135 cm⁻¹ (Fe(III) da back-bonding zaifroq).
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 6. TANLASH QOIDALARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📐</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tanlash qoidalari — ⁵⁷Fe yadro o&apos;tishlari</h2>
              <p className="text-purple-400 text-xs">K₄[Fe(CN)₆] uchun soddalashtirilgan holat (singlet)</p>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 text-sm text-purple-200 leading-relaxed">
            <p>⁵⁷Fe uchun asosiy Mössbauer o&apos;tishi <strong className="text-yellow-300">14.4125 keV</strong> — bu
              <strong> I=1/2</strong> (asosiy holat, g_n = +0.181) va <strong>I=3/2</strong> (qo&apos;zg&apos;algan holat,
              g_n = −0.103, τ = 141 ns) orasidagi <strong className="text-orange-300">magnit dipol (M1) o&apos;tish</strong>.
              K₄[Fe(CN)₆] uchun soddalashtiruvchi shartlar:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectionRules.map((sr, i) => (
              <div key={i} className="bg-purple-800/30 border border-purple-700/40 rounded-lg p-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-yellow-300 font-mono font-bold text-base">{sr.rule}</span>
                </div>
                <p className="text-purple-300 text-xs mt-1">{sr.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-sm">
            <p className="text-blue-300 font-bold text-xs mb-2">💡 Singlet holati — 4 o&apos;tish yo&apos;li birlashadi:</p>
            <p className="text-purple-200 text-xs">
              K₄[Fe(CN)₆] da <strong className="text-yellow-300">V_zz = 0</strong> tufayli 4 ta o&apos;tish yo&apos;li
              (±3/2 → ±1/2, ±3/2 → ∓1/2, ±1/2 → ±1/2, ±1/2 → ∓1/2) birlashadi va bir energetik pozitsiyada
              joylashadi. Natijada bir chiziqli spektr — <strong className="text-orange-300">SINGLET</strong>.
              Bu Mössbauer da uchraydigan eng oddiy va nazariy jihatdan eng shaffof holat.
            </p>
          </div>
        </div>

        {/* ═══════════ 7. SIANOFERRATLAR QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔗</span>
            <div>
              <h2 className="text-xl font-bold text-white">Sianoferratlar qatori — Werner-Prussian klassikasi</h2>
              <p className="text-purple-400 text-xs">Sianoferratlarning to&apos;liq Mössbauer taqqosi</p>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 text-sm text-purple-200">
            <p>K₄[Fe(CN)₆] — sianoferratlar oilasining boshi. Bu birikma tarixda <strong className="text-yellow-300">Prussian
              ko&apos;k pigmentining prekursori</strong> sifatida 300+ yildan foydalanilgan. Zamonaviy amaliyotda
              Na-ion batareya, elektrokataliz, biosensor va oziq-ovqat sanoati (E535) sohalarida ishlatiladi.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">An&apos;anaviy nom</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Fe oksid.</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">δ</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ΔE_Q</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Spektr</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Spin</th>
                </tr>
              </thead>
              <tbody>
                {cyanoferrateSeries.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/40 ${c.current ? "bg-yellow-900/20 border-yellow-500/30" : "hover:bg-purple-800/20"}`}>
                    <td className={`py-3 px-3 font-bold ${c.current ? "text-yellow-300" : "text-purple-200"}`}>{c.formula}</td>
                    <td className="py-3 px-3 text-purple-300 text-xs">{c.trad}</td>
                    <td className="py-3 px-3 text-purple-200 text-xs">{c.oxid}</td>
                    <td className="py-3 px-3 font-mono text-yellow-400">{c.delta}</td>
                    <td className="py-3 px-3 font-mono text-orange-400">{c.deltaQ}</td>
                    <td className="py-3 px-3 text-teal-300 text-xs">{c.spektr}</td>
                    <td className="py-3 px-3 text-purple-300 text-xs">{c.spin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-300 font-bold text-sm mb-2">🔵 Prussian ko&apos;k Fe₄[Fe(CN)₆]₃</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Ikki sayt tuzilishi:</strong> Ichki Fe(II) LS (C bilan, δ=−0.02 — K₄ ga o&apos;xshash) va
                tashqi Fe(III) HS (N bilan, δ=+0.36). Ikki sayt Mössbauer da BIR spektrda ko&apos;rinadi.
                K₄[Fe(CN)₆] va K₃[Fe(CN)₆] taqqosisi Prussian ko&apos;k analizini tushunish uchun asos.
              </p>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
              <p className="text-purple-300 font-bold text-sm mb-2">💊 Natriy nitroprussid Na₂[Fe(CN)₅NO]</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Noyob holat:</strong> Formal Fe(II) LS bo&apos;lsa ham NO⁺ ligand C₄ᵥ simmetriya
                beradi (5 CN⁻ ekvatorial + 1 NO⁺ aksial). Natijada juda katta ΔE_Q = 1.76 mm/s.
                Tibbiyotda vazodilyator (qon bosimini pasaytiruvchi) sifatida ishlatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 8. TAJRIBA PARAMETRLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tavsiya etilgan tajriba parametrlari</h2>
              <p className="text-purple-400 text-xs">K₄[Fe(CN)₆]·3H₂O Mössbauer o&apos;lchov uchun (12 ta amaliy tavsiya)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-yellow-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Qiymat / tavsiya</th>
                  <th className="py-3 px-3 text-yellow-300 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {experimentalParams.map((e, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3 text-yellow-300 font-bold text-xs">{e.param}</td>
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
              <p className="text-purple-400 text-xs">4 xil texnika — har birining afzallik va kamchiliklari</p>
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
              <p className="text-purple-400 text-xs">K₄[Fe(CN)₆]·3H₂O ga xos spetsifik muammolar (asosan trigidrat suvi)</p>
            </div>
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
                    <p className="text-purple-200"><strong className="text-green-300">Yechim:</strong> <em className="text-green-200">{iv.solution}</em></p>
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
              <h2 className="text-xl font-bold text-white">Tarixiy kontekst — K₄[Fe(CN)₆] va Mössbauer</h2>
              <p className="text-purple-400 text-xs">320 yildan ortiq tarix — Diesbach dan kvantovaya kompyutinggacha</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 via-purple-500 to-teal-500"></div>
            <div className="space-y-3">
              {historyEvents.map((h, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-purple-950"></div>
                  <div className="bg-purple-800/30 rounded-lg p-3 border border-purple-700/40">
                    <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                      <span className="text-yellow-400 font-bold text-sm font-mono">{h.year}</span>
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
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/30 rounded-2xl p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <h2 className="text-xl font-bold text-white">Asosiy xulosalar</h2>
          </div>
          <ol className="space-y-2 text-purple-200 text-sm list-decimal list-inside leading-relaxed">
            <li>K₄[Fe(CN)₆]·3H₂O ⁵⁷Fe Mössbauer spektri <strong className="text-orange-300">klassik SINGLET</strong> — bitta Lorentzian chiziq δ = −0.04 mm/s markazida (RT). Fe(II) LS d⁶ (t₂g⁶) konfiguratsiyaning bevosita natijasi.</li>
            <li><strong className="text-orange-300">ΔE_Q = 0</strong> (mukammal singlet) — VALENT hissa V_val = 0 (t₂g⁶ sferik) + PANJARA hissa V_lat ≈ 0 (deyarli mukammal Oh) → EFG = 0.</li>
            <li><strong className="text-yellow-300">δ ≈ 0 (−0.04 mm/s)</strong> — kovalent Fe–C bog&apos;lanish + CN⁻ ning kuchli π-akseptor xarakteri (Fe→CN back-bonding) tufayli |ψ(0)|² juda yuqori.</li>
            <li><strong className="text-blue-300">H_hf = 0 (barcha T da)</strong> — DIAMAGNIT (S=0) holatning bevosita ko&apos;rsatkichi. Fermi kontakt, orbital va spin-dipol hissalarning barchasi nol.</li>
            <li><strong className="text-teal-300">Γ = 0.24 mm/s (77 K)</strong> — Heisenberg limitidan atigi 2.5× keng. Bu Mössbauer da uchraydigan eng tor chiziqli spektrlardan biri.</li>
            <li><strong className="text-green-300">Haroratga bog&apos;liq:</strong> δ(T) chiziqli SOD trend (~−2·10⁻⁴ mm/s/K), ΔE_Q(T) = 0 barcha T da (t₂g⁶ Boltzmann bo&apos;linishi mumkin emas), f_LM(T) Debye qonuni (θ_D ≈ 350 K).</li>
            <li>K₄[Fe(CN)₆] Mössbauer spektrometrlarining <strong className="text-yellow-300">KALIBRLASH namunasi</strong> sifatida qabul qilingan (α-Fe folga bilan birga). Pozitsiya standart: −0.04 mm/s (RT), +0.02 mm/s (77 K).</li>
            <li>K₃[Fe(CN)₆] (Fe³⁺ LS, dublet) bilan taqqoslash Fe(II)/Fe(III) juftini <strong className="text-orange-300">AJRATISHNING</strong> eng aniq yo&apos;li — Werner nazariyasining Mössbauer tasdig&apos;i.</li>
            <li>Alternativ tasdiqlash: ¹³C NMR (170 ppm), ¹H NMR (H₂O), UV-Vis (MLCT 320 nm), IR (νCN = 2044 cm⁻¹), XRD (Fe–C = 1.900 Å). Barcha usullar bir xil natijaga keltiradi.</li>
          </ol>
        </div>

        {/* ═══════════ 13. ADABIYOTLAR ═══════════ */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-2xl p-6 space-y-3">
          <h3 className="text-teal-400 font-bold flex items-center gap-2 text-lg">
            <span>📚</span> Manba adabiyotlar
          </h3>
          <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>P. Gütlich, E. Bill, A. X. Trautwein</strong> — <em>Mössbauer Spectroscopy and Transition Metal Chemistry: Fundamentals and Applications</em>. Springer, 2011.</li>
            <li><strong>N. N. Greenwood, T. C. Gibb</strong> — <em>Mössbauer Spectroscopy</em>. Chapman &amp; Hall, London, 1971 (klassik ma&apos;lumotnoma).</li>
            <li><strong>F. Menil</strong> — Systematic trends of the ⁵⁷Fe Mössbauer isomer shifts. <em>J. Phys. Chem. Solids</em> <strong>46</strong>, 763 (1985).</li>
            <li><strong>W. Kerler, W. Neuwirth</strong> — Über die Mössbauer-Absorption in K₄Fe(CN)₆·3H₂O. <em>Z. Physik</em> <strong>167</strong>, 176 (1962) — K₄[Fe(CN)₆] birinchi spektri.</li>
            <li><strong>J. F. Duncan, R. M. Golding</strong> — Applications of Mössbauer spectroscopy to inorganic chemistry. <em>Q. Rev. Chem. Soc.</em> <strong>19</strong>, 36 (1965) — sianoferratlar tahlili.</li>
            <li><strong>R. L. Mössbauer</strong> — Kernresonanzfluoreszenz von Gammastrahlung in Ir¹⁹¹. <em>Z. Physik</em> <strong>151</strong>, 124 (1958) — asl kashfiyot.</li>
            <li><strong>R. H. Herber (ed.)</strong> — <em>Chemical Mössbauer Spectroscopy</em>. Plenum Press, 1984.</li>
            <li><strong>A. Werner</strong> — Beitrag zur Konstitution anorganischer Verbindungen. <em>Z. anorg. Chem.</em> <strong>3</strong>, 267 (1893) — koordinatsion nazariya.</li>
            <li><strong>C. K. Jørgensen</strong> — <em>Absorption Spectra and Chemical Bonding in Complexes</em>. Pergamon Press, 1962 — sianoferratlar elektron strukturasi.</li>
          </ul>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/k3-fe-cn6"
            className="px-6 py-3 border border-red-500 rounded-xl hover:bg-red-800/30 text-red-300 transition-all hover:border-red-400 flex items-center gap-2">
            <span>←</span>
            <div className="text-left">
              <div className="text-[10px] text-red-400">Oldingi:</div>
              <div className="font-bold">K₃[Fe(CN)₆] — Qizil qon</div>
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
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-2"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-green-500/30">
            <div className="text-right">
              <div className="text-[10px] text-green-100">Keyingi:</div>
              <div>[Fe(H₂O)₆]²⁺ Fe(II) HS</div>
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
          Mössbauer spektroskopiyasi · K₄[Fe(CN)₆]·3H₂O — Sariq qon tuzi · Fe(II) LS kalibrlash birikmasi
        </p>
      </footer>
    </main>
  )
}
