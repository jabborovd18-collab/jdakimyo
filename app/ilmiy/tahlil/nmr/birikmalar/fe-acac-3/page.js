"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// [Fe(acac)₃] — TRIS(ATSETILASETONATO)TEMIR(III) YaMR (ILMIY BOYITILGAN)
// Manbalar: Morgan & Moss (1920), Drago (1965), Bertini-Luchinat (1986),
//           La Mar (1973), Cotton-Wilkinson, Miessler-Tarr, SDBS ID: 1163
// Xususiyat: Paramagnit YaMR, Contact Shift, Curie Spin, Ray-Dutt Twist
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(acac)<sub>3</sub>]",
  formulaPlain: "[Fe(acac)3]",
  iupac: "Tris(2,4-pentandionato)temir(III)",
  commonName: "Temir(III) atsetilasetonat (qizil-jigar)",
  molarMass: 353.17,
  casNumber: "14768-11-7",
  color: "qizil-jigar (red-brown)",
  structure: "Oktaedr (D₃, propeller)",
  metalLigand: "Fe-O (acac⁻, bidentat, O,O'-xelat)",
  pointGroup: "D₃",
  electrolyteType: "Noelektrolit",
  molarConductivity: "~0 S·cm²/mol (organik erituvchilarda)",
  solubility: "CHCl₃, benzol, toluol, CCl₄, DMSO — eriydi; suvda erimeydi",
  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI (YUQORI SPINLI d⁵)
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Fe³⁺",
    electronConfig: "[Ar] 3d⁵",
    dElectrons: 5,
    spinState: "Yuqori spinli (high-spin)",
    orbitalOccupancy: "t₂g³ eg²",
    unpairedElectrons: 5,
    magneticMoment: "μ_eff ≈ 5.9 BM (spin-only: √35 = 5.92 BM)",
    crystalFieldSplitting: "Δo ≈ 14,000 cm⁻¹ (1.74 eV, ~714 nm)",
    racahParameter: "B ≈ 600 cm⁻¹ (erkin ion B₀ = 1100 cm⁻¹)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.55",
    pairingEnergy: "P ≈ 30,000 cm⁻¹",
    cFSE: "CFSE = 0 cm⁻¹ (yuqori spinli d⁵ da simmetrik, 0)",
    spectrochemicalSeries: "acac⁻ — o'rtacha maydon ligandi (F⁻ < H₂O < acac⁻ < NH₃ < en < NO₂⁻ < CN⁻)",
    whyHighSpin: "Δo (14,000) << P (30,000) → yuqori spinli, 5 ta toq elektron (paramagnit)",
    colorOrigin: "d-d o'tishlar Laporte ta'qiqlangan, lekin spin-allowed: ⁶A₁g → ⁴T₁g, ⁴T₂g (kuchsiz). Qizil-jigar rang — ligand-to-metal charge transfer (LMCT) natijasi.",
    chargeTransfer: "LMCT: acac⁻ (π) → Fe³⁺ (~25,000 cm⁻¹, 400 nm, kuchli)",
    zeroCFSE: "Yuqori spinli d⁵ — CFSE = 0. Bu yagona holat! Barcha 5 ta elektron turli orbitallarda, simmetrik to'ldirilgan.",
    magneticAnisotropy: "Kichik magnit anizotropiya (Δχ ≈ 10⁻³² m³/molecule) — pseudo-contact shift uchun muhim"
  },
  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA VA SPEKTRAL TANLASH QOIDALARI
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "D₃",
    order: 6,
    symmetryElements: ["E", "2C₃", "3C₂"],
    propellerShape: "3 ta acac⁻ halqasi propeller shaklida joylashgan (helikal struktura)",
    chirality: "Λ (lambda) va Δ (delta) enantiomerlar — xirallik",
    nmrEquivalence: "D₃ simmetriyada: barcha 3 ta acac⁻ ekvivalent. Har bir acac⁻ da 2 ta CH₃ va 1 ta CH. Shuning uchun: 2 ta signal — 18H (CH₃, singlet) + 3H (CH, singlet).",
    irActive: "A₂ + E — IR faol (asimetrik tebranishlar)",
    ramanActive: "A₁ + E — Raman faol (simmetrik tebranishlar)",
    mutualExclusion: "D₃ da markaziy simmetriya yo'q — IR va Raman ustma-ust tushishi mumkin",
    rayDuttTwist: "Ray-Dutt twist mexanizmi — ligandlarning tez almashinishi (fluxionallik). D₃ ↔ D₃h orqali trigonal prizma → oktaedr qayta tashkil topish."
  },
  //  ═══════════════════════════════════════════════════════════════
  // PARAMAGNIT YaMR NAZARIYASI — CHUQUR (ILMIY BOYITILGAN)
  //  ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "Keng diapazon: -60 dan +80 ppm gacha (diamagnit chegaradan tashqarida!)",
      whyThisShift: "Paramagnit siljish 3 ta komponentdan iborat: (1) Fermi Contact Shift (FC, dominant), (2) Pseudo-Contact Shift (PC, dipolyar), (3) Diamagnit siljish. FC shift — unpaired spin zichligi proton orbitallariga tarqaladi. Manfiy shift (-15, -72 ppm) — spin polarization effect (McConnell mechanism): toq elektron t₂g da, lekin ligand π* orbitallari orqali manfiy spin density hosil qiladi.",
      multiplicity: "Singlet (D₃ simmetriya, barcha CH₃ va CH ekvivalent)",
      linewidth: "~50-500 Hz (keng, Curie spin relaksatsiya tufayli)",
      t1Relaxation: "T₁ ≈ 0.1-10 ms (juda qisqa, elektron-proton dipol relaksatsiyasi)",
      t2Relaxation: "T₂ ≈ 0.1-5 ms (keng chiziqlar)",
      contactShift: "CH₃: -15.1 ppm, CH: -71.8 ppm (CDCl₃, 298 K)",
      pseudoContactShift: "Δδ_PC = (1/(12πr³))[Δχ_ax(3cos²θ-1) + (3/2)Δχ_rh sin²θ cos2φ]",
      curieSpin: "Curie spin relaksatsiya: 1/T₂ ∝ B₀²·μ_eff²·τ_c/r⁶ — magnit maydon oshgani sari chiziqlar kengayadi"
    },
    c13: {
      nucleus: "¹³C (I = 1/2, 1.1% tabiiy)",
      shift: "Keng diapazon: -2000 dan +2000 ppm gacha",
      whyThisShift: "¹³C paramagnit siljish ¹H dan ham katta. C=O uglerodda ~500-1500 ppm (bevosita Fe ga bog'langan O orqali). CH va CH₃ da kichikroq manfiy shift.",
      sensitivity: "¹³C sezgirligi ¹H dan 5700 marta past — ko'p skan kerak",
      linewidth: "~200-2000 Hz (juda keng)",
      t1Relaxation: "T₁ ≈ 0.01-1 ms",
      applications: "Spin density xaritasi, ligand elektron strukturasi"
    },
    fe57: {
      nucleus: "⁵⁷Fe (I = 1/2, 2.12% tabiiy)",
      shift: "Juda keng diapazon (-5000 dan +5000 ppm)",
      whyThisShift: "⁵⁷Fe YaMR paramagnit komplekslarda juda qiyin. Keng chiziqlar, past sezgirlik.",
      sensitivity: "Sezgirlik juda past",
      linewidth: "~500-5000 Hz",
      t1Relaxation: "T₁ ≈ 0.01-0.1 ms",
      detection: "Odatda Mössbauer spektroskopiya ko'proq ishlatiladi"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      feO: "1.95-2.00 Å (Fe-O, o'rtacha 1.98 Å)",
      co_single: "1.28-1.30 Å (C-O, yarim qo'sh bog'",
      cc_single: "1.39-1.41 Å (C-C, xelat halqasida)",
      cc_methyl: "1.50-1.52 Å (C-CH₃)",
      comparison: "[Cr(acac)₃]: Cr-O = 1.96 Å. [Al(acac)₃]: Al-O = 1.88 Å. [Co(acac)₃]: Co-O = 1.89 Å. Fe³⁺ ion radiusi kattaroq.",
      biteAngle: "O-Fe-O bite angle: ~90° (xelat burchagi)"
    },
    bondAngles: {
      ofeo: "90° (chelate O-Fe-O)",
      ccco: "~125° (C-C-C, xelat halqasi)",
      oco: "~124° (O-C-O, sp²)",
      comparison: "Ideal oktaedr — 90° va 180°. Propeller shakl biroz distorsiya qiladi."
    },
    fluxionality: {
      mechanism: "Ray-Dutt twist (trigonal prizma orqali) yoki Bailar twist",
      activation: "Eₐ ≈ 50-80 kJ/mol",
      rate: "k ≈ 10⁴-10⁶ s⁻¹ (298 K)",
      nmrEffect: "Yuqori haroratda D₃ simmetriya o'rtacha, past haroratda sekinlashadi (VT-NMR orqali kuzatiladi)",
      chiralInversion: "Λ ↔ Δ enantiomerlarning tez almashinishi (racemizatsiya)"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // TERMODINAMIK VA MAGNIT PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    stability: {
      logBeta3: "β₃ ≈ 10²⁰ (barqaror, xelat effekti)",
      stepwise: "K₁ ≈ 10⁹, K₂ ≈ 10⁷, K₃ ≈ 10⁴",
      chelateEffect: "Xelat effekti — 3 ta bidentat ligand, entropiya foydali",
      comparison: "[Fe(H₂O)₆]³⁺ dan 10²⁰ marta barqaror"
    },
    magneticProperties: {
      spinState: "Yuqori spinli, S = 5/2",
      muEffective: "5.9 BM (spin-only: 5.92 BM)",
      curieConstant: "C ≈ 4.375 emu·K/mol",
      curieLaw: "χ_M = C/T (Curie qonuni, 50-300 K)",
      antiferromagnetic: "Qattiq holatda kuchsiz antiferromagnit o'zaro ta'sir (θ ≈ -1 K)",
      evansMethod: "Evans usuli bilan μ_eff aniqlash: Δf = (f_sample - f_ref) = k·χ_M·c"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    morganMoss: {
      year: 1920,
      scientist: "Gilbert T. Morgan & Harry W. Moss (Angliya)",
      achievement: "Birinchi marta metal-β-diketonat komplekslarini tizimli sintez qildi",
      contribution: "Xelat effekti va strukturaviy tavsiflar",
      significance: "Koordinatsion kimyoda klassik ish"
    },
    drago: {
      year: 1965,
      scientist: "Russell S. Drago (AQSh)",
      achievement: "Paramagnit YaMR spektroskopiya orqali [Fe(acac)₃] ni batafsil o'rgandi",
      contribution: "Contact Shift nazariyasini tasdiqladi",
      method: "¹H YaMR, turli erituvchilar, harorat effektlari"
    },
    laMar: {
      year: 1973,
      scientist: "Gerd N. La Mar (AQSh)",
      achievement: "Paramagnit komplekslarda YaMR shiftlarini tizimli tahlil qildi",
      contribution: "Spin density xaritasi, McConnell mexanizmi",
      significance: "NMR of Paramagnetic Molecules — klassik monografiya"
    },
    bertini: {
      year: 1986,
      scientist: "Ivano Bertini & Claudio Luchinat (Italiya)",
      achievement: "Paramagnit NMR nazariyasining to'liq ishlab chiqilishi",
      book: "'NMR of Paramagnetic Molecules in Biological Systems'",
      contribution: "Curie spin, pseudo-contact shift, relaxation theory"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA PARAMAGNIT KOMPLEKSLAR
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[Fe(acac)₃]",
      metal: "Fe³⁺ (d⁵)",
      spinState: "Yuqori spinli (S=5/2)",
      muEff: "5.9 BM",
      nmrShift: "¹H: -15, -72 ppm",
      stability: "β₃ ≈ 10²⁰"
    },
    {
      compound: "[Fe(phen)₃]²⁺",
      metal: "Fe²⁺ (d⁶)",
      spinState: "Past spinli (S=0)",
      muEff: "0 BM (diamagnit)",
      nmrShift: "¹H: 7.5-9.2 ppm (diamagnit)",
      stability: "β₃ ≈ 10²¹"
    },
    {
      compound: "[Co(acac)₃]",
      metal: "Co³⁺ (d⁶)",
      spinState: "Past spinli (S=0)",
      muEff: "0 BM (diamagnit)",
      nmrShift: "¹H: 1.9, 5.9 ppm (diamagnit)",
      stability: "β₃ ≈ 10²⁰"
    },
    {
      compound: "[Mn(acac)₃]",
      metal: "Mn³⁺ (d⁴)",
      spinState: "Yuqori spinli (S=2)",
      muEff: "4.9 BM",
      nmrShift: "¹H: keng diapazon",
      stability: "β₃ ≈ 10¹⁷"
    },
    {
      compound: "[Cr(acac)₃]",
      metal: "Cr³⁺ (d³)",
      spinState: "Yuqori spinli (S=3/2)",
      muEff: "3.8 BM",
      nmrShift: "¹H: paramagnit shift",
      stability: "β₃ ≈ 10²¹"
    }
  ],
  // YaMR ma'lumotlari
  nmrNucleus: "¹H, ¹³C",
  chemicalShift: "¹H: -15.1 ppm (CH₃), -71.8 ppm (CH)",
  multiplicity: "singlet",
  jCoupling: "— (paramagnit kengayish tufayli ko'rinmaydi)",
  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "¹H",
      ligand: "CH₃ (γ-metil, 6 ta)",
      shift: -15.1,
      multiplicity: "keng singlet",
      jCoupling: "—",
      integration: "18H",
      notes: "Fermi contact shift (-15.1 ppm). Spin polarization effect tufayli manfiy shift. D₃ simmetriya — barcha 6 ta CH₃ ekvivalent."
    },
    {
      nucleus: "¹H",
      ligand: "CH (metin, 3 ta)",
      shift: -71.8,
      multiplicity: "keng singlet",
      jCoupling: "—",
      integration: "3H",
      notes: "Juda kuchli paramagnit shift (-71.8 ppm). Metin uglerod to'g'ridan-to'g'ri Fe-O-C halqasida, katta spin density."
    },
    {
      nucleus: "¹³C",
      ligand: "C=O",
      shift: 1250,
      multiplicity: "keng singlet",
      jCoupling: "—",
      integration: "3C",
      notes: "Karboksil uglerod — juda katta paramagnit shift. ¹³C tabiiy tarqalishi 1.1% — ko'p skan kerak."
    },
    {
      nucleus: "¹³C",
      ligand: "CH (metin)",
      shift: -180,
      multiplicity: "keng singlet",
      jCoupling: "—",
      integration: "3C",
      notes: "Metin uglerod — manfiy shift (spin polarization)."
    },
    {
      nucleus: "¹³C",
      ligand: "CH₃ (metil)",
      shift: -50,
      multiplicity: "keng singlet",
      jCoupling: "—",
      integration: "6C",
      notes: "Metil uglerod — kichikroq manfiy shift."
    }
  ],
  // YaMR spektr ma'lumotlari (simulyatsiya uchun)
  nmrSpectrum: [
    { ppm: -80, intensity: 0, notes: "—" },
    { ppm: -71.8, intensity: 0.3, notes: "¹H: CH (singlet, 3H)" },
    { ppm: -50, intensity: 0, notes: "—" },
    { ppm: -15.1, intensity: 1.0, notes: "¹H: CH₃ (singlet, 18H)" },
    { ppm: 0, intensity: 0, notes: "TMS referens" },
    { ppm: 5, intensity: 0, notes: "—" },
    { ppm: 10, intensity: 0, notes: "—" }
  ],
  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "Paramagnit aralashmalar (Fe²⁺, Mn²⁺, Cu²⁺)",
      effect: "Signallarni kengaytiradi, paramagnit shift oshadi",
      severity: "Yuqori",
      solution: "Sof namuna ishlatish. Paramagnit aralashmalardan saqlash.",
      theoryNote: "Paramagnit aralashmalar 1/r⁶ bog'liqlikda signallarni kengaytiradi. Sof [Fe(acac)₃] olish uchun sublimatsiyalash kerak."
    },
    {
      source: "Diamagnit aralashmalar (Al(acac)₃, Co(acac)₃)",
      effect: "0-10 ppm diapazonida diamagnit signallar paydo bo'ladi",
      severity: "O'rta",
      solution: "YaMR orqali aralashmalarni aniqlash. Sof namuna ishlatish.",
      theoryNote: "Diamagnit aralashmalar 0-10 ppm da signallar beradi. [Fe(acac)₃] da -15 va -72 ppm — bu aralashmalardan uzoq."
    },
    {
      source: "Namlik (H₂O)",
      effect: "D₂O da HOD signal 4.7 ppm da (paramagnit muhitda kengayadi)",
      severity: "O'rta",
      solution: "Organik erituvchilardan foydalanish (CDCl₃, C₆D₆).",
      theoryNote: "[Fe(acac)₃] organik erituvchilarda eriydi, suvda erimeydi. CDCl₃ yoki C₆D₆ eng mos erituvchilar."
    },
    {
      source: "Magnit maydon kuchining o'zgarishi (B₀)",
      effect: "Curie spin relaksatsiya: kengroq chiziqlar yuqori B₀ da",
      severity: "Past",
      solution: "B₀ ga bog'liq emas — standart 400-600 MHz spektrometrda ishlaydi.",
      theoryNote: "Curie spin: 1/T₂ ∝ B₀². 600 MHz da chiziqlar 400 MHz dan 2.25 marta kengroq bo'lishi mumkin."
    },
    {
      source: "Harorat effektlari",
      effect: "Past T da signallar kengayadi (Curie qonuni: χ_M ∝ 1/T)",
      severity: "O'rta",
      solution: "298-320 K da ishlash tavsiya etiladi. VT-NMR uchun haroratni nazorat qilish.",
      theoryNote: "Curie qonuni: χ_M = C/T. Past T da χ_M oshadi, paramagnit shift oshadi. VT-NMR orqali kinetikani o'rganish mumkin."
    },
    {
      source: "Erituvchi ta'siri (solvatochromism)",
      effect: "Kimyoviy siljishlar biroz o'zgaradi (erituvchiga bog'liq)",
      severity: "Past",
      solution: "Standart erituvchi (CDCl₃) ishlatish. Har xil erituvchilarda taqqoslash.",
      theoryNote: "[Fe(acac)₃] solvatochromism — erituvchining donorlik xususiyati shiftlarni biroz o'zgartiradi. CDCl₃ (ε = 4.8) standart."
    }
  ],
  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak, labor xalat. [Fe(acac)₃] zaharli emas, lekin organik erituvchilar (CHCl₃, benzol) zaharli. Havo almashinuvi yaxshi bo'lgan joyda ishlash.",
      time: "15 daq",
      theoryNote: "[Fe(acac)₃] zaharli emas, lekin organik erituvchilar (CDCl₃, C₆D₆) zaharli. Havo almashinuvi va himoya vositalari kerak."
    },
    {
      step: 2,
      title: "Sof [Fe(acac)₃] ni tayyorlash",
      desc: "Tijorat [Fe(acac)₃] (99%) yoki sintez. Sublimatsiya orqali tozalash (150°C, 0.1 mmHg). Quruq qorong'i joyda saqlash.",
      time: "1-2 soat (sintez yoki sublimatsiya)",
      theoryNote: "Sublimatsiya orqali tozalash — [Fe(acac)₃] sublimatsiyalanadi (gaz fazasiga o'tadi). Bu uning molekulyar xarakterini ko'rsatadi."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming) qilish. CDCl₃ yoki C₆D₆ erituvchi.",
      time: "30 daq",
      theoryNote: "Paramagnit komplekslar uchun yaxshi shimlash juda muhim — keng chiziqlarni iloji boricha toraytirish uchun."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "20-50 mg [Fe(acac)₃] ni 0.6 mL CDCl₃ da eritish. YaMR naychaga solish. TMS (referens) qo'shish.",
      time: "10 daq",
      theoryNote: "CDCl₃ (deuterlangan xloroform) — eng mos erituvchi. TMS referens (0 ppm). Paramagnit shift -60 dan +60 ppm gacha bo'lishi mumkin."
    },
    {
      step: 5,
      title: "¹H YaMR spektrini olish (keng diapazon)",
      desc: "¹H YaMR spektrini olish (16-64 skan). DIQQAT: Keng diapazonda skanerlash kerak (-80 dan +80 ppm gacha)! Standart 0-10 ppm diapazoni etarli emas!",
      time: "5-10 daq",
      theoryNote: "Paramagnit komplekslar uchun KENG diapazonda skanerlash kerak! CH₃ signali -15.1 ppm, CH signali -71.8 ppm — ikkalasi ham diamagnit chegaradan (-10 dan +12 ppm) tashqarida."
    },
    {
      step: 6,
      title: "Natijani tekshirish",
      desc: "-15.1 ppm da CH₃ signali (18H, singlet) va -71.8 ppm da CH signali (3H, singlet) borligini tekshirish. 18:3 = 6:1 integratsiya nisbati to'g'rimi?",
      time: "5 daq",
      theoryNote: "18:3 = 6:1 integratsiya nisbati — [Fe(acac)₃] formulani tasdiqlaydi. 3 ta acac⁻: har birida 2 CH₃ (6H) + 1 CH (1H) = 7H. 3 × 7 = 21H umumiy, lekin CH₃:CH = 18:3."
    },
    {
      step: 7,
      title: "VT-NMR (ixtiyoriy — o'zgaruvchan harorat)",
      desc: "Haroratni 250 K dan 350 K gacha o'zgartirib, signallarning o'zgarishini kuzatish. Curie qonuni: past T da shiftlar kuchayadi.",
      time: "30-60 daq",
      theoryNote: "Curie qonuni: χ_M = C/T. Past haroratda magnit qabul qiluvchanlik oshadi → paramagnit shiftlar kuchayadi. VT-NMR orqali Ray-Dutt twist mexanizmini o'rganish mumkin."
    },
    {
      step: 8,
      title: "Evans usuli bilan μ_eff aniqlash (ixtiyoriy)",
      desc: "Evans usuli: namuna + TMS + erituvchi (ko'pik naycha). Referens: sof erituvchi + TMS. Δf = frequency shift (Hz). μ_eff = 2.828√(χ_M·T) hisoblash.",
      time: "30-40 daq",
      theoryNote: "Evans usuli: μ_eff = 0.0616·√((Δf·T)/(c·m)) BM. [Fe(acac)₃] uchun kutilayotgan qiymat: 5.9 BM (yuqori spinli d⁵)."
    }
  ],
  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "SQUID magnitometriya",
      description: "μ_eff ni aniq o'lchash (0.1 K dan 400 K gacha)",
      advantages: ["Juda aniq μ_eff", "Harorat bog'liqligi", "Curie-Weiss qonuni"],
      disadvantages: ["Qimmat uskunalar", "Faqat qattiq namuna", "Uzoq vaqt"],
      bestFor: "Magnit xususiyatlar, Curie qonuni",
      examples: "μ_eff = 5.9 BM (S=5/2, yuqori spinli d⁵)"
    },
    {
      name: "EPR spektroskopiya",
      description: "Elektron paramagnit rezonans (g-faktor, A tensor)",
      advantages: ["g-faktor aniqlash", "Spin holati", "Koordinatsion geometriya"],
      disadvantages: ["Faqat paramagnit", "Keng chiziqlar (S=5/2)", "Maxsus uskunalar"],
      bestFor: "g-faktor, zero-field splitting",
      examples: "g ≈ 2.0, |D| ≈ 0.5-1.0 cm⁻¹ (ZFS, S=5/2)"
    },
    {
      name: "Mössbauer spektroskopiya (⁵⁷Fe)",
      description: "⁵⁷Fe yadrolari energiya darajalarini o'lchash",
      advantages: ["Oksidlanish darajasi", "Spin holati", "Simmetriya"],
      disadvantages: ["Faqat Fe uchun", "⁵⁷Fe boyitish kerak", "Past harorat"],
      bestFor: "Fe²⁺/Fe³⁺, spin holati",
      examples: "δ ≈ 0.4 mm/s, ΔEQ ≈ 0.8 mm/s (Fe³⁺, yuqori spinli)"
    },
    {
      name: "VT-NMR (Variable Temperature)",
      description: "Haroratni o'zgartirib paramagnit shiftlarni o'rganish",
      advantages: ["Curie qonuni", "Kinetic parametrlar", "Ray-Dutt twist"],
      disadvantages: ["Harorat nazorati", "Uzoq vaqt", "Murakkab tahlil"],
      bestFor: "Fluxionallik, kinetika",
      examples: "Ray-Dutt twist Eₐ ≈ 50-80 kJ/mol"
    },
    {
      name: "UV-Vis spektroskopiya",
      description: "Elektron o'tishlarni o'lchash (d-d va LMCT)",
      advantages: ["Δo aniqlash", "LMCT kuchi", "Tez"],
      disadvantages: ["d-d o'tishlar kuchsiz", "Murakkab interpretatsiya"],
      bestFor: "Δo o'lchash, LMCT",
      examples: "LMCT ~400 nm, d-d o'tishlar ~700-1000 nm"
    },
    {
      name: "DFT hisob-kitoblari (UB3LYP)",
      description: "Spin density xaritasi, paramagnit shift bashorati",
      advantages: ["Spin density", "Shift bashorati", "Mexanizm"],
      disadvantages: ["Kuchli kompyuter", "Murakkab"],
      bestFor: "Spin density, paramagnit shift",
      examples: "UB3LYP/6-31G(d): CH₃ -14 ppm, CH -70 ppm (tajribaga mos)"
    }
  ]
}

export default function FeAcac3Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(-15.1)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("h1")
  const [evansFrequency, setEvansFrequency] = useState(45)
  const [evansConcentration, setEvansConcentration] = useState(0.05)
  const [evansTemperature, setEvansTemperature] = useState(298)

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

  // Evans usuli bilan μ_eff hisoblash
  // μ_eff = 0.0616·√((Δf·T)/(c·m)) BM
  // soddalashtirilgan: μ_eff = 2.828·√(χ_M·T), χ_M = (3·Δf)/(4π·c·ν₀·10⁶)
  // amaliy: μ_eff ≈ 0.0616·√((Δf·T)/c) (agar m = 1 g/mL bo'lsa)
  const muEff = useMemo(() => {
    // soddalashtirilgan Evans formulasi: μ_eff = 0.0616·√((Δf·T)/c) BM
    const deltaF = evansFrequency // Hz
    const T = evansTemperature // K
    const c = evansConcentration * 1000 // mol/m³ (mol/L dan)
    const mu = 0.0616 * Math.sqrt((deltaF * T) / (c / 1000))
    return mu.toFixed(2)
  }, [evansFrequency, evansTemperature, evansConcentration])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> [Fe(acac)₃] — PARAMAGNIT YaMR FENOMENI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">[Fe(acac)₃]</strong> — Tris(atsetilasetonato)temir(III),
              YaMR spektroskopiyasining eng qiziqarli fenomenini o&apos;rganish uchun: <strong className="text-red-300">Contact Shift</strong>!
              Yuqori spinli Fe³⁺ (d⁵, S=5/2), 5 ta toq elektron, keng diapazonda YaMR signallar!
            </p>
            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹H:</strong> -15.1 ppm (CH₃, 18H)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹H:</strong> -71.8 ppm (CH, 3H)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Diapazon:</strong> -60 dan +80 ppm
                  </div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Yuqori spinli:</strong> d⁵, S=5/2
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Magnit:</strong> μ_eff ≈ 5.9 BM
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Simmetriya:</strong> D₃ (propeller)
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Knowledge Base:</strong> Morgan & Moss (1920), Drago (1965), La Mar (1973),
                Bertini & Luchinat (1986), Cotton-Wilkinson, Miessler-Tarr, SDBS ID: 1163
              </p>
            </div>
            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">⚠️ DIQQAT:</strong> Paramagnit komplekslar uchun <em>keng diapazonda</em> skanerlash kerak!
                Standart 0-10 ppm diapazoni etarli emas. -80 dan +80 ppm gacha kerak!
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
              <Link href="/ilmiy/tahlil/nmr" className="hover:text-purple-300">YaMR spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-red-400 font-semibold">[Fe(acac)₃]</span>
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
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Paramagnit Kompleks</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Yuqori Spinli (d⁵)</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">D₃ Simmetriya</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Contact Shift</span>
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
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit Kompleks</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Yuqori Spinli (d⁵)</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Contact Shift</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">D₃ Simmetriya</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              [Fe(acac)₃]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Tris(atsetilasetonato)temir(III) — <span className="text-red-400 italic">&quot;Paramagnit YaMR fenomenining klassik namunasi&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-red-400">YaMR spektroskopiya</strong> yordamida <strong className="text-red-400">paramagnit siljish (Contact Shift)</strong> fenomenini o&apos;rganish.
            Fe³⁺ — yuqori spinli d⁵ (S=5/2), 5 ta toq elektron. ¹H YaMR da signallar <strong className="text-yellow-400">-15 ppm va -72 ppm</strong> da (diamagnit chegaradan tashqarida!).
            <strong className="text-red-400"> Morgan & Moss (1920)</strong> kashfiyoti, <strong className="text-red-400">Drago (1965)</strong> paramagnit YaMR tahlili.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe³⁺ (d⁵)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit</div>
              <div className="text-white font-bold">μ_eff ≈ 5.9 BM</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">D₃ (6)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Toq elektronlar</div>
              <div className="text-white font-bold">5 ta (S=5/2)</div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi — YUQORI SPINLI d⁵
          </h2>
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun bu kompleks yuqori spinli?</strong> Fe³⁺ — d⁵ elektron konfiguratsiya. acac⁻ — <em>o&apos;rta</em> maydon ligandi.
              Δ<sub>o</sub> (14,000 cm⁻¹) &lt;&lt; P (juftlanish energiyasi, 30,000 cm⁻¹) → yuqori spinli, 5 ta toq elektron → <strong className="text-red-400">kuchli paramagnit!</strong>
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
                  <span className="text-red-400 font-bold">{COMPOUND.crystalField.spinState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Orbital to&apos;ldirilishi:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.orbitalOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="text-red-400 font-bold">{COMPOUND.crystalField.unpairedElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit momenti:</span>
                  <span className="text-red-400 font-bold">{COMPOUND.crystalField.magneticMoment}</span>
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
                  <span className="text-yellow-400 font-mono">{COMPOUND.crystalField.cFSE}</span>
                </div>
              </div>
              <div className="mt-3 bg-yellow-900/30 rounded p-2">
                <p className="text-yellow-300 text-xs">{COMPOUND.crystalField.zeroCFSE}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-2">Spektrokimyoviy qator va magnit anizotropiya</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Spektrokimyoviy qator:</strong> {COMPOUND.crystalField.spectrochemicalSeries}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Nima uchun yuqori spinli?</strong> {COMPOUND.crystalField.whyHighSpin}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Rang sababi:</strong> {COMPOUND.crystalField.colorOrigin}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>Magnit anizotropiya:</strong> {COMPOUND.crystalField.magneticAnisotropy}
            </p>
          </div>

          {/* d-orbital splitting diagram — YUQORI SPINLI */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital bo&apos;linish diagrammasi (yuqori spinli)</h4>
            <svg viewBox="0 0 600 200" className="w-full h-48" role="img" aria-label="d-orbital splitting high-spin">
              <title>d-orbital bo&apos;linish diagrammasi — Fe³⁺ yuqori spinli d⁵</title>
              <line x1="50" y1="180" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="100" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 100)">Energiya</text>
              <line x1="40" y1="100" x2="560" y2="100" stroke="#6b21a8" strokeWidth="1" strokeDasharray="4,2" />
              <text x="570" y="103" fontSize="8" fill="#6b21a8">Barycenter</text>
              <line x1="350" y1="60" x2="450" y2="60" stroke="#eab308" strokeWidth="3" />
              <text x="400" y="50" textAnchor="middle" fontSize="10" fill="#eab308" fontWeight="bold">e<sub>g</sub></text>
              <text x="400" y="75" textAnchor="middle" fontSize="8" fill="#eab308">d<sub>x²-y²</sub>, d<sub>z²</sub></text>
              <text x="480" y="63" fontSize="8" fill="#eab308">+0.6Δ<sub>o</sub></text>
              <line x1="150" y1="140" x2="250" y2="140" stroke="#22c55e" strokeWidth="3" />
              <text x="200" y="130" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">t<sub>2g</sub></text>
              <text x="200" y="155" textAnchor="middle" fontSize="8" fill="#22c55e">d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></text>
              <text x="120" y="143" fontSize="8" fill="#22c55e">-0.4Δ<sub>o</sub></text>
              {/* Elektronlar: t2g da 3 ta (↑), eg da 2 ta (↑) - yuqori spinli */}
              {[170, 200, 230].map((x, i) => (
                <g key={`t2g-${i}`}>
                  <circle cx={x} cy="140" r="4" fill="#22c55e" />
                  <text x={x} y="135" textAnchor="middle" fontSize="8" fill="#22c55e">↑</text>
                </g>
              ))}
              {[380, 420].map((x, i) => (
                <g key={`eg-${i}`}>
                  <circle cx={x} cy="60" r="4" fill="#eab308" />
                  <text x={x} y="55" textAnchor="middle" fontSize="8" fill="#eab308">↑</text>
                </g>
              ))}
              <line x1="500" y1="60" x2="500" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="60" x2="505" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="140" x2="505" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <text x="515" y="103" fontSize="10" fill="#fbbf24" fontWeight="bold">Δ<sub>o</sub></text>
            </svg>
            <div className="mt-2 bg-yellow-900/30 rounded p-2">
              <p className="text-yellow-300 text-xs">
                <strong>Yuqori spinli d⁵:</strong> Barcha 5 ta elektron turli orbitallarda, parallel spinli (Hund qoidasi).
                CFSE = 0 — yagona holat! Bu paramagnit xususiyatlar uchun muhim.
              </p>
            </div>
          </div>
        </div>

        {/* SIMMETRIYA */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (D₃) — Propeller shakli
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>D₃ nuqtaviy guruhi:</strong> [Fe(acac)₃] da 3 ta acac⁻ ligand <em>propeller shaklida</em> joylashgan.
              Bu helikal struktura — Λ (lambda) va Δ (delta) enantiomerlari. Ray-Dutt twist mexanizmi orqali tez almashinadi.
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
              <h3 className="text-purple-400 font-bold mb-3">Xirallik va fluxionallik</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Propeller shakli:</span>
                  <span className="text-purple-400 text-xs">{COMPOUND.symmetry.propellerShape}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Xirallik:</span>
                  <span className="text-purple-400 text-xs">{COMPOUND.symmetry.chirality}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ray-Dutt twist:</span>
                  <span className="text-purple-400 text-xs">{COMPOUND.symmetry.rayDuttTwist}</span>
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

        {/* PARAMAGNIT YaMR NAZARIYASI — ENG MUHIM QISM */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> PARAMAGNIT YaMR nazariyasi — Contact Shift fenomeni
          </h2>
          <div className="bg-red-900/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              <strong>Paramagnit siljishning 3 komponenti:</strong> (1) <span className="text-yellow-400 font-bold">Fermi Contact Shift</span> (dominant),
              (2) Pseudo-Contact Shift (dipolyar), (3) Diamagnit shift. <strong className="text-red-400">McConnell mexanizmi:</strong> toq elektron t₂g da,
              lekin ligand π* orbitallari orqali manfiy spin density hosil qiladi → <em>manfiy kimyoviy siljish</em> (-15, -72 ppm)!
            </p>
          </div>

          {/* Paramagnit shift komponentlari */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h4 className="text-red-400 font-bold mb-2">1. Fermi Contact Shift (FC)</h4>
              <p className="text-purple-200 text-xs mb-2">δ_FC ∝ ρ_s (spin density)</p>
              <p className="text-purple-200 text-xs">Proton orbitallarida toq elektron spin zichligi. Dominant mexanizm.</p>
              <p className="text-yellow-300 text-xs mt-2"><strong>Qiymat:</strong> -15 dan -72 ppm gacha</p>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h4 className="text-purple-400 font-bold mb-2">2. Pseudo-Contact Shift (PC)</h4>
              <p className="text-purple-200 text-xs mb-2">δ_PC = f(1/r³, Δχ, θ, φ)</p>
              <p className="text-purple-200 text-xs">Magnit anizotropiya (Δχ) tufayli dipolyar ta'sir.</p>
              <p className="text-yellow-300 text-xs mt-2"><strong>Qiymat:</strong> ±10 ppm</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h4 className="text-blue-400 font-bold mb-2">3. Diamagnit shift</h4>
              <p className="text-purple-200 text-xs mb-2">δ_dia = 0-10 ppm (standart)</p>
              <p className="text-purple-200 text-xs">Paramagnit ta'sir bo'lmasa, normal YaMR shiftlar.</p>
              <p className="text-yellow-300 text-xs mt-2"><strong>Qiymat:</strong> 0-10 ppm</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveNmrNucleus("h1")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "h1"
                  ? "bg-red-600/60 text-white border border-red-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹H (I=1/2)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("c13")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "c13"
                  ? "bg-red-600/60 text-white border border-red-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹³C (I=1/2)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("fe57")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "fe57"
                  ? "bg-red-600/60 text-white border border-red-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ⁵⁷Fe (I=1/2)
            </button>
          </div>

          {activeNmrNucleus === "h1" && (
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-red-400 font-bold">{COMPOUND.nmrTheory.h1.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.h1.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Contact Shift:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.h1.contactShift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.h1.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.h1.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-400 font-bold text-xs mb-1">Nima uchun -15 va -72 ppm? (Manfiy shift!)</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-400 font-bold text-xs mb-1">Pseudo-Contact Shift formulasi:</div>
                <p className="text-purple-200 text-xs font-mono">{COMPOUND.nmrTheory.h1.pseudoContactShift}</p>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-400 font-bold text-xs mb-1">Curie Spin relaksatsiya:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.curieSpin}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "c13" && (
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-red-400 font-bold">{COMPOUND.nmrTheory.c13.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.c13.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.c13.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.c13.t1Relaxation}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.c13.sensitivity}</div>
                </div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-400 font-bold text-xs mb-1">Nima uchun -2000 dan +2000 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.whyThisShift}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "fe57" && (
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-red-400 font-bold">{COMPOUND.nmrTheory.fe57.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.fe57.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.fe57.sensitivity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.fe57.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.nmrTheory.fe57.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-400 font-bold text-xs mb-1">Aniqlash:</div>
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
                  <span className="text-purple-400">Fe-O:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.feO}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-O:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.co_single}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-C (xelat):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.cc_single}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-CH₃:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.cc_methyl}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog&apos; burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">O-Fe-O (chelate):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.ofeo}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-C-C (xelat):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.ccco}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">O-C-O:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.oco}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Fluxionallik — Ray-Dutt Twist</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Mexanizm:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.fluxionality.mechanism}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Eₐ:</span>
                <span className="text-green-400 font-mono">{COMPOUND.structuralData.fluxionality.activation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Tezlik (298 K):</span>
                <span className="text-green-400 font-mono">{COMPOUND.structuralData.fluxionality.rate}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">YaMR effekti:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.fluxionality.nmrEffect}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Xiral inversiya:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.fluxionality.chiralInversion}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              <strong>Taqqoslash:</strong> {COMPOUND.structuralData.bondLengths.comparison}
            </p>
          </div>
        </div>

        {/* MAGNIT XUSUSIYATLAR VA EVANS USULI */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> Magnit xususiyatlar va Evans usuli
          </h2>
          <div className="bg-orange-900/30 rounded-lg p-4 mb-6">
            <p className="text-orange-300 text-sm">
              <strong>Evans usuli:</strong> YaMR spektrometri orqali magnit qabul qiluvchanlikni o&apos;lchash.
              Δf (chastota siljishi, Hz) orqali μ_eff hisoblanadi. <strong className="text-orange-400">[Fe(acac)₃] uchun kutilayotgan: 5.9 BM.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Magnit parametrlar</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-orange-400">{COMPOUND.thermodynamics.magneticProperties.spinState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">μ_eff:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.magneticProperties.muEffective}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Curie constant:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.magneticProperties.curieConstant}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Curie qonuni:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.magneticProperties.curieLaw}</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Barqarorlik</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">log β₃:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.stability.logBeta3}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Stepwise:</span>
                  <span className="text-orange-400 text-xs font-mono">{COMPOUND.thermodynamics.stability.stepwise}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Xelat effekti:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.stability.chelateEffect}</span>
                </div>
              </div>
            </div>
          </div>

          {/* INTERAKTIV EVANS KALKULYATORI */}
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
            <h4 className="text-orange-400 font-bold mb-4">🧪 Interaktiv Evans kalkulyatori</h4>
            <p className="text-purple-200 text-xs mb-4">
              <strong>Formula:</strong> μ_eff = 0.0616·√((Δf·T)/c) BM
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-yellow-400 text-xs mb-2">
                  Δf (chastota siljishi, Hz): {evansFrequency} Hz
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={evansFrequency}
                  onChange={(e) => setEvansFrequency(Number(e.target.value))}
                  className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Chastota siljishi"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>10 Hz</span>
                  <span>100 Hz</span>
                </div>
              </div>
              <div>
                <label className="block text-yellow-400 text-xs mb-2">
                  c (konsentratsiya, M): {evansConcentration}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.005"
                  value={evansConcentration}
                  onChange={(e) => setEvansConcentration(Number(e.target.value))}
                  className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Konsentratsiya"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>0.01 M</span>
                  <span>0.2 M</span>
                </div>
              </div>
              <div>
                <label className="block text-yellow-400 text-xs mb-2">
                  T (harorat, K): {evansTemperature} K
                </label>
                <input
                  type="range"
                  min="250"
                  max="350"
                  step="1"
                  value={evansTemperature}
                  onChange={(e) => setEvansTemperature(Number(e.target.value))}
                  className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Harorat"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>250 K</span>
                  <span>350 K</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-800/40 rounded-lg p-4 text-center">
              <div className="text-xs text-purple-400 mb-1">Hisoblangan μ_eff:</div>
              <div className="text-4xl font-bold text-orange-400">{muEff} BM</div>
              <div className="text-xs text-purple-300 mt-2">
                {Math.abs(parseFloat(muEff) - 5.9) < 0.3 ? (
                  <span className="text-green-400">✓ Yuqori spinli d⁵ (kutilayotgan: 5.9 BM)</span>
                ) : (
                  <span className="text-yellow-400">⚠️ Kutilayotgan qiymatdan farq qiladi</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* YaMR SIGNALLAR JADVALI */}
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
                    <td className="py-3 px-3">{signal.ligand}</td>
                    <td className="py-3 px-3 text-red-400 font-mono font-bold">{signal.shift}</td>
                    <td className="py-3 px-3">{signal.multiplicity}</td>
                    <td className="py-3 px-3 font-mono">{signal.jCoupling}</td>
                    <td className="py-3 px-3">{signal.integration}</td>
                    <td className="py-3 px-3 text-xs text-purple-300">{signal.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-3">
            <p className="text-yellow-300 text-xs">
              <strong>⚠️ MUHIM:</strong> Paramagnit komplekslar uchun YaMR diapazoni juda keng (-80 dan +80 ppm gacha).
              Standart 0-10 ppm diapazoni etarli emas! Keng diapazonda skanerlash kerak.
            </p>
          </div>
        </div>

        {/* INTERAKTIV YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹H YaMR spektr simulyatsiyasi (KENG DIAPAZON)</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            Kimyoviy siljishni (δ, ppm) o&apos;zgartiring. DIQQAT: Paramagnit kompleks uchun <span className="text-red-400 font-bold">keng diapazon</span> (-80 dan +10 ppm gacha).
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Kimyoviy siljish (δ): {ppmSlider} ppm
            </label>
            <input
              type="range"
              min="-80"
              max="10"
              step="0.1"
              value={ppmSlider}
              onChange={(e) => setPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>-80 ppm (kuchli shielded)</span>
              <span>-71.8 (CH)</span>
              <span>-15.1 (CH₃)</span>
              <span>0 ppm (TMS)</span>
              <span>+10 ppm</span>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-red-400">{ppmSlider} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-red-400">
                  {currentSignal.notes !== "—" ? currentSignal.notes : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Spin density:</div>
                <div className="text-xl font-mono font-bold text-red-400">
                  {ppmSlider < 0 ? "Manfiy (polarization)" : ppmSlider === 0 ? "TMS referens" : "Mavjud emas"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="Paramagnit YaMR spektr">
              <title>¹H YaMR spektr simulyatsiyasi — [Fe(acac)₃] (paramagnit)</title>
              {/* X o'qi - keng diapazon */}
              {[-80, -60, -40, -20, 0, 10].map((ppm, i) => {
                const x = 580 - ((ppm + 80) / 90) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>
              {/* CH signali -71.8 ppm */}
              <line
                x1={580 - ((-71.8 + 80) / 90) * 530}
                y1="220"
                x2={580 - ((-71.8 + 80) / 90) * 530}
                y2="80"
                stroke="#ef4444"
                strokeWidth="3"
              />
              <text x={580 - ((-71.8 + 80) / 90) * 530} y="75" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">
                -71.8 ppm (CH, 3H)
              </text>
              {/* CH3 signali -15.1 ppm */}
              <line
                x1={580 - ((-15.1 + 80) / 90) * 530}
                y1="220"
                x2={580 - ((-15.1 + 80) / 90) * 530}
                y2="40"
                stroke="#ef4444"
                strokeWidth="3"
              />
              <text x={580 - ((-15.1 + 80) / 90) * 530} y="35" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">
                -15.1 ppm (CH₃, 18H)
              </text>
              {/* TMS referens */}
              <line
                x1={580 - ((0 + 80) / 90) * 530}
                y1="220"
                x2={580 - ((0 + 80) / 90) * 530}
                y2="180"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <text x={580 - ((0 + 80) / 90) * 530} y="175" textAnchor="middle" fontSize="8" fill="#fbbf24">TMS</text>
              {/* Slider pozitsiyasi */}
              <line
                x1={580 - ((ppmSlider + 80) / 90) * 530}
                y1="220"
                x2={580 - ((ppmSlider + 80) / 90) * 530}
                y2="20"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              {/* Diamagnit mintaqa */}
              <rect
                x={580 - ((10 + 80) / 90) * 530}
                y="20"
                width={((10 - (-10)) / 90) * 530}
                height="200"
                fill="#a78bfa"
                opacity="0.05"
              />
              <text x={580 - ((0 + 80) / 90) * 530} y="215" textAnchor="middle" fontSize="7" fill="#a78bfa" opacity="0.6">
                Diamagnit mintaqa
              </text>
            </svg>
          </div>
          <div className="bg-red-900/30 rounded-lg p-3">
            <p className="text-red-300 text-xs">
              <strong>📌 Muhim kuzatuv:</strong> Ikkala signal ham <em>manfiy</em> ppm da! Bu McConnell mexanizmi (spin polarization) tufayli —
              toq elektron t₂g da, lekin ligand π* orbitallari orqali manfiy spin density hosil qiladi.
              18:3 integratsiya nisbati = 6:1 — bu [Fe(acac)₃] formulani tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📜</span> Tarixiy kontekst
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Morgan & Moss (1920)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olimlar:</span>
                  <span className="text-amber-400">{COMPOUND.history.morganMoss.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.morganMoss.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.morganMoss.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.morganMoss.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Drago (1965)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.drago.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.drago.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.drago.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Usul:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.drago.method}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">La Mar (1973)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.laMar.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.laMar.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.laMar.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.laMar.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Bertini & Luchinat (1986)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olimlar:</span>
                  <span className="text-amber-400">{COMPOUND.history.bertini.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.bertini.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Kitob:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.bertini.book}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.bertini.contribution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa β-diketonat komplekslar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Metall</th>
                  <th className="py-3 px-3 text-teal-400">Spin holati</th>
                  <th className="py-3 px-3 text-teal-400">μ_eff (BM)</th>
                  <th className="py-3 px-3 text-teal-400">¹H YaMR shift</th>
                  <th className="py-3 px-3 text-teal-400">Barqarorlik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 0 ? "bg-red-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.metal}</td>
                    <td className="py-3 px-3 text-xs">{comp.spinState}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.muEff}</td>
                    <td className="py-3 px-3 text-xs font-mono text-red-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.stability}</td>
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
            <li><strong className="text-red-400">Kristall maydon nazariyasi:</strong> Fe³⁺ (d⁵), yuqori spinli (t₂g³ eg²), S=5/2, 5 ta toq elektron, CFSE = 0 (yagona!)</li>
            <li><strong className="text-red-400">Paramagnit YaMR:</strong> Contact Shift fenomeni — McConnell mexanizmi, manfiy spin density</li>
            <li><strong className="text-red-400">¹H YaMR:</strong> -15.1 ppm (CH₃, 18H) va -71.8 ppm (CH, 3H) — ikkalasi ham diamagnit chegaradan tashqarida!</li>
            <li><strong className="text-red-400">KENG DIAPAZON:</strong> -80 dan +80 ppm gacha skanerlash kerak (standart 0-10 ppm etarli emas)</li>
            <li><strong className="text-red-400">Simmetriya (D₃):</strong> Propeller shakl, Λ va Δ enantiomerlar, Ray-Dutt twist fluxionallik</li>
            <li><strong className="text-red-400">Curie Spin:</strong> Relaksatsiya B₀² ga bog&apos;liq — yuqori maydon kengroq chiziqlar</li>
            <li><strong className="text-red-400">Evans usuli:</strong> μ_eff ≈ 5.9 BM (yuqori spinli d⁵)</li>
            <li><strong className="text-red-400">Strukturaviy:</strong> Fe-O = 1.98 Å, propeller shakl, helikal struktura</li>
            <li><strong className="text-red-400">Barqarorlik:</strong> β₃ ≈ 10²⁰ (xelat effekti, 3 bidentat ligand)</li>
            <li><strong className="text-red-400">Tarix:</strong> Morgan & Moss (1920), Drago (1965), La Mar (1973), Bertini (1986)</li>
            <li><strong className="text-red-400">Taqqoslash:</strong> [Fe(acac)₃] paramagnit, [Co(acac)₃] diamagnit (past spinli d⁶)</li>
            <li><strong className="text-red-400">Kengaytiruvchi:</strong> SQUID, EPR, Mössbauer, VT-NMR, DFT</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmares/fe-phen-3" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Ferroin [Fe(phen)₃]²⁺ →</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(acac)₃] (Tris(atsetilasetonato)temir(III)) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Morgan & Moss (1920), Drago (1965), La Mar (1973), Bertini & Luchinat (1986), Cotton-Wilkinson, Miessler-Tarr, SDBS ID: 1163</p>
        </div>
      </footer>
    </main>
  )
}