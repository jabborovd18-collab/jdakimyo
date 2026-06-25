"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅NO₂]Cl₂ — NITRO IZOMER IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Jorgensen (1894), Naumov (2013, Angew. Chem.), Saha (2018, RSC Adv.)
// Xususiyat: Linkage izomerizm, C₄ᵥ simmetriya, photo-salient effect
// O'ziga xoslik: N-bonded nitro, nitrito → nitro konversiyasi, DFT ωB97XD
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>NO<sub>2</sub>]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5NO2]Cl2",
  iupac: "Pentaamminnitrokobalt(III) xlorid",
  formulaExpanded: "CoN₆H₁₅O₂Cl₂",
  commonName: "Nitro-pentaammincobalt(III) xlorid (sariq)",
  molarMass: 278.44,
  casNumber: "14970-14-0",
  color: "sariq (yellow, nitro izomer)",
  structure: "Oktaedr (C₄ᵥ simmetriya)",
  metalLigand: "Co-N (NH₃), Co-N (NO₂, N-bonded)",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "C₄ᵥ (nitro izomer)",
  electrolyteType: "1:2 elektrolit (3 ion)",
  molarConductivity: "~230-260 S·cm²/mol",

  // Linkage izomerizm ma'lumotlari
  linkageInfo: {
    nitro: {
      name: "Nitro (N-bonded)",
      color: "sariq",
      bond: "Co-N (NO₂)",
      bondLength: "1.924 Å (DFT ωB97XD)",
      stability: "Barqaror (termodinamik mahsulot)",
      irSignature: "νₐₛ(NO₂) = 1430, νₛ(NO₂) = 1315 cm⁻¹"
    },
    nitrito: {
      name: "Nitrito (O-bonded)",
      color: "qizil",
      bond: "Co-O (ONO)",
      bondLength: "2.05 Å (DFT ωB97XD)",
      stability: "Nobarqaror (kinetik mahsulot)",
      irSignature: "ν(N=O) = 1460, ν(N-O) = 1065 cm⁻¹"
    },
    conversion: {
      mechanism: "Intramolekulyar, endo-nitrito orqali",
      barrier: "TS1 = 38.16 kcal/mol, TS2 = 9.68 kcal/mol (ωB97XD/6-31+G(d,p))",
      pathway: "nitro → TS1 → endo-nitrito → TS2 → exo-nitrito",
      timescale: "Qattiq holatda: sekin (kunlar), yorug'likda: tez (photo-salient)"
    }
  },

  // IQ cho'qqilari — NAZARIY IZOHLAR BILAN
  irPeaks: [
    { 
      freq: 3300, T: 14, absorbance: 0.85, 
      assignment: "νₐₛ(N-H)", 
      assignment_uz: "N-H asimetrik cho'zilish", 
      intensity: "Juda kuchli", 
      bond: "N-H", 
      symmetry: "A₁ + E (C₄ᵥ)", 
      forceConstant: "6.1 mdyn/Å", 
      theoryNote: "⭐ NH₃ ning asimetrik cho'zilishi. C₄ᵥ simmetriyada A₁ va E modlari IQ faol. Erkin NH₃ (3336 cm⁻¹) dan biroz past — koordinatsiya ta'siri."
    },
    { 
      freq: 3200, T: 28, absorbance: 0.72, 
      assignment: "νₛ(N-H)", 
      assignment_uz: "N-H simmetrik cho'zilish", 
      intensity: "Kuchli", 
      bond: "N-H", 
      symmetry: "A₁", 
      forceConstant: "5.9 mdyn/Å", 
      theoryNote: "NH₃ ning simmetrik cho'zilishi. A₁ mod IQ va Raman ikkalasida ham faol (alternativa taqiq yo'q, C₄ᵥ da inversiya yo'q)."
    },
    { 
      freq: 1580, T: 48, absorbance: 0.52, 
      assignment: "δ(NH₃)", 
      assignment_uz: "NH₃ egilish (scissoring)", 
      intensity: "O'rta", 
      bond: "NH₃", 
      symmetry: "A₁ + E", 
      forceConstant: "0.6 mdyn/Å", 
      theoryNote: "NH₃ ning deformatsion tebranishi (scissoring). Erkin NH₃ (1580 cm⁻¹) bilan deyarli bir xil."
    },
    { 
      freq: 1430, T: 38, absorbance: 0.62, 
      assignment: "νₐₛ(NO₂)", 
      assignment_uz: "NO₂ asimetrik cho'zilish (NITRO belgisi)", 
      intensity: "Kuchli", 
      bond: "NO₂", 
      symmetry: "A₁ (C₄ᵥ)", 
      forceConstant: "8.5 mdyn/Å", 
      theoryNote: "⭐⭐ MUHIM: NITRO IZOMER ASOSIY BELGISI! νₐₛ(NO₂) = 1430 cm⁻¹. N-bonded nitro belgisi. Erkin NO₂⁻ (1300 cm⁻¹) dan yuqori — N-bonding tufayli. ωB97XD/6-31+G(d,p) bo'yicha tasdiqlangan."
    },
    { 
      freq: 1315, T: 45, absorbance: 0.55, 
      assignment: "νₛ(NO₂)", 
      assignment_uz: "NO₂ simmetrik cho'zilish (NITRO belgisi)", 
      intensity: "Kuchli", 
      bond: "NO₂", 
      symmetry: "A₁", 
      forceConstant: "7.8 mdyn/Å", 
      theoryNote: "⭐⭐ MUHIM: NITRO IZOMER IKKINCHI BELGISI! νₛ(NO₂) = 1315 cm⁻¹. Δν = νₐₛ − νₛ = 115 cm⁻¹. Bu katta farq N-bonding tufayli. Nitrito izomerda bu cho'qqilar yo'q (1460, 1065 cm⁻¹)."
    },
    { 
      freq: 1320, T: 62, absorbance: 0.38, 
      assignment: "δₛ(NH₃)", 
      assignment_uz: "NH₃ simmetrik egilish (umbrella)", 
      intensity: "O'rta-zaif", 
      bond: "NH₃", 
      symmetry: "A₁", 
      forceConstant: "0.5 mdyn/Å", 
      theoryNote: "NH₃ ning 'soyabon' (umbrella) tebranishi. Erkin NH₃ (950 cm⁻¹) dan yuqori — koordinatsiya ta'siri."
    },
    { 
      freq: 830, T: 52, absorbance: 0.48, 
      assignment: "ρ(NH₃)", 
      assignment_uz: "NH₃ rocking (tebranish)", 
      intensity: "O'rta", 
      bond: "NH₃", 
      symmetry: "E", 
      forceConstant: "0.4 mdyn/Å", 
      theoryNote: "NH₃ ning rocking tebranishi."
    },
    { 
      freq: 825, T: 55, absorbance: 0.45, 
      assignment: "δ(ONO) wag", 
      assignment_uz: "NO₂ wagging (NITRO belgisi)", 
      intensity: "O'rta", 
      bond: "NO₂", 
      symmetry: "E (C₄ᵥ)", 
      forceConstant: "0.4 mdyn/Å", 
      theoryNote: "⭐ UCHINCHI NITRO BELGISI! δ(ONO) wag = 825 cm⁻¹. Penland (1956) bo'yicha nitro signal. Nitrito izomerda bu cho'qqi yo'q."
    },
    { 
      freq: 440, T: 40, absorbance: 0.62, 
      assignment: "ν(Co-N)", 
      assignment_uz: "Co-N cho'zilish (NH₃)", 
      intensity: "Kuchli", 
      bond: "Co-N(NH₃)", 
      symmetry: "A₁ + E", 
      forceConstant: "1.7 mdyn/Å", 
      theoryNote: "Co-N bog'ining cho'zilishi (NH₃ uchun). ωB97XD bo'yicha Co-N = 1.97-2.01 Å."
    },
    { 
      freq: 340, T: 55, absorbance: 0.42, 
      assignment: "δ(Co-N-O)", 
      assignment_uz: "Co-N-O egilish deformatsiya", 
      intensity: "O'rta-zaif", 
      bond: "Co-N-O", 
      symmetry: "E", 
      forceConstant: "0.3 mdyn/Å", 
      theoryNote: "Co-N-O burchakning deformatsiyasi."
    },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.02 }, { freq: 3500, absorbance: 0.03 },
    { freq: 3300, absorbance: 0.85 }, { freq: 3200, absorbance: 0.72 },
    { freq: 2000, absorbance: 0.05 }, { freq: 1580, absorbance: 0.52 },
    { freq: 1430, absorbance: 0.62 }, { freq: 1315, absorbance: 0.55 },
    { freq: 1320, absorbance: 0.38 }, { freq: 1000, absorbance: 0.10 },
    { freq: 830, absorbance: 0.48 }, { freq: 825, absorbance: 0.45 },
    { freq: 440, absorbance: 0.62 }, { freq: 340, absorbance: 0.42 },
    { freq: 200, absorbance: 0.02 },
  ],

  // Turli erituvchilarda — NAZARIY IZOHLAR
  solventData: [
    { 
      solvent: "Suv (H₂O)", dielectric: 78.5, lm: 250, kappa: 0.0250, color: "sariq", 
      note: "Suvda sekin konversiya: nitrito → nitro. 24 soatda to'liq konversiya.",
      theoryNote: "Suvda sekin intramolekulyar konversiya: nitrito → TS1 → endo-nitrito → TS2 → nitrito. ωB97XD bo'yicha TS1 = 38.16 kcal/mol."
    },
    { 
      solvent: "DMF", dielectric: 36.7, lm: 255, kappa: 0.0255, color: "sariq", 
      note: "DMF da tezroq konversiya. DMF qutbli erituvchi — konversiya tezlashadi.",
      theoryNote: "DMF qutbli erituvchi — konversiya tezlashadi. Jackson (1988) bo'yicha DMF da konversiya tezroq."
    },
    { 
      solvent: "Qattiq holat (qorong'i)", dielectric: "—", lm: 250, kappa: "—", color: "sariq", 
      note: "Qattiq holatda sekin konversiya (kunlar). Qorong'i xonada sekin.",
      theoryNote: "Qattiq holatda intramolekulyar konversiya sekin. Naumov (2013) bo'yicha qorong'ida sekin."
    },
    { 
      solvent: "Qattiq holat (yorug'lik)", dielectric: "—", lm: 250, kappa: "—", color: "sariq → qizil", 
      note: "Yorug'likda tez konversiya (photo-salient effect). Kristall sakraydi!",
      theoryNote: "Photo-salient effect (Naumov 2013, Angew. Chem.). UV yorug'lik yoki quyosh nuri ta'sirida kristall sakraydi — photo-isomerization."
    },
    { 
      solvent: "DMSO", dielectric: 46.7, lm: 260, kappa: 0.0260, color: "sariq", 
      note: "DMSO da konversiya tezroq. DMSO qutbli erituvchi.",
      theoryNote: "DMSO qutbli erituvchi — konversiya tezlashadi."
    },
  ],

  // Halaqit beruvchi omillar — NAZARIY IZOHLAR
  interferences: [
    { 
      source: "CO₂ (atmosfera)", freqRange: "2350, 667 cm⁻¹", 
      effect: "CO₂ cho'qqilari — NO₂ sohasiga aralashishi mumkin (2350 cm⁻¹)", 
      severity: "O'rta", 
      solution: "Spektrometrni N₂ bilan tozalash yoki CO₂ absorber ishlatish.",
      theoryNote: "CO₂ ning IQ cho'qqilari 2350 va 667 cm⁻¹ da — bu NO₂ cho'qqilariga (1430, 1315 cm⁻¹) aralashmaydi, lekin 667 cm⁻¹ da aralashishi mumkin."
    },
    { 
      source: "Suv (H₂O)", freqRange: "3400, 1640 cm⁻¹", 
      effect: "Keng suv cho'qqilari — N-H sohasiga aralashadi", 
      severity: "Yuqori", 
      solution: "KBr ni 110°C da 2 soat quritish. Namuna quritgichda saqlash.",
      theoryNote: "Suv cho'qqilari 3400 va 1640 cm⁻¹ da — bu N-H cho'qqilariga (3300, 3200 cm⁻¹) aralashadi."
    },
    { 
      source: "Namuna parchalanishi", freqRange: "Barcha", 
      effect: "NO₂ ajralishi — cho'qqilar o'zgaradi", 
      severity: "O'rta", 
      solution: "Qorong'i xona, past harorat. Tez o'lchash.",
      theoryNote: "[Co(NH₃)₅NO₂]Cl₂ yorug'lik ta'sirida sekin parchalanadi."
    },
    { 
      source: "Nitrito izomer aralashmasi", freqRange: "1460, 1065 cm⁻¹", 
      effect: "Nitrito cho'qqilari aralashishi mumkin (1460, 1065 cm⁻¹)", 
      severity: "Yuqori", 
      solution: "Sof nitro izomer ishlatish. Sof nitrito bilan solishtirish.",
      theoryNote: "Nitrito izomerda ν(N=O) = 1460 va ν(N-O) = 1065 cm⁻¹ cho'qqilari bor. Sof nitro da bu cho'qqilar yo'q."
    },
    { 
      source: "Harorat ta'siri", freqRange: "Barcha", 
      effect: "Harorat oshishi — konversiya tezlashadi", 
      severity: "O'rta", 
      solution: "Past haroratda saqlash (4°C). Tez o'lchash.",
      theoryNote: "Harorat oshishi konversiya tezligini oshiradi. ωB97XD bo'yicha TS1 = 38.16 kcal/mol."
    },
  ],

  // Texnikalar — NAZARIY IZOHLAR
  techniques: [
    { 
      name: "KBr tabletka (nitro)", 
      description: "Sof nitro izomerni KBr bilan tabletka qilish", 
      advantages: [
        "Eng aniq va an'anaviy usul",
        "NO₂ cho'qqilari aniq ko'rinadi (1430, 1315, 825 cm⁻¹)",
        "Nitrito bilan solishtirish mumkin",
        "Kvantitativ tahlil uchun qulay"
      ], 
      disadvantages: [
        "Namuna tayyorlash kerak (10-15 daq)",
        "KBr nam bo'lsa, suv cho'qqilari aralashadi",
        "Nitrito aralashmasi mumkin",
        "Faqat bitta izomer uchun"
      ], 
      bestFor: "Aniq kvantitativ tahlil, nitro izomer", 
      freqRange: "4000-400 cm⁻¹", 
      resolution: "4 cm⁻¹", 
      samplePrep: "10-15 daq"
    },
    { 
      name: "KBr tabletka (nitrito)", 
      description: "Sof nitrito izomerni KBr bilan tabletka qilish", 
      advantages: [
        "Nitrito cho'qqilari aniq ko'rinadi (1460, 1065 cm⁻¹)",
        "Nitro bilan solishtirish mumkin",
        "Konversiya kuzatish mumkin"
      ], 
      disadvantages: [
        "Nitrito nobarqaror — tez konversiya",
        "Namuna tayyorlash qiyin",
        "Qorong'i xona kerak"
      ], 
      bestFor: "Nitrito izomer, konversiya kuzatish", 
      freqRange: "4000-400 cm⁻¹", 
      resolution: "4 cm⁻¹", 
      samplePrep: "15-20 daq (qorong'ida)"
    },
    { 
      name: "DSC (Differential Scanning Calorimetry)", 
      description: "Termal konversiyani kuzatish", 
      advantages: [
        "Termal konversiya kinetikasini o'lchash",
        "ΔH, ΔS parametrlarini o'lchash",
        "To'g'ridan-to'g'ri termal kuzatish"
      ], 
      disadvantages: [
        "Qimmat uskuna",
        "Murakkab tahlil",
        "Faqat termal konversiya uchun"
      ], 
      bestFor: "Termal konversiya, ΔH/ΔS", 
      freqRange: "—", 
      resolution: "—", 
      samplePrep: "30-60 daq"
    },
    { 
      name: "Photo-salient effect testi", 
      description: "UV yorug'lik ta'sirida kristall sakrashini kuzatish", 
      advantages: [
        "Photo-salient effect ni ko'rish",
        "Photo-isomerization ni kuzatish",
        "Vizual ravishda jozibali"
      ], 
      disadvantages: [
        "UV uskuna kerak",
        "Kristall sifati muhim",
        "Faqat photo-salient uchun"
      ], 
      bestFor: "Photo-salient effect, photo-isomerization", 
      freqRange: "—", 
      resolution: "—", 
      samplePrep: "10-15 daq"
    },
  ],

  // Laboratoriya bajarish tartibi — KENGAYTIRILGAN
  labProcedure: [
    { 
      step: 1, 
      title: "⚠️ Xavfsizlik tayyorgarligi", 
      desc: "Qorong'i xona, qo'lqop, ko'zoynak. NO₂⁻ toksik, Co toksik. Ventilyatsiya.",
      time: "15 daq",
      theoryNote: "NO₂⁻ toksik — nafas yo'llarini tirnaydi. Co toksik — teri va ko'zga zarar. Qorong'i xona — photo-isomerization ning oldini olish."
    },
    { 
      step: 2, 
      title: "Sof nitro izomerni tayyorlash", 
      desc: "Sof [Co(NH₃)₅NO₂]Cl₂ ni sintez qilish yoki sotib olish. Qorong'ida saqlash.",
      time: "1-2 soat (sintez) yoki tayyor",
      theoryNote: "Jorgensen (1894) bo'yicha sintez. Qorong'ida saqlash — photo-isomerization ning oldini olish."
    },
    { 
      step: 3, 
      title: "IQ spektrometrni tayyorlash", 
      desc: "Spektrometrni yoqish, 30 daq isitish. Fon spektrini olish. N₂ bilan tozalash.",
      time: "30 daq",
      theoryNote: "Spektrometr N₂ bilan tozalanadi — CO₂ cho'qqilari (2350 cm⁻¹) aralashmasligi uchun."
    },
    { 
      step: 4, 
      title: "KBr tabletka tayyorlash", 
      desc: "1 mg namuna + 200 mg KBr. Gidravlik press bilan tabletka bosish.",
      time: "10-15 daq",
      theoryNote: "KBr tabletka — an'anaviy usul. KBr nam bo'lmasligi kerak — suv cho'qqilari aralashmasligi uchun."
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
      title: "Nitro/nitrito farqlash", 
      desc: "νₐₛ(NO₂) 1430 cm⁻¹ ni tekshirish. νₛ(NO₂) 1315 cm⁻¹ ni tekshirish. δ(ONO) wag 825 cm⁻¹ ni tekshirish.",
      time: "5 daq",
      theoryNote: "νₐₛ(NO₂) = 1430 cm⁻¹ — NITRO IZOMER ASOSIY BELGISI. νₛ(NO₂) = 1315 cm⁻¹ — ikkinchi belgi. δ(ONO) wag = 825 cm⁻¹ — uchinchi belgi."
    },
    { 
      step: 7, 
      title: "Konversiya kuzatish (ixtiyoriy)", 
      desc: "Namunani 24 soat qorong'ida saqlash. Keyin spektrlarni qayta o'lchash.",
      time: "24 soat (ixtiyoriy)",
      theoryNote: "Qorong'ida sekin konversiya: nitrito → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → nitrito. ωB97XD/6-31+G(d,p) bo'yicha."
    },
    { 
      step: 8, 
      title: "Ma'lumotlarni tahlil qilish", 
      desc: "νₐₛ(NO₂) 1430, νₛ(NO₂) 1315, δ(ONO) wag 825 cm⁻¹ cho'qqilarini tekshirish. Nitrito cho'qqilari yo'qligini tekshirish (1460, 1065 cm⁻¹).",
      time: "10 daq",
      theoryNote: "Sof nitro da νₐₛ(NO₂) = 1430, νₛ(NO₂) = 1315, δ(ONO) wag = 825 cm⁻¹ cho'qqilari bor. Nitrito cho'qqilari (1460, 1065 cm⁻¹) yo'q."
    },
  ],

  // Laboratoriya natijalari — KENGAYTIRILGAN, NAZARIY IZOHLAR BILAN
  labResults: [
    { 
      id: "LAB-001", 
      technique: "KBr tabletka (nitro)", 
      condition: "Sof nitro izomer, KBr tabletka", 
      freq_NO2: "1430, 1315, 825", 
      freq_CoN: "440", 
      quality: "A'lo",
      notes: "Sof nitro izomer — νₐₛ(NO₂) = 1430, νₛ(NO₂) = 1315, δ(ONO) wag = 825 cm⁻¹ cho'qqilari aniq. Nitrito cho'qqilari (1460, 1065 cm⁻¹) yo'q. Bu sof nitro izomer belgisi.",
      theoryNote: "ωB97XD/6-31+G(d,p) bo'yicha tasdiqlangan. N-bonded nitro belgisi. Co-N bog' uzunligi 1.924 Å."
    },
    { 
      id: "LAB-002", 
      technique: "KBr tabletka (nitrito)", 
      condition: "Sof nitrito izomer, KBr tabletka (qorong'ida)", 
      freq_NO2: "1460, 1065", 
      freq_CoN: "340", 
      quality: "A'lo (qorong'ida)",
      notes: "Sof nitrito izomer — ν(N=O) = 1460, ν(N-O) = 1065 cm⁻¹ cho'qqilari aniq. Nitro cho'qqilari (1430, 1315, 825 cm⁻¹) yo'q. Bu sof nitrito izomer belgisi.",
      theoryNote: "O-bonded nitrito belgisi. Co-O bog' uzunligi 2.05 Å. Nitrito nobarqaror — qorong'ida saqlash kerak."
    },
    { 
      id: "LAB-003", 
      technique: "Konversiya kuzatish (24 soat, qorong'i)", 
      condition: "Nitrito → nitrito konversiyasi, 24 soat, qorong'i", 
      freq_NO2: "1460→1430, 1065→1315", 
      freq_CoN: "340→440", 
      quality: "Konversiya kuzatildi",
      notes: "24 soat qorong'ida — nitrito cho'qqilari (1460, 1065 cm⁻¹) nitrito cho'qqilariga (1430, 1315 cm⁻¹) aylandi. Bu intramolekulyar konversiya.",
      theoryNote: "Intramolekulyar konversiya: nitrito → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → nitrito. ωB97XD/6-31+G(d,p) bo'yicha."
    },
    { 
      id: "LAB-004", 
      technique: "DSC (Differential Scanning Calorimetry)", 
      condition: "Termal konversiya, DSC", 
      freq_NO2: "—", 
      freq_CoN: "—", 
      quality: "Termal konversiya",
      notes: "DSC — termal konversiya kuzatildi. ΔH va ΔS parametrlari o'lchandi. Konversiya ekzotermik (ΔH < 0).",
      theoryNote: "DSC — termal konversiya kinetikasini o'lchash. ΔH va ΔS parametrlari o'lchanadi."
    },
    { 
      id: "LAB-005", 
      technique: "Photo-salient effect testi", 
      condition: "UV yorug'lik ta'siri, kristall sakrash", 
      freq_NO2: "—", 
      freq_CoN: "—", 
      quality: "Photo-salient kuzatildi",
      notes: "UV yorug'lik ta'sirida kristall sakraydi — photo-salient effect (Naumov 2013, Angew. Chem.). Photo-isomerization kuzatildi.",
      theoryNote: "Photo-salient effect (Naumov 2013, Angew. Chem.). UV yorug'lik yoki quyosh nuri ta'sirida kristall sakraydi — photo-isomerization."
    },
    { 
      id: "LAB-006", 
      technique: "UV-Vis spektroskopiya", 
      condition: "UV-Vis, suvda", 
      freq_NO2: "—", 
      freq_CoN: "—", 
      quality: "UV-Vis farqlash",
      notes: "UV-Vis: nitro λmax = 350 nm, nitrito λmax = 370 nm. Bu nitro/nitrito farqlash usuli.",
      theoryNote: "UV-Vis: nitro va nitrito izomerlar turli λmax ga ega. Bu nitro/nitrito farqlash usuli."
    },
  ],
}

export default function CoNH35NO2Cl2Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(1430)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [conversionTemp, setConversionTemp] = useState(25)

  const [calcDq, setCalcDq] = useState(23000)
  const [calcP, setCalcP] = useState(21000)
  const [calcUnpairedElectrons, setCalcUnpairedElectrons] = useState(0)

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
    const cfse = -2.4 * calcDq + 2 * calcP
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = -2.4×Δₒ + 2P"
    }
  }, [calcDq, calcP])

  const muResult = useMemo(() => {
    const mu = Math.sqrt(calcUnpairedElectrons * (calcUnpairedElectrons + 2))
    return { mu: mu.toFixed(2), n: calcUnpairedElectrons }
  }, [calcUnpairedElectrons])

  // Konversiya kinetikasi kalkulyatori
  const conversionResult = useMemo(() => {
    const T = conversionTemp + 273.15
    const R = 8.314
    const Ea_TS1 = 38.16 * 4184 // kcal/mol → J/mol
    const Ea_TS2 = 9.68 * 4184
    const A = 1e12
    const k_TS1 = A * Math.exp(-Ea_TS1 / (R * T))
    const k_TS2 = A * Math.exp(-Ea_TS2 / (R * T))
    const t_half_TS1 = Math.log(2) / k_TS1
    const t_half_TS2 = Math.log(2) / k_TS2
    return {
      k_TS1: k_TS1.toExponential(3),
      k_TS2: k_TS2.toExponential(3),
      t_half_TS1_hours: (t_half_TS1 / 3600).toFixed(1),
      t_half_TS2_hours: (t_half_TS2 / 3600).toFixed(1),
      rateLimiting: "TS1 (38.16 kcal/mol)"
    }
  }, [conversionTemp])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚗️</span> [Co(NH₃)₅NO₂]Cl₂ — LINKAGE IZOMERIZM!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Co(NH₃)₅NO₂]Cl₂</strong> — linkage izomerizmning klassik namunasi (Jorgensen 1894).
              C₄ᵥ simmetriya, N-bonded nitro, photo-salient effect!
            </p>

            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">📊 Asosiy cho'qqilar (NITRO):</div>
                  <div className="text-purple-200">
                    <strong>νₐₛ(NO₂):</strong> 1430 cm⁻¹ (N-bonded)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>νₛ(NO₂):</strong> 1315 cm⁻¹ (N-bonded)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>δ(ONO) wag:</strong> 825 cm⁻¹ (nitro signal)
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Konduktometriya:</div>
                  <div className="text-purple-200">
                    <strong>Λm ≈ 230-260 S·cm²/mol</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>1:2 elektrolit</strong> (3 ion)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Linkage izomerizm:</strong> NO₂⁻ ambidentat ligand — N yoki O orqali bog'lanishi mumkin.
                Nitro (N-bonded, sariq) vs Nitrito (O-bonded, qizil).
              </p>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong className="text-yellow-300">⚠️ XAVFSIZLIK:</strong> NO₂⁻ toksik, Co toksik. Qorong'i xona, qo'lqop, ko'zoynak kerak!
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-yellow-400 font-semibold">[Co(NH₃)₅NO₂]Cl₂</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">1:2 elektrolit</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Linkage izomer</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">C₄ᵥ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Photo-salient</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Oktaedr</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁶</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Linkage izomer</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Photo-salient</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Co(NH₃)₅NO₂]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            pentaamminnitrokobalt(III) xlorid — <span className="text-yellow-400 italic">&quot;Linkage izomerizm namunasi (Jorgensen 1894, Photo-salient effect Naumov 2013)&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> KBr tabletka usulida 4000−400 cm⁻¹
            oralig'ida olingan. Eng muhim diagnostik signallar:
            <strong className="text-yellow-400"> νₐₛ(NO₂) 1430, νₛ(NO₂) 1315, δ(ONO) wag 825 cm⁻¹</strong> — NITRO izomer belgilari;
            <strong className="text-yellow-400"> ν(Co-N) 440 cm⁻¹</strong> — Co-N bog'i.
            Bu kompleks linkage izomerizmning klassik namunasi (Jorgensen 1894).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfiguratsiya</div>
              <div className="text-white font-bold">d⁶ (past spin)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">C₄ᵥ (nitro)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:2 (3 ion)</div>
            </div>
          </div>
        </div>

        {/* LINKAGE IZOMERIZM */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Linkage izomerizm — NO₂⁻ ambidentat ligand</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Nitro izomer (N-bonded)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-yellow-400">Co-N (NO₂)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-N bog' uzunligi:</span>
                  <span className="text-yellow-400">1.924 Å (ωB97XD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IR belgisi:</span>
                  <span className="text-yellow-400">1430, 1315, 825 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-yellow-400 font-bold">Barqaror (termodinamik)</span>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Nitrito izomer (O-bonded)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-red-400">Qizil</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-red-400">Co-O (ONO)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-O bog' uzunligi:</span>
                  <span className="text-red-400">2.05 Å (ωB97XD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IR belgisi:</span>
                  <span className="text-red-400">1460, 1065 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-red-400 font-bold">Nobarqaror (kinetik)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Konversiya mexanizmi (ωB97XD/6-31+G(d,p)):</strong> nitrito → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → nitrito.
              Intramolekulyar mexanizm. Qorong'ida sekin, yorug'likda tez (photo-salient effect, Naumov 2013).
            </p>
          </div>
        </div>

        {/* KONVERSIYA KINETIKASI KALKULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⏱️ Konversiya kinetikasi kalkulyatori (ωB97XD)</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">Konversiya mexanizmi:</strong> nitrito → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → nitrito.
            Haroratni o'zgartiring, tezlik konstantalarini ko'ring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Harorat: {conversionTemp}°C ({(conversionTemp + 273.15).toFixed(1)} K)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={conversionTemp}
              onChange={(e) => setConversionTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Haroratni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0°C</span>
              <span>50°C</span>
              <span>100°C</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-purple-400">k_TS1 (TS1, 38.16 kcal/mol):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{conversionResult.k_TS1} s⁻¹</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">k_TS2 (TS2, 9.68 kcal/mol):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{conversionResult.k_TS2} s⁻¹</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Rate-limiting:</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{conversionResult.rateLimiting}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-purple-400">t₁/₂ (TS1):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{conversionResult.t_half_TS1_hours} soat</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">t₁/₂ (TS2):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{conversionResult.t_half_TS2_hours} soat</div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>ωB97XD/6-31+G(d,p) bo'yicha:</strong> TS1 (38.16 kcal/mol) — rate-limiting step.
              TS2 (9.68 kcal/mol) — tezroq. Intramolekulyar mexanizm (Saha 2018, RSC Adv.).
            </p>
          </div>
        </div>

        {/* C₄ᵥ SIMMETRIYA VA ALTERNATIVA TAQIQ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 C₄ᵥ simmetriya — alternativa taqiq yo'q</h2>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">C₄ᵥ simmetriya va alternativa taqiq</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-green-400 font-bold">IQ-faol modlar:</span>
                <span className="text-purple-200"> A₁, E (asimetrik modlar)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-blue-400 font-bold">Raman-faol modlar:</span>
                <span className="text-purple-200"> A₁, E (simmetrik modlar)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-yellow-400 font-bold">Alternativa taqiq:</span>
                <span className="text-purple-200"> YO'Q! (C₄ᵥ da inversiya yo'q)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-yellow-400 font-bold">NO₂ cho'qqilari:</span>
                <span className="text-purple-200"> 1430, 1315, 825 cm⁻¹ (NITRO)</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> νₐₛ(NO₂) = 1430, νₛ(NO₂) = 1315, δ(ONO) wag = 825 cm⁻¹ — NITRO IZOMER BELGILARI.
              Erkin NO₂⁻ (1300 cm⁻¹) dan yuqori — N-bonding tufayli. ωB97XD/6-31+G(d,p) bo'yicha tasdiqlangan.
            </p>
          </div>
        </div>

        {/* INTERAKTIV IQ SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi (NITRO izomer)</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            Slayderni harakatlantirib, chastotani o'zgartiring. Eng yaqin cho'qqi avtomatik tanlanadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
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
              <span>200 cm⁻¹ (M-L)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (N-H)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin soni:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.forceConstant}</div>
              </div>
            </div>
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
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
              <title>IQ spektr grafigi — [Co(NH₃)₅NO₂]Cl₂ (nitro izomer)</title>
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
                stroke="#eab308"
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
                const isImportant = peak.freq === 1430 || peak.freq === 1315 || peak.freq === 825 || peak.freq === 440
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 10 : 6}
                      fill={isActive ? "#fbbf24" : isImportant ? "#f472b6" : "#eab308"}
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

          <div className="flex flex-wrap gap-3">
            {COMPOUND.irPeaks.map((p, i) => {
              const isImportant = p.freq === 1430 || p.freq === 1315 || p.freq === 825 || p.freq === 440
              return (
                <button
                  key={i}
                  onClick={() => setActivePeak(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    activePeak === i ? 'border-yellow-400 bg-yellow-900/30' :
                    isImportant ? 'border-pink-400 bg-pink-900/20' :
                    'border-yellow-400/40 bg-yellow-900/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePeak === i ? 'bg-yellow-400' : isImportant ? 'bg-pink-400' : 'bg-yellow-400'}`} />
                  <span className="font-mono text-yellow-400">{p.freq}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isImportant && <span className="text-[10px] text-yellow-400 font-bold">(⭐)</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali (NITRO izomer)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota</th>
                  <th className="py-3 px-4 text-purple-300">T%</th>
                  <th className="py-3 px-4 text-purple-300">Belgilanish</th>
                  <th className="py-3 px-4 text-purple-300">Tavsif</th>
                  <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                  <th className="py-3 px-4 text-purple-300">Bog'</th>
                  <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.irPeaks.map((p, i) => {
                  const isImportant = p.freq === 1430 || p.freq === 1315 || p.freq === 825 || p.freq === 440
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-yellow-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-yellow-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-yellow-400">⭐</span>}
                      </td>
                      <td className="py-3 px-4">{p.T}%</td>
                      <td className="py-3 px-4 font-mono">{p.assignment}</td>
                      <td className="py-3 px-4 text-xs">{p.assignment_uz}</td>
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
                      <td className="py-3 px-4 font-mono text-yellow-400">{p.bond}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> νₐₛ(NO₂) = 1430, νₛ(NO₂) = 1315, δ(ONO) wag = 825 cm⁻¹ — NITRO IZOMER BELGILARI.
              Δν = νₐₛ − νₛ = 115 cm⁻¹. Bu katta farq N-bonding tufayli. Nitrito izomerda bu cho'qqilar yo'q (1460, 1065 cm⁻¹).
            </p>
          </div>
        </div>

        {/* LABORATORIYA BAJARISH TARTIBI — KENGAYTIRILGAN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi (KENGAYTIRILGAN)</h2>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div key={i} className={`rounded-xl p-5 cursor-pointer transition-all ${
                activeLabStep === i ? "bg-yellow-900/40 border-2 border-yellow-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
              }`}
              onClick={() => setActiveLabStep(i)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-2">
                      <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-yellow-400 mt-2">
                      Vaqt: {step.time}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LABORATORIYA NATIJALARI SOLISHTIRISH — KENGAYTIRILGAN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari solishtirish (KENGAYTIRILGAN)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">ID</th>
                  <th className="py-3 px-4 text-purple-300">Texnika</th>
                  <th className="py-3 px-4 text-purple-300">Sharoit</th>
                  <th className="py-3 px-4 text-purple-300">ν(NO₂)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-N)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.labResults.map((result) => (
                  <tr
                    key={result.id}
                    onClick={() => setActiveLabResult(result.id)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeLabResult === result.id ? 'bg-yellow-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_NO2}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CoN}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Konversiya kuzatildi' ? 'bg-orange-600/30 text-orange-400' :
                        result.quality === 'Termal konversiya' ? 'bg-orange-600/30 text-orange-400' :
                        result.quality === 'Photo-salient kuzatildi' ? 'bg-orange-600/30 text-orange-400' :
                        result.quality === 'UV-Vis farqlash' ? 'bg-blue-600/30 text-blue-400' :
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

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.labResults.find(r => r.id === activeLabResult)?.notes}
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
              <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
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
                      activeInterference === i ? 'bg-yellow-900/20' : ''
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

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning yechimi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].solution}
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
              <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
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
                    ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">{COMPOUND.techniques[activeTechnique].name}</h3>
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
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Linkage izomerizm:</strong> NO₂⁻ ambidentat ligand — N yoki O orqali bog'lanishi mumkin</li>
            <li><strong className="text-yellow-400">Nitro izomer:</strong> C₄ᵥ simmetriya, sariq rang, Λm ≈ 230-260 S·cm²/mol</li>
            <li><strong className="text-yellow-400">IR belgisi:</strong> νₐₛ(NO₂) = 1430, νₛ(NO₂) = 1315, δ(ONO) wag = 825 cm⁻¹</li>
            <li><strong className="text-yellow-400">Konversiya mexanizmi:</strong> nitrito → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → nitrito</li>
            <li><strong className="text-yellow-400">Photo-salient effect:</strong> UV yorug'likda kristall sakraydi (Naumov 2013)</li>
            <li><strong className="text-yellow-400">1:2 elektrolit:</strong> 3 ion, Λm ≈ 230-260 S·cm²/mol</li>
            <li><strong className="text-yellow-400">ωB97XD/6-31+G(d,p):</strong> Co-N bog' uzunligi 1.924 Å (nitro), 2.05 Å (nitrito)</li>
            <li><strong className="text-yellow-400">⚠️ XAVFSIZLIK:</strong> NO₂⁻ toksik, Co toksik — ehtiyot bo'ling!</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Birikmalar ro'yxati →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₅NO₂]Cl₂ (Nitro izomer) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Jorgensen (1894), Naumov (2013, Angew. Chem.), Saha (2018, RSC Adv.)</p>
        </div>
      </footer>
    </main>
  )
}