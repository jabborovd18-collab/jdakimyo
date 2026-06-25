"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Mn₂(CO)₁₀] — DIMANGANES DEKAKARBONIL IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Nakamoto, Lever, Wilkinson, Cotton, Adams (Metal Carbonyls)
// Xususiyat: Mn-Mn metal-metal bog', 18 elektron qoidasi, D₄d simmetriya
// O'ziga xoslik: Neytral molekula, noelektrolit, barcha CO terminal (bridging yo'q)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Mn<sub>2</sub>(CO)<sub>10</sub>]",
  formulaPlain: "[Mn2(CO)10]",
  iupac: "Dimanganes dekakarbonil",
  formulaExpanded: "Mn₂C₁₀O₁₀",
  commonName: "Dimanganes dekakarbonil (Manganese decacarbonyl)",
  molarMass: 341.92,
  casNumber: "14283-20-0",
  color: "oltin-sariq kristall (golden yellow crystals)",
  structure: "D₄d simmetriya (ikkita oktaedr Mn-Mn bog' orqali bog'langan)",
  metalLigand: "Mn-C (karbonil), C≡O, Mn-Mn",
  spaceGroup: "I2/a (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "D₄d (D₄d yaqin, staggered konformatsiya)",
  electrolyteType: "Noelektrolit (neytral molekula)",
  molarConductivity: "~0 S·cm²/mol",

  // 18 elektron qoidasi
  electronCount: {
    Mn0_1: "Mn⁰ (d⁷) = 7 elektron",
    Mn0_2: "Mn⁰ (d⁷) = 7 elektron",
    CO_ligands: "10 × CO (2 elektron har biri) = 20 elektron",
    Mn_Mn_bond: "Mn-Mn bog' = 2 elektron (har bir Mn ga 1 e)",
    total_per_Mn: "7 + 5×2 + 1 = 18 elektron (har bir Mn uchun)",
    rule: "18 elektron qoidasi bajariladi (har bir Mn uchun) — barqaror"
  },

  // Mn-Mn bog' ma'lumotlari
  metalBond: {
    bondType: "Mn-Mn single bond",
    bondLength: "2.90 Å (eksperimental), 2.88 Å (DFT)",
    bondEnergy: "~150 kJ/mol (taxminan)",
    significance: "Metal-metal bog' — metal karbonil klasterlarining asosiy xususiyati"
  },

  // Konformatsiya
  conformation: {
    type: "Staggered (D₄d)",
    description: "Ikkita Mn(CO)₅ guruhi bir-biriga nisbatan staggered (staggered konformatsiya)",
    alternative: "Eclipsed (D₄ₕ) — yuqori energiyali, noqulay",
    energyDifference: "Eclipsed - Staggered ≈ 5-10 kJ/mol (DFT)"
  },

  // IQ cho'qqilari — NAZARIY IZOHLAR BILAN
  irPeaks: [
    { 
      freq: 2045, T: 10, absorbance: 0.90, 
      assignment: "νₐₛ(C≡O)", 
      assignment_uz: "C≡O asimetrik cho'zilish (terminal CO, axial)", 
      intensity: "Juda kuchli", 
      bond: "C≡O (axial)", 
      symmetry: "E₁ (D₄d)", 
      forceConstant: "16.8 mdyn/Å", 
      theoryNote: "⭐ Terminal CO ning asimetrik cho'zilishi (axial CO). Erkin CO (2143 cm⁻¹) dan past — π-back-bonding tufayli C≡O bog' kuchsizlanadi. π-back-bonding: Mn⁰ (d⁷) elektronlari CO ning π* orbitaliga o'tadi."
    },
    { 
      freq: 2013, T: 12, absorbance: 0.88, 
      assignment: "νₐₛ(C≡O)", 
      assignment_uz: "C≡O asimetrik cho'zilish (terminal CO, ekvatorial)", 
      intensity: "Juda kuchli", 
      bond: "C≡O (equatorial)", 
      symmetry: "E₂ (D₄d)", 
      forceConstant: "16.5 mdyn/Å", 
      theoryNote: "⭐ Terminal CO ning asimetrik cho'zilishi (ekvatorial CO). Ekvatorial CO bog'lari biroz kuchsizroq (axial CO ga qaraganda)."
    },
    { 
      freq: 1983, T: 18, absorbance: 0.82, 
      assignment: "νₛ(C≡O)", 
      assignment_uz: "C≡O simmetrik cho'zilish (terminal CO)", 
      intensity: "Kuchli", 
      bond: "C≡O", 
      symmetry: "A₁ (Raman)", 
      forceConstant: "16.2 mdyn/Å", 
      theoryNote: "C≡O simmetrik cho'zilish. A₁ mod faqat Raman faol (D₄d da inversiya yo'q, lekin simmetriya cheklovlari bor)."
    },
    { 
      freq: 458, T: 40, absorbance: 0.62, 
      assignment: "νₐₛ(Mn-C)", 
      assignment_uz: "Mn-C asimetrik cho'zilish (axial CO)", 
      intensity: "Kuchli", 
      bond: "Mn-C (axial)", 
      symmetry: "E₁ (D₄d)", 
      forceConstant: "2.1 mdyn/Å", 
      theoryNote: "Mn-C bog'ining asimetrik cho'zilishi (axial CO uchun). π-back-bonding tufayli Mn-C bog' kuchli."
    },
    { 
      freq: 422, T: 45, absorbance: 0.55, 
      assignment: "νₐₛ(Mn-C)", 
      assignment_uz: "Mn-C asimetrik cho'zilish (ekvatorial CO)", 
      intensity: "Kuchli", 
      bond: "Mn-C (equatorial)", 
      symmetry: "E₂ (D₄d)", 
      forceConstant: "1.9 mdyn/Å", 
      theoryNote: "Mn-C bog'ining asimetrik cho'zilishi (ekvatorial CO uchun)."
    },
    { 
      freq: 160, T: 70, absorbance: 0.38, 
      assignment: "ν(Mn-Mn)", 
      assignment_uz: "Mn-Mn cho'zilish (metal-metal bog')", 
      intensity: "O'rta-zaif", 
      bond: "Mn-Mn", 
      symmetry: "A₁ (D₄d)", 
      forceConstant: "1.2 mdyn/Å", 
      theoryNote: "⭐⭐ MUHIM: Mn-Mn bog'ining cho'zilishi. Bu [Mn₂(CO)₁₀] ning ASOSIY BELGISI! Mn-Mn bog' uzunligi 2.90 Å. Bu bog' energiyasi ~150 kJ/mol. Far-IR soha (160 cm⁻¹)."
    },
    { 
      freq: 380, T: 55, absorbance: 0.42, 
      assignment: "δ(C-Mn-C)", 
      assignment_uz: "C-Mn-C egilish (axial-ekvatorial)", 
      intensity: "O'rta", 
      bond: "C-Mn-C", 
      symmetry: "E₁ (D₄d)", 
      forceConstant: "0.5 mdyn/Å", 
      theoryNote: "C-Mn-C burchakning deformatsiyasi (axial-ekvatorial burchak)."
    },
    { 
      freq: 340, T: 60, absorbance: 0.38, 
      assignment: "δ(Mn-C-O)", 
      assignment_uz: "Mn-C-O egilish", 
      intensity: "O'rta-zaif", 
      bond: "Mn-C-O", 
      symmetry: "E₂ (D₄d)", 
      forceConstant: "0.4 mdyn/Å", 
      theoryNote: "Mn-C-O burchakning deformatsiyasi."
    },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.02 }, { freq: 3500, absorbance: 0.03 },
    { freq: 2500, absorbance: 0.05 }, { freq: 2045, absorbance: 0.90 },
    { freq: 2013, absorbance: 0.88 }, { freq: 1983, absorbance: 0.82 },
    { freq: 1500, absorbance: 0.08 }, { freq: 1000, absorbance: 0.06 },
    { freq: 458, absorbance: 0.62 }, { freq: 422, absorbance: 0.55 },
    { freq: 380, absorbance: 0.42 }, { freq: 340, absorbance: 0.38 },
    { freq: 160, absorbance: 0.38 }, { freq: 200, absorbance: 0.02 },
  ],

  // Turli erituvchilarda — NAZARIY IZOHLAR
  solventData: [
    { 
      solvent: "Suv (H₂O)", dielectric: 78.5, lm: 0, kappa: 0.0000, color: "erimaydi", 
      note: "⚠️ Suvda ERIMAYDI! [Mn₂(CO)₁₀] neytral molekula, nopolar. Sekin gidroliz (CO ajralishi).",
      theoryNote: "Neytral molekula suvda erimaydi (nopolar). Sekin gidroliz: Mn₂(CO)₁₀ + H₂O → MnO + 10CO (sekin)."
    },
    { 
      solvent: "Geptan (C₇H₁₆)", dielectric: 1.9, lm: 0, kappa: 0.0000, color: "oltin-sariq", 
      note: "Nopolar erituvchi — yaxshi eriydi. ν(C≡O) 2045, 2013 cm⁻¹ da aniq.",
      theoryNote: "Nopolar erituvchi [Mn₂(CO)₁₀] ni yaxshi eritadi. π-back-bonding tufayli C≡O bog' kuchsizlanadi (2143 → 2045 cm⁻¹)."
    },
    { 
      solvent: "Toluen (C₆H₅CH₃)", dielectric: 2.4, lm: 0, kappa: 0.0000, color: "oltin-sariq", 
      note: "Nopolar aromatik — yaxshi eriydi. ν(C≡O) 2044, 2012 cm⁻¹ da aniq.",
      theoryNote: "Aromatik erituvchi yaxshi eritadi. π-π stacking mumkin (kam ta'sir)."
    },
    { 
      solvent: "THF (Tetragidrofuran)", dielectric: 7.6, lm: 0, kappa: 0.0000, color: "oltin-sariq", 
      note: "Qutbli organik — yaxshi eriydi. THF sekin ligand almashinishi mumkin.",
      theoryNote: "THF qutbli erituvchi. Sekin ligand almashinishi mumkin (THF → CO)."
    },
    { 
      solvent: "CCl₄ (Karbon tetraxlorid)", dielectric: 2.2, lm: 0, kappa: 0.0000, color: "oltin-sariq", 
      note: "Nopolar erituvchi — yaxshi eriydi. ν(C≡O) 2045, 2013 cm⁻¹ da aniq. CCl₄ cho'qqilari 790 cm⁻¹ da — aralashmaydi.",
      theoryNote: "CCl₄ nopolar erituvchi. CCl₄ ning IQ cho'qqilari 790 cm⁻¹ da — bu [Mn₂(CO)₁₀] cho'qqilariga aralashmaydi."
    },
    { 
      solvent: "DMSO", dielectric: 46.7, lm: 0, kappa: 0.0000, color: "oltin-sariq", 
      note: "Qutbli organik — yaxshi eriydi. DMSO sekin ligand almashinishi mumkin.",
      theoryNote: "DMSO qutbli erituvchi. DMSO sekin ligand almashinishi mumkin (DMSO → CO)."
    },
  ],

  // Halaqit beruvchi omillar — NAZARIY IZOHLAR
  interferences: [
    { 
      source: "CO ajralishi", freqRange: "2143 cm⁻¹", 
      effect: "Erkin CO cho'qqisi — C≡O sohasiga aralashadi (2143 cm⁻¹)", 
      severity: "Yuqori", 
      solution: "Qorong'i xona, past harorat (-20°C). CO ajralishini kamaytirish.",
      theoryNote: "[Mn₂(CO)₁₀] sekin parchalanadi: Mn₂(CO)₁₀ → 2Mn + 10CO. Erkin CO 2143 cm⁻¹ da cho'qqi beradi — bu [Mn₂(CO)₁₀] cho'qqilaridan (2045, 2013 cm⁻¹) farq qiladi."
    },
    { 
      source: "Erituvchi cho'qqilari", freqRange: "Turli", 
      effect: "Erituvchi cho'qqilari aralashishi mumkin (CCl₄ 790 cm⁻¹, THF 900 cm⁻¹)", 
      severity: "O'rta", 
      solution: "Nopolar erituvchi ishlatish (geptan, CCl₄). CCl₄ cho'qqilari 790 cm⁻¹ da — [Mn₂(CO)₁₀] cho'qqilariga aralashmaydi.",
      theoryNote: "CCl₄ ning IQ cho'qqilari 790 cm⁻¹ da — bu [Mn₂(CO)₁₀] cho'qqilariga (458, 422, 380, 340 cm⁻¹) aralashmaydi."
    },
    { 
      source: "Namuna parchalanishi", freqRange: "Barcha", 
      effect: "CO ajralishi — cho'qqilar o'zgaradi, Mn cho'kmasi hosil bo'ladi", 
      severity: "Yuqori", 
      solution: "Qorong'i xona, past harorat. Tez o'lchash. N₂ atmosferasi.",
      theoryNote: "[Mn₂(CO)₁₀] yorug'lik va issiqlik ta'sirida parchalanadi. Mn cho'kmasi hosil bo'ladi (qora cho'kma). Mn₂(CO)₁₀ → 2Mn + 10CO."
    },
    { 
      source: "Mn-Mn bog' cho'qqisi", freqRange: "160 cm⁻¹", 
      effect: "Mn-Mn cho'qqisi 160 cm⁻¹ da — Far-IR soha, oddiy IQ spektrometrlar ko'ra olmaydi", 
      severity: "O'rta", 
      solution: "Far-IR spektrometr ishlatish (160 cm⁻¹ gacha). Bu [Mn₂(CO)₁₀] ning ASOSIY BELGISI.",
      theoryNote: "Mn-Mn bog' cho'qqisi 160 cm⁻¹ da — bu Far-IR soha. Oddiy IQ spektrometrlar 400 cm⁻¹ gacha ko'radi, shuning uchun Mn-Mn cho'qqisini ko'ra olmaydi. Far-IR kerak."
    },
    { 
      source: "Harorat ta'siri", freqRange: "Barcha", 
      effect: "Harorat oshishi — CO ajralishi tezlashadi", 
      severity: "O'rta", 
      solution: "Past haroratda saqlash (-20°C). Tez o'lchash.",
      theoryNote: "[Mn₂(CO)₁₀] 100°C da sekin parchalanadi. 150°C da to'liq parchalanadi."
    },
    { 
      source: "Oksidlanish", freqRange: "Barcha", 
      effect: "O₂ bilan reaksiya — MnO cho'kmasi, CO₂ cho'qqisi (2350 cm⁻¹)", 
      severity: "Yuqori", 
      solution: "N₂ atmosferasi. O₂ yo'qligini tekshirish.",
      theoryNote: "[Mn₂(CO)₁₀] O₂ bilan reaksiyaga kirishadi: 2Mn₂(CO)₁₀ + O₂ → 2MnO + 20CO + 2CO₂. CO₂ 2350 cm⁻¹ da cho'qqi beradi."
    },
  ],

  // Texnikalar — NAZARIY IZOHLAR
  techniques: [
    { 
      name: "Eritma (geptan/CCl₄)", 
      description: "Nopolar erituvchida eritma", 
      advantages: [
        "Konsentratsiya nazorati",
        "C≡O cho'qqilari aniq (2045, 2013 cm⁻¹)",
        "Kvantitativ tahlil",
        "Erituvchi ta'siri kam"
      ], 
      disadvantages: [
        "Erituvchi cho'qqilari aralashishi mumkin",
        "Konsentratsiya nazorati kerak",
        "Erituvchi toza bo'lishi kerak",
        "CO ajralishi mumkin"
      ], 
      bestFor: "Kvantitativ tahlil, eritma", 
      freqRange: "4000-400 cm⁻¹", 
      resolution: "2 cm⁻¹", 
      samplePrep: "10-15 daq"
    },
    { 
      name: "Neat solid (sof qattiq)", 
      description: "Sof qattiq namuna (KBr tabletka)", 
      advantages: [
        "Eng aniq va an'anaviy usul",
        "C≡O cho'qqilari aniq ko'rinadi",
        "Mn-Mn cho'qqisini ko'rish mumkin (Far-IR)",
        "Kvantitativ tahlil uchun qulay"
      ], 
      disadvantages: [
        "Namuna tayyorlash kerak (10-15 daq)",
        "KBr nam bo'lsa, suv cho'qqilari aralashadi",
        "CO ajralishi mumkin",
        "Qorong'i xona kerak"
      ], 
      bestFor: "Aniq kvantitativ tahlil, sof qattiq", 
      freqRange: "4000-400 cm⁻¹", 
      resolution: "2 cm⁻¹", 
      samplePrep: "10-15 daq"
    },
    { 
      name: "ATR (Attenuated Total Reflectance)", 
      description: "To'g'ridan-to'g'ri qattiq namuna", 
      advantages: [
        "Tez o'lchash (1-2 daq)",
        "Namuna tayyorlash shart emas",
        "C≡O cho'qqilari aniq",
        "Namuna buzilmaydi"
      ], 
      disadvantages: [
        "Cho'qqilar biroz siljigan",
        "Past chastotali soha zaif",
        "Kvantitativ tahlil qiyin",
        "Mn-Mn cho'qqisini ko'ra olmaydi"
      ], 
      bestFor: "Tez skrining, tez o'lchash", 
      freqRange: "4000-600 cm⁻¹", 
      resolution: "2 cm⁻¹", 
      samplePrep: "1-2 daq"
    },
    { 
      name: "Far-IR spektroskopiya", 
      description: "Far-IR spektroskopiya (160 cm⁻¹ gacha)", 
      advantages: [
        "Mn-Mn cho'qqisini ko'rish (160 cm⁻¹)",
        "[Mn₂(CO)₁₀] ning ASOSIY BELGISI",
        "Metal-metal bog'ni ko'rish",
        "Strukturaviy tasdiq"
      ], 
      disadvantages: [
        "Qimmat uskuna",
        "Maxsus detektor kerak",
        "Murakkab tahlil",
        "Faqat Far-IR uchun"
      ], 
      bestFor: "Mn-Mn bog'ni ko'rish, strukturaviy tasdiq", 
      freqRange: "600-50 cm⁻¹", 
      resolution: "2 cm⁻¹", 
      samplePrep: "15-20 daq"
    },
  ],

  // Laboratoriya bajarish tartibi — KENGAYTIRILGAN
  labProcedure: [
    { 
      step: 1, 
      title: "⚠️ Xavfsizlik tayyorgarligi", 
      desc: "Qorong'i xona, qo'lqop, ko'zoynak. CO toksik, Mn toksik. N₂ atmosferasi, CO detektori.",
      time: "15 daq",
      theoryNote: "CO toksik — nafas yo'llarini to'xtatadi. Mn toksik — teri va ko'zga zarar. Qorong'i xona — photo-decomposition ning oldini olish. N₂ atmosferasi O₂ ni chiqaradi."
    },
    { 
      step: 2, 
      title: "Sof [Mn₂(CO)₁₀] ni tayyorlash", 
      desc: "Sof [Mn₂(CO)₁₀] ni sintez qilish yoki sotib olish. Qorong'ida saqlash. Sublimatsiya orqali tozalash mumkin.",
      time: "1-2 soat (sintez) yoki tayyor",
      theoryNote: "[Mn₂(CO)₁₀] sintez: Mn₂(CO)₁₀ ni MnI₂ + CO dan sintez qilish mumkin. Sublimatsiya orqali tozalash mumkin (100°C, vakuum)."
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
      title: "KBr tabletka tayyorlash (ixtiyoriy)", 
      desc: "1 mg namuna + 200 mg KBr. Gidravlik press bilan tabletka bosish. Yoki eritma (geptan) ishlatish.",
      time: "10-15 daq",
      theoryNote: "KBr tabletka — an'anaviy usul. KBr nam bo'lmasligi kerak — suv cho'qqilari aralashmasligi uchun."
    },
    { 
      step: 5, 
      title: "Spektrlarni o'lchash", 
      desc: "4000-400 cm⁻¹ oralig'ida spektrlarni o'lchash. 2-3 marta takrorlash. Far-IR (160 cm⁻¹ gacha) ixtiyoriy.",
      time: "10 daq",
      theoryNote: "4000-400 cm⁻¹ oralig'i — barcha muhim cho'qqilarni qamrab oladi. Far-IR (160 cm⁻¹) — Mn-Mn bog' cho'qqisini ko'rish uchun."
    },
    { 
      step: 6, 
      title: "C≡O cho'qqilarini tekshirish", 
      desc: "νₐₛ(C≡O) 2045, 2013 cm⁻¹ cho'qqilarini tekshirish. νₛ(C≡O) 1983 cm⁻¹ ni tekshirish.",
      time: "5 daq",
      theoryNote: "νₐₛ(C≡O) = 2045, 2013 cm⁻¹ — terminal CO cho'qqilari. νₛ(C≡O) = 1983 cm⁻¹ — simmetrik cho'zilish."
    },
    { 
      step: 7, 
      title: "Mn-Mn cho'qqisini tekshirish (Far-IR)", 
      desc: "Far-IR spektrometr bilan 160 cm⁻¹ da Mn-Mn cho'qqisini tekshirish. Bu [Mn₂(CO)₁₀] ning ASOSIY BELGISI.",
      time: "10 daq (Far-IR)",
      theoryNote: "Mn-Mn bog' cho'qqisi 160 cm⁻¹ da — bu [Mn₂(CO)₁₀] ning ASOSIY BELGISI! Mn-Mn bog' uzunligi 2.90 Å."
    },
    { 
      step: 8, 
      title: "Ma'lumotlarni tahlil qilish", 
      desc: "νₐₛ(C≡O) 2045, 2013, νₛ(C≡O) 1983, Mn-Mn 160 cm⁻¹ cho'qqilarini tekshirish. Erkin CO (2143 cm⁻¹) yo'qligini tekshirish.",
      time: "10 daq",
      theoryNote: "[Mn₂(CO)₁₀] da νₐₛ(C≡O) = 2045, 2013, νₛ(C≡O) = 1983, Mn-Mn = 160 cm⁻¹ cho'qqilari bor. Erkin CO (2143 cm⁻¹) yo'q."
    },
  ],

  // Laboratoriya natijalari solishtirish — KENGAYTIRILGAN
  labResults: [
    { 
      id: "LAB-001", 
      technique: "KBr tabletka", 
      condition: "Sof [Mn₂(CO)₁₀], KBr tabletka", 
      freq_CO: "2045, 2013, 1983", 
      freq_MnMn: "160 (Far-IR)", 
      quality: "A'lo",
      notes: "Sof [Mn₂(CO)₁₀] — νₐₛ(C≡O) = 2045, 2013, νₛ(C≡O) = 1983 cm⁻¹ cho'qqilari aniq. Mn-Mn cho'qqisi 160 cm⁻¹ da (Far-IR). Bu [Mn₂(CO)₁₀] ning ASOSIY BELGISI.",
      theoryNote: "[Mn₂(CO)₁₀] — barcha CO terminal (bridging CO yo'q). D₄d simmetriya (staggered). Mn-Mn bog' uzunligi 2.90 Å."
    },
    { 
      id: "LAB-002", 
      technique: "Geptan eritmasi", 
      condition: "Geptan da 10⁻³ M", 
      freq_CO: "2044, 2012, 1982", 
      freq_MnMn: "—", 
      quality: "A'lo",
      notes: "Geptan da — cho'qqilar biroz siljigan. C≡O cho'qqilari aniq. Mn-Mn cho'qqisini Far-IR da ko'rish mumkin.",
      theoryNote: "Geptan nopolar erituvchi — cho'qqilar biroz siljiydi (solvatochromic effect)."
    },
    { 
      id: "LAB-003", 
      technique: "CCl₄ eritmasi", 
      condition: "CCl₄ da 10⁻³ M", 
      freq_CO: "2045, 2013, 1983", 
      freq_MnMn: "—", 
      quality: "A'lo",
      notes: "CCl₄ da — cho'qqilar aniq. CCl₄ cho'qqilari 790 cm⁻¹ da — [Mn₂(CO)₁₀] cho'qqilariga aralashmaydi.",
      theoryNote: "CCl₄ nopolar erituvchi. CCl₄ ning IQ cho'qqilari 790 cm⁻¹ da — bu [Mn₂(CO)₁₀] cho'qqilariga aralashmaydi."
    },
    { 
      id: "LAB-004", 
      technique: "ATR", 
      condition: "To'g'ridan-to'g'ri qattiq", 
      freq_CO: "2044, 2012, 1982", 
      freq_MnMn: "—", 
      quality: "A'lo",
      notes: "ATR usuli — cho'qqilar biroz siljigan. C≡O cho'qqilari aniq. Mn-Mn cho'qqisini ATR ko'ra olmaydi (past chastota).",
      theoryNote: "ATR usuli — cho'qqilar biroz siljiydi. Mn-Mn cho'qqisi (160 cm⁻¹) ATR da ko'rinmaydi (past chastota)."
    },
    { 
      id: "LAB-005", 
      technique: "Konduktometriya", 
      condition: "Geptan da, 10⁻³ M", 
      freq_CO: "—", 
      freq_MnMn: "—", 
      quality: "Noelektrolit",
      notes: "⚠️ MUHIM: Λm ≈ 0 S·cm²/mol. Neytral molekula — noelektrolit. Mn₂(CO)₁₀ neytral molekula.",
      theoryNote: "[Mn₂(CO)₁₀] neytral molekula — noelektrolit. Λm ≈ 0 S·cm²/mol."
    },
    { 
      id: "LAB-006", 
      technique: "Far-IR spektroskopiya", 
      condition: "Far-IR, KBr tabletka", 
      freq_CO: "—", 
      freq_MnMn: "160", 
      quality: "Mn-Mn aniqlandi",
      notes: "Far-IR — Mn-Mn cho'qqisi 160 cm⁻¹ da aniq. Bu [Mn₂(CO)₁₀] ning ASOSIY BELGISI! Mn-Mn bog' uzunligi 2.90 Å.",
      theoryNote: "Mn-Mn bog' cho'qqisi 160 cm⁻¹ da — bu Far-IR soha. Mn-Mn bog' energiyasi ~150 kJ/mol."
    },
  ],
}

export default function Mn2CO10Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2045)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeLabStep, setActiveLabStep] = useState(0)

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚗️</span> [Mn₂(CO)₁₀] — DIMANGANES DEKAKARBONIL!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Mn₂(CO)₁₀]</strong> — dimanganes dekakarbonil, Mn-Mn metal-metal bog' bor.
              D₄d simmetriya, 18 elektron qoidasi, barcha CO terminal!
            </p>

            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>νₐₛ(C≡O):</strong> 2045, 2013 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>νₛ(C≡O):</strong> 1983 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Mn-Mn):</strong> 160 cm⁻¹ (Far-IR)
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Konduktometriya:</div>
                  <div className="text-purple-200">
                    <strong>Λm ≈ 0 S·cm²/mol</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Noelektrolit</strong> (neytral molekula)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">18 elektron qoidasi:</strong> Mn⁰ (d⁷) + 5×CO (10e) + Mn-Mn bog' (1e) = 18 elektron (har bir Mn uchun). Barqaror!
              </p>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong className="text-yellow-300">⚠️ XAVFSIZLIK:</strong> CO toksik, Mn toksik. Qorong'i xona, N₂ atmosferasi, CO detektori kerak!
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
              <span className="text-yellow-400 font-semibold">[Mn₂(CO)₁₀]</span>
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
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Noelektrolit</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Mn-Mn bog'</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">D₄d simmetriya</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">18 elektron</span>
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
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">D₄d simmetriya</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁷</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Mn-Mn bog'</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">18 elektron</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Mn₂(CO)₁₀]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            dimanganes dekakarbonil — <span className="text-yellow-400 italic">&quot;Mn-Mn metal-metal bog', 18 elektron qoidasi, D₄d simmetriya&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> KBr tabletka yoki nopolar erituvchida 4000−160 cm⁻¹
            oralig'ida olingan. Eng muhim diagnostik signallar:
            <strong className="text-yellow-400"> νₐₛ(C≡O) 2045, 2013, νₛ(C≡O) 1983 cm⁻¹</strong> — terminal CO cho'qqilari;
            <strong className="text-yellow-400"> ν(Mn-Mn) 160 cm⁻¹</strong> — Mn-Mn metal-metal bog' (Far-IR).
            Bu kompleks Mn-Mn metal-metal bog'ining klassik namunasi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Mn⁰ (d⁷)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">18 elektron</div>
              <div className="text-white font-bold">Har bir Mn</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">D₄d (staggered)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">Noelektrolit</div>
            </div>
          </div>
        </div>

        {/* 18 ELEKTRON QOIDASI VA MN-MN BOG' */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔢 18 elektron qoidasi va Mn-Mn bog'</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Elektron hisobi (har bir Mn uchun)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Mn⁰ (d⁷):</span>
                  <span className="text-yellow-400">7 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">5 × CO (2 elektron har biri):</span>
                  <span className="text-yellow-400">10 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Mn-Mn bog' (1 elektron):</span>
                  <span className="text-yellow-400">1 elektron</span>
                </div>
                <div className="flex justify-between border-t border-yellow-700/50 pt-2">
                  <span className="text-purple-400 font-bold">Jami (har bir Mn):</span>
                  <span className="text-yellow-400 font-bold">18 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Qoida:</span>
                  <span className="text-yellow-400">Bajariladi — barqaror!</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Mn-Mn bog'</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog' turi:</span>
                  <span className="text-orange-400">Mn-Mn single bond</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog' uzunligi:</span>
                  <span className="text-orange-400">2.90 Å (eksperimental)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog' energiyasi:</span>
                  <span className="text-orange-400">~150 kJ/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Konformatsiya:</span>
                  <span className="text-orange-400">Staggered (D₄d)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Mn-Mn bog':</strong> [Mn₂(CO)₁₀] da Mn-Mn single bond bor. Bu metal karbonil klasterlarining asosiy xususiyati.
              Har bir Mn 18 elektron qoidasini bajaradi. Mn-Mn bog' uzunligi 2.90 Å, energiyasi ~150 kJ/mol.
              D₄d simmetriya (staggered konformatsiya) — eclipsed (D₄ₕ) ga qaraganda 5-10 kJ/mol past energiyali.
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
                  const isImportant = p.freq === 2045 || p.freq === 2013 || p.freq === 1983 || p.freq === 160
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-yellow-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-yellow-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-yellow-400">⭐</span>}
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

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> ν(Mn-Mn) = 160 cm⁻¹ — bu [Mn₂(CO)₁₀] ning ASOSIY BELGISI!
              Mn-Mn bog' uzunligi 2.90 Å, energiyasi ~150 kJ/mol. Far-IR soha (160 cm⁻¹) — oddiy IQ spektrometrlar ko'ra olmaydi, Far-IR kerak.
              νₐₛ(C≡O) = 2045, 2013 cm⁻¹ — terminal CO cho'qqilari (barcha CO terminal, bridging CO yo'q).
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
            <label className="block text-yellow-400 font-bold mb-2">
              To'lqin soni: {freqSlider} cm⁻¹
            </label>
            <input
              type="range"
              min="160"
              max="4000"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="To'lqin sonini o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>160 cm⁻¹ (Mn-Mn)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (C≡O)</span>
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
              <title>IQ spektr grafigi — [Mn₂(CO)₁₀]</title>
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
                const isImportant = peak.freq === 2045 || peak.freq === 2013 || peak.freq === 1983 || peak.freq === 160
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
                  <th className="py-3 px-4 text-purple-300">ν(C≡O)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Mn-Mn)</th>
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
                    <td className="py-3 px-4 font-mono">{result.freq_CO}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_MnMn}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Noelektrolit' ? 'bg-orange-600/30 text-orange-400' :
                        result.quality === 'Mn-Mn aniqlandi' ? 'bg-orange-600/30 text-orange-400' :
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
            <li><strong className="text-yellow-400">Mn-Mn metal-metal bog':</strong> 2.90 Å, energiyasi ~150 kJ/mol</li>
            <li><strong className="text-yellow-400">18 elektron qoidasi:</strong> Har bir Mn uchun bajariladi — barqaror</li>
            <li><strong className="text-yellow-400">IR belgisi:</strong> νₐₛ(C≡O) = 2045, 2013, νₛ(C≡O) = 1983, ν(Mn-Mn) = 160 cm⁻¹</li>
            <li><strong className="text-yellow-400">D₄d simmetriya:</strong> Staggered konformatsiya (eclipsed ga qaraganda 5-10 kJ/mol past)</li>
            <li><strong className="text-yellow-400">Noelektrolit:</strong> Neytral molekula, Λm ≈ 0 S·cm²/mol</li>
            <li><strong className="text-yellow-400">Barcha CO terminal:</strong> Bridging CO yo'q (D₄d simmetriya)</li>
            <li><strong className="text-yellow-400">Far-IR kerak:</strong> Mn-Mn cho'qqisi 160 cm⁻¹ da — Far-IR kerak</li>
            <li><strong className="text-yellow-400">⚠️ XAVFSIZLIK:</strong> CO toksik, Mn toksik — ehtiyot bo'ling!</li>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Mn₂(CO)₁₀] (Dimanganes dekakarbonil) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto, Lever, Wilkinson, Cotton, Adams (Metal Carbonyls)</p>
        </div>
      </footer>
    </main>
  )
}