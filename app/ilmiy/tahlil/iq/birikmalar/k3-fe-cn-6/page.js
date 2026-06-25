"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Fe(CN)₆] — KALIY FERRITSIANID (QIZIL QON TUZI) IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Nakamoto, Sharpe (1976), Dunbar (1987)
// Xususiyat: Fe³⁺ (d⁵, past spin), Oₕ simmetriya, π-back-bonding, oksidlovchi
// O'ziga xoslik: 17 elektron (18 emas!), paramagnit, 1:3 elektrolit, Prussian Blue
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
  formulaPlain: "K3[Fe(CN)6]",
  iupac: "Kaliy geksatsianoferrat(III)",
  formulaExpanded: "K₃FeC₆N₆",
  commonName: "Qizil qon tuzi (Red prussiate of potash)",
  molarMass: 329.24,
  casNumber: "13746-66-2",
  color: "qizil (red, qizil qon tuzi)",
  structure: "Oktaedr (Oₕ simmetriya)",
  metalLigand: "Fe-C (sianid), C≡N",
  spaceGroup: "Fm3̄m (kubik)",
  crystalSystem: "Monoklinik (anhidrat), Kubik (trihidrat)",
  pointGroup: "Oₕ (oktaedral)",
  electrolyteType: "1:3 elektrolit (4 ion)",
  molarConductivity: "~430 S·cm²/mol",

  // Elektron hisobi — MUHIM: 17 elektron (18 emas!)
  electronCount: {
    Fe3: "Fe³⁺ (d⁵) = 5 elektron",
    CN_ligands: "6 × CN⁻ (2 elektron har biri) = 12 elektron",
    total: "5 + 12 = 17 elektron",
    rule: "17 elektron — 18 elektron qoidasi bajarilmaydi! (1 elektron kam)",
    spinState: "Past spin (t₂g⁵) — paramagnit (1 toq elektron, μ ≈ 1.8 BM)"
  },

  // Bog' ma'lumotlari
  bondInfo: {
    Fe_C: "Fe-C bog' uzunligi: 1.92 Å (kuchsiz π-back-bonding)",
    CN: "C≡N bog' uzunligi: 1.15 Å (uch bog'li)",
    piBackBonding: "Fe³⁺ (t₂g⁵) elektronlari kamroq — kamroq π-back-bonding. C≡N bog' kamroq kuchsizlanadi (K₄[Fe(CN)₆] ga qaraganda).",
    CN_stretch: "ν(C≡N) ≈ 2115 cm⁻¹ (erkin CN⁻ = 2080 cm⁻¹ dan YUQORI — kamroq π-back-bonding tufayli)"
  },

  // K₄[Fe(CN)₆] bilan taqqoslash — MUHIM FARQLAR
  comparison: {
    K3: {
      name: "K₃[Fe(CN)₆] (Qizil qon tuzi)",
      Fe_state: "Fe³⁺ (d⁵, past spin)",
      color: "Qizil",
      CN_stretch: "2115 cm⁻¹",
      magnetism: "Paramagnit (t₂g⁵, 1 toq elektron, μ ≈ 1.8 BM)",
      electronCount: "17 elektron (18 emas!)",
      electrolyte: "1:3 elektrolit (4 ion)"
    },
    K4: {
      name: "K₄[Fe(CN)₆] (Sariq qon tuzi)",
      Fe_state: "Fe²⁺ (d⁶, past spin)",
      color: "Sariq",
      CN_stretch: "2044 cm⁻¹",
      magnetism: "Diamagnit (t₂g⁶)",
      electronCount: "18 elektron",
      electrolyte: "4:1 elektrolit (5 ion)"
    },
    difference: {
      electronDifference: "1 elektron farq (17 vs 18)",
      CN_shift: "ν(C≡N) farqi: 71 cm⁻¹ (2044 → 2115 cm⁻¹)",
      magnetism: "Paramagnit vs Diamagnit",
      color: "Qizil vs Sariq"
    }
  },

  // IQ cho'qqilari — NAZARIY IZOHLAR BILAN
  irPeaks: [
    {
      freq: 2115, T: 8, absorbance: 0.92,
      assignment: "ν(C≡N)",
      assignment_uz: "C≡N cho'zilish (asimetrik, T₁ᵤ)",
      intensity: "Juda kuchli",
      bond: "C≡N",
      symmetry: "T₁ᵤ (Oₕ)",
      forceConstant: "17.5 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C≡N cho'zilish (T₁ᵤ mod, Oₕ da IQ faol). Erkin CN⁻ (2080 cm⁻¹) dan YUQORI — kamroq π-back-bonding tufayli C≡N bog' kuchliroq. Fe³⁺ (t₂g⁵) elektronlari kamroq — CN⁻ ning π* orbitaliga kamroq o'tadi, C≡N bog' kuchliroq (2080 → 2115 cm⁻¹, 35 cm⁻¹ siljish)."
    },
    {
      freq: 2044, T: 15, absorbance: 0.45,
      assignment: "ν(C≡N) hot band",
      assignment_uz: "C≡N cho'zilish (hot band yoki Fermi rezonans)",
      intensity: "O'rta",
      bond: "C≡N",
      symmetry: "T₁ᵤ (Oₕ)",
      forceConstant: "16.5 mdyn/Å",
      theoryNote: "Hot band yoki Fermi rezonans — K₄[Fe(CN)₆] da asosiy cho'qqi (2044 cm⁻¹), K₃[Fe(CN)₆] da hot band yoki Fermi rezonans."
    },
    {
      freq: 600, T: 40, absorbance: 0.65,
      assignment: "ν(Fe-C)",
      assignment_uz: "Fe-C cho'zilish (T₁ᵤ)",
      intensity: "Kuchli",
      bond: "Fe-C",
      symmetry: "T₁ᵤ (Oₕ)",
      forceConstant: "1.9 mdyn/Å",
      theoryNote: "⭐ Fe-C bog'ining cho'zilishi. Kamroq π-back-bonding tufayli Fe-C bog' kuchsizroq (K₄[Fe(CN)₆] da 590 cm⁻¹, K₃[Fe(CN)₆] da 600 cm⁻¹). Oₕ da T₁ᵤ mod IQ faol."
    },
    {
      freq: 510, T: 45, absorbance: 0.58,
      assignment: "δ(Fe-C-N)",
      assignment_uz: "Fe-C-N egilish (T₂ᵤ)",
      intensity: "O'rta",
      bond: "Fe-C-N",
      symmetry: "T₂ᵤ (Oₕ)",
      forceConstant: "0.5 mdyn/Å",
      theoryNote: "Fe-C-N burchakning deformatsiyasi. Chiziqli Fe-C≡N bog' egiladi."
    },
    {
      freq: 420, T: 50, absorbance: 0.48,
      assignment: "δ(C-Fe-C)",
      assignment_uz: "C-Fe-C egilish (T₂ᵤ)",
      intensity: "O'rta",
      bond: "C-Fe-C",
      symmetry: "T₂ᵤ (Oₕ)",
      forceConstant: "0.4 mdyn/Å",
      theoryNote: "C-Fe-C burchakning deformatsiyasi. Oktaedral burchak (90°) o'zgaradi."
    },
    {
      freq: 380, T: 55, absorbance: 0.42,
      assignment: "δ(Fe-C-N)",
      assignment_uz: "Fe-C-N egilish (T₁ᵤ)",
      intensity: "O'rta-zaif",
      bond: "Fe-C-N",
      symmetry: "T₁ᵤ (Oₕ)",
      forceConstant: "0.4 mdyn/Å",
      theoryNote: "Fe-C-N burchakning deformatsiyasi (boshqa mod)."
    },
    {
      freq: 1620, T: 60, absorbance: 0.38,
      assignment: "δ(H-O-H)",
      assignment_uz: "H-O-H egilish (kristall suv)",
      intensity: "O'rta-zaif",
      bond: "H-O-H",
      symmetry: "—",
      theoryNote: "K₃[Fe(CN)₆] trihidrat — kristall suv cho'qqisi. Anhadrat shaklda bu cho'qqi yo'q."
    },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.02 }, { freq: 3500, absorbance: 0.08 },
    { freq: 2500, absorbance: 0.05 }, { freq: 2115, absorbance: 0.92 },
    { freq: 2044, absorbance: 0.45 }, { freq: 1620, absorbance: 0.38 },
    { freq: 1000, absorbance: 0.06 }, { freq: 600, absorbance: 0.65 },
    { freq: 510, absorbance: 0.58 }, { freq: 420, absorbance: 0.48 },
    { freq: 380, absorbance: 0.42 }, { freq: 200, absorbance: 0.02 },
  ],

  // Turli erituvchilarda — NAZARIY IZOHLAR
  solventData: [
    {
      solvent: "Suv (H₂O)", dielectric: 78.5, lm: 430, kappa: 0.0430, color: "qizil",
      note: "Suvda yaxshi eriydi — 1:3 elektrolit. Λm ≈ 430 S·cm²/mol (Geary 1971 bo'yicha).",
      theoryNote: "Suv qutbli erituvchi (ε = 78.5) — [Fe(CN)₆]³⁻ to'liq dissotsiatsiyalanadi. 1:3 elektrolit — 4 ion hosil bo'ladi."
    },
    {
      solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: 380, kappa: 0.0380, color: "qizil",
      note: "Metanol da eriydi — lekin suvdan kam. Λm ≈ 380 S·cm²/mol (kamroq dissotsiatsiya).",
      theoryNote: "Metanol (ε = 32.7) — suvdan kam qutbli. Kamroq dissotsiatsiya, Λm kamroq."
    },
    {
      solvent: "DMF", dielectric: 36.7, lm: 390, kappa: 0.0390, color: "qizil",
      note: "DMF qutbli — eriydi, lekin suvdan kam.",
      theoryNote: "DMF (ε = 36.7) — suvdan kam qutbli, lekin kam dissotsiatsiya."
    },
    {
      solvent: "Asetonitril", dielectric: 37.5, lm: 395, kappa: 0.0395, color: "qizil",
      note: "Asetonitril qutbli — eriydi.",
      theoryNote: "CH₃CN (ε = 37.5) — qutbli organik erituvchi."
    },
    {
      solvent: "Geptan (C₇H₁₆)", dielectric: 1.9, lm: 0, kappa: 0.0000, color: "erimaydi",
      note: "⚠️ Geptan da ERIMAYDI! K₃[Fe(CN)₆] ionli birikma — nopolar erituvchida erimaydi.",
      theoryNote: "Geptan (ε = 1.9) — nopolar. Ionli birikma erimaydi."
    },
    {
      solvent: "DMSO", dielectric: 46.7, lm: 410, kappa: 0.0410, color: "qizil",
      note: "DMSO qutbli — yaxshi eriydi.",
      theoryNote: "DMSO (ε = 46.7) — yuqori qutbli organik erituvchi."
    },
  ],

  // Halaqit beruvchi omillar — NAZARIY IZOHLAR
  interferences: [
    {
      source: "Suv (H₂O)", freqRange: "3400, 1640 cm⁻¹",
      effect: "Keng suv cho'qqilari — trihidrat cho'qqilari 3400, 1620 cm⁻¹ da",
      severity: "O'rta",
      solution: "Anhidrat shakl ishlatish. KBr tabletka uchun KBr ni quritish.",
      theoryNote: "K₃[Fe(CN)₆] trihidrat — kristall suv cho'qqilari 3400 va 1620 cm⁻¹ da. Anhidrat shaklda bu cho'qqilar yo'q."
    },
    {
      source: "CO₂ (atmosfera)", freqRange: "2350, 667 cm⁻¹",
      effect: "CO₂ cho'qqilari 2350 va 667 cm⁻¹ da — C≡N sohasiga aralashishi mumkin (lekin C≡N 2115 da — aralashmaydi)",
      severity: "Past",
      solution: "N₂ bilan tozalash (ixtiyoriy). C≡N 2115 cm⁻¹ da — CO₂ 2350 dan farq qiladi.",
      theoryNote: "CO₂ 2350 cm⁻¹ da — C≡N 2115 cm⁻¹ dan farq qiladi. CO₂ cho'qqisi aralashmaydi."
    },
    {
      source: "KCN ajralishi", freqRange: "2080 cm⁻¹",
      effect: "Erkin KCN cho'qqisi 2080 cm⁻¹ da — C≡N sohasiga aralashishi mumkin",
      severity: "Yuqori",
      solution: "Past haroratda saqlash. Parchalanishning oldini olish.",
      theoryNote: "[Fe(CN)₆]³⁻ sekin parchalanadi: KCN ajralishi mumkin. Erkin KCN 2080 cm⁻¹ da cho'qqi beradi."
    },
    {
      source: "Qaytarilish (K₄[Fe(CN)₆])", freqRange: "2044 cm⁻¹ (K₄[Fe(CN)₆])",
      effect: "K₄[Fe(CN)₆] cho'qqisi 2044 cm⁻¹ da — C≡N sohasiga aralashishi mumkin",
      severity: "Yuqori",
      solution: "Oksidlanish sharoiti. Namuna toza bo'lishi kerak.",
      theoryNote: "K₄[Fe(CN)₆] (sariq qon tuzi) — ν(C≡N) ≈ 2044 cm⁻¹. K₃[Fe(CN)₆] (qizil) — ν(C≡N) ≈ 2115 cm⁻¹. Farq: 71 cm⁻¹."
    },
    {
      source: "Prussian Blue cho'kmasi", freqRange: "Barcha",
      effect: "Fe²⁺ bilan reaksiya — ko'k cho'kma hosil bo'ladi",
      severity: "Yuqori",
      solution: "Fe²⁺ yo'qligini tekshirish. Toza asboblar ishlatish.",
      theoryNote: "4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ (Prussian Blue). Fe²⁺ bilan reaksiyada ko'k cho'kma hosil bo'ladi."
    },
  ],

  // Texnikalar — NAZARIY IZOHLAR
  techniques: [
    {
      name: "KBr tabletka",
      description: "KBr bilan tabletka tayyorlash (an'anaviy usul)",
      advantages: [
        "Eng aniq va an'anaviy usul",
        "C≡N cho'qqilari aniq ko'rinadi (2115 cm⁻¹)",
        "Kvantitativ tahlil uchun qulay",
        "Barcha cho'qqilar aniq"
      ],
      disadvantages: [
        "Namuna tayyorlash kerak (10-15 daq)",
        "KBr nam bo'lsa, suv cho'qqilari aralashadi",
        "KCN ajralishi mumkin",
        "Qorong'i xona kerak"
      ],
      bestFor: "Aniq kvantitativ tahlil, an'anaviy",
      freqRange: "4000-400 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "10-15 daq"
    },
    {
      name: "Suvli eritma (UV-Vis)",
      description: "Suvli eritma — UV-Vis spektroskopiya",
      advantages: [
        "Suvda yaxshi eriydi",
        "UV-Vis λmax = 420 nm (LMCT)",
        "Tez o'lchash",
        "Kvantitativ tahlil"
      ],
      disadvantages: [
        "Faqat suvda",
        "Fe²⁺ bilan reaksiya (Prussian Blue)",
        "Qaytarilish mumkin"
      ],
      bestFor: "UV-Vis, kvantitativ, tez o'lchash",
      freqRange: "200-800 nm",
      resolution: "1 nm",
      samplePrep: "5-10 daq"
    },
    {
      name: "ATR (Attenuated Total Reflectance)",
      description: "To'g'ridan-to'g'ri qattiq namuna",
      advantages: [
        "Tez o'lchash (1-2 daq)",
        "Namuna tayyorlash shart emas",
        "C≡N cho'qqilari aniq",
        "Namuna buzilmaydi"
      ],
      disadvantages: [
        "Cho'qqilar biroz siljigan",
        "Past chastotali soha zaif",
        "Kvantitativ tahlil qiyin"
      ],
      bestFor: "Tez skrining, tez o'lchash",
      freqRange: "4000-600 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "1-2 daq"
    },
    {
      name: "Prussian Blue testi",
      description: "Fe²⁺ bilan reaksiya — ko'k cho'kma",
      advantages: [
        "[Fe(CN)₆]³⁻ ni aniqlash",
        "Vizual ravishda jozibali",
        "Kvantitativ tahlil",
        "Klassik test"
      ],
      disadvantages: [
        "Faqat [Fe(CN)₆]³⁻ uchun",
        "Fe²⁺ kerak",
        "Faqat sifat test"
      ],
      bestFor: "[Fe(CN)₆]³⁻ aniqlash, Prussian Blue",
      freqRange: "—",
      resolution: "—",
      samplePrep: "5-10 daq"
    },
  ],

  // Laboratoriya bajarish tartibi — KENGAYTIRILGAN
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. KCN ajralishi mumkin — toksik. Fe²⁺ yo'qligini tekshirish. N₂ atmosferasi ixtiyoriy.",
      time: "15 daq",
      theoryNote: "KCN toksik — nafas yo'llarini to'xtatadi. K₃[Fe(CN)₆] sekin parchalanadi. Fe²⁺ bilan Prussian Blue hosil bo'ladi."
    },
    {
      step: 2,
      title: "Sof K₃[Fe(CN)₆] ni tayyorlash",
      desc: "Sof K₃[Fe(CN)₆] ni sotib olish yoki sintez qilish. Qorong'ida saqlash. Fe²⁺ yo'qligini tekshirish.",
      time: "Tayyor yoki 1-2 soat (sintez)",
      theoryNote: "K₃[Fe(CN)₆] — qizil qon tuzi. Qorong'ida saqlash — qaytarilishning oldini olish. Fe²⁺ yo'qligini tekshirish — Prussian Blue cho'kmasining oldini olish."
    },
    {
      step: 3,
      title: "IQ spektrometrni tayyorlash",
      desc: "Spektrometrni yoqish, 30 daq isitish. Fon spektrini olish. N₂ bilan tozalash (ixtiyoriy).",
      time: "30 daq",
      theoryNote: "Spektrometr tayyorlanadi. CO₂ cho'qqilari (2350 cm⁻¹) aralashmasligi uchun."
    },
    {
      step: 4,
      title: "KBr tabletka tayyorlash",
      desc: "1 mg namuna + 200 mg KBr. Gidravlik press bilan tabletka bosish. KBr quruq bo'lishi kerak.",
      time: "10-15 daq",
      theoryNote: "KBr tabletka — an'anaviy usul. KBr nam bo'lmasligi kerak — suv cho'qqilari (3400, 1620 cm⁻¹) aralashmasligi uchun."
    },
    {
      step: 5,
      title: "Spektrlarni o'lchash",
      desc: "4000-400 cm⁻¹ oralig'ida spektrlarni o'lchash. 2-3 marta takrorlash.",
      time: "10 daq",
      theoryNote: "4000-400 cm⁻¹ oralig'i — barcha muhim cho'qqilarni qamrab oladi."
    },
    {
      step: 6,
      title: "C≡N cho'qqisini tekshirish",
      desc: "ν(C≡N) 2115 cm⁻¹ cho'qqisini tekshirish. Erkin KCN (2080 cm⁻¹) yo'qligini tekshirish. K₄[Fe(CN)₆] (2044 cm⁻¹) yo'qligini tekshirish.",
      time: "5 daq",
      theoryNote: "ν(C≡N) = 2115 cm⁻¹ — K₃[Fe(CN)₆] belgisi. Erkin KCN 2080 cm⁻¹ da, K₄[Fe(CN)₆] 2044 cm⁻¹ da cho'qqi beradi."
    },
    {
      step: 7,
      title: "Prussian Blue testi (ixtiyoriy)",
      desc: "Fe²⁺ eritmasi qo'shib, ko'k cho'kma hosil bo'lishini tekshirish.",
      time: "5-10 daq",
      theoryNote: "4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ (Prussian Blue). Bu K₃[Fe(CN)₆] ni aniqlashning klassik testi."
    },
    {
      step: 8,
      title: "Ma'lumotlarni tahlil qilish",
      desc: "ν(C≡N) 2115, ν(Fe-C) 600 cm⁻¹ cho'qqilarini tekshirish. Erkin KCN (2080 cm⁻¹) va K₄[Fe(CN)₆] (2044 cm⁻¹) yo'qligini tekshirish.",
      time: "10 daq",
      theoryNote: "K₃[Fe(CN)₆] da ν(C≡N) = 2115, ν(Fe-C) = 600 cm⁻¹. Erkin KCN (2080 cm⁻¹) va K₄[Fe(CN)₆] (2044 cm⁻¹) yo'q."
    },
  ],

  // Laboratoriya natijalari solishtirish — KENGAYTIRILGAN
  labResults: [
    {
      id: "LAB-001",
      technique: "KBr tabletka",
      condition: "Sof K₃[Fe(CN)₆], KBr tabletka",
      freq_CN: "2115",
      freq_FeC: "600, 510, 420, 380",
      quality: "A'lo",
      notes: "Sof K₃[Fe(CN)₆] — ν(C≡N) = 2115 cm⁻¹ cho'qqisi aniq. ν(Fe-C) = 600, 510, 420, 380 cm⁻¹ cho'qqilari aniq. Bu K₃[Fe(CN)₆] ning asosiy belgisi.",
      theoryNote: "K₃[Fe(CN)₆] — barcha CN terminal (bridging CN yo'q). Oₕ simmetriya. Fe³⁺ (d⁵, past spin) — paramagnit. Kamroq π-back-bonding."
    },
    {
      id: "LAB-002",
      technique: "Suvli eritma (UV-Vis)",
      condition: "Suvda 10⁻⁴ M",
      freq_CN: "—",
      freq_FeC: "—",
      quality: "UV-Vis farqlash",
      notes: "UV-Vis: λmax = 420 nm (LMCT o'tish). Bu K₃[Fe(CN)₆] belgisi. Λm ≈ 430 S·cm²/mol (1:3 elektrolit).",
      theoryNote: "UV-Vis λmax = 420 nm — LMCT (ligand-to-metal charge transfer) o'tish. 1:3 elektrolit — 4 ion."
    },
    {
      id: "LAB-003",
      technique: "ATR",
      condition: "To'g'ridan-to'g'ri qattiq",
      freq_CN: "2113",
      freq_FeC: "598, 508",
      quality: "A'lo",
      notes: "ATR usuli — cho'qqilar biroz siljigan. C≡N cho'qqisi 2113 cm⁻¹ da aniq. Past chastotali cho'qqilar zaif.",
      theoryNote: "ATR usuli — cho'qqilar biroz siljiydi. C≡N 2113 cm⁻¹ da (2115 dan 2 cm⁻¹ past)."
    },
    {
      id: "LAB-004",
      technique: "Konduktometriya",
      condition: "Suvda, 10⁻³ M",
      freq_CN: "—",
      freq_FeC: "—",
      quality: "1:3 elektrolit",
      notes: "⚠️ Λm ≈ 430 S·cm²/mol. 1:3 elektrolit — 4 ion (3K⁺ + [Fe(CN)₆]³⁻). Bu Geary (1971) bo'yicha.",
      theoryNote: "K₃[Fe(CN)₆] — 1:3 elektrolit. 3K⁺ + [Fe(CN)₆]³⁻ = 4 ion. Λm ≈ 430 S·cm²/mol (Geary 1971)."
    },
    {
      id: "LAB-005",
      technique: "Prussian Blue testi",
      condition: "Fe²⁺ qo'shish",
      freq_CN: "—",
      freq_FeC: "—",
      quality: "Prussian Blue aniqlandi",
      notes: "Fe²⁺ qo'shilganda ko'k cho'kma hosil bo'ladi — Fe₄[Fe(CN)₆]₃ (Prussian Blue). Bu K₃[Fe(CN)₆] ni aniqlashning klassik testi.",
      theoryNote: "4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ (Prussian Blue). Diesbach (1704) kashfiyoti."
    },
    {
      id: "LAB-006",
      technique: "Qaytarilish testi",
      condition: "H₂ qo'shish (qaytarilish)",
      freq_CN: "2044 (K₄[Fe(CN)₆])",
      freq_FeC: "—",
      quality: "Qaytarilish aniqlandi",
      notes: "H₂ qo'shilganda K₄[Fe(CN)₆] (sariq qon tuzi) hosil bo'ladi. ν(C≡N) 2115 → 2044 cm⁻¹ ga siljiydi.",
      theoryNote: "K₃[Fe(CN)₆] → K₄[Fe(CN)₆] (qaytarilish). Fe³⁺ → Fe²⁺. ν(C≡N) 2115 → 2044 cm⁻¹ (71 cm⁻¹ siljish)."
    },
  ],
}

export default function K3FeCN6Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2115)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeLabStep, setActiveLabStep] = useState(0)

  const [calcDq, setCalcDq] = useState(35000)
  const [calcP, setCalcP] = useState(21000)
  const [calcUnpairedElectrons, setCalcUnpairedElectrons] = useState(1)

  const currentPeak = useMemo(() => {
    let closest = COMPOUND.irPeaks[0]
    let minDiff = Math.abs(freqSlider - COMPOUND.irPeaks[0].freq)
    for (let i = 1; i < COMPOUND.irPeaks.length; i++) {
      const diff = Math.abs(freqSlider - COMPOUND.irPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = COMPOUND.irPeaks[i] }
    }
    return closest
  }, [freqSlider])

  const cfseResult = useMemo(() => {
    // Fe³⁺ past spin: t₂g⁵, CFSE = -2.0Δₒ + 2P
    const cfse = -2.0 * calcDq + 2 * calcP
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = -2.0×Δₒ + 2P (t₂g⁵)"
    }
  }, [calcDq, calcP])

  const muResult = useMemo(() => {
    const mu = Math.sqrt(calcUnpairedElectrons * (calcUnpairedElectrons + 2))
    return { mu: mu.toFixed(2), n: calcUnpairedElectrons }
  }, [calcUnpairedElectrons])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚗️</span> K₃[Fe(CN)₆] — KALIY FERRITSIANID (QIZIL QON TUZI)!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">K₃[Fe(CN)₆]</strong> — kaliy ferritsianid, qizil qon tuzi.
              Oₕ simmetriya, 17 elektron (18 emas!), paramagnit, Prussian Blue sintezi!
            </p>

            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(C≡N):</strong> 2115 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Fe-C):</strong> 600 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>UV-Vis λmax:</strong> 420 nm (LMCT)
                  </div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-2">🔬 Konduktometriya:</div>
                  <div className="text-purple-200">
                    <strong>Λm ≈ 430 S·cm²/mol</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>1:3 elektrolit</strong> (4 ion)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">17 elektron (18 emas!):</strong> Fe³⁺ (d⁵) + 6×CN⁻ (12 elektron) = 17 elektron.
                Fe³⁺ (d⁵, past spin, t₂g⁵) — paramagnit (1 toq elektron, μ ≈ 1.8 BM).
              </p>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">⚠️ XAVFSIZLIK:</strong> KCN ajralishi mumkin — toksik! Fe²⁺ bilan Prussian Blue hosil bo'ladi.
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <Link href="/ilmiy/tahlil/iq" className="hover:text-purple-300">IQ spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-red-400 font-semibold">K₃[Fe(CN)₆]</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">1:3 elektrolit</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">17 elektron</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Oₕ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Paramagnit</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-red-600 hover:bg-red-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Oₕ simmetriya</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁵ past spin</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">17 elektron</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Prussian Blue</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              K₃[Fe(CN)₆]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            kaliy geksatsianoferrat(III) — <span className="text-red-400 italic">&quot;Qizil qon tuzi, 17 elektron, Prussian Blue sintezi, Oₕ simmetriya&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-red-400">IQ spektri</strong> KBr tabletka yoki suvli eritmada olingan. Eng muhim diagnostik signallar:
            <strong className="text-red-400"> ν(C≡N) 2115 cm⁻¹</strong> — C≡N cho'zilish (kamroq π-back-bonding);
            <strong className="text-red-400"> ν(Fe-C) 600 cm⁻¹</strong> — Fe-C bog';
            <strong className="text-red-400"> UV-Vis λmax = 420 nm</strong> — LMCT o'tish.
            Bu kompleks Prussian Blue sintezining asosiy komponenti (Diesbach 1704).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe³⁺ (d⁵)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">17 elektron</div>
              <div className="text-white font-bold">Paramagnit</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Oₕ (oktaedr)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:3 (4 ion)</div>
            </div>
          </div>
        </div>

        {/* 17 ELEKTRON VA K₄[Fe(CN)₆] BILAN TAQQOSLASH */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔢 17 elektron va K₄[Fe(CN)₆] bilan taqqoslash</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">K₃[Fe(CN)₆] (Qizil qon tuzi)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe³⁺ (d⁵):</span>
                  <span className="text-red-400">5 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">6 × CN⁻ (2 elektron har biri):</span>
                  <span className="text-red-400">12 elektron</span>
                </div>
                <div className="flex justify-between border-t border-red-700/50 pt-2">
                  <span className="text-purple-400 font-bold">Jami:</span>
                  <span className="text-red-400 font-bold">17 elektron (18 emas!)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-red-400">Past spin (t₂g⁵), paramagnit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Qoida:</span>
                  <span className="text-red-400">Bajarilmaydi (1 elektron kam)</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">K₄[Fe(CN)₆] (Sariq qon tuzi)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe²⁺ (d⁶):</span>
                  <span className="text-yellow-400">6 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">6 × CN⁻ (2 elektron har biri):</span>
                  <span className="text-yellow-400">12 elektron</span>
                </div>
                <div className="flex justify-between border-t border-yellow-700/50 pt-2">
                  <span className="text-purple-400 font-bold">Jami:</span>
                  <span className="text-yellow-400 font-bold">18 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-yellow-400">Past spin (t₂g⁶), diamagnit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Qoida:</span>
                  <span className="text-yellow-400">Bajariladi — barqaror!</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-300 text-sm">
              <strong>K₃[Fe(CN)₆] vs K₄[Fe(CN)₆] farqlari:</strong><br/>
              <strong>Elektron:</strong> 17 vs 18 elektron (1 elektron farq)<br/>
              <strong>ν(C≡N):</strong> 2115 vs 2044 cm⁻¹ (71 cm⁻¹ siljish)<br/>
              <strong>Magnit:</strong> Paramagnit vs Diamagnit<br/>
              <strong>Rang:</strong> Qizil vs Sariq<br/>
              <strong>Elektrolit:</strong> 1:3 (4 ion) vs 4:1 (5 ion)
            </p>
          </div>
        </div>

        {/* IQ CHO'QQILARI — NAZARIY IZOHLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 IQ cho'qqilari — NAZARIY IZOHLAR BILAN</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota</th>
                  <th className="py-3 px-4 text-purple-300">Belgilanish</th>
                  <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                  <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                  <th className="py-3 px-4 text-purple-300">Kuch konstanta</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.irPeaks.map((p, i) => {
                  const isImportant = p.freq === 2115 || p.freq === 600
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-red-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-red-400' : 'text-red-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-red-400">⭐</span>}
                      </td>
                      <td className="py-3 px-4 font-mono">{p.assignment}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-[10px] ${
                          p.intensity.includes('Juda kuchli') ? 'bg-red-600/30 text-red-400' :
                          p.intensity === 'Kuchli' ? 'bg-orange-600/30 text-orange-400' :
                          p.intensity === 'O\'rta' ? 'bg-yellow-600/30 text-yellow-400' :
                          'bg-green-600/30 text-green-400'
                        }`}>
                          {p.intensity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400">{p.forceConstant}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> ν(C≡N) = 2115 cm⁻¹ — bu K₃[Fe(CN)₆] ning ASOSIY BELGISI!
              Erkin CN⁻ (2080 cm⁻¹) dan YUQORI — kamroq π-back-bonding tufayli.
              Fe³⁺ (t₂g⁵) elektronlari kamroq — CN⁻ ning π* orbitaliga kamroq o'tadi, C≡N bog' kuchliroq.
              ν(Fe-C) = 600 cm⁻¹ — kamroq π-back-bonding tufayli Fe-C bog' kuchsizroq (K₄[Fe(CN)₆] da 590 cm⁻¹).
            </p>
          </div>
        </div>

        {/* INTERAKTIV IQ SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            Slayderni harakatlantirib, chastotani o'zgartiring. Eng yaqin cho'qqi avtomatik tanlanadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-red-400 font-bold mb-2">
              To'lqin soni: {freqSlider} cm⁻¹
            </label>
            <input
              type="range"
              min="200"
              max="4000"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="To'lqin sonini o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200 cm⁻¹ (Fe-C)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (C≡N)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin soni:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.forceConstant}</div>
              </div>
            </div>
            <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Batafsil tavsif:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentPeak.theoryNote}
              </p>
            </div>
          </div>

          {/* SVG GRAFIK */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-96">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="IQ spektr grafigi">
              <title>IQ spektr grafigi — K₃[Fe(CN)₆]</title>
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.0)*200} x2="580" y2={220 - (v/1.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1000, 2000, 3000, 4000].map((f, i) => (
                <g key={i}>
                  <text x={50 + (f/4000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{f}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">To'lqin soni (cm⁻¹)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish</text>

              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                points={COMPOUND.irSpectrum.map(p => {
                  const x = 50 + ((4000 - p.freq)/4000)*530
                  const y = 220 - (p.absorbance/1.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line
                x1={50 + ((4000 - currentPeak.freq)/4000)*530}
                y1="30"
                x2={50 + ((4000 - currentPeak.freq)/4000)*530}
                y2="220"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              {COMPOUND.irPeaks.map((peak, i) => {
                const x = 50 + ((4000 - peak.freq)/4000)*530
                const y = 220 - (peak.absorbance/1.0)*200
                const isActive = currentPeak.freq === peak.freq
                const isImportant = peak.freq === 2115 || peak.freq === 600
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 10 : 6}
                      fill={isActive ? "#fbbf24" : isImportant ? "#f472b6" : "#ef4444"}
                      stroke={isImportant ? "#fbbf24" : "#fff"}
                      strokeWidth={isImportant ? 3 : 2}
                    />
                    {isActive && (
                      <>
                        <text x={x} y={y - 20} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">
                          {peak.freq} cm⁻¹
                        </text>
                        <text x={x} y={y - 8} textAnchor="middle" fontSize="7" fill="#fbbf24">
                          {peak.assignment}
                        </text>
                      </>
                    )}
                    {isImportant && !isActive && (
                      <text x={x} y={y - 12} textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="bold">
                        MUHIM!
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* LABORATORIYA BAJARISH TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi (KENGAYTIRILGAN)</h2>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div key={i} className={`rounded-xl p-5 cursor-pointer transition-all ${
                activeLabStep === i ? "bg-red-900/40 border-2 border-red-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-red-500/50"
              }`}
              onClick={() => setActiveLabStep(i)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-red-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-red-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-2">
                      <div className="text-red-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-red-400 mt-2">
                      Vaqt: {step.time}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LABORATORIYA NATIJALARI SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari solishtirish (KENGAYTIRILGAN)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">ID</th>
                  <th className="py-3 px-4 text-purple-300">Texnika</th>
                  <th className="py-3 px-4 text-purple-300">Sharoit</th>
                  <th className="py-3 px-4 text-purple-300">ν(C≡N)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Fe-C)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.labResults.map((result) => (
                  <tr
                    key={result.id}
                    onClick={() => setActiveLabResult(result.id)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeLabResult === result.id ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CN}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_FeC}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'UV-Vis farqlash' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === '1:3 elektrolit' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Prussian Blue aniqlandi' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Qaytarilish aniqlandi' ? 'bg-orange-600/30 text-orange-400' :
                        'bg-green-600/30 text-green-400'
                      }`}>
                        {result.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.labResults.find(r => r.id === activeLabResult)?.notes}
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
              <div className="text-red-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.labResults.find(r => r.id === activeLabResult)?.theoryNote}</p>
            </div>
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ Halaqit beruvchi omillar (NAZARIY IZOHLAR)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Manba</th>
                  <th className="py-3 px-4 text-purple-300">Chastota oralig'i</th>
                  <th className="py-3 px-4 text-purple-300">Ta'sir</th>
                  <th className="py-3 px-4 text-purple-300">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((interference, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeInterference === i ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">{interference.source}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{interference.freqRange}</td>
                    <td className="py-3 px-4 text-xs">{interference.effect}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        interference.severity === 'Yuqori' ? 'bg-red-600/30 text-red-400' :
                        interference.severity === 'O\'rta' ? 'bg-yellow-600/30 text-yellow-400' :
                        'bg-green-600/30 text-green-400'
                      }`}>
                        {interference.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning yechimi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].solution}
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
              <div className="text-red-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.interferences[activeInterference].theoryNote}</p>
            </div>
          </div>
        </div>

        {/* TEXNIKALAR SOLISHTIRISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Texnikalar solishtirishi (TARTIBI)</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.techniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-red-600/60 text-white border border-red-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-400 font-bold mb-3">{COMPOUND.techniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">
              {COMPOUND.techniques[activeTechnique].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.techniques[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.techniques[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].bestFor}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Chastota oralig'i:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].freqRange}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Ruxsat:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Namuna tayyorlash:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].samplePrep}</div>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-red-400">Prussian Blue sintezi:</strong> 4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ (Diesbach 1704)</li>
            <li><strong className="text-red-400">17 elektron (18 emas!):</strong> Fe³⁺ (d⁵) + 6×CN⁻ (12e) = 17 elektron — paramagnit</li>
            <li><strong className="text-red-400">IR belgisi:</strong> ν(C≡N) = 2115 cm⁻¹ (kamroq π-back-bonding), ν(Fe-C) = 600 cm⁻¹</li>
            <li><strong className="text-red-400">Oₕ simmetriya:</strong> Oktaedr, paramagnit (t₂g⁵, 1 toq elektron)</li>
            <li><strong className="text-red-400">1:3 elektrolit:</strong> 4 ion, Λm ≈ 430 S·cm²/mol</li>
            <li><strong className="text-red-400">UV-Vis λmax = 420 nm:</strong> LMCT o'tish</li>
            <li><strong className="text-red-400">Kamroq π-back-bonding:</strong> Fe³⁺ (t₂g⁵) → CN⁻ π* orbitaliga kamroq o'tadi</li>
            <li><strong className="text-red-400">⚠️ XAVFSIZLIK:</strong> KCN ajralishi mumkin — toksik! Fe²⁺ bilan Prussian Blue hosil bo'ladi.</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            Birikmalar ro'yxati →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₃[Fe(CN)₆] (Kaliy ferritsianid) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto, Sharpe (1976), Dunbar (1987), Diesbach (1704)</p>
        </div>
      </footer>
    </main>
  )
}