"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Fe(CN)₆] — MÖSSBAUER SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • Gütlich P., Bill E., Trautwein A.X. — Mössbauer Spectroscopy and Transition
//     Metal Chemistry: Fundamentals and Applications (Springer, 2011)
//   • Greenwood N.N., Gibb T.C. — Mössbauer Spectroscopy (Chapman & Hall, 1971)
//   • Menil F. — J. Phys. Chem. Solids 46, 763 (1985) — δ va kimyoviy bog'lanish
//   • Mössbauer R.L. — Z. Physik 151, 124 (1958) — asl kashfiyot
//   • Ingalls R. — Phys. Rev. 133, A787 (1964) — ΔE_Q(T) modeli
//   • Herber R.H. (ed.) — Chemical Mössbauer Spectroscopy (Plenum, 1984)
// Xususiyat: Mössbauer to'liq yoritilgan + PDF eksport (faqat Mössbauer tahlili)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
  formulaPlain: "K3[Fe(CN)6]",
  iupac: "Kaliy geksatsianoferrat(III)",
  commonName: "Qizil qon tuzi (Ferricyanide)",
  molarMass: 329.24,
  casNumber: "13746-66-2",
  color: "yorqin ruby-qizil kristall",
  structure: "Oktaedr (Oh, [Fe(CN)6]³⁻ ioni)",
  metalLigand: "Fe–C≡N",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "Oh (kompleks anioni uchun)",
  bondLengthFeC: "1.926 Å",
  bondLengthCN: "1.155 Å",
  bondAngle: "90° / 180° (N-Fe-N)",
  cfseValue: "-2.0 Δo",
  deltaOh: "33 800 cm⁻¹ (~404 kJ/mol)",
  pairingEnergy: "~19 000 cm⁻¹",
  spinState: "d⁵ past spin (t₂g⁵)",
  spin: "S = 1/2",
  magnet: "Paramagnit (μ_eff ≈ 2.25 μB, Kotani egri chizig'i)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// MÖSSBAUER PARAMETRLARI — batafsil ilmiy izohlar bilan
// ═══════════════════════════════════════════════════════════════════════════════
const mossbauerParams = [
  {
    param: "δ", paramName: "Izomer siljish",
    value: "−0.12", unit: "mm/s",
    reference: "α-Fe (RT) ga nisbatan",
    physicalMeaning: "Yadro va s-elektron zichligining elektrostatik o'zaro ta'siri",
    formula: "δ = (2π/3)Ze²[|ψ_A(0)|² − |ψ_S(0)|²](ΔR/R)",
    diagnostic: "Fe³⁺ LS uchun tipik (−0.15 ÷ +0.30 mm/s diapazoni)",
    interpretation: "Manfiy δ — |ψ(0)|² yuqori — kovalent bog'lanish, π-back-bonding CN⁻ ga, 4s ekranlash kamaygan",
    intensity: "Juda muhim", intensityCode: 4,
    freeIon: "Fe³⁺(gaz): −0.5 mm/s (ekstrapolyatsiya)",
    coordShift: "CN⁻ ligandda kovalentlik δ ni pastroq qiladi",
    theoryNote: "Izomer siljish δ manba (⁵⁷Co/Rh) va absorbent (K₃[Fe(CN)₆]) o'rtasidagi yadro s-elektron zichligining farqiga bog'liq. ⁵⁷Fe uchun ΔR/R < 0 (qo'zg'algan yadro kichikroq), demak |ψ(0)|² yuqori → δ past. K₃[Fe(CN)₆] da CN⁻ ligand kuchli σ-donor va π-akseptor: Fe(3d) → π*(CN) back-donation orqali 3d dan 4p/4s ga elektron zichligining qayta taqsimoti sodir bo'ladi, |ψ(0)|² keskin oshadi va δ manfiy chiqadi.",
    tag: "isomerShift"
  },
  {
    param: "ΔE_Q", paramName: "Kvadrupol bo'linishi",
    value: "0.28", unit: "mm/s",
    reference: "T = 295 K (RT)",
    physicalMeaning: "Yadroning kvadrupol momenti Q va elektr maydon gradienti (EFG) o'zaro ta'siri",
    formula: "ΔE_Q = ½·e·Q·V_zz·√(1 + η²/3)",
    diagnostic: "t₂g⁵ konfiguratsiya (bitta g'ovak) — nolga teng bo'lmagan EFG",
    interpretation: "t₂g⁵ da bitta orbital yakka to'ldirilmagan → asimmetriya → V_zz ≠ 0 → dublet",
    intensity: "Juda muhim", intensityCode: 4,
    freeIon: "Fe(III) LS: 0.4−3.0 mm/s (keng diapazon)",
    coordShift: "Ideal Oh dan buzilish + t₂g asimmetriyasi",
    theoryNote: "Kvadrupol bo'linishi ⁵⁷Fe ning I=3/2 qo'zg'algan holatidagi ±1/2 va ±3/2 subholatlarning parchalanishi natijasidir. ⁵⁷Fe* kvadrupol momenti Q = +0.16 barn. Elektr maydon gradienti (EFG, V_ij tenzori) ikki manbadan keladi: (1) valent hissa V_val — d-orbitallarning noyakson to'ldirilishi; t₂g⁵ da bitta orbital yakka to'ldirilmagan, bu 4/7·<r⁻³>·e ga teng valent hissa beradi; (2) panjara hissa V_lat — atrofdagi CN⁻ ligandlarning zaryad taqsimoti. Ideal Oh da V_lat = 0, ammo K₃[Fe(CN)₆] da monoklinik panjara tufayli oz miqdorda buzilish mavjud.",
    tag: "quadrupole"
  },
  {
    param: "H_hf", paramName: "Giperkichik magnit maydon",
    value: "0", unit: "Tesla",
    reference: "T > 5 K",
    physicalMeaning: "Yadro spini I ning ichki magnit maydonda Zeeman parchalanishi",
    formula: "H_hf = H_F + H_L + H_D + H_dip + H_ext",
    diagnostic: "Paramagnit + tez spin-spin relaksatsiya → sekstet YO'Q",
    interpretation: "T > 5 K da τ_e < 1/ω_L (10⁻⁸ s) — magnit tuzilma ko'rinmaydi",
    intensity: "Muhim", intensityCode: 3,
    freeIon: "Fe³⁺ LS teoretik: ~40−50 T (agar τ_e uzoq bo'lsa)",
    coordShift: "CN⁻ ligand — kuchli maydon, spin S=1/2, kichik intrinsik moment",
    theoryNote: "Paramagnit Fe³⁺ LS (S=1/2) da elektron spinlari orasidagi almashinuv juda tez (τ_e ≈ 10⁻¹¹ s), Larmor davri (1/ω_L ≈ 10⁻⁸ s) dan bir necha tartib qisqa. Shuning uchun yadro o'rtacha nol magnit maydon 'ko'radi' va sekstet paydo bo'lmaydi. Ammo T < 4.2 K va tashqi maydon (5−9 T) qo'llansa, spin relaksatsiyasi sekinlashadi va sekstet paydo bo'lishi mumkin. Bu 'dressed' Mössbauer usuli bilan H_hf ≈ 45−50 T ni o'lchash imkoni beradi.",
    tag: "magnetic"
  },
  {
    param: "Γ", paramName: "Chiziq kengligi (FWHM)",
    value: "0.28", unit: "mm/s",
    reference: "T = 77 K, ⁵⁷Co/Rh manba",
    physicalMeaning: "Tabiiy chiziq kengligi + jihoz + namuna kengayishi",
    formula: "Γ_exp = Γ_manba + Γ_absorbent + Γ_geom + Γ_kalinlik",
    diagnostic: "Yuqori kristallik namuna (Γ ≈ 2·Γ_nat)",
    interpretation: "Tabiiy chegaraga yaqin — bir sayt, monofazali",
    intensity: "Sifat ko'rsatkichi", intensityCode: 3,
    freeIon: "Γ_nat(⁵⁷Fe) = 0.097 mm/s (Heisenberg limiti, 2/τ)",
    coordShift: "Amorf yoki ko'p sayt tuz → Γ > 0.4 mm/s",
    theoryNote: "Heisenberg noaniqlik prinsipi ⁵⁷Fe uchun tabiiy chiziq kengligini Γ_nat = ℏ/τ = 4.66·10⁻⁹ eV ≈ 0.097 mm/s ga qo'yadi (τ = 141 ns yashash vaqti). Amaliyotda o'lchangan Γ_exp har doim 2·Γ_nat ≈ 0.194 mm/s dan katta, chunki ham manba ham absorbent chiziqlar profil qiladi. K₃[Fe(CN)₆] uchun Γ ≈ 0.28 mm/s — yaxshi kristallik va monofazali namuna signali. Amorf yoki nanozarrachalarda Γ > 0.4 mm/s bo'lib, ko'p sayt taqsimotini ko'rsatadi.",
    tag: "linewidth"
  },
  {
    param: "f_LM", paramName: "Lamb–Mössbauer omili",
    value: "0.72", unit: "(o'lchamsiz)",
    reference: "T = 77 K, θ_D ≈ 300 K",
    physicalMeaning: "Recoil-free rezonans yutish ehtimoli",
    formula: "f_LM = exp[−(6E_R/k_Bθ_D)(¼ + (T/θ_D)²·π²/6)]",
    diagnostic: "f > 0.5 — a'lo o'lchov shartlari",
    interpretation: "K₃[Fe(CN)₆] — o'rtacha qattiq kristall (θ_D ≈ 300 K)",
    intensity: "O'lchov sharti", intensityCode: 2,
    freeIon: "Gaz/suyuqlik: f = 0 (rezonans YO'Q)",
    coordShift: "Kristallik yaxshilashish f ni oshiradi",
    theoryNote: "Lamb–Mössbauer omili — recoil-free (qaytishsiz) gamma-yutish ehtimolini xarakterlaydi. Debye modelida f = exp(-<x²>·k²) — atomning termik tebranish o'rtacha kvadrat siljishi <x²> ga bog'liq. Qattiq kristallda atom panjaraga bog'langan va massa cheksizga yaqin, shuning uchun recoil energiya E_R = 1.96·10⁻³ eV panjara tomonidan yutiladi. K₃[Fe(CN)₆] uchun Debye harorati ≈ 300 K, 77 K da f ≈ 0.72 — juda yaxshi. Xona haroratida (295 K) f ≈ 0.40 — hali ham etarli. Suyuq eritmada f = 0, shuning uchun qattiq namuna majburiy.",
    tag: "lambMossbauer"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HARORATGA BOG'LIQ PARAMETRLAR (T = 4.2, 77, 295 K)
// ═══════════════════════════════════════════════════════════════════════════════
const tempData = [
  { T: 4.2,  delta: -0.05, deltaQ: 0.30, H_hf: 0,  fLM: 0.92, gamma: 0.24, izoh: "LHe temperature — eng aniq o'lchov" },
  { T: 20,   delta: -0.06, deltaQ: 0.30, H_hf: 0,  fLM: 0.90, gamma: 0.25, izoh: "Kriostat past T" },
  { T: 77,   delta: -0.09, deltaQ: 0.29, H_hf: 0,  fLM: 0.72, gamma: 0.28, izoh: "LN₂ standart o'lchov T" },
  { T: 200,  delta: -0.10, deltaQ: 0.28, H_hf: 0,  fLM: 0.51, gamma: 0.30, izoh: "Oraliq T" },
  { T: 295,  delta: -0.12, deltaQ: 0.28, H_hf: 0,  fLM: 0.40, gamma: 0.31, izoh: "Xona harorati (RT)" },
  { T: 400,  delta: -0.15, deltaQ: 0.26, H_hf: 0,  fLM: 0.22, gamma: 0.36, izoh: "Yuqori T — ikkinchi darajali Doppler" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TO'LIQ SPEKTR NUQTALARI (Lorentzian dublet)
// ═══════════════════════════════════════════════════════════════════════════════
const mossbauerSpectrum = (function() {
  const points = []
  const delta = -0.12, deltaQ = 0.28, gamma = 0.28
  const vMin = -4, vMax = 4, steps = 400
  const positions = [delta - deltaQ / 2, delta + deltaQ / 2]

  for (let i = 0; i <= steps; i++) {
    const v = vMin + (i / steps) * (vMax - vMin)
    let abs = 0
    positions.forEach(x0 => {
      const hw = gamma / 2
      abs += 1 / (1 + Math.pow((v - x0) / hw, 2))
    })
    abs /= 2
    points.push({ v, transmittance: 100 - abs * 22 }) // % transmissiya
  }
  return points
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SIANOFERRATLAR QATORI — Werner-Prussian ko'k qatori
// ═══════════════════════════════════════════════════════════════════════════════
const cyanoferrateSeries = [
  { formula: "K₃[Fe(CN)₆]",     trad: "Qizil qon tuzi",  color: "ruby-qizil",  delta: "−0.12", deltaQ: "0.28", spektr: "Dublet",  spin: "S=1/2 LS", oxid: "+3", current: true },
  { formula: "K₄[Fe(CN)₆]·3H₂O", trad: "Sariq qon tuzi",  color: "limonli-sariq", delta: "−0.04", deltaQ: "0.00", spektr: "Singlet", spin: "S=0 LS",   oxid: "+2", current: false },
  { formula: "Fe₄[Fe(CN)₆]₃",   trad: "Prussian ko'k",   color: "to'q ko'k",   delta: "+0.36 / −0.02", deltaQ: "0.40 / 0.30", spektr: "Ikki komponent", spin: "aralash", oxid: "+2/+3", current: false },
  { formula: "Na₂[Fe(CN)₅NO]",  trad: "Natriy nitroprussid", color: "quyuq qizil", delta: "−0.17", deltaQ: "1.76", spektr: "Katta dublet", spin: "S=0",     oxid: "+2 (formal)", current: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// NAMUNA TAYYORLASH USULLARI
// ═══════════════════════════════════════════════════════════════════════════════
const techniques = [
  {
    name: "Poroshok tabletka (BN yoki plastik matrisa)",
    description: "Namuna kubik bor-nitrid (BN) yoki polimer bilan aralashtirilib, 10−40 mg⁵⁷Fe/cm² kalinlikda tabletka bosiladi.",
    advantages: ["Standart transmissiya rejimi", "Kvantitativ ko'p fazali tahlil", "Aniq spektroskopik parametrlar", "Aluminiy foil orasida saqlanadi"],
    disadvantages: ["Optimal Fe kontsentratsiya kerak (t = μd ≈ 3−5)", "Tabletka tayyorlashda anizotropiya", "Havoga sezgir namunalar uchun glove-box", "Namuna 20−100 mg kerak"],
    bestFor: "Standart RT/LN₂/LHe o'lchov, kvantitativ tahlil, ⁵⁷Fe boyitilmagan tabiiy Fe",
    freqRange: "±10 mm/s (kimyoviy), ±100 mm/s (magnit)", resolution: "0.15−0.30 mm/s", samplePrep: "15−30 daq"
  },
  {
    name: "CEMS (Konversiya elektronlari)",
    description: "Sirt-sensitiv rejim — rezonans yutildan keyingi ichki konversiya elektronlarini gaz (He−CH₄) detektor bilan qayd etadi (0−300 nm chuqurlik).",
    advantages: ["Faqat sirt qatlami (0−300 nm)", "Plyonka, korroziya, katalizator uchun", "Havoga sezgir sirt tahlili", "Vaqt bo'yicha o'zgarishlarni kuzatish"],
    disadvantages: ["Faqat sirt — bulk ma'lumot yo'q", "Maxsus gaz detektor kerak", "Sekin o'lchov (12−48 soat)", "Namuna tekis va o'tkazuvchi bo'lishi"],
    bestFor: "Yupqa plyonkalar, katalizator zarrachalari, korroziya qatlamlari",
    freqRange: "±10 mm/s", resolution: "0.25 mm/s", samplePrep: "5−10 daq"
  },
  {
    name: "Sinxrotron Mössbauer (SMS/NFS)",
    description: "Puls sinxrotron nurlanishidan (SPring-8, ESRF, APS, PETRA-III) foydalanadi. Vaqt bo'yicha ajratilgan Nuclear Forward Scattering (NFS).",
    advantages: ["Yuqori bosim (100+ GPa, olmos hujra)", "Mikro-namuna (10−100 µg)", "Vaqt-boy o'lchov (ns)", "Yuqori intensivlik (10¹⁰× rad manba)"],
    disadvantages: ["Beamtime kerak (raqobat)", "Katta jihoz — laboratoriyada emas", "Ma'lumotni tahlil murakkab (fourier)", "Sekin loyihalar (kuzatuv 1−2 yil)"],
    bestFor: "Ekstremal shartlar, mikro-namuna, dinamik jarayonlar",
    freqRange: "Time-domain (ns)", resolution: "0.05−0.10 mm/s ekvivalent", samplePrep: "1−3 kun"
  },
  {
    name: "Emissiya (source) rejimi",
    description: "K₃[⁵⁷Co(CN)₆] sifatida ⁵⁷Co ni namuna panjarasiga qo'shiladi. Absorbent — standart K₄[⁵⁶Fe(CN)₆].",
    advantages: ["Diffuziya va defektlarni o'rganish", "In-situ kimyoviy o'zgarishlarni kuzatish", "Kobalt lokal muhiti to'g'ridan-to'g'ri", "Yadro kimyosi (parchalanish keyin)"],
    disadvantages: ["⁵⁷Co manba tayyorlash qiyin (siklotron)", "Radioaktiv namuna licence", "Har namuna uchun ⁵⁷Co dopantlash kerak", "Manba yarim yemirilishi t½ = 271 kun"],
    bestFor: "Yadro-kimyoviy tadqiqot, kataliz mexanizmi, diffuziya",
    freqRange: "±10 mm/s", resolution: "0.30 mm/s", samplePrep: "1−2 hafta"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  { source: "Namuna qalinligi noto'g'ri (t > 5)", freqRange: "Butun spektr", effect: "Chiziqlar kengayadi, chuqurligi to'yinadi (saturation), aniq δ va ΔE_Q buziladi", severity: "Yuqori", solution: "Optimal t = μd ≈ 3−5 tanlash. ⁵⁷Fe boyitilmagan uchun 20−40 mg tabiiy Fe/cm². Bir necha kalinlik bilan tekshirish (0.5t, t, 1.5t)." },
  { source: "Ikkinchi darajali Doppler siljish (SOD)", freqRange: "δ ga qo'shimcha (T-bog'liq)", effect: "Harorat oshsa δ pastroq ko'rinadi (~7·10⁻⁴ mm/s/K). Turli T dagi o'lchovlarni solishtirishda xatolik", severity: "O'rta", solution: "Aniq harorat nazorati (±1 K). Barcha spektrlarni bir xil T da olish. SOD tuzatishni qo'llash: δ_true = δ_obs + <v²>/2c." },
  { source: "Havoda Fe(III) → Fe(II) qaytarilishi", freqRange: "Yangi dublet paydo bo'ladi", effect: "K₃[Fe(CN)₆] fotoreduksiyaga uchraydi: qismli qora, Fe(II) LS paydo bo'lib singlet chiqadi", severity: "Yuqori", solution: "Qorong'ida saqlash, Ar/N₂ atmosferada tabletka tayyorlash. Freshli qayta kristallizatsiya. Havoda 24 soat oldindan o'lchash." },
  { source: "Kalibrlash xatosi (v shkalasi)", freqRange: "δ va ΔE_Q ga sistem xato", effect: "α-Fe folga kalibrlash to'g'ri bo'lmasa, δ absolyut qiymati 0.05−0.10 mm/s ga siljiydi", severity: "Yuqori", solution: "25 µm α-Fe folga bilan har o'lchovda kalibrlash. Sekstet chiziqlarining orasida 33.0 T ekanligini tasdiqlash. Har bir manba uchun alohida kalibrlash." },
  { source: "Vibrator geometriyasi (cosine effekt)", freqRange: "Sistem xato", effect: "Manba–absorbent–detektor to'g'ri chiziq emas → v effektiv qiymati pasayadi (~0.1%)", severity: "Past", solution: "Kollimator o'rnatish, manba va detektor markazi bir chiziqda. Buni α-Fe kalibrlash orqali korreksiya qilish." },
  { source: "Kompleks parchalanishi (yuqori T)", freqRange: "Ko'p yangi chiziqlar", effect: "T > 200 °C da K₃[Fe(CN)₆] parchalanadi → Fe₂O₃, Fe₃O₄, karbid + KCN. Qattiq halojnyoq siljigan spektr", severity: "Yuqori", solution: "T < 100 °C da o'lchash. Termik tahlil (DSC/TGA) oldindan qilish. Har o'lchovdan keyin XRD bilan fazovi tasdiqlash." },
  { source: "Manba yoshi (⁵⁷Co yemirilishi)", freqRange: "Signal intensivligi", effect: "⁵⁷Co t½ = 271 kun. 1 yildan keyin faollik 2× kamayadi → o'lchov vaqti 4× oshadi", severity: "O'rta", solution: "Manbani 2 yilda bir marta yangilash (10−100 mCi). Yosh manbani hisobga olib namuna qalinligini o'zgartirish. MCA sanoq statistikasini nazorat qilish." },
  { source: "⁵⁷Fe past mo'lligi (tabiiy 2.12%)", freqRange: "Signal intensivligi", effect: "Tabiiy Fe da faqat 2.12% ⁵⁷Fe — o'lchov vaqti 47× uzun bo'ladi (boyitilganga qaraganda)", severity: "O'rta", solution: "Nozik namunalar uchun ⁵⁷Fe (90−95%) boyitilgan reagent ishlatish. K₃[⁵⁷Fe(CN)₆] tayyorlash: ⁵⁷FeCl₃ + KCN sinteziga qaytish." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY-KIMYOVIY KONTEKST
// ═══════════════════════════════════════════════════════════════════════════════
const historyEvents = [
  { year: "1822", event: "Kashfiyot", desc: "Leopold Gmelin qizil kristall ko'rinishida ta'riflagan (K₄[Fe(CN)₆] + Cl₂ → K₃[Fe(CN)₆] reaksiyasidan)." },
  { year: "1893", event: "Werner nazariyasi", desc: "Alfred Werner koordinatsion nazariyani K₃[Fe(CN)₆] va K₄[Fe(CN)₆] taqqosi orqali kengaytirdi — ichki/tashqi sfera tushunchasi." },
  { year: "1929", event: "Bethe kristall maydon", desc: "H. Bethe kristall maydon nazariyasini yaratdi, CN⁻ ni kuchli maydon ligand deb ta'rifladi — Δo ≈ 34 000 cm⁻¹." },
  { year: "1958", event: "Mössbauer effekti", desc: "R. Mössbauer ¹⁹¹Ir uchun rezonansni kashf etdi (Z. Physik 151, 124). ⁵⁷Fe 1959 da kimyoga ochildi." },
  { year: "1961", event: "Nobel mukofoti", desc: "R. Mössbauer 32 yoshida Fizika bo'yicha Nobel oldi. Robert Hofstadter bilan birga." },
  { year: "1962", event: "K₃[Fe(CN)₆] birinchi spektri", desc: "L.M. Epstein K₃[Fe(CN)₆] ning birinchi to'liq Mössbauer spektrini nashr etdi — δ = −0.12, ΔE_Q = 0.28 mm/s." },
  { year: "1970-yillar", event: "Prussian ko'k tahlili", desc: "K₃[Fe(CN)₆] va K₄[Fe(CN)₆] ning aralashmasi Prussian ko'kning ikki komponentli Mössbauer spektrini tushunishga imkon berdi." },
  { year: "1980-yillar", event: "Molekulyar elektronika", desc: "K₃[Fe(CN)₆] elektrokimyoviy standart sifatida (E° = +0.36 V), IT sanoati va batareyalarda foydalanish." },
  { year: "2010-yillar", event: "Katalitik siklda o'rganish", desc: "Suvni ajratish katalizatorlari uchun Fe(III/II) siklini K₃[Fe(CN)₆] operando Mössbauer bilan tekshirish." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// MÖSSBAUER-SPESIFIK: TANLASH QOIDALARI (⁵⁷Fe)
// ═══════════════════════════════════════════════════════════════════════════════
const selectionRules = [
  { rule: "ΔI = ±1", desc: "Yadro spin o'zgarishi: I=1/2 (asosiy) → I=3/2 (qo'zg'algan)" },
  { rule: "Δm_I = 0, ±1", desc: "Yadro magnit kvant sonining o'zgarishi (M1 magnit dipol o'tish)" },
  { rule: "L = 1 (M1)", desc: "Fotonning orbital burchak momenti — magnit dipol xarakter" },
  { rule: "Π_e·Π_g = +1", desc: "Yadro juftlik (parity) saqlanadi (M1 uchun)" },
  { rule: "E_γ = 14.4125 keV", desc: "⁵⁷Fe qat'iy rezonans energiyasi (aniqlik 10⁻¹³)" },
  { rule: "Δv ≤ ±10 mm/s", desc: "Doppler tezligi kimyoviy shift diapazoni uchun" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TAJRIBA PARAMETRLARI TAVSIYALAR
// ═══════════════════════════════════════════════════════════════════════════════
const experimentalParams = [
  { param: "⁵⁷Co manba", value: "10−100 mCi", note: "Rh yoki Pd matrisa; t½ = 271 kun" },
  { param: "Optimal Fe qalinligi", value: "5−15 mg⁵⁷Fe/cm² (yoki 30 mg tabiiy)", note: "t = μd ≈ 3−5 uchun" },
  { param: "Vibrator turi", value: "Elektromagnit (kelib chiqishi Kankeleit)", note: "Sinusoidal yoki uchburchak" },
  { param: "Detektor", value: "Kr−CH₄ gaz proporsional (14.4 keV filtrlash)", note: "Yoki NaI(Tl) sintillator" },
  { param: "MCA kanallar", value: "512 yoki 1024", note: "Har kanal ≈ 0.04 mm/s (±10 mm/s uchun)" },
  { param: "Sanoq statistikasi", value: "≥ 10⁶ sanoq/kanal", note: "Fon ustida 3−10% chuqurlik uchun" },
  { param: "O'lchov vaqti", value: "4−72 soat", note: "T ga qarab; past T da uzoq" },
  { param: "Namuna T", value: "4.2 K / 77 K / 295 K", note: "Kriostatlar: LHe / LN₂ / RT" },
  { param: "Kalibrlash", value: "25 µm α-Fe folga (RT)", note: "Sekstet 33.0 T, chiziqlar orasi = 10.657 mm/s" },
  { param: "Ma'lumot tahlil", value: "WinNormos, Mosswinn, Recoil, MossA", note: "Voigt yoki Lorentzian profil, χ² < 1.2 — a'lo fit" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONENT: MINI-SPEKTR CHIZUVCHI
// ═══════════════════════════════════════════════════════════════════════════════
function InteraktivSpektr({ delta = -0.12, deltaQ = 0.28, gamma = 0.28 }) {
  const spektr = useMemo(() => {
    const arr = []
    const vMin = -4, vMax = 4, steps = 400
    const positions = [delta - deltaQ / 2, delta + deltaQ / 2]

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      let abs = 0
      positions.forEach(x0 => {
        const hw = gamma / 2
        abs += 1 / (1 + Math.pow((v - x0) / hw, 2))
      })
      abs /= 2
      arr.push({ v, T: 100 - abs * 22 })
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
      {[100, 95, 90, 85, 80].map(t => (
        <g key={t}>
          <line x1="60" y1={40 + ((100 - t) / 22) * 240} x2="680" y2={40 + ((100 - t) / 22) * 240}
            stroke="#4c1d95" strokeWidth="0.4" strokeDasharray="2,3"/>
          <text x="50" y={44 + ((100 - t) / 22) * 240} fill="#a78bfa" fontSize="11" textAnchor="end">{t}</text>
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
        fill="none" stroke="#ef4444" strokeWidth="2.2"
      />

      {/* Cho'qqi belgilari */}
      <line x1={vToX(delta - deltaQ/2)} y1={tToY(100 - 22)} x2={vToX(delta - deltaQ/2)} y2="40"
        stroke="#f87171" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.6"/>
      <text x={vToX(delta - deltaQ/2)} y="35" fill="#f87171" fontSize="10" textAnchor="middle" fontWeight="bold">
        {(delta - deltaQ/2).toFixed(2)}
      </text>
      <line x1={vToX(delta + deltaQ/2)} y1={tToY(100 - 22)} x2={vToX(delta + deltaQ/2)} y2="40"
        stroke="#f87171" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.6"/>
      <text x={vToX(delta + deltaQ/2)} y="35" fill="#f87171" fontSize="10" textAnchor="middle" fontWeight="bold">
        {(delta + deltaQ/2).toFixed(2)}
      </text>

      {/* Delta va deltaQ belgilari */}
      <line x1={vToX(delta - deltaQ/2)} y1="20" x2={vToX(delta + deltaQ/2)} y2="20"
        stroke="#fde047" strokeWidth="1.2" markerEnd="url(#arr)" markerStart="url(#arr2)"/>
      <text x={vToX(delta)} y="16" fill="#fde047" fontSize="10" textAnchor="middle" fontWeight="bold">
        ΔE_Q = {deltaQ} mm/s
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
export default function K3FeCN6Sahifasi() {
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
    cyanoferrate: true,
    experimental: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  })

  // Simulyator uchun state
  const [simDelta, setSimDelta] = useState(-0.12)
  const [simDeltaQ, setSimDeltaQ] = useState(0.28)
  const [simGamma, setSimGamma] = useState(0.28)

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
        red: rgb(0.86, 0.15, 0.15),
        redDeep: rgb(0.65, 0.10, 0.10),
        yellow: rgb(0.85, 0.65, 0.05),
        yellowDeep: rgb(0.65, 0.48, 0.02),
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
          `JDA-Kimyo Mössbauer Tahlili  •  K₃[Fe(CN)₆] (Qizil qon tuzi)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.teal })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.tealDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }

      const drawTableRow = (label, value, bgColor = C.bgTeal, labelColor = C.tealDeep) => {
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

      // ═══════════════════════════════════════════════════════════
      // SARLAVHA POLOSASI
      // ═══════════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  Mössbauer Spektroskopiyasi  •  Vol. 3, Son 1", {
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
      safeText("DOI: 10.0000/jda-kimyo.mossbauer.2026.001", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      drawCenteredText(`K₃[Fe(CN)₆] — ⁵⁷Fe Mössbauer Spektroskopik Tahlili`, y, 19, boldFont, C.textDark)
      y -= 28
      drawCenteredText("Kaliy geksatsianoferrat(III)  •  «Qizil qon tuzi»", y, 12, italicFont, C.purpleSoft)
      y -= 20
      drawCenteredText(
        `Simmetriya: Oh  •  Fe³⁺, d⁵ LS (t₂g⁵)  •  S=1/2, paramagnit  •  M = 329.24 g/mol`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ═══════════════════════════════════════════════════════════
      // ABSTRACT
      // ═══════════════════════════════════════════════════════════
      const abstract =
        `Kaliy geksatsianoferrat(III) K₃[Fe(CN)₆] Werner koordinatsion nazariyasining klassik Fe(III) namunasidir. ` +
        `⁵⁷Fe Mössbauer spektroskopiyasi (E_γ = 14.4125 keV, ±10 mm/s Doppler diapazoni) orqali quyidagi ` +
        `giperkichik parametrlar aniqlangan: izomer siljish δ = −0.12 mm/s (α-Fe ga nisbatan, RT), kvadrupol ` +
        `bo'linishi ΔE_Q = 0.28 mm/s, chiziq kengligi Γ = 0.28 mm/s (T = 77 K). Manfiy δ CN⁻ ligandining ` +
        `kuchli π-akseptor xarakteri va Fe→CN back-donation orqali |ψ(0)|² zichligining ortishini isbotlaydi. ` +
        `Kichik ΔE_Q qiymati t₂g⁵ konfiguratsiyasining deyarli sferik simmetriyasidan kelib chiqadi (bir yakka ` +
        `to'ldirilmagan orbital). Spektrda magnit sekstet YO'Q (H_hf = 0) — tez elektron spin relaksatsiyasi ` +
        `natijasida. Haroratga bog'liq o'lchovlar (4.2, 77, 295 K) ikkinchi darajali Doppler siljish (SOD, ` +
        `~7·10⁻⁴ mm/s/K) va Lamb–Mössbauer omili f (θ_D ≈ 300 K) trendlarini tasdiqlaydi.`

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
          ["Formula", "K₃[Fe(CN)₆]"],
          ["IUPAC nomi", "Kaliy geksatsianoferrat(III)"],
          ["An'anaviy nomi", "Qizil qon tuzi (Ferricyanide)"],
          ["CAS raqami", "13746-66-2"],
          ["Molar massa", "329.24 g/mol"],
          ["Rangi", "Yorqin ruby-qizil kristall"],
          ["Kristall tizim", "Monoklinik (P2₁/c fazoviy guruh)"],
          ["Kompleks anion simmetriyasi", "Oh (deyarli mukammal)"],
          ["Koordinatsion son", "6 (oktaedrik)"],
          ["Metall ioni", "Fe³⁺ (d⁵ LS, t₂g⁵)"],
          ["Ligand tipi", "CN⁻ (kuchli maydon, σ+π akseptor)"],
          ["Fe–C bog' uzunligi", "1.926 Å (XRD ma'lumot)"],
          ["C≡N bog' uzunligi", "1.155 Å"],
          ["Δo (10Dq)", "33 800 cm⁻¹ (~404 kJ/mol)"],
          ["Erish nuqtasi", "Parchalanadi ~300°C"],
          ["Suvda eruvchanligi", "464 g/L (20°C) — yaxshi eriydi"],
          ["Standart potensial E°", "+0.36 V (Fe³⁺/Fe²⁺, CN⁻ da)"],
        ]
        idData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgTeal : C.white, C.tealDeep)
        })
        y -= 15
      }

      // 2. NAZARIY ASOS
      if (pdfSections.theory) {
        drawSectionHeader(sectionNum++, "Mössbauer Spektroskopiyasining Nazariy Asosi")
        drawWrappedText(
          "Mössbauer spektroskopiyasi qattiq jismdagi atom yadrolarining qaytishsiz (recoil-free) gamma-kvant rezonans yutish hodisasiga asoslangan. Kashfiyot 1958 yilda R. Mössbauer tomonidan amalga oshirildi (Nobel mukofoti, 1961). Kimyo va koordinatsion birikmalarda asosan ⁵⁷Fe izotopi ishlatiladi (tabiiy mo'lligi 2.119%).",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Mössbauer spektroskopiyasi qattiq jismdagi atom yadrolarining qaytishsiz (recoil-free) gamma-kvant rezonans yutish hodisasiga asoslangan. Kashfiyot 1958 yilda R. Mössbauer tomonidan amalga oshirildi (Nobel mukofoti, 1961). Kimyo va koordinatsion birikmalarda asosan ⁵⁷Fe izotopi ishlatiladi (tabiiy mo'lligi 2.119%).", regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "1) Recoil-free rezonans: Erkin atom γ-kvantni chiqarganda (yoki yutganda) impuls saqlanishi tufayli otdirish energiyasi E_R = E_γ²/(2Mc²) ≈ 1.96·10⁻³ eV bo'ladi — bu tabiiy chiziq kengligidan ~4·10⁵ marta katta. Qattiq kristallda atom panjaraga bog'langan, effektiv massa cheksiz va otdirish nolga yaqin.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "2) Doppler tezligi orqali rezonans: Manba (⁵⁷Co/Rh matrisada) vibrator bilan yurgiziladi (±10 mm/s). Gamma-fotonning energiyasi E' = E_γ(1 + v/c) formulasi bo'yicha o'zgaradi. K₃[Fe(CN)₆] namunasi aynan δ = −0.12 mm/s tezlikda rezonans yutadi.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "3) Uch giperkichik parametr: (a) Izomer siljish δ [mm/s] — yadro atrofidagi s-elektron zichligi, oksidlanish darajasi va spin holati. (b) Kvadrupol bo'linishi ΔE_Q [mm/s] — yadro kvadrupol momenti va EFG o'zaro ta'siri, koordinatsion simmetriya. (c) Magnit maydon H_hf [Tesla] — Zeeman parchalanishi, magnit tartib turi.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "4) K₃[Fe(CN)₆] uchun natijalar: Kuchli maydon CN⁻ ligand → LS holat t₂g⁵ (bir yakka to'ldirilmagan orbital) → dublet spektr. Manfiy δ CN⁻ ning π-akseptor xarakteridan (Fe→CN back-bonding, |ψ(0)|² yuqori). ΔE_Q kichik — t₂g⁵ deyarli sferik.",
          C.bgYellow, C.yellow, C.textDark
        )
      }

      // 3. MÖSSBAUER PARAMETRLARI JADVALI
      if (pdfSections.parameters) {
        drawSectionHeader(sectionNum++, "Mössbauer Parametrlari — Batafsil Tahlil")
        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.tealDeep })
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
          const bg = idx % 2 === 0 ? C.bgTeal : C.white
          page.drawRectangle({ x: MARGIN, y: y - 42, width: CONTENT_W, height: 42, color: bg })

          safeText(`${p.param}`, { x: MARGIN + 6, y: y - 14, size: 12, font: boldFont, color: C.tealDeep, maxWidth: colW[0] - 4 })
          safeText(p.paramName, { x: MARGIN + 6, y: y - 30, size: 7.5, font: italicFont, color: C.textMuted, maxWidth: colW[0] - 4 })

          safeText(`${p.value} ${p.unit}`, { x: MARGIN + 6 + colW[0], y: y - 14, size: 10, font: boldFont, color: C.redDeep, maxWidth: colW[1] - 4 })
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
          "Umumiy xulosa: Uch giperkichik parametr birgalikda K₃[Fe(CN)₆] ning to'liq elektron holatini beradi — Fe(III) oksidlanish darajasi, past spin konfiguratsiya, deyarli mukammal Oh simmetriya va paramagnit lekin tez relaksatsiyali xarakter. Mössbauer bu ma'lumotlarni BIR spektrdan olishga imkon beradi.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 4. SPEKTR SIMULATSIYA (matn qismi)
      if (pdfSections.spectrum) {
        drawSectionHeader(sectionNum++, "Mössbauer Spektri — Talqin")
        drawWrappedText(
          "K₃[Fe(CN)₆] ning Mössbauer spektri klassik ASSIMETRIK DUBLET shakliga ega. Ikki chiziq ⁵⁷Fe qo'zg'algan holatining (I=3/2) ±1/2 va ±3/2 subholatlar orasidagi kvadrupol parchalanishidan hosil bo'ladi. Chiziqlar joylashuvi: v₁ = δ − ΔE_Q/2 = −0.26 mm/s va v₂ = δ + ΔE_Q/2 = +0.02 mm/s (α-Fe ga nisbatan).",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("K₃[Fe(CN)₆] ning Mössbauer spektri klassik ASSIMETRIK DUBLET shakliga ega. Ikki chiziq ⁵⁷Fe qo'zg'algan holatining (I=3/2) ±1/2 va ±3/2 subholatlar orasidagi kvadrupol parchalanishidan hosil bo'ladi. Chiziqlar joylashuvi: v₁ = δ − ΔE_Q/2 = −0.26 mm/s va v₂ = δ + ΔE_Q/2 = +0.02 mm/s (α-Fe ga nisbatan).", regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "Chiziq intensivligi: Ideal poroshok namunada 1:1 nisbat kutiladi (I(±1/2)/I(±3/2) = 1). Amaliyotda 1.05:1 gacha assimetriya kuzatiladi — kristall teksturasi yoki Goldanskii–Karyagin effekti (anizotropik f_LM).",
          C.bgYellow, C.yellow, C.textDark
        )
        drawInfoBox(
          "Chiziq shakli: Lorentzian profil, Γ = 0.28 mm/s. Bu tabiiy chiziq kengligining (Γ_nat = 0.097 mm/s) 2.9 barobari — manba, detektor va namuna hissasi. Voigt profil (Gaussian + Lorentzian konvolyutsiya) yanada yaxshi fit beradi.",
          C.bgTeal, C.teal, C.textDark
        )
      }

      // 5. HARORAT
      if (pdfSections.temperature) {
        drawSectionHeader(sectionNum++, "Haroratga Bog'liq O'lchovlar")
        drawWrappedText(
          "Mössbauer parametrlar haroratga bog'liq. Ikki asosiy effekt: (1) Ikkinchi darajali Doppler siljish (SOD) — termik tebranish tufayli δ oshadi/kamayadi ~7·10⁻⁴ mm/s/K. (2) Lamb–Mössbauer omili f_LM — harorat oshgach kamayadi. Quyidagi jadval to'liq harorat trendini ko'rsatadi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Mössbauer parametrlar haroratga bog'liq. Ikki asosiy effekt: (1) Ikkinchi darajali Doppler siljish (SOD) — termik tebranish tufayli δ oshadi/kamayadi ~7·10⁻⁴ mm/s/K. (2) Lamb–Mössbauer omili f_LM — harorat oshgach kamayadi. Quyidagi jadval to'liq harorat trendini ko'rsatadi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.tealDeep })
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
          const bg = idx % 2 === 0 ? C.bgTeal : C.white
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx3 = MARGIN + 6
          const cells = [String(td.T), String(td.delta), String(td.deltaQ), String(td.fLM), String(td.gamma), td.izoh]
          cells.forEach((cell, i) => {
            const font = i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.tealDeep : C.textDark
            safeText(cell, { x: cx3, y: y - 12, size: 8.5, font, color, maxWidth: twcol[i] - 4 })
            cx3 += twcol[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Xulosa: Δδ/ΔT = −(-0.15 − -0.05)/(400 − 4.2) ≈ −2.5·10⁻⁴ mm/s/K — SOD (2nd order Doppler) effekti nazariy qiymatga mos. ΔE_Q deyarli o'zgarmaydi (Fe(III) LS uchun t₂g⁵ Boltzmann bo'linishi kichik) — bu Fe(III) LS holatining haroratga barqarorligini isbotlaydi. f_LM 4.2 K da 0.92 dan 400 K da 0.22 gacha kamayadi.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 6. TANLASH QOIDALARI
      if (pdfSections.selectionRules) {
        drawSectionHeader(sectionNum++, "Tanlash Qoidalari — ⁵⁷Fe Yadro O'tishlari")
        drawWrappedText(
          "⁵⁷Fe uchun asosiy Mössbauer o'tishi 14.4125 keV — bu I=1/2 (asosiy holat) va I=3/2 (qo'zg'algan holat, τ=141 ns) orasidagi magnit dipol (M1) o'tishdir. Tanlash qoidalari:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("⁵⁷Fe uchun asosiy Mössbauer o'tishi 14.4125 keV — bu I=1/2 (asosiy holat) va I=3/2 (qo'zg'algan holat, τ=141 ns) orasidagi magnit dipol (M1) o'tishdir. Tanlash qoidalari:", regularFont, 9.5, CONTENT_W).length * 13 + 10

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
          "Kvadrupol dublet uchun 4 ta o'tish yo'li: (±3/2 → ±1/2), (±3/2 → ∓1/2), (±1/2 → ±1/2), (±1/2 → ∓1/2). Ulardan 2 tasi bir xil energiyada (±3/2 → ±1/2) va 2 tasi (±1/2 → ±1/2) — natijada 2 chiziqli dublet ko'rinadi. Poroshok namuna uchun intensivlik nisbati 1:1.",
          C.bgBlue, C.blue, C.textDark
        )
      }

      // 7. SIANOFERRATLAR QATORI
      if (pdfSections.cyanoferrate) {
        drawSectionHeader(sectionNum++, "Sianoferratlar Qatori — Werner-Prussian")
        drawWrappedText(
          "K₃[Fe(CN)₆] va K₄[Fe(CN)₆] Werner koordinatsion nazariyasining asosiy taqqoslash juftligidir. Ular Prussian ko'k pigmentining prekursorlaridir va Mössbauer spektroskopiyasi bilan Fe(III)/Fe(II) sistema o'rganish uchun eng klassik ma'lumotnoma:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("K₃[Fe(CN)₆] va K₄[Fe(CN)₆] Werner koordinatsion nazariyasining asosiy taqqoslash juftligidir. Ular Prussian ko'k pigmentining prekursorlaridir va Mössbauer spektroskopiyasi bilan Fe(III)/Fe(II) sistema o'rganish uchun eng klassik ma'lumotnoma:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const wHeaders = ["Kompleks", "An'anaviy nom", "δ", "ΔE_Q", "Spektr"]
        const wColW = [140, 120, 60, 65, 110]
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
          "Diagnostik farq: K₃[Fe(CN)₆] (Fe³⁺ LS, δ=−0.12, ΔE_Q=0.28) — DUBLET. K₄[Fe(CN)₆] (Fe²⁺ LS, δ=−0.04, ΔE_Q=0.00) — SINGLET (t₂g⁶ sferik). Prussian ko'k Fe₄[Fe(CN)₆]₃ da ikkalasi ham bor — Fe(II) LS ichki (C bilan) va Fe(III) HS tashqi (N bilan). Bu holatlar Mössbauer bilan aniq ajratiladi.",
          C.bgYellow, C.yellow, C.textDark
        )
      }

      // 8. TAJRIBA PARAMETRLARI
      if (pdfSections.experimental) {
        drawSectionHeader(sectionNum++, "Tavsiya Etilgan Tajriba Parametrlari")
        experimentalParams.forEach((e, i) => {
          drawTableRow(e.param, `${e.value}  —  ${e.note}`, i % 2 === 0 ? C.bgTeal : C.white, C.tealDeep)
        })
        y -= 10
      }

      // 9. TEXNIKALAR
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

      // 10. HALAQITLAR
      if (pdfSections.interferences) {
        drawSectionHeader(sectionNum++, "Mössbauer Tahliliga Halaqit Beruvchi Omillar")
        drawWrappedText(
          "Aniq Mössbauer spektri olish uchun bir necha texnik va namunaviy halaqitlarni bartaraf etish zarur. Quyidagi jadval eng ko'p uchraydigan muammolarni va ularning yechimlarini keltiradi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Aniq Mössbauer spektri olish uchun bir necha texnik va namunaviy halaqitlarni bartaraf etish zarur. Quyidagi jadval eng ko'p uchraydigan muammolarni va ularning yechimlarini keltiradi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

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

      // 11. XULOSALAR
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar")
        const conclusions = [
          "K₃[Fe(CN)₆] ⁵⁷Fe Mössbauer spektri KLASSIK ASSIMETRIK DUBLET shakliga ega — bu Fe(III) LS holatining d⁵ (t₂g⁵) konfiguratsiyasidan kelib chiqadi.",
          "Izomer siljish δ = −0.12 mm/s (RT) — MANFIY qiymati CN⁻ ligandning kuchli π-akseptor xarakterini va Fe→CN back-bonding orqali |ψ(0)|² ning ortishini bevosita isbotlaydi.",
          "Kvadrupol bo'linishi ΔE_Q = 0.28 mm/s — kichik qiymat t₂g⁵ konfiguratsiyaning deyarli sferik simmetriyasini ko'rsatadi (bitta yakka to'ldirilmagan orbital).",
          "H_hf = 0 T (T > 5 K) — paramagnit Fe³⁺ LS elektron spin relaksatsiyasining tez ekanligini isbotlaydi (τ_e < 10⁻⁸ s), sekstet ko'rinmaydi.",
          "Haroratga bog'liqlik: SOD effekt δ(T) ni −2.5·10⁻⁴ mm/s/K ga siljitadi. f_LM Debye modelini qanoatlantiradi (θ_D ≈ 300 K).",
          "K₄[Fe(CN)₆] (SINGLET) bilan taqqoslash Fe(II) LS va Fe(III) LS ni aniq ajratadi — Werner koordinatsion nazariyasining Mössbauer tasdig'i.",
          "Alternativ tasdiqlash: EPR (g₁=2.35, g₂=2.10, g₃=0.91), UV-Vis (LMCT 420 nm), IR (νCN=2135 cm⁻¹). Barcha usullar bir xil natijaga keltiradi.",
          "K₃[Fe(CN)₆] Mössbauer amaliyotida Fe(III) LS uchun REFERENS BIRIKMA sifatida qabul qilingan — barcha Fe(III) LS komplekslar bu tayanchda solishtiriladi.",
        ]
        conclusions.forEach((c, i) => {
          checkPageBreak(30)
          const boxH = wrapText(cleanText(c), regularFont, 9.5, CONTENT_W - 30).length * 12 + 12
          page.drawRectangle({
            x: MARGIN, y: y - boxH, width: CONTENT_W,
            height: boxH, color: i % 2 === 0 ? C.bgTeal : C.white,
          })
          page.drawCircle({
            x: MARGIN + 12, y: y - 12, size: 8,
            color: C.tealDeep,
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
      link.download = `K3-FeCN6-Mossbauer-Tahlili-${new Date().toISOString().split("T")[0]}.pdf`
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
          <h1 className="text-xl md:text-2xl font-bold text-teal-400 flex items-center gap-2">
            ⚛️ K₃[Fe(CN)₆] — Mössbauer tahlili
          </h1>
          <p className="text-purple-400 text-xs">Qizil qon tuzi · Fe³⁺ LS · d⁵ t₂g⁵ · Referens birikma</p>
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
                { key: "identification", label: "1. Birikma identifikatsiyasi", desc: "Formula, IUPAC, CAS, XRD ma'lumotlar" },
                { key: "theory", label: "2. Nazariy asos", desc: "Recoil-free rezonans, Doppler, 3 hyperfine parametr" },
                { key: "parameters", label: "3. Mössbauer parametrlari", desc: "δ, ΔE_Q, H_hf, Γ, f_LM batafsil" },
                { key: "spectrum", label: "4. Spektr talqini", desc: "Dublet talqini, chiziq intensivligi va shakli" },
                { key: "temperature", label: "5. Haroratga bog'liqlik", desc: "6 ta harorat qiymati (4.2-400 K)" },
                { key: "selectionRules", label: "6. Tanlash qoidalari", desc: "⁵⁷Fe M1 o'tishlari uchun 6 ta qoida" },
                { key: "cyanoferrate", label: "7. Sianoferratlar qatori", desc: "4 ta klassik kompleks taqqoslash" },
                { key: "experimental", label: "8. Tajriba parametrlari", desc: "10 ta amaliy tavsiyalar" },
                { key: "techniques", label: "9. O'lchov rejimlari", desc: "4 ta rejim — afzallik/kamchilik" },
                { key: "interferences", label: "10. Halaqit beruvchi omillar", desc: "8 ta omil va yechimlari" },
                { key: "conclusions", label: "11. Asosiy xulosalar", desc: "8 ta ilmiy xulosa" },
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
                <code className="bg-purple-950 px-1 rounded">/public/fonts/</code> papkasida DejaVuSans.ttf, DejaVuSans-Bold.ttf va DejaVuSans-Oblique.ttf fayllari bo&apos;lishi kerak. Kutilgan hajm: ~5−7 sahifa A4.
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
        <div className="bg-gradient-to-br from-red-900/30 via-purple-900/30 to-blue-900/30 border border-red-500/40 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">⚛️</span>
                <div>
                  <div className="text-red-400 text-3xl md:text-4xl font-bold" dangerouslySetInnerHTML={{__html: COMPOUND.formulaHTML}}/>
                  <p className="text-purple-300 text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-purple-400 text-xs italic">« {COMPOUND.commonName} »</p>
                </div>
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                <strong className="text-red-300">K₃[Fe(CN)₆]</strong> — Fe(III) past spin holatining
                <strong className="text-yellow-300"> klassik referens birikmasi</strong> Mössbauer amaliyotida.
                CN⁻ kuchli maydon ligand tufayli Δo ≈ 33 800 cm⁻¹ &gt; P — LS holat barqaror.
                t₂g⁵ konfiguratsiya deyarli sferik simmetrik, natijada spektr kichik ΔE_Q li
                assimetrik dublet ko&apos;rinishida chiqadi. δ manfiy — CN⁻ ning π-akseptor xarakteridan.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-xl border-2 border-red-500/30 shadow-inner flex items-center justify-center text-xs text-white/60 font-mono"
                style={{background: "linear-gradient(135deg, #b71c1c, #d32f2f, #b71c1c)"}}>
                Yorqin ruby-qizil
              </div>
              <div className="bg-purple-950/60 rounded-lg p-2 text-[10px] space-y-0.5">
                <p><span className="text-purple-400">M:</span> <span className="text-white font-mono">{COMPOUND.molarMass} g/mol</span></p>
                <p><span className="text-purple-400">CAS:</span> <span className="text-white font-mono">{COMPOUND.casNumber}</span></p>
                <p><span className="text-purple-400">Fe–C:</span> <span className="text-white font-mono">{COMPOUND.bondLengthFeC}</span></p>
                <p><span className="text-purple-400">Space grp:</span> <span className="text-white font-mono">{COMPOUND.spaceGroup}</span></p>
              </div>
            </div>
          </div>

          {/* Asosiy parametrlar */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6">
            <div className="bg-red-600/20 border border-red-500/40 rounded-lg p-3 text-center">
              <p className="text-red-400 text-[10px] uppercase tracking-wider">δ (izomer siljish)</p>
              <p className="text-white font-mono text-lg font-bold">−0.12</p>
              <p className="text-purple-400 text-[9px]">mm/s (RT)</p>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-lg p-3 text-center">
              <p className="text-yellow-400 text-[10px] uppercase tracking-wider">ΔE_Q (kvadrupol)</p>
              <p className="text-white font-mono text-lg font-bold">0.28</p>
              <p className="text-purple-400 text-[9px]">mm/s</p>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/40 rounded-lg p-3 text-center">
              <p className="text-blue-400 text-[10px] uppercase tracking-wider">H_hf (magnit)</p>
              <p className="text-white font-mono text-lg font-bold">0</p>
              <p className="text-purple-400 text-[9px]">T (paramag)</p>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/40 rounded-lg p-3 text-center">
              <p className="text-purple-400 text-[10px] uppercase tracking-wider">Γ (kenglik)</p>
              <p className="text-white font-mono text-lg font-bold">0.28</p>
              <p className="text-purple-400 text-[9px]">mm/s (77 K)</p>
            </div>
            <div className="bg-teal-600/20 border border-teal-500/40 rounded-lg p-3 text-center">
              <p className="text-teal-400 text-[10px] uppercase tracking-wider">Spektr</p>
              <p className="text-white font-mono text-base font-bold">Dublet</p>
              <p className="text-purple-400 text-[9px]">assimetrik</p>
            </div>
          </div>
        </div>

        {/* ═══════════ 2. INTERAKTIV SPEKTR ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-xl font-bold text-white">Interaktiv Mössbauer spektr simulyatori</h2>
              <p className="text-purple-400 text-xs">δ, ΔE_Q, Γ parametrlarini o&apos;zgartirib spektr shakli o&apos;zgarishini kuzating</p>
            </div>
          </div>

          {/* Boshqaruv */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-red-400 font-bold">δ (izomer siljish):</span>
                <span className="text-white font-mono">{simDelta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="-0.5" max="0.5" step="0.01" value={simDelta}
                onChange={(e) => setSimDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-red-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>Kovalent (−0.5)</span>
                <span>Neytral (0)</span>
                <span>Ionli (+0.5)</span>
              </div>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔE_Q (kvadrupol):</span>
                <span className="text-white font-mono">{simDeltaQ.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0" max="3.5" step="0.02" value={simDeltaQ}
                onChange={(e) => setSimDeltaQ(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-yellow-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>Sferik (0)</span>
                <span>Buzilgan (1.5)</span>
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
                <span>Yaxshi (0.30)</span>
                <span>Kengaygan (0.8)</span>
              </div>
            </div>
          </div>

          {/* Preset tugmalari */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setSimDelta(-0.12); setSimDeltaQ(0.28); setSimGamma(0.28) }}
              className="px-3 py-1 bg-red-600/30 border border-red-500/40 text-red-300 rounded-full text-xs hover:bg-red-600/50 transition-colors">
              🎯 K₃[Fe(CN)₆] (RT)
            </button>
            <button onClick={() => { setSimDelta(-0.09); setSimDeltaQ(0.29); setSimGamma(0.28) }}
              className="px-3 py-1 bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-full text-xs hover:bg-blue-600/50 transition-colors">
              ❄ K₃[Fe(CN)₆] (77 K)
            </button>
            <button onClick={() => { setSimDelta(-0.04); setSimDeltaQ(0.0); setSimGamma(0.25) }}
              className="px-3 py-1 bg-yellow-600/30 border border-yellow-500/40 text-yellow-300 rounded-full text-xs hover:bg-yellow-600/50 transition-colors">
              🟡 K₄[Fe(CN)₆] (taqqoslash)
            </button>
            <button onClick={() => { setSimDelta(1.39); setSimDeltaQ(3.19); setSimGamma(0.30) }}
              className="px-3 py-1 bg-green-600/30 border border-green-500/40 text-green-300 rounded-full text-xs hover:bg-green-600/50 transition-colors">
              🌊 [Fe(H₂O)₆]²⁺ Fe(II) HS
            </button>
          </div>

          {/* Spektr */}
          <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/40">
            <InteraktivSpektr delta={simDelta} deltaQ={simDeltaQ} gamma={simGamma}/>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 text-sm text-purple-200">
            <p><strong className="text-red-300">📖 Kuzatishlar:</strong></p>
            <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
              <li><strong>ΔE_Q oshsa</strong> → chiziqlar bir-biridan uzoqlashadi (asimmetriya oshadi)</li>
              <li><strong>δ o&apos;zgartirsa</strong> → butun spektr chapga/o&apos;ngga siljydi</li>
              <li><strong>Γ oshsa</strong> → chiziqlar kengayadi va kesishadi — past kristallik yoki ko&apos;p sayt</li>
              <li>K₃[Fe(CN)₆] va K₄[Fe(CN)₆] farqi: δ (kichik) va ΔE_Q (dublet vs singlet)</li>
            </ul>
          </div>
        </div>

        {/* ═══════════ 3. MÖSSBAUER PARAMETRLARI JADVALI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎛️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Giperkichik parametrlar — batafsil ilmiy tahlil</h2>
              <p className="text-purple-400 text-xs">Har bir parametrni tanlab uning fizik ma&apos;nosini ko&apos;ring</p>
            </div>
          </div>

          {/* Parametr tanlagichi */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {mossbauerParams.map((p, i) => (
              <button key={i} onClick={() => setSelectedParam(i)}
                className={`px-3 py-3 rounded-xl text-left transition-all ${
                  selectedParam === i
                    ? "bg-teal-600/30 border-2 border-teal-400"
                    : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
                }`}>
                <div className={`font-bold text-lg ${selectedParam === i ? "text-teal-300" : "text-teal-400"}`}>{p.param}</div>
                <div className="text-purple-300 text-[10px] mt-0.5 leading-tight">{p.paramName}</div>
              </button>
            ))}
          </div>

          {/* Tanlangan parametr batafsil */}
          <div className="bg-purple-800/30 border border-teal-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-baseline gap-4 flex-wrap">
              <div>
                <span className="text-teal-400 text-4xl font-bold">{p.param}</span>
                <span className="text-purple-300 text-sm ml-2">= </span>
                <span className="text-red-400 text-2xl font-mono font-bold">{p.value}</span>
                <span className="text-purple-400 text-sm ml-1">{p.unit}</span>
              </div>
              <span className="text-purple-500 text-xs italic bg-purple-950/50 px-2 py-1 rounded">{p.reference}</span>
            </div>

            <div className="bg-black/30 rounded-lg p-3 border border-teal-500/20 text-center">
              <p className="text-teal-300 font-mono text-sm">{p.formula}</p>
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

            <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-3">
              <p className="text-teal-300 font-bold text-xs mb-2">🎓 Nazariy tushuntirish:</p>
              <p className="text-purple-100 text-xs leading-relaxed">{p.theoryNote}</p>
            </div>
          </div>

          {/* Barcha parametrlar tez jadval */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-teal-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-teal-300 text-xs uppercase">Qiymat</th>
                  <th className="py-3 px-3 text-teal-300 text-xs uppercase">Formula</th>
                  <th className="py-3 px-3 text-teal-300 text-xs uppercase">Diagnostik</th>
                </tr>
              </thead>
              <tbody>
                {mossbauerParams.map((mp, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3">
                      <div className="text-teal-300 font-bold text-lg">{mp.param}</div>
                      <div className="text-purple-400 text-[10px]">{mp.paramName}</div>
                    </td>
                    <td className="py-2 px-3 font-mono">
                      <span className="text-red-400 font-bold">{mp.value}</span>
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

        {/* ═══════════ 4. HARORAT JADVALI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌡️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Haroratga bog&apos;liq o&apos;lchovlar</h2>
              <p className="text-purple-400 text-xs">4.2 K dan 400 K gacha K₃[Fe(CN)₆] Mössbauer parametrlari</p>
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
                <p className="text-red-400 text-[10px] uppercase">δ</p>
                <p className="text-white font-mono text-xl">{t.delta.toFixed(2)}</p>
                <p className="text-purple-500 text-[9px]">mm/s</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <p className="text-yellow-400 text-[10px] uppercase">ΔE_Q</p>
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
              <li><strong>δ trend:</strong> T oshgach δ pastroq bo&apos;ladi (SOD effekt, ~7·10⁻⁴ mm/s/K)</li>
              <li><strong>ΔE_Q barqarorlik:</strong> Fe(III) LS uchun ΔE_Q(T) deyarli o&apos;zgarmas (t₂g bo&apos;linishi kichik)</li>
              <li><strong>f_LM eksponentsial pasayish:</strong> Debye modeli, θ_D ≈ 300 K</li>
              <li><strong>Γ kengayishi:</strong> Yuqori T da termik tebranish → chiziqlar kengayadi</li>
            </ul>
          </div>
        </div>

        {/* ═══════════ 5. TANLASH QOIDALARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📐</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tanlash qoidalari — ⁵⁷Fe yadro o&apos;tishlari</h2>
              <p className="text-purple-400 text-xs">Kvantmexanika asosidagi rezonans shartlari</p>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 text-sm text-purple-200 leading-relaxed">
            <p>⁵⁷Fe uchun asosiy Mössbauer o&apos;tishi <strong className="text-yellow-300">14.4125 keV</strong> — bu
              <strong> I=1/2</strong> (asosiy holat, g_n = +0.181) va <strong>I=3/2</strong> (qo&apos;zg&apos;algan holat,
              g_n = −0.103, τ = 141 ns) orasidagi <strong className="text-red-300">magnit dipol (M1) o&apos;tish</strong>.
              Kvant mexanika quyidagi tanlash qoidalarini talab qiladi:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectionRules.map((sr, i) => (
              <div key={i} className="bg-purple-800/30 border border-purple-700/40 rounded-lg p-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-teal-300 font-mono font-bold text-base">{sr.rule}</span>
                </div>
                <p className="text-purple-300 text-xs mt-1">{sr.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-sm">
            <p className="text-blue-300 font-bold text-xs mb-2">💡 Kvadrupol dublet uchun 4 ta o&apos;tish yo&apos;li:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-purple-200">
              <div className="bg-purple-950/40 rounded p-2 font-mono">±3/2 → ±1/2 (I₁ = 3)</div>
              <div className="bg-purple-950/40 rounded p-2 font-mono">±3/2 → ∓1/2 (I₂ = ?)</div>
              <div className="bg-purple-950/40 rounded p-2 font-mono">±1/2 → ±1/2 (I₃ = 1)</div>
              <div className="bg-purple-950/40 rounded p-2 font-mono">±1/2 → ∓1/2 (I₄ = ?)</div>
            </div>
            <p className="text-purple-200 text-xs mt-2">Ulardan 2 tasi bir xil energiyada — natijada dublet
              spektrida <strong>2 ta chiziq</strong> ko&apos;rinadi. Poroshok namuna uchun ideal intensivlik
              nisbati <strong className="text-yellow-300">1:1</strong>.</p>
          </div>
        </div>

        {/* ═══════════ 6. SIANOFERRATLAR QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔗</span>
            <div>
              <h2 className="text-xl font-bold text-white">Sianoferratlar qatori — Werner-Prussian klassikasi</h2>
              <p className="text-purple-400 text-xs">Fe(III/II) sianoferratlarning taqqosli tahlili</p>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 text-sm text-purple-200">
            <p>K₃[Fe(CN)₆] va K₄[Fe(CN)₆] — Alfred Werner (1893) koordinatsion nazariyasining asosiy taqqoslash
              juftligi. Ular <strong className="text-blue-300">Prussian ko&apos;k pigmentining prekursorlaridir</strong> va
              Mössbauer spektroskopiyasi bilan Fe(III)/Fe(II) sistemani o&apos;rganish uchun eng klassik
              ma&apos;lumotnoma hisoblanadi.</p>
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
                    <td className="py-3 px-3 font-mono text-red-400">{c.delta}</td>
                    <td className="py-3 px-3 font-mono text-yellow-400">{c.deltaQ}</td>
                    <td className="py-3 px-3 text-teal-300 text-xs">{c.spektr}</td>
                    <td className="py-3 px-3 text-purple-300 text-xs">{c.spin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 font-bold text-sm mb-2">🔴 K₃[Fe(CN)₆] vs K₄[Fe(CN)₆]</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Farq:</strong> K₃ da Fe(III) LS (d⁵, t₂g⁵) — bitta yakka to&apos;ldirilmagan orbital →
                <strong className="text-yellow-300"> DUBLET</strong> (ΔE_Q = 0.28). K₄ da Fe(II) LS (d⁶, t₂g⁶) —
                to&apos;liq to&apos;lgan sferik → <strong className="text-teal-300">SINGLET</strong> (ΔE_Q = 0).
                Bu farq Mössbauer bilan Fe(III) va Fe(II) LS ni ajratishning eng aniq usulidir.
              </p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-300 font-bold text-sm mb-2">🔵 Prussian ko&apos;k Fe₄[Fe(CN)₆]₃</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Ikki sayt tuzilishi:</strong> Ichki Fe(II) LS (C bilan koordinatsiya, δ=−0.02) va tashqi
                Fe(III) HS (N bilan koordinatsiya, δ=+0.36). Ikki sayt Mössbauer da bir spektrda ko&apos;rinadi —
                bu Prussian ko&apos;kning noyob elektron tuzilishini tasdiqlaydi. Pigment sifatida 300+ yildan foydalanish.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 7. TAJRIBA PARAMETRLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tavsiya etilgan tajriba parametrlari</h2>
              <p className="text-purple-400 text-xs">K₃[Fe(CN)₆] Mössbauer o&apos;lchov uchun amaliy tavsiyalar</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-teal-500/30 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-300 text-xs uppercase">Parametr</th>
                  <th className="py-3 px-3 text-teal-300 text-xs uppercase">Qiymat / tavsiya</th>
                  <th className="py-3 px-3 text-teal-300 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {experimentalParams.map((e, i) => (
                  <tr key={i} className="border-b border-purple-800/40 hover:bg-purple-800/20">
                    <td className="py-2 px-3 text-teal-300 font-bold text-xs">{e.param}</td>
                    <td className="py-2 px-3 text-white font-mono text-xs">{e.value}</td>
                    <td className="py-2 px-3 text-purple-300 text-[11px] italic">{e.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════ 8. O'LCHOV REJIMLARI ═══════════ */}
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

        {/* ═══════════ 9. HALAQIT OMILLAR ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Halaqit beruvchi omillar va yechimlari</h2>
              <p className="text-purple-400 text-xs">Aniq Mössbauer spektri olish uchun bartaraf etish kerak bo&apos;lgan muammolar</p>
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

        {/* ═══════════ 10. TARIXIY KONTEKST ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Tarixiy kontekst — K₃[Fe(CN)₆] va Mössbauer</h2>
              <p className="text-purple-400 text-xs">200 yildan ortiq tarix — Gmelin dan operando katalizatorlargacha</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-purple-500 to-teal-500"></div>
            <div className="space-y-3">
              {historyEvents.map((h, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-purple-600 border-2 border-purple-950"></div>
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

        {/* ═══════════ 11. XULOSALAR ═══════════ */}
        <div className="bg-gradient-to-r from-teal-600/10 to-red-600/10 border border-teal-500/30 rounded-2xl p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <h2 className="text-xl font-bold text-white">Asosiy xulosalar</h2>
          </div>
          <ol className="space-y-2 text-purple-200 text-sm list-decimal list-inside leading-relaxed">
            <li>K₃[Fe(CN)₆] ⁵⁷Fe Mössbauer spektri <strong className="text-red-300">klassik assimetrik dublet</strong> — Fe(III) LS d⁵ (t₂g⁵) konfiguratsiyaning bevosita natijasi.</li>
            <li><strong className="text-red-300">δ = −0.12 mm/s</strong> (RT, α-Fe ga nisbatan) — MANFIY qiymati CN⁻ ligandning kuchli π-akseptor xarakterini va Fe→CN back-bonding orqali <em>|ψ(0)|²</em> ning ortishini isbotlaydi.</li>
            <li><strong className="text-yellow-300">ΔE_Q = 0.28 mm/s</strong> — kichik qiymat t₂g⁵ konfiguratsiyaning deyarli sferik simmetriyasini ko&apos;rsatadi (bir yakka to&apos;ldirilmagan orbital).</li>
            <li><strong className="text-blue-300">H_hf = 0 T</strong> (T &gt; 5 K) — paramagnit Fe³⁺ LS elektron spin relaksatsiyasi tez (τ_e &lt; 10⁻⁸ s), Zeeman sekstet ko&apos;rinmaydi.</li>
            <li><strong className="text-teal-300">Γ = 0.28 mm/s</strong> — tabiiy chiziq kengligining ~2.9× — yaxshi kristallik, monofazali namuna.</li>
            <li><strong className="text-green-300">Haroratga bog&apos;liq:</strong> δ(T) chiziqli SOD effekt (~2.5·10⁻⁴ mm/s/K), f_LM(T) Debye modelini qanoatlantiradi (θ_D ≈ 300 K).</li>
            <li>K₄[Fe(CN)₆] (singlet) bilan taqqoslash Fe(II) LS va Fe(III) LS ni <strong className="text-yellow-300">aniq ajratadi</strong> — Werner nazariyasining Mössbauer tasdig&apos;i.</li>
            <li>Alternativ tasdiqlash: EPR (g₁=2.35, g₂=2.10, g₃=0.91), UV-Vis (LMCT 420 nm, ε≈1000), IR (νCN=2135 cm⁻¹). Barcha usullar bir xil natijaga keltiradi.</li>
            <li>K₃[Fe(CN)₆] Mössbauer amaliyotida <strong className="text-red-300">Fe(III) LS uchun referens birikma</strong> — barcha Fe(III) LS komplekslar bu tayanchda solishtiriladi.</li>
          </ol>
        </div>

        {/* ═══════════ 12. ADABIYOTLAR ═══════════ */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-2xl p-6 space-y-3">
          <h3 className="text-teal-400 font-bold flex items-center gap-2 text-lg">
            <span>📚</span> Manba adabiyotlar
          </h3>
          <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>P. Gütlich, E. Bill, A. X. Trautwein</strong> — <em>Mössbauer Spectroscopy and Transition Metal Chemistry: Fundamentals and Applications</em>. Springer, 2011.</li>
            <li><strong>N. N. Greenwood, T. C. Gibb</strong> — <em>Mössbauer Spectroscopy</em>. Chapman &amp; Hall, London, 1971 (klassik ma&apos;lumotnoma).</li>
            <li><strong>F. Menil</strong> — Systematic trends of the ⁵⁷Fe Mössbauer isomer shifts. <em>J. Phys. Chem. Solids</em> <strong>46</strong>, 763 (1985).</li>
            <li><strong>R. L. Mössbauer</strong> — Kernresonanzfluoreszenz von Gammastrahlung in Ir¹⁹¹. <em>Z. Physik</em> <strong>151</strong>, 124 (1958) — asl kashfiyot.</li>
            <li><strong>R. Ingalls</strong> — Electric field gradient tensor in ferrous compounds. <em>Phys. Rev.</em> <strong>133</strong>, A787 (1964) — ΔE_Q(T) modeli.</li>
            <li><strong>L. M. Epstein</strong> — Mössbauer study of iron cyanide complexes. <em>J. Chem. Phys.</em> <strong>36</strong>, 2731 (1962) — K₃[Fe(CN)₆] birinchi spektri.</li>
            <li><strong>R. H. Herber (ed.)</strong> — <em>Chemical Mössbauer Spectroscopy</em>. Plenum Press, 1984.</li>
            <li><strong>A. Werner</strong> — Beitrag zur Konstitution anorganischer Verbindungen. <em>Z. anorg. Chem.</em> <strong>3</strong>, 267 (1893) — koordinatsion nazariya.</li>
          </ul>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar"
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all hover:border-purple-400 flex items-center gap-2">
            <span>←</span>
            <div className="text-left">
              <div className="text-[10px] text-purple-400">Barcha:</div>
              <div className="font-bold">Mössbauer birikmalar</div>
            </div>
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/k4-fe-cn6"
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/30">
            <div className="text-right">
              <div className="text-[10px] text-yellow-100">Keyingi:</div>
              <div>K₄[Fe(CN)₆] — Sariq qon tuzi</div>
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
          Mössbauer spektroskopiyasi · K₃[Fe(CN)₆] — Qizil qon tuzi · Fe(III) LS referens birikmasi
        </p>
      </footer>
    </main>
  )
}
