"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// [Fe(phen)₃]²⁺ — FERROIN YaMR (ILMIY BOYITILGAN)
// Manbalar: Blau (1898), Werner (1913), Day & Sanders (1967),
//           McCleverty (1979), Miessler-Tarr, Cotton-Wilkinson, SDBS ID: 4821
// Xususiyat: MLCT, aromatik YaMR, redoks indikator, diamagnit d⁶
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(phen)<sub>3</sub>]²⁺",
  formulaPlain: "[Fe(phen)3]2+",
  iupac: "Tris(1,10-fenantrolin)temir(II)",
  commonName: "Ferroin (qizil, redoks indikator)",
  molarMass: 532.47,
  saltFormulaHTML: "[Fe(phen)<sub>3</sub>]SO<sub>4</sub> · nH<sub>2</sub>O",
  saltMolarMass: 628.54,
  casNumber: "14768-11-7",
  color: "to'q qizil (deep red)",
  structure: "Oktaedr (D₃, propeller)",
  metalLigand: "Fe-N (phen, bidentat N,N'-xelat)",
  pointGroup: "D₃",
  electrolyteType: "1:2 elektrolit ([Fe(phen)₃]SO₄)",
  molarConductivity: "~260 S·cm²/mol",
  solubility: "Suvda eriydi (sulfate), CHCl₃ da erimeydi",
  crystalField: {
    metalIon: "Fe²⁺",
    electronConfig: "[Ar] 3d⁶",
    dElectrons: 6,
    spinState: "Past spinli (low-spin)",
    orbitalOccupancy: "t₂g⁶ eg⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Δo ≈ 17,500 cm⁻¹ (2.17 eV, ~571 nm)",
    racahParameter: "B ≈ 540 cm⁻¹ (erkin ion B₀ = 1050 cm⁻¹)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.51",
    pairingEnergy: "P ≈ 17,000 cm⁻¹",
    cFSE: "CFSE = -2.4 Δo + P ≈ -42,000 + 17,000 = -25,000 cm⁻¹",
    spectrochemicalSeries: "phen — kuchli maydon ligandi (F⁻ < H₂O < NH₃ < en < phen < NO₂⁻ < CN⁻)",
    whyLowSpin: "Δo (17,500) > P (17,000) → past spinli, diamagnit. Phen kuchli σ-donor va π-akseptor.",
    colorOrigin: "Asosiy yutilish — MLCT (Metal-to-Ligand Charge Transfer) ~510 nm, kuchli (ε ≈ 11,000). d-d o'tishlar Laporte ta'qiqlangan, juda kuchsiz.",
    chargeTransfer: "MLCT: Fe²⁺ (t₂g) → phen (π*) — ~510 nm, intensiv qizil rang. Bu phenantroline komplekslarining klassik xususiyati.",
    piBackbonding: "Phen — kuchli π-akseptor. Fe²⁺ (t₂g) → phen (π*) qayta bog'lanish. MLCT va π-backbonding kuchli.",
    mlctBand: "¹A₁ → ¹MLCT: 510 nm (19,600 cm⁻¹), ε ≈ 11,000 L/(mol·cm). Bu MLCT bandidir — Ru(bpy)₃²⁺ ga o'xshash."
  },
  symmetry: {
    pointGroup: "D₃",
    order: 6,
    symmetryElements: ["E", "2C₃", "3C₂"],
    propellerShape: "3 ta phen ligand propeller shaklida joylashgan (helikal struktura)",
    chirality: "Λ (lambda) va Δ (delta) enantiomerlar — xirallik (optik izomerlar)",
    nmrEquivalence: "D₃ simmetriyada: barcha 3 ta phen ligand ekvivalent. Har bir phen da 8 ta aromatik H (4 ta juft ekvivalent: H₂,₉ / H₃,₈ / H₄,₇ / H₅,₆). Shuning uchun ¹H YaMR da 4 ta signal (8H + 8H + 8H + 8H = 24H umumiy, 3×8=24).",
    irActive: "A₂ + E — IR faol",
    ramanActive: "A₁ + E — Raman faol",
    mutualExclusion: "D₃ da markaziy simmetriya yo'q — IR va Raman ustma-ust tushishi mumkin"
  },
  nmrTheory: {
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "7.5-9.2 ppm (aromatik protonlar)",
      whyThisShift: "Phen ligandning barcha protonlari aromatik (sp²). Aromatik halqaning ring current effekti deshielding qiladi (7-8 ppm). Qo'shimcha deshielding — Fe²⁺ ga bog'lanish orqali (metal effekti) va MLCT tufayli liganddan elektron zichligi kamayadi.",
      multiplicity: "Murakkab multipletlar (AB sistemalari, J = 5-8 Hz)",
      linewidth: "~2-10 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 1-5 s (dipol-dipol mexanizm)",
      couplingNotes: "Orto-bog'liq: ³J(H₂-H₃) ≈ 5 Hz, ³J(H₃-H₄) ≈ 8 Hz. Meta-bog'liq: ⁴J ≈ 1-2 Hz. Har bir phen ligand 4 ta juft ekvivalent proton jufti.",
      mlctEffect: "MLCT tufayli liganddan elektron zichligi Fe²⁺ ga o'tadi → protonlar deshielded → yuqori ppm shift. Bu Ru(bpy)₃²⁺ da ham kuzatiladi."
    },
    c13: {
      nucleus: "¹³C (I = 1/2, 1.1% tabiiy)",
      shift: "110-150 ppm (aromatik uglerodlar)",
      whyThisShift: "Phen ligandning 12 ta uglerodi (har bir phen da). Aromatik uglerodlar 110-150 ppm da. N yaqinidagi uglerodlar (C₂, C₉) yuqoriroq ppm (140-150 ppm).",
      multiplicity: "Singlet (decoupling bilan)",
      linewidth: "~5-20 Hz",
      t1Relaxation: "T₁ ≈ 0.5-2 s (CSA va dipol-dipol)",
      sensitivity: "¹³C tabiiy tarqalishi 1.1% — ¹H dan 5700 marta past sezgirlik",
      mlctEffect: "MLCT tufayli C atomlarining elektron zichligi kamayadi → deshielding → yuqori ppm"
    },
    n15: {
      nucleus: "¹⁵N (I = 1/2, 0.37% tabiiy)",
      shift: "140-160 ppm (N-bog'langan)",
      whyThisShift: "Phen ligandning 2 ta N atomi (har bir phen da). N atomlari Fe²⁺ ga bevosita bog'langan. Erkin phen: ~120 ppm. Kompleksda: ~150 ppm (deshielding, Fe²⁺ ga bog'lanish).",
      multiplicity: "Singlet",
      linewidth: "~10-50 Hz",
      t1Relaxation: "T₁ ≈ 10-100 s",
      sensitivity: "¹⁵N past tabiiy tarqalish (0.37%) va past γ — juda past sezgirlik. ¹⁵N boyitish tavsiya etiladi."
    },
    fe57: {
      nucleus: "⁵⁷Fe (I = 1/2, 2.12% tabiiy)",
      shift: "Keng diapazon",
      whyThisShift: "⁵⁷Fe YaMR past spinli Fe(II) komplekslarda juda qiyin. Sezgirlik ¹H dan 33,000 marta past.",
      sensitivity: "Juda past sezgirlik",
      detection: "Odatda to'g'ridan-to'g'ri ⁵⁷Fe YaMR olinmaydi. Mössbauer ko'proq ishlatiladi."
    }
  },
  structuralData: {
    bondLengths: {
      feN: "1.97-2.00 Å (Fe-N, o'rtacha 1.98 Å)",
      cn_phen: "1.32-1.35 Å (C-N, aromatik)",
      cc_phen: "1.38-1.42 Å (C-C, aromatik)",
      comparison: "[Ru(phen)₃]²⁺: Ru-N = 2.06 Å (Ru²⁺ katta radius). [Co(phen)₃]³⁺: Co-N = 1.93 Å (Co³⁺ kichik radius).",
      biteAngle: "N-Fe-N bite angle: ~82° (chelate burchagi, phen kichik bite angle)"
    },
    bondAngles: {
      nFeN_cis: "82° (chelate, phen uchun)",
      nFeN_trans: "~180° (trans N-Fe-N)",
      ccn: "~120° (aromatik halqada)",
      comparison: "Ideal oktaedr 90°, lekin phen kichik bite angle (82°) tufayli distorded."
    },
    phenanthroline: {
      structure: "3 ta kondensatsiyalangan aromatik halqa (2 N atomi 1,10-pozitsiyada)",
      planarity: "Phen ligand to'liq planar (aromatik)",
      biteAngle: "82° — etilendiamin (en) da 85° dan kichikroq",
      rigidity: "Juda qattiq (rigid) ligand — konformatsion erkinlik yo'q"
    }
  },
  redoxProperties: {
    ferroin: {
      name: "Ferroin — [Fe(phen)₃]²⁺",
      oxidationState: "Fe²⁺ (d⁶)",
      spinState: "Past spinli, diamagnit",
      color: "To'q qizil (deep red)",
      mlct: "510 nm, ε ≈ 11,000",
      stability: "Barqaror, inert kompleks"
    },
    ferriin: {
      name: "Ferriin — [Fe(phen)₃]³⁺",
      oxidationState: "Fe³⁺ (d⁵)",
      spinState: "Past spinli, paramagnit (1 ta toq e⁻)",
      color: "Och ko'k (pale blue)",
      mlct: "~600 nm, ε ≈ 500 (kuchsizroq)",
      stability: "Kamroq barqaror"
    },
    redoxCouple: {
      reaction: "[Fe(phen)₃]²⁺ ⇌ [Fe(phen)₃]³⁺ + e⁻",
      standardPotential: "E° = +1.06 V (SHE)",
      nernst: "E = E° + (RT/F)·ln([Fe³⁺]/[Fe²⁺])",
      reversibility: "Qaytar (reversible), ΔEp ≈ 60 mV",
      application: "Redoks indikator — titrlashlarda keng ishlatiladi",
      colorChange: "Qizil (Fe²⁺) → Ko'k (Fe³⁺) — 0.1 V o'zgarishda rang o'zgaradi"
    }
  },
  history: {
    blau: {
      year: 1898,
      scientist: "Fritz Blau (Germaniya)",
      achievement: "1,10-fenantrolinni birinchi marta sintez qildi va metal komplekslarini tavsifladi",
      method: "Skraup sintezi (anilin + glitserol + H₂SO₄ + oksidlovchi)",
      significance: "Koordinatsion kimyoda klassik ligand kashfiyoti"
    },
    werner: {
      year: 1913,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Koordinatsion nazariya (Nobel mukofoti)",
      contribution: "Phenantroline komplekslarini nazariy jihatdan tushuntirdi",
      nobel: "Nobel mukofoti (1913)"
    },
    daySanders: {
      year: 1967,
      scientist: "Peter Day & N. Sanders",
      achievement: "MLCT (Metal-to-Ligand Charge Transfer) konseptsiyasini tizimli o'rgandi",
      contribution: "Phenantroline va bipyridine komplekslarida MLCT bandlarini aniqladi",
      significance: "Koordinatsion kimyoda muhim nazariy hissa"
    },
    mccleverty: {
      year: 1979,
      scientist: "Jon A. McCleverty",
      achievement: "Ferroin va redoks indikatorlarini tizimli tadqiq qildi",
      contribution: "Analitik kimyoda ferroin indikatorini keng qo'llash",
      significance: "Ferroin — eng keng ishlatiladigan redoks indikatorlardan biri"
    }
  },
  comparison: [
    {
      compound: "[Fe(phen)₃]²⁺",
      metal: "Fe²⁺ (d⁶)",
      color: "Qizil",
      nmrShift: "¹H: 7.5-9.2 ppm",
      spinState: "Past spinli, diamagnit",
      mlct: "510 nm, ε ≈ 11,000"
    },
    {
      compound: "[Fe(phen)₃]³⁺ (ferriin)",
      metal: "Fe³⁺ (d⁵)",
      color: "Ko'k",
      nmrShift: "Paramagnit shift",
      spinState: "Past spinli, paramagnit",
      mlct: "~600 nm, ε ≈ 500"
    },
    {
      compound: "[Fe(bipy)₃]²⁺",
      metal: "Fe²⁺ (d⁶)",
      color: "Qizil-to'q sariq",
      nmrShift: "¹H: 7.8-9.0 ppm",
      spinState: "Past spinli, diamagnit",
      mlct: "~520 nm"
    },
    {
      compound: "[Ru(phen)₃]²⁺",
      metal: "Ru²⁺ (d⁶)",
      color: "To'q sariq",
      nmrShift: "¹H: 7.5-9.0 ppm",
      spinState: "Past spinli, diamagnit",
      mlct: "~450 nm, ε ≈ 14,000"
    },
    {
      compound: "[Co(phen)₃]³⁺",
      metal: "Co³⁺ (d⁶)",
      color: "Sariq",
      nmrShift: "¹H: 7.5-9.0 ppm",
      spinState: "Past spinli, diamagnit",
      mlct: "~350 nm (UV)"
    }
  ],
  applications: [
    {
      field: "Analitik kimyo",
      use: "Redoks indikator (ferroin/ferriin jufti)",
      mechanism: "Qizil (Fe²⁺) ↔ Ko'k (Fe³⁺), E° = +1.06 V",
      examples: "Se(IV), Ce(IV), Cr(VI) titrlashlari"
    },
    {
      field: "Spektrofotometriya",
      use: "Fe²⁺ miqdorini aniqlash",
      mechanism: "510 nm da MLCT bandi (ε ≈ 11,000)",
      sensitivity: "Juda sezgir, 10⁻⁵ M gacha aniqlash"
    },
    {
      field: "Fotokimyo",
      use: "Foto-sensibilizator (solar cells)",
      mechanism: "MLCT orqali elektron uzatish",
      modern: "Dye-sensitized solar cells (DSSC)"
    },
    {
      field: "Materialshunoslik",
      use: "Molekulyar qurilmalar, sensorlar",
      mechanism: "Redoks-svitching, elektrochromic",
      applications: "Smart windows, molecular electronics"
    }
  ],
  nmrNucleus: "¹H, ¹³C, ¹⁵N",
  chemicalShift: "¹H: 7.5-9.2 ppm (aromatik), ¹³C: 110-150 ppm",
  multiplicity: "multiplet (aromatik)",
  jCoupling: "J(H-H) = 5-8 Hz",
  nmrSignals: [
    {
      nucleus: "¹H",
      ligand: "H₂, H₉ (N-ga yaqin, 2-pozitsiya)",
      shift: "9.15",
      multiplicity: "dublet (dd)",
      jCoupling: "³J = 5 Hz, ⁴J = 1 Hz",
      integration: "6H",
      notes: "N atomiga eng yaqin protonlar. MLCT tufayli kuchli deshielded (9.15 ppm — eng yuqori)."
    },
    {
      nucleus: "¹H",
      ligand: "H₃, H₈ (3-pozitsiya)",
      shift: "8.55",
      multiplicity: "dublet (dd)",
      jCoupling: "³J = 8 Hz, ³J = 5 Hz",
      integration: "6H",
      notes: "H₂ va H₄ o'rtasida. O'rta deshielding."
    },
    {
      nucleus: "¹H",
      ligand: "H₄, H₇ (4-pozitsiya)",
      shift: "8.30",
      multiplicity: "dublet (d)",
      jCoupling: "³J = 8 Hz",
      integration: "6H",
      notes: "H₃ ga bog'liq. Aromatik mintaqa."
    },
    {
      nucleus: "¹H",
      ligand: "H₅, H₆ (5,6-pozitsiya, markaziy halqa)",
      shift: "7.80",
      multiplicity: "singlet (s)",
      jCoupling: "— (simmetrik)",
      integration: "6H",
      notes: "Markaziy halqada (N atomlaridan uzoq). Eng past deshielding (7.80 ppm)."
    },
    {
      nucleus: "¹³C",
      ligand: "C₂, C₉ (N-ga yaqin)",
      shift: "150",
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6C",
      notes: "N atomiga eng yaqin uglerodlar. Kuchli deshielding."
    },
    {
      nucleus: "¹³C",
      ligand: "C₁₀ (C-N)",
      shift: "145",
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6C",
      notes: "N atomi bilan bevosita bog'langan C."
    },
    {
      nucleus: "¹³C",
      ligand: "C₃, C₈",
      shift: "130",
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6C",
      notes: "O'rta deshielding."
    },
    {
      nucleus: "¹³C",
      ligand: "C₅, C₆ (markaziy)",
      shift: "120",
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6C",
      notes: "Eng past deshielding."
    }
  ],
  nmrSpectrum: [
    { ppm: 7.0, intensity: 0, notes: "—" },
    { ppm: 7.8, intensity: 0.7, notes: "¹H: H₅,H₆ (singlet, 6H)" },
    { ppm: 8.0, intensity: 0, notes: "—" },
    { ppm: 8.3, intensity: 0.8, notes: "¹H: H₄,H₇ (dublet, 6H)" },
    { ppm: 8.55, intensity: 0.9, notes: "¹H: H₃,H₈ (dublet, 6H)" },
    { ppm: 9.0, intensity: 0, notes: "—" },
    { ppm: 9.15, intensity: 1.0, notes: "¹H: H₂,H₉ (dublet, 6H)" },
    { ppm: 10.0, intensity: 0, notes: "—" }
  ],
  interferences: [
    {
      source: "[Fe(phen)₃]³⁺ (ferriin) aralashmasi",
      effect: "Paramagnit shift — signallar kengayadi va siljiydi",
      severity: "Yuqori",
      solution: "Sof [Fe(phen)₃]²⁺ ishlatish. Qaytaruvchi muhitda saqlash (Fe²⁺ → Fe³⁺ oksidlanishning oldini olish).",
      theoryNote: "[Fe(phen)₃]³⁺ — past spinli d⁵ (1 ta toq e⁻), paramagnit. ¹H YaMR da signallarni kengaytiradi va paramagnit shift beradi. Havo ta'sirida [Fe(phen)₃]²⁺ sekin oksidlanadi."
    },
    {
      source: "Erkin phenantroline aralashmasi",
      effect: "Qo'shimcha ¹H signallar (erkin phen: 7.6-8.9 ppm)",
      severity: "O'rta",
      solution: "Sof kompleks ishlatish. Rekristallizatsiya orqali tozalash.",
      theoryNote: "Erkin phenantroline ¹H YaMR da 7.6-8.9 ppm da signallar beradi. Kompleksda MLCT tufayli 7.8-9.2 ppm ga siljiydi."
    },
    {
      source: "Erituvchi cho'qqilari",
      effect: "D₂O da HOD signal 4.7 ppm da, DMSO-d₆ da 2.5 ppm",
      severity: "Past",
      solution: "Erituvchi signallari ¹H aromatik mintaqadan (7-10 ppm) uzoq.",
      theoryNote: "Aromatik protonlar 7-10 ppm da. Erituvchi signallari (HOD 4.7, DMSO 2.5, CDCl₃ 7.26) bu mintaqadan uzoq yoki yaqin. D₂O eng mos — HOD 4.7 ppm da (aromatik mintaqadan uzoq)."
    },
    {
      source: "Fe²⁺ ionlari",
      effect: "Paramagnit kengayish (erkin Fe²⁺ yuqori spinli, 4 ta toq e⁻)",
      severity: "O'rta",
      solution: "Sof kompleks ishlatish. Erkin Fe²⁺ ni yo'qotish uchun yuvish.",
      theoryNote: "Erkin Fe²⁺ (aq) — yuqori spinli d⁶ (4 ta toq e⁻), paramagnit. [Fe(phen)₃]²⁺ — past spinli, diamagnit. Erkin Fe²⁺ aralashmasi signallarni kengaytiradi."
    },
    {
      source: "Oksidlanish (Fe²⁺ → Fe³⁺)",
      effect: "[Fe(phen)₃]³⁺ hosil bo'ladi, paramagnit siljish",
      severity: "Yuqori",
      solution: "Inert muhitda (N₂, Ar) ishlash. Qaytaruvchi agentlar qo'shish (askorbin kislotasi).",
      theoryNote: "[Fe(phen)₃]²⁺ havo ta'sirida sekin oksidlanib [Fe(phen)₃]³⁺ ga aylanadi (E° = 1.06 V). Inert muhitda saqlash tavsiya etiladi."
    },
    {
      source: "Harorat effektlari",
      effect: "Yuqori T da signal o'tkirligi oshadi, past T da kengayadi",
      severity: "Past",
      solution: "298 K da ishlash tavsiya etiladi.",
      theoryNote: "Diamagnit komplekslar uchun harorat effekti kichik. 298 K — standart."
    }
  ],
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak, labor xalat. Phen toksik (mutagen). Fe²⁺ zaharli emas, lekin konsentratsiyalangan eritmalar ehtiyotkorlik bilan ishlatiladi.",
      time: "15 daq",
      theoryNote: "1,10-fenantrolin toksik va mutagen. Havo almashinuvi yaxshi bo'lgan joyda ishlash. [Fe(phen)₃]SO₄ o'zi xavfsizroq."
    },
    {
      step: 2,
      title: "Sof [Fe(phen)₃]SO₄ ni tayyorlash",
      desc: "Tijorat [Fe(phen)₃]SO₄ (99%) yoki sintez. Sintez: FeSO₄ + 3 phen → [Fe(phen)₃]SO₄ (suvda, 60°C, 1 soat). Qizil kristallar.",
      time: "1-2 soat (sintez) yoki tayyor",
      theoryNote: "FeSO₄·7H₂O + 3 phenantroline → [Fe(phen)₃]SO₄ + 7H₂O. Qizil kristallar — ferroin."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming) qilish. D₂O yoki DMSO-d₆ erituvchi.",
      time: "30 daq",
      theoryNote: "Yaxshi shimlash — o'tkir aromatik signallar uchun muhim. D₂O — HOD signal 4.7 ppm da (aromatik mintaqadan uzoq)."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "10-20 mg [Fe(phen)₃]SO₄ ni 0.6 mL D₂O da eritish. YaMR naychaga solish. Inert muhit (N₂) tavsiya etiladi.",
      time: "10-15 daq",
      theoryNote: "[Fe(phen)₃]SO₄ suvda eriydi. D₂O eng mos erituvchi. Havo ta'siridan saqlash (oksidlanishning oldini olish)."
    },
    {
      step: 5,
      title: "¹H YaMR spektrini olish",
      desc: "¹H YaMR spektrini olish (16-64 skan). Aromatik signallarni tekshirish (7.5-9.2 ppm, 4 ta signal, 24H umumiy).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da 4 ta signal: 7.80 (H₅,H₆), 8.30 (H₄,H₇), 8.55 (H₃,H₈), 9.15 ppm (H₂,H₉). Har biri 6H integratsiyasi."
    },
    {
      step: 6,
      title: "¹³C YaMR spektrini olish (ixtiyoriy)",
      desc: "¹³C YaMR spektrini olish (1000-5000 skan). Aromatik signallar (110-150 ppm).",
      time: "30-60 daq",
      theoryNote: "¹³C YaMR da 4 ta signal: 120, 130, 145, 150 ppm. ¹³C tabiiy tarqalishi 1.1% — ko'p skan kerak."
    },
    {
      step: 7,
      title: "Redoks test (ixtiyoriy)",
      desc: "Na₂S₂O₄ (qaytaruvchi) qo'shish — rang qizil bo'lib qoladi. KMnO₄ (oksidlovchi) qo'shish — rang ko'k bo'ladi (ferriin).",
      time: "10 daq",
      theoryNote: "Ferroin (qizil, Fe²⁺) ↔ Ferriin (ko'k, Fe³⁺). E° = 1.06 V. Qaytaruvchi qo'shilsa — qizil, oksidlovchi qo'shilsa — ko'k."
    },
    {
      step: 8,
      title: "Ferriin aralashmasini tekshirish",
      desc: "Agar [Fe(phen)₃]³⁺ aralashmasi bo'lsa, ¹H YaMR da paramagnit kengayish kuzatiladi.",
      time: "5 daq",
      theoryNote: "[Fe(phen)₃]³⁺ — paramagnit (1 ta toq e⁻). ¹H YaMR da signallar kengayadi va siljiydi."
    }
  ],
  advancedTechniques: [
    {
      name: "UV-Vis spektroskopiya",
      description: "MLCT bandini o'lchash (510 nm)",
      advantages: ["MLCT aniqlash", "ε aniqlash", "Konsentratsiya o'lchash"],
      disadvantages: ["Faqat MLCT", "Struktura haqida ma'lumot kam"],
      bestFor: "MLCT, konsentratsiya, rang tushuntirish",
      examples: "510 nm, ε ≈ 11,000 L/(mol·cm) — intensiv qizil"
    },
    {
      name: "Elektrokimyo (CV)",
      description: "Ferroin/Ferriin redoks juftini o'rganish",
      advantages: ["E° aniqlash", "Qaytarlik darajasi", "Kinetika"],
      disadvantages: ["Elektrod kerak", "Erituvchi ta'siri"],
      bestFor: "Redoks xususiyatlari, E°",
      examples: "E° = +1.06 V (SHE), qaytar juft"
    },
    {
      name: "CD (Circular Dichroism)",
      description: "Λ va Δ enantiomerlarni farqlash",
      advantages: ["Xirallik aniqlash", "Enantiomer tozaligi", "Absolyut konfiguratsiya"],
      disadvantages: ["Maxsus uskuna", "Murakkab tahlil"],
      bestFor: "Xirallik, enantiomerlar",
      examples: "Λ-[Fe(phen)₃]²⁺ va Δ-[Fe(phen)₃]²⁺ CD spektrlari"
    },
    {
      name: "Fluorescence spektroskopiya",
      description: "MLCT emissiyasini o'lchash",
      advantages: ["MLCT emissiya", "Kvant unumdorligi", "Sezgir"],
      disadvantages: ["Faqat emissiv", "Quenching effektlari"],
      bestFor: "MLCT emissiya, fotoxususiyatlar",
      examples: "[Fe(phen)₃]²⁺ — kuchsiz emissiya (tez non-radiative decay). [Ru(phen)₃]²⁺ — kuchli emissiya."
    },
    {
      name: "Mössbauer spektroskopiya (⁵⁷Fe)",
      description: "Fe²⁺/Fe³⁺ va spin holatini aniqlash",
      advantages: ["Oksidlanish darajasi", "Spin holati", "Simmetriya"],
      disadvantages: ["Faqat Fe uchun", "⁵⁷Fe boyitish kerak"],
      bestFor: "Fe²⁺/Fe³⁺, spin holati",
      examples: "[Fe(phen)₃]²⁺: δ ≈ 0.3 mm/s, ΔEQ ≈ 0.5 mm/s (past spinli)"
    },
    {
      name: "X-ray kristallografiya (SCXRD)",
      description: "Kristall strukturasini aniq aniqlash",
      advantages: ["Aniq bog' uzunliklari", "Simmetriya", "3D struktura"],
      disadvantages: ["Kristall kerak", "Qimmat", "Uzoq vaqt"],
      bestFor: "Strukturaviy parametrlar",
      examples: "Fe-N = 1.98 Å, N-Fe-N bite angle = 82°"
    }
  ]
}

export default function FePhen3Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(9.15)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("h1")
  const [redoxState, setRedoxState] = useState("ferroin")

  const currentSignal = useMemo(() => {
    let closest = COMPOUND.nmrSpectrum[0]
    let minDiff = Math.abs(ppmSlider - COMPOUND.nmrSpectrum[0].ppm)
    for (let i = 1; i < COMPOUND.nmrSpectrum.length; i++) {
      const diff = Math.abs(ppmSlider - COMPOUND.nmrSpectrum[i].ppm)
      if (diff < minDiff) {
        minDiff = diff
        closest = COMPOUND.nmrSpectrum[i]
      }
    }
    return closest
  }, [ppmSlider])

  const redoxInfo = useMemo(() => {
    return redoxState === "ferroin" ? COMPOUND.redoxProperties.ferroin : COMPOUND.redoxProperties.ferriin
  }, [redoxState])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> [Fe(phen)₃]²⁺ — FERROIN YaMR!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">[Fe(phen)₃]²⁺</strong> — Ferroin, eng keng ishlatiladigan redoks indikator!
              Past spinli Fe²⁺ (d⁶), kuchli MLCT (Metal-to-Ligand Charge Transfer), aromatik YaMR signallar!
            </p>
            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹H:</strong> 7.8-9.2 ppm (aromatik)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹³C:</strong> 110-150 ppm (aromatik)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁵N:</strong> ~150 ppm (Fe-N)
                  </div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>MLCT:</strong> 510 nm (qizil rang)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Spin:</strong> Past spinli, diamagnit
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Redoks:</strong> E° = 1.06 V (Fe²⁺/Fe³⁺)
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Knowledge Base:</strong> Blau (1898), Werner (1913), Day &amp; Sanders (1967),
                McCleverty (1979), Cotton-Wilkinson, Miessler-Tarr, SDBS ID: 4821
              </p>
            </div>
            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">⚠️ XAVFSIZLIK:</strong> Phen toksik (mutagen)! Qo&apos;lqop va havo almashinuvi kerak.
                Havo ta&apos;sirida Fe²⁺ → Fe³⁺ oksidlanishi (qizil → ko&apos;k).
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

      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/nmr" className="hover:text-purple-300">YaMR spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-red-400 font-semibold">[Fe(phen)₃]²⁺</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🧲 YaMR</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol (cation) • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Diamagnit Kompleks</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">MLCT</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">D₃ Simmetriya</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Redoks Indikator</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Birikmalar katalogi
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
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Blau (1898)</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">MLCT</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Redoks Indikator</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              [Fe(phen)₃]²⁺
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Ferroin — <span className="text-red-400 italic">&quot;MLCT, aromatik YaMR, redoks indikator fenomeni&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-red-400">YaMR spektroskopiya</strong> yordamida <strong className="text-red-400">MLCT (Metal-to-Ligand Charge Transfer)</strong> va aromatik YaMR signallarini o&apos;rganish.
            Fe²⁺ — past spinli d⁶ (t₂g⁶ eg⁰), diamagnit. D₃ simmetriya, propeller shakl.
            <strong className="text-red-400"> ¹H YaMR: 7.8-9.2 ppm</strong> (aromatik, MLCT tufayli deshielded).
            <strong className="text-red-400"> E° = 1.06 V</strong> — qizil (Fe²⁺) ↔ ko&apos;k (Fe³⁺) redoks jufti.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe²⁺ (d⁶)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit</div>
              <div className="text-white font-bold">Diamagnit</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">D₃ (6)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Redoks</div>
              <div className="text-white font-bold">E° = 1.06 V</div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi — PAST SPINLI d⁶
          </h2>
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun bu kompleks diamagnit?</strong> Fe²⁺ — d⁶ elektron konfiguratsiya. phen — <em>kuchli</em> maydon ligandi (CN⁻ dan keyin).
              Δ<sub>o</sub> (17,500 cm⁻¹) &gt; P (juftlanish energiyasi, 17,000 cm⁻¹) → past spinli (low-spin), barcha elektronlar juftlangan → diamagnit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Metall ioni:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.metalIon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Elektron konfiguratsiya:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.electronConfig}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">d-elektronlar soni:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.dElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-blue-400">{COMPOUND.crystalField.spinState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Orbital to&apos;ldirilishi:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.orbitalOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.unpairedElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit momenti:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.magneticMoment}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Kristall maydon parametrlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Δ<sub>o</sub> (10Dq):</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.crystalFieldSplitting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Racah B:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.racahParameter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">β (nefelauxetik):</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.nephelauxeticRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Juftlanish energiyasi P:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.pairingEnergy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.cFSE}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-2">Spektrokimyoviy qator va MLCT</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Spektrokimyoviy qator:</strong> {COMPOUND.crystalField.spectrochemicalSeries}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Nima uchun past spinli?</strong> {COMPOUND.crystalField.whyLowSpin}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Rang sababi:</strong> {COMPOUND.crystalField.colorOrigin}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>MLCT band:</strong> {COMPOUND.crystalField.mlctBand}
            </p>
          </div>

          {/* d-orbital splitting diagram - TUZATILGAN (tspan ishlatilgan) */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital bo&apos;linish diagrammasi</h4>
            <svg viewBox="0 0 600 200" className="w-full h-48" role="img" aria-label="d-orbital splitting">
              <title>d-orbital bo&apos;linish diagrammasi — Fe²⁺ past spinli</title>
              <line x1="50" y1="180" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="100" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 100)">Energiya</text>
              <line x1="40" y1="100" x2="560" y2="100" stroke="#6b21a8" strokeWidth="1" strokeDasharray="4,2" />
              <text x="570" y="103" fontSize="8" fill="#6b21a8">Barycenter</text>
              
              {/* eg orbitals */}
              <line x1="350" y1="60" x2="450" y2="60" stroke="#eab308" strokeWidth="3" />
              <text x="400" y="50" textAnchor="middle" fontSize="10" fill="#eab308" fontWeight="bold">
                e<tspan baselineShift="sub" fontSize="7">g</tspan>
              </text>
              <text x="400" y="75" textAnchor="middle" fontSize="8" fill="#eab308">
                d<tspan baselineShift="sub" fontSize="6">x²-y²</tspan>, d<tspan baselineShift="sub" fontSize="6">z²</tspan>
              </text>
              <text x="480" y="63" fontSize="8" fill="#eab308">
                +0.6Δ<tspan baselineShift="sub" fontSize="6">o</tspan>
              </text>
              
              {/* t2g orbitals */}
              <line x1="150" y1="140" x2="250" y2="140" stroke="#22c55e" strokeWidth="3" />
              <text x="200" y="130" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">
                t<tspan baselineShift="sub" fontSize="7">2g</tspan>
              </text>
              <text x="200" y="155" textAnchor="middle" fontSize="8" fill="#22c55e">
                d<tspan baselineShift="sub" fontSize="6">xy</tspan>, d<tspan baselineShift="sub" fontSize="6">xz</tspan>, d<tspan baselineShift="sub" fontSize="6">yz</tspan>
              </text>
              <text x="120" y="143" fontSize="8" fill="#22c55e">
                -0.4Δ<tspan baselineShift="sub" fontSize="6">o</tspan>
              </text>
              
              {/* Elektronlar (t2g da 6 ta, eg da 0 ta) */}
              {[160, 180, 200, 220, 240, 260].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="140" r="4" fill="#22c55e" />
                  <text x={x} y="135" textAnchor="middle" fontSize="6" fill="#22c55e">↑↓</text>
                </g>
              ))}
              
              {/* Δo belgisi */}
              <line x1="500" y1="60" x2="500" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="60" x2="505" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="140" x2="505" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <text x="515" y="103" fontSize="10" fill="#fbbf24" fontWeight="bold">
                Δ<tspan baselineShift="sub" fontSize="7">o</tspan>
              </text>
              
              {/* MLCT arrow */}
              <line x1="200" y1="135" x2="400" y2="55" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
                </marker>
              </defs>
              <text x="310" y="80" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">MLCT</text>
            </svg>
          </div>
        </div>

        {/* SIMMETRIYA */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (D₃) — Propeller shakli
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>D₃ nuqtaviy guruhi:</strong> [Fe(phen)₃]²⁺ da 3 ta phen ligand <em>propeller shaklida</em> joylashgan.
              Bu helikal struktura — Λ (lambda) va Δ (delta) enantiomerlari. Xirallik mavjud.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Simmetriya elementlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Nuqtaviy guruh:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.pointGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Guruh tartibi:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.order}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Simmetriya elementlari:</span>
                  <span className="text-purple-400 font-mono text-xs">{COMPOUND.symmetry.symmetryElements.join(", ")}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Xirallik va propeller</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Propeller shakli:</span>
                  <span className="text-purple-400 text-xs">{COMPOUND.symmetry.propellerShape}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Xirallik:</span>
                  <span className="text-purple-400 text-xs">{COMPOUND.symmetry.chirality}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-2">YaMR uchun ekvivalentlik</h4>
            <p className="text-purple-200 text-sm">
              {COMPOUND.symmetry.nmrEquivalence}
            </p>
          </div>
        </div>

        {/* MLCT NAZARIYASI */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🌈</span> MLCT (Metal-to-Ligand Charge Transfer)
          </h2>
          <div className="bg-yellow-900/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              <strong>MLCT nima?</strong> Metal (Fe²⁺) dan ligand (phen) ga elektron o&apos;tishi.
              Fe²⁺ (t₂g) → phen (π*). Bu <em>intensiv</em> yutilish (ε ≈ 11,000) va <em>qizil rangning sababi</em>.
              d-d o&apos;tishlar Laporte ta&apos;qiqlangan, juda kuchsiz (ε &lt; 100).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">MLCT band xususiyatlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Band:</span>
                  <span className="text-yellow-400 text-xs">{COMPOUND.crystalField.mlctBand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">To&apos;lqin uzunligi:</span>
                  <span className="text-yellow-400 font-mono">510 nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Energiya:</span>
                  <span className="text-yellow-400 font-mono">19,600 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Molyar ekstinksiya:</span>
                  <span className="text-yellow-400 font-mono">ε ≈ 11,000 L/(mol·cm)</span>
                </div>
              </div>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">MLCT va YaMR effekti</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-yellow-400 text-xs">Fe²⁺ → phen (π*) elektron o&apos;tishi</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">YaMR effekti:</span>
                  <span className="text-yellow-400 text-xs">Ligand deshielded → yuqori ppm shift</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Taqqoslash:</span>
                  <span className="text-yellow-400 text-xs">Erkin phen: 7.6-8.9 ppm, Kompleks: 7.8-9.2 ppm</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>Nima uchun qizil?</strong> MLCT bandi 510 nm da (yashil-ko&apos;k yutilish). Qolgan qizil va sariq yorug&apos;lik qaytariladi → to&apos;q qizil rang.
            </p>
          </div>
        </div>

        {/* YaMR NAZARIYASI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> YaMR nazariyasi — chuqur tahlil
          </h2>
          <div className="bg-cyan-900/30 rounded-lg p-4 mb-6">
            <p className="text-cyan-300 text-sm">
              <strong>Nima uchun aynan shu kimyoviy siljishlar?</strong> Har bir yadro uchun kimyoviy siljishning fizik ma&apos;nosini,
              MLCT effektini va spektral xususiyatlarini chuqur o&apos;rganamiz.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveNmrNucleus("h1")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "h1"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹H (I=1/2)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("c13")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "c13"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹³C (I=1/2)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("n15")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "n15"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹⁵N (I=1/2)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("fe57")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "fe57"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ⁵⁷Fe (I=1/2)
            </button>
          </div>

          {activeNmrNucleus === "h1" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.h1.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Multiplicity:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.multiplicity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 7.5-9.2 ppm? (MLCT effekti)</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Spin-spin bog&apos;lanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.couplingNotes}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">MLCT YaMR effekti:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.mlctEffect}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "c13" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.c13.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Multiplicity:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.multiplicity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 110-150 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">MLCT effekti:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.mlctEffect}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "n15" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.n15.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.t1Relaxation}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.sensitivity}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 140-160 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.whyThisShift}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "fe57" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.fe57.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.fe57.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.fe57.sensitivity}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Aniqlash:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.fe57.detection}</p>
              </div>
            </div>
          )}
        </div>

        {/* STRUKTURAVIY PARAMETRLAR */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📏</span> Strukturaviy parametrlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog&apos; uzunliklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Fe-N:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.feN}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-N (phen):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.cn_phen}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-C (phen):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.cc_phen}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog&apos; burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-Fe-N (chelate):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.nFeN_cis}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-Fe-N (trans):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.nFeN_trans}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-C-N (phen):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.ccn}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Phenanthroline ligand xususiyatlari</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Struktura:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.phenanthroline.structure}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Planarlik:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.phenanthroline.planarity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Bite angle:</span>
                <span className="text-green-400 font-mono">{COMPOUND.structuralData.phenanthroline.biteAngle}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Qattiqlik:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.phenanthroline.rigidity}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              <strong>Taqqoslash:</strong> {COMPOUND.structuralData.bondLengths.comparison}
            </p>
          </div>
        </div>

        {/* YaMR SIGNAL JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧲 YaMR signallar (batafsil)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-red-400">Yadro</th>
                  <th className="py-3 px-3 text-red-400">Ligand</th>
                  <th className="py-3 px-3 text-red-400">δ (ppm)</th>
                  <th className="py-3 px-3 text-red-400">Multiplicity</th>
                  <th className="py-3 px-3 text-red-400">J (Hz)</th>
                  <th className="py-3 px-3 text-red-400">Integration</th>
                  <th className="py-3 px-3 text-red-400">Izohlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.nmrSignals.map((signal, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-red-400 font-bold">{signal.nucleus}</td>
                    <td className="py-3 px-3 text-xs">{signal.ligand}</td>
                    <td className="py-3 px-3 text-red-400 font-mono font-bold">{signal.shift}</td>
                    <td className="py-3 px-3 text-xs">{signal.multiplicity}</td>
                    <td className="py-3 px-3 text-xs font-mono">{signal.jCoupling}</td>
                    <td className="py-3 px-3">{signal.integration}</td>
                    <td className="py-3 px-3 text-xs text-purple-300">{signal.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTERAKTIV YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹H YaMR spektr simulyatsiyasi</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            Kimyoviy siljishni (δ, ppm) o&apos;zgartiring. Aromatik signallarni ko&apos;ring.
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Kimyoviy siljish (δ): {ppmSlider.toFixed(2)} ppm
            </label>
            <input
              type="range"
              min="7"
              max="10"
              step="0.05"
              value={ppmSlider}
              onChange={(e) => setPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>7.0 ppm</span>
              <span>7.80 (H₅,H₆)</span>
              <span>8.30 (H₄,H₇)</span>
              <span>8.55 (H₃,H₈)</span>
              <span>9.15 (H₂,H₉)</span>
              <span>10.0 ppm</span>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-red-400">{ppmSlider.toFixed(2)} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-red-400">
                  {currentSignal.notes !== "—" ? currentSignal.notes : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Pozitsiya:</div>
                <div className="text-xl font-mono font-bold text-red-400">
                  {ppmSlider < 8 ? "H₅,H₆ (markaziy)" : ppmSlider < 8.5 ? "H₄,H₇" : ppmSlider < 9 ? "H₃,H₈" : "H₂,H₉ (N yaqin)"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>¹H YaMR spektr simulyatsiyasi — [Fe(phen)₃]²⁺</title>
              {[7, 8, 9, 10].map((ppm, i) => (
                <g key={i}>
                  <line x1={580 - ((ppm - 7) / 3) * 530} y1="220" x2={580 - ((ppm - 7) / 3) * 530} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={580 - ((ppm - 7) / 3) * 530} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>
              
              {/* Signallar */}
              <line x1={580 - ((7.8 - 7) / 3) * 530} y1="220" x2={580 - ((7.8 - 7) / 3) * 530} y2="100" stroke="#ef4444" strokeWidth="3" />
              <text x={580 - ((7.8 - 7) / 3) * 530} y="95" textAnchor="middle" fontSize="8" fill="#ef4444">H₅,H₆</text>
              
              <line x1={580 - ((8.3 - 7) / 3) * 530} y1="220" x2={580 - ((8.3 - 7) / 3) * 530} y2="80" stroke="#ef4444" strokeWidth="3" />
              <text x={580 - ((8.3 - 7) / 3) * 530} y="75" textAnchor="middle" fontSize="8" fill="#ef4444">H₄,H₇</text>
              
              <line x1={580 - ((8.55 - 7) / 3) * 530} y1="220" x2={580 - ((8.55 - 7) / 3) * 530} y2="60" stroke="#ef4444" strokeWidth="3" />
              <text x={580 - ((8.55 - 7) / 3) * 530} y="55" textAnchor="middle" fontSize="8" fill="#ef4444">H₃,H₈</text>
              
              <line x1={580 - ((9.15 - 7) / 3) * 530} y1="220" x2={580 - ((9.15 - 7) / 3) * 530} y2="40" stroke="#ef4444" strokeWidth="3" />
              <text x={580 - ((9.15 - 7) / 3) * 530} y="35" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">H₂,H₉</text>
              
              {/* Slider pozitsiyasi */}
              <line
                x1={580 - ((ppmSlider - 7) / 3) * 530}
                y1="220"
                x2={580 - ((ppmSlider - 7) / 3) * 530}
                y2="20"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
            </svg>
          </div>
          <div className="bg-red-900/30 rounded-lg p-3">
            <p className="text-red-300 text-xs">
              <strong>📌 Muhim kuzatuv:</strong> N atomiga yaqin protonlar (H₂,H₉) eng yuqori ppm da (9.15) — MLCT tufayli kuchli deshielded.
              Markaziy halqa protonlari (H₅,H₆) eng past ppm da (7.80). 6H + 6H + 6H + 6H = 24H umumiy integratsiya.
            </p>
          </div>
        </div>

        {/* REDOKS XUSUSIYATLARI */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚡</span> Redoks xususiyatlari — Ferroin/Ferriin
          </h2>
          <div className="bg-orange-900/30 rounded-lg p-4 mb-6">
            <p className="text-orange-300 text-sm">
              <strong>Redoks indikator:</strong> [Fe(phen)₃]²⁺ (Ferroin, qizil) ↔ [Fe(phen)₃]³⁺ (Ferriin, ko&apos;k).
              E° = +1.06 V (SHE). Bu eng keng ishlatiladigan redoks indikatorlardan biri — analitik kimyoda.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setRedoxState("ferroin")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                redoxState === "ferroin"
                  ? "bg-red-600/60 text-white border border-red-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ⬤ Ferroin [Fe(phen)₃]²⁺ (Qizil)
            </button>
            <button
              onClick={() => setRedoxState("ferriin")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                redoxState === "ferriin"
                  ? "bg-blue-600/60 text-white border border-blue-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ⬤ Ferriin [Fe(phen)₃]³⁺ (Ko'k)
            </button>
          </div>
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <h3 className="text-orange-400 font-bold mb-3">{redoxInfo.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-purple-400">Oksidlanish darajasi:</div>
                <div className="text-lg font-mono font-bold text-orange-400">{redoxInfo.oxidationState}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Spin holati:</div>
                <div className="text-lg font-mono font-bold text-orange-400">{redoxInfo.spinState}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Rang:</div>
                <div className="text-lg font-mono font-bold text-orange-400">{redoxInfo.color}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">MLCT:</div>
                <div className="text-lg font-mono font-bold text-orange-400">{redoxInfo.mlct}</div>
              </div>
            </div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-4">
            <h4 className="text-orange-400 font-bold mb-2">Redoks jufti</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Reaksiya:</span>
                <span className="text-orange-400 text-xs font-mono">{COMPOUND.redoxProperties.redoxCouple.reaction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Standart potentsial:</span>
                <span className="text-orange-400 font-mono">{COMPOUND.redoxProperties.redoxCouple.standardPotential}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Nernst:</span>
                <span className="text-orange-400 text-xs font-mono">{COMPOUND.redoxProperties.redoxCouple.nernst}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Qaytarlik:</span>
                <span className="text-orange-400 text-xs">{COMPOUND.redoxProperties.redoxCouple.reversibility}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Rang o&apos;zgarishi:</span>
                <span className="text-orange-400 text-xs">{COMPOUND.redoxProperties.redoxCouple.colorChange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QO'LLANILISHI */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🏭</span> Qo&apos;llanilishi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.applications.map((app, i) => (
              <div key={i} className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
                <h3 className="text-amber-400 font-bold mb-3">{app.field}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Qo&apos;llanish:</span>
                    <span className="text-amber-400 text-xs">{app.use}</span>
                  </div>
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Mexanizm:</span>
                    <span className="text-amber-400 text-xs">{app.mechanism}</span>
                  </div>
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Misollar:</span>
                    <span className="text-amber-400 text-xs">{app.examples}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📜</span> Tarixiy kontekst
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Blau (1898)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.blau.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.blau.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.blau.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Usul:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.blau.method}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Werner (1913)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.werner.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.werner.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Day &amp; Sanders (1967)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olimlar:</span>
                  <span className="text-amber-400">{COMPOUND.history.daySanders.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.daySanders.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.daySanders.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.daySanders.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">McCleverty (1979)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.mccleverty.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.mccleverty.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.mccleverty.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.mccleverty.contribution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa MLCT komplekslar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Metall</th>
                  <th className="py-3 px-3 text-teal-400">Rang</th>
                  <th className="py-3 px-3 text-teal-400">¹H YaMR</th>
                  <th className="py-3 px-3 text-teal-400">Spin holati</th>
                  <th className="py-3 px-3 text-teal-400">MLCT</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 0 ? "bg-red-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.metal}</td>
                    <td className="py-3 px-3 text-xs">{comp.color}</td>
                    <td className="py-3 px-3 text-xs font-mono text-yellow-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs">{comp.spinState}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.mlct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LABORATORIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi</h2>
          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveLabStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeLabStep === i ? "bg-red-900/40 border-2 border-red-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-red-500/50"
                }`}
              >
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

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ Halaqit beruvchi omillar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-red-400">Manba</th>
                  <th className="py-3 px-3 text-red-400">Ta&apos;sir</th>
                  <th className="py-3 px-3 text-red-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-red-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((int, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${
                      activeInterference === i ? "bg-red-900/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-bold">{int.source}</td>
                    <td className="py-3 px-3 text-xs">{int.effect}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        int.severity === "Yuqori" ? "bg-red-600/30 text-red-400" :
                        int.severity === "O'rta" ? "bg-yellow-600/30 text-yellow-400" :
                        "bg-green-600/30 text-green-400"
                      }`}>
                        {int.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs">{int.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning nazariy izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].theoryNote}
            </p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Kengaytiruvchi metodlar</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.advancedTechniques.map((tech, i) => (
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
            <h3 className="text-red-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">{COMPOUND.advancedTechniques[activeTechnique].description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.advancedTechniques[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.advancedTechniques[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
              <div className="text-white text-sm">{COMPOUND.advancedTechniques[activeTechnique].bestFor}</div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
              <div className="text-red-400 font-bold text-xs mb-1">Misollar:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-red-400">Kristall maydon nazariyasi:</strong> Fe²⁺ (d⁶), past spinli (t₂g⁶ eg⁰), diamagnit, Δ<sub>o</sub> ≈ 17,500 cm⁻¹</li>
            <li><strong className="text-red-400">MLCT:</strong> Fe²⁺ (t₂g) → phen (π*) — 510 nm, ε ≈ 11,000 — intensiv qizil rang</li>
            <li><strong className="text-red-400">Simmetriya (D₃):</strong> Propeller shakl, Λ va Δ enantiomerlar, xirallik</li>
            <li><strong className="text-red-400">¹H YaMR:</strong> 7.8-9.2 ppm (aromatik, MLCT deshielding), 4 ta signal, 24H umumiy</li>
            <li><strong className="text-red-400">¹³C YaMR:</strong> 110-150 ppm (aromatik)</li>
            <li><strong className="text-red-400">Redoks:</strong> Ferroin (qizil) ↔ Ferriin (ko&apos;k), E° = +1.06 V</li>
            <li><strong className="text-red-400">Strukturaviy:</strong> Fe-N = 1.98 Å, bite angle = 82° (phen kichik bite)</li>
            <li><strong className="text-red-400">Qo&apos;llanish:</strong> Redoks indikator, spektrofotometriya, DSSC</li>
            <li><strong className="text-red-400">Tarix:</strong> Blau (1898), Werner (1913), Day &amp; Sanders (1967)</li>
            <li><strong className="text-red-400">Taqqoslash:</strong> [Fe(bipy)₃]²⁺, [Ru(phen)₃]²⁺ — MLCT komplekslar</li>
            <li><strong className="text-red-400">Kengaytiruvchi:</strong> UV-Vis, CV, CD, Fluorescence, Mössbauer, XRD</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/cis-pt-cl2-nh3-2" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Sisplatin →</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(phen)₃]²⁺ (Ferroin) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Blau (1898), Werner (1913), Day &amp; Sanders (1967), McCleverty (1979), Cotton-Wilkinson, Miessler-Tarr, SDBS ID: 4821</p>
        </div>
      </footer>
    </main>
  )
}