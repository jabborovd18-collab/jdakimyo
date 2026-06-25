"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// FOTOFIZIKA — MLCT VA QO'ZG'ALGAN HOLATLAR KIMYOSI
// Manbalar: Jablonski (1933), Kasha (1950), Strickler-Berg (1962),
//           Förster (1948), Dexter (1953), Rehm-Weller (1970),
//           Crosby (1966), Balzani (1990), Yersin (2004)
//  ═══════════════════════════════════════════════════════════════════════════════

const PHOTOPHYSICS = {
  //  ═══════════════════════════════════════════════════════════════
  // ASOSIY TUSHUNCHALAR
  //  ═══════════════════════════════════════════════════════════════
  concept: {
    definition: "Fotofizika — molekulaning yorug'lik yutilishi va undan keyingi fizik jarayonlarni (emissiya, energiya ko'chishi, qayta tashkilanish) o'rganuvchi fan",
    scope: "Yutilish → Qo'zg'alish → Vibratsion relaksatsiya → Emissiya (fluoresensiya/fosforesensiya) yoki Noradiativ jarayonlar",
    keyQuestion: "Qo'zg'algan elektron qanday taqdirga duchor bo'ladi?"
  },

  //  ═══════════════════════════════════════════════════════════════
  // JABLONSKI DIAGRAMMASI
  //  ═══════════════════════════════════════════════════════════════
  jablonski: {
    states: [
      { name: "S₀ (Asosiy holat)", type: "singlet", spin: "0", color: "blue" },
      { name: "S₁ (Birinchi singlet qo'zg'algan)", type: "singlet", spin: "0", color: "green" },
      { name: "S₂ (Ikkinchi singlet qo'zg'algan)", type: "singlet", spin: "0", color: "yellow" },
      { name: "T₁ (Birinchi triplet qo'zg'algan)", type: "triplet", spin: "1", color: "red" },
      { name: "T₂ (Ikkinchi triplet qo'zg'algan)", type: "triplet", spin: "1", color: "orange" }
    ],
    processes: [
      {
        name: "Yutilish (Absorption)",
        symbol: "hν_abs",
        time: "10⁻¹⁵ s (femtosekund)",
        description: "Foton yutilishi va elektronni S₀ dan S₁ yoki S₂ ga o'tishi",
        rule: "Spin ruxsat etilgan (ΔS = 0) — singlet → singlet"
      },
      {
        name: "Vibratsion relaksatsiya (VR)",
        symbol: "VR",
        time: "10⁻¹² - 10⁻¹⁰ s (pikosekund)",
        description: "Qo'zg'algan holat ichida yuqori vibratsion darajalardan past darajalarga tushish",
        rule: "Issiqlik ajratish orqali"
      },
      {
        name: "Ichki konversiya (IC)",
        symbol: "IC",
        time: "10⁻¹² - 10⁻⁸ s",
        description: "Bir xil spinli holatlar orasida (S₂ → S₁, S₁ → S₀) noradiativ o'tish",
        rule: "Kasha qoidasi: S₂ → S₁ juda tez (~10⁻¹² s)"
      },
      {
        name: "Intersystem crossing (ISC)",
        symbol: "ISC",
        time: "10⁻¹⁰ - 10⁻⁷ s",
        description: "Spin o'zgarishi bilan (S₁ → T₁) noradiativ o'tish",
        rule: "Og'ir atom effekti (heavy atom effect) tezlashtiradi"
      },
      {
        name: "Fluoresensiya",
        symbol: "hν_fl",
        time: "10⁻⁹ - 10⁻⁷ s (nanosekund)",
        description: "S₁ → S₀ radiativ o'tish (spin ruxsat etilgan)",
        rule: "Stokes shift — yutilishdan uzun to'lqin"
      },
      {
        name: "Fosforesensiya",
        symbol: "hν_ph",
        time: "10⁻⁶ - 10² s (mikrosekund - sekund)",
        description: "T₁ → S₀ radiativ o'tish (spin ta'qiqlangan)",
        rule: "Uzoq umr, spin-orbital bog'lanish kerak"
      }
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // KASHA QOIDASI
  //  ═══════════════════════════════════════════════════════════════
  kasha: {
    rule: "Ko'pchilik molekulalarda emissiya (fluoresensiya yoki fosforesensiya) faqat eng past energiyali qo'zg'algan holatdan sodir bo'ladi (odatda S₁ yoki T₁)",
    reasoning: "Yuqori qo'zg'algan holatlar (S₂, S₃...) juda tez ichki konversiya (IC) orqali S₁ ga tushadi (~10⁻¹² s)",
    exceptions: [
      "Azulen (S₂ emissiya — S₁ va S₂ orasidagi katta energiya farqi)",
      "Ba'zi tioketonlar",
      "Ba'zi porfirinlar"
    ],
    discoverer: "Michael Kasha (1950)",
    implication: "Emissiya spektri yutilish to'lqin uzunligiga bog'liq emas!"
  },

  //  ═══════════════════════════════════════════════════════════════
  // KVANT UNUMDORLIGI VA UMR
  //  ═══════════════════════════════════════════════════════════════
  quantumYield: {
    definition: "Φ (kvant unumdorligi) = chiqarilgan fotonlar soni / yutilgan fotonlar soni",
    formula: "Φ = k_r / (k_r + Σk_nr)",
    parameters: {
      k_r: "Radiativ tezlik konstantasi (s⁻¹)",
      k_nr: "Noradiativ tezlik konstantalari yig'indisi (s⁻¹)",
      k_IC: "Ichki konversiya tezligi",
      k_ISC: "Intersystem crossing tezligi",
      k_q: "Quenching (o'chirish) tezligi"
    },
    typicalValues: {
      fluorescence: "0.01 - 0.99",
      phosphorescence: "10⁻⁵ - 1.0 (og'ir atomlar bilan)",
      MLCT_Ru: "0.028 - 0.062 ([Ru(bpy)₃]²⁺)",
      MLCT_Ir: "0.4 - 1.0 (OLED materiallari)"
    },
    stricklerBerg: {
      formula: "k_r = 2.88 × 10⁻⁹ × n² × ∫ε(ν)dν / ν²",
      description: "Radiativ tezlik yutilish spektrining integraliga bog'liq",
      implication: "Kuchli yutilish → tez fluoresensiya"
    }
  },

  lifetime: {
    definition: "τ (umr) — qo'zg'algan holatning o'rtacha yashash vaqti",
    formula: "τ = 1 / (k_r + Σk_nr)",
    relation: "Φ = k_r × τ",
    typicalValues: {
      fluorescence: "1 - 100 ns",
      phosphorescence: "1 μs - 10 s",
      MLCT_Ru: "~600 ns (suvda)",
      MLCT_Ir: "1 - 10 μs",
      lanthanides: "0.1 - 10 ms"
    },
    measurement: "TCSPC (Time-Correlated Single Photon Counting), flash photolysis"
  },

  //  ═══════════════════════════════════════════════════════════════
  // STERN-VOLMER
  //  ═══════════════════════════════════════════════════════════════
  sternVolmer: {
    formula: "I₀/I = τ₀/τ = 1 + K_SV[Q] = 1 + k_q·τ₀·[Q]",
    parameters: {
      I0_I: "Quenching gacha va keyingi intensivliklar nisbati",
      tau0_tau: "Umr nisbati",
      K_SV: "Stern-Volmer konstantasi (M⁻¹)",
      k_q: "Bimolekulyar quenching tezligi (M⁻¹s⁻¹)",
      Q: "Quencher konsentratsiyasi"
    },
    diffusionLimit: "k_q(max) ≈ 10¹⁰ M⁻¹s⁻¹ (suvda, diffuziya bilan cheklangan)",
    types: [
      { name: "Dinamik quenching", description: "Qo'zg'algan holat va quencher to'qnashishi. I₀/I = τ₀/τ." },
      { name: "Statik quenching", description: "Asosiy holatda kompleks hosil bo'lishi. I₀/I ≠ τ₀/τ." },
      { name: "Aralash", description: "Ikkalasi ham sodir bo'ladi. Yuqoriga egilgan grafik." }
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // ENERGIYA KO'CHISH MEXANIZMLARI
  //  ═══════════════════════════════════════════════════════════════
  energyTransfer: {
    forster: {
      name: "Förster rezonans energiya ko'chishi (FRET)",
      mechanism: "Dipol-dipol o'zaro ta'sir (uzoq masofa)",
      distance: "1 - 10 nm",
      rate: "k_FRET = (1/τ_D) × (R₀/r)⁶",
      requirements: [
        "Donor emissiyasi va akseptor yutilishi ustma-ust tushishi kerak",
        "Dipol momentlari ma'lum orientatsiyada",
        "Spin ruxsat etilgan (odatda singlet-singlet)"
      ],
      forsterRadius: "R₀ — 50% samaradorlikdagi masofa (odatda 2-8 nm)",
      application: "Biologik sensorlar, FRET mikroskopiyasi"
    },
    dexter: {
      name: "Dexter energiya ko'chishi",
      mechanism: "Elektron almashinish (qisqa masofa)",
      distance: "< 1 nm (orbital ustma-ust tushishi kerak)",
      rate: "k_Dexter ∝ exp(-2r/L)",
      requirements: [
        "Donor va akseptor orbitallari ustma-ust tushishi",
        "Spin saqlanishi (Wigner qoidasi)",
        "Triplet-triplet ko'chish uchun muhim"
      ],
      application: "Triplet-triplet annihilyatsiya, upconversion"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // REHM-WELLER TENGLAMASI
  //  ═══════════════════════════════════════════════════════════════
  rehmWeller: {
    formula: "ΔG_ET = E_ox(D) - E_red(A) - E₀₀ + C",
    description: "Fotoinduksiyalangan elektron ko'chish erkin energiyasi",
    parameters: {
      E_ox: "Donor oksidlanish potentsiali",
      E_red: "Akseptor qaytarilish potentsiali",
      E_00: "Qo'zg'algan holat energiyasi (0-0 o'tish)",
      C: "Kulon energiyasi (odatda kichik, ~0.1 eV)"
    },
    application: "Fotokataliz, DSSC, organik PV dizayni"
  },

  //  ═══════════════════════════════════════════════════════════════
  // KLASSIK MISOLLAR
  //  ═══════════════════════════════════════════════════════════════
  examples: [
    {
      name: "[Ru(bpy)₃]²⁺",
      formula: "Tris(2,2'-bipiridin)ruteniy(II)",
      formulaHTML: "[Ru(bpy)<sub>3</sub>]<sup>2+</sup>",
      absorption: "~452 nm (MLCT)",
      emission: "~620 nm (³MLCT)",
      phi: "Φ ≈ 0.042 (suvda, 298 K)",
      tau: "τ ≈ 600 ns (suvda)",
      state: "³MLCT (triplet)",
      mechanism: "Tez ISC (Ru — og'ir atom), fosforesensiya",
      application: "Fotokataliz, DSSC, sensorlar",
      color: "To'q sariq (yutilish), qizil-to'q sariq (emissiya)",
      significance: "Eng ko'p o'rganilgan fotofizik kompleks"
    },
    {
      name: "[Ir(ppy)₃]",
      formula: "Tris(2-fenilpiridin)iridiy(III)",
      formulaHTML: "[Ir(ppy)<sub>3</sub>]",
      absorption: "~380 nm (LC/MLCT)",
      emission: "~515 nm (³LC/³MLCT)",
      phi: "Φ ≈ 0.4 - 1.0",
      tau: "τ ≈ 1 - 2 μs",
      state: "³LC/³MLCT aralash",
      mechanism: "Juda tez ISC (Ir — juda og'ir), yuqori Φ",
      application: "OLED (yashil piksel), fotokataliz",
      color: "Sariq (yutilish), yashil (emissiya)",
      significance: "OLED uchun standart yashil emitter"
    },
    {
      name: "[Cu(dmp)₂]⁺",
      formula: "Bis(2,9-dimetil-1,10-fenantrolin)mis(I)",
      formulaHTML: "[Cu(dmp)<sub>2</sub>]<sup>+</sup>",
      absorption: "~454 nm (MLCT)",
      emission: "~700 nm (³MLCT)",
      phi: "Φ ≈ 0.002 - 0.01",
      tau: "τ ≈ 100 ns",
      state: "³MLCT (flattening distorsiyasi)",
      mechanism: "MLCT → flattening distorsiyasi → tez non-radiativ",
      application: "Arzon fotokatalizator (Cu — arzon)",
      color: "Sariq (yutilish), qizil (emissiya)",
      significance: "Ru o'rnini bosuvchi arzon alternativ"
    },
    {
      name: "[Eu(tta)₃(phen)]",
      formula: "Evropiy β-diketonat kompleksi",
      formulaHTML: "[Eu(tta)<sub>3</sub>(phen)]",
      absorption: "~340 nm (ligand π-π*)",
      emission: "~612 nm (Eu³⁺ ⁵D₀ → ⁷F₂)",
      phi: "Φ ≈ 0.3 - 0.6",
      tau: "τ ≈ 0.3 - 1 ms",
      state: "Eu³⁺ ⁵D₀ (lokalizatsiyalangan f-f)",
      mechanism: "Antenna effekti — ligand yutadi, Eu³⁺ ga energiya ko'chiradi",
      application: "Bioassay, lyuminestsent sensorlar",
      color: "UV yutilish, qizil emissiya",
      significance: "Lantanid fotofizikasining klassik namunasi"
    },
    {
      name: "[PtOEP]",
      formula: "Platina oktaetilporfirin",
      formulaHTML: "[PtOEP]",
      absorption: "~380, 535 nm (Soret, Q-band)",
      emission: "~645 nm (³ππ*)",
      phi: "Φ ≈ 0.5",
      tau: "τ ≈ 60 - 100 μs",
      state: "³ππ* (triplet)",
      mechanism: "Pt og'ir atom → tez ISC → kuchli fosforesensiya",
      application: "O₂ sensorlar (kuchli quenching)",
      color: "Qizil-binafsha (yutilish), qizil (emissiya)",
      significance: "Oksigen sensori standarti"
    },
    {
      name: "[Re(bpy)(CO)₃Cl]",
      formula: "Reniy(I) karbonil kompleks",
      formulaHTML: "[Re(bpy)(CO)<sub>3</sub>Cl]",
      absorption: "~370 nm (MLCT)",
      emission: "~550 nm (³MLCT)",
      phi: "Φ ≈ 0.01 - 0.05",
      tau: "τ ≈ 50 - 200 ns",
      state: "³MLCT",
      mechanism: "Re og'ir atom, CO kuchli π-akseptor",
      application: "CO₂ qaytarish fotokatalizatori",
      color: "Sariq (yutilish), yashil (emissiya)",
      significance: "CO₂ fotokatalizi standarti"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // OG'IR ATOM EFFEKTİ
  //  ═══════════════════════════════════════════════════════════════
  heavyAtomEffect: {
    internal: {
      name: "Ichki og'ir atom effekti",
      description: "Molekula ichidagi og'ir atom (I, Br, Pt, Ir, Re) spin-orbital bog'lanishni kuchaytiradi",
      consequence: "ISC tezlashadi → fosforesensiya kuchayadi",
      example: "Ir(III), Pt(II) komplekslari — Φ_phos yaqin 1.0 gacha"
    },
    external: {
      name: "Tashqi og'ir atom effekti",
      description: "Og'ir atomli erituvchi (CH₂I₂, etil iodid) yoki tuz (KI, CsCl) qo'shiladi",
      consequence: "To'qnashuv vaqtida spin-orbital bog'lanish kuchayadi",
      example: "Naftalin + etil iodid → fosforesensiya kuchayadi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // MLCT FOTOFIZIKASI MAXSUS
  //  ═══════════════════════════════════════════════════════════════
  mlctPhotophysics: {
    characteristics: [
      "Tez ISC (og'ir metallar uchun ~10-100 fs)",
      "³MLCT emissiyasi (fosforesensiya)",
      "Katta Stokes shift (~150-200 nm)",
      "Erituvchiga sezgir (qutblilikka bog'liq)",
      "Ligand o'zgartirish orqali sozlanadi (tuning)"
    ],
    energyGapLaw: {
      description: "Energiya oralig'i qonuni — quyi energiyali emissiyalar tezroq non-radiativ relaksatsiyaga uchraydi",
      formula: "k_nr ∝ exp(-γΔE/ħω_M)",
      consequence: "Qizil/IR emitterlar past Φ ga ega"
    },
    tuning: {
      strategies: [
        "Ligand elektron xossalarini o'zgartirish (donor/akseptor)",
        "Metall o'zgartirish (Ru → Os → Re → Ir)",
        "Geometriyani o'zgartirish",
        "Aralash ligand sistemalar"
      ]
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIX
  //  ═══════════════════════════════════════════════════════════════
  history: {
    jablonski: {
      year: 1933,
      scientist: "Aleksander Jablonski (Polsha)",
      achievement: "Energiya sathlari diagrammasini taklif qildi",
      contribution: "Fluoresensiya va fosforesensiyani farqlash"
    },
    kasha: {
      year: 1950,
      scientist: "Michael Kasha (AQSh)",
      achievement: "Kasha qoidasi — emissiya eng past qo'zg'algan holatdan",
      contribution: "Foto-kimyo asoslari"
    },
    forster: {
      year: 1948,
      scientist: "Theodor Förster (Germaniya)",
      achievement: "FRET nazariyasi — dipol-dipol energiya ko'chishi",
      contribution: "Biologik tizimlarda keng qo'llaniladi"
    },
    dexter: {
      year: 1953,
      scientist: "David Dexter (AQSh)",
      achievement: "Elektron almashinish orqali energiya ko'chishi",
      contribution: "Triplet-triplet ko'chish mexanizmi"
    },
    stricklerBerg: {
      year: 1962,
      scientist: "S.J. Strickler va R.A. Berg (AQSh)",
      achievement: "Radiativ tezlik bilan yutilish bog'liqligi",
      contribution: "k_r ni hisoblash formulasi"
    },
    rehmWeller: {
      year: 1970,
      scientist: "D. Rehm va A. Weller (Germaniya)",
      achievement: "Fotoinduksiyalangan elektron ko'chish energetikasi",
      contribution: "ΔG_ET formulasi"
    },
    balzani: {
      year: "1990-yillar",
      scientist: "Vincenzo Balzani (Italiya)",
      achievement: "Supramolekulyar fotofizika",
      contribution: "Molekulyar mashinalar, antenna komplekslari"
    },
    yersin: {
      year: "2000-yillar",
      scientist: "Hartmut Yersin (Germaniya)",
      achievement: "OLED materiallari fotofizikasi",
      contribution: "Ir(III), Pt(II) emitterlari"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // QO'LLANILISH
  //  ═══════════════════════════════════════════════════════════════
  applications: [
    {
      field: "OLED (Organic Light-Emitting Diodes)",
      description: "Displey va yoritish texnologiyalari",
      examples: ["[Ir(ppy)₃] — yashil piksel", "[Ir(piq)₃] — qizil piksel", "TADF emitterlar"],
      significance: "Telefonlar, TV ekranlari"
    },
    {
      field: "DSSC (Dye-Sensitized Solar Cells)",
      description: "Bo'yoq-sensibilizatsiyalangan quyosh batareyalari",
      examples: ["N3 bo'yoq (Ru)", "[Ru(bpy)₃]²⁺ derivativlari"],
      significance: "Arzon quyosh energiyasi"
    },
    {
      field: "Fotokataliz",
      description: "Yorug'lik bilan katalitik reaksiyalar",
      examples: ["CO₂ qaytarish", "Suv parchalash", "Organik sintez"],
      significance: "Yashil kimyo"
    },
    {
      field: "Biologik tasvirlash",
      description: "Hujayra va to'qimalarni tasvirlash",
      examples: ["FRET sensorlar", "O₂ sensorlar", "pH sensorlar"],
      significance: "Tibbiy diagnostika"
    },
    {
      field: "Lyuminestsent sensorlar",
      description: "Ion va molekulalarni aniqlash",
      examples: ["O₂ sensing ([PtOEP])", "pH sensing", "Metal ionlar"],
      significance: "Atrof-muhit monitoringi"
    },
    {
      field: "Upconversion",
      description: "Past energiyali fotonlarni yuqori energiyalilarga aylantirish",
      examples: ["TTA (triplet-triplet annihilyatsiya)", "Lantanid upconversion"],
      significance: "Quyosh energiyasi samaradorligini oshirish"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "Steady-state UV-Vis spektroskopiya",
      application: "Yutilish spektrlari",
      information: "λ_max, ε, band shakli",
      advantage: "Tez, oddiy",
      example: "[Ru(bpy)₃]²⁺ — 452 nm MLCT"
    },
    {
      method: "Steady-state fluoresensiya",
      application: "Emissiya spektrlari",
      information: "λ_em, Φ (nisbiy), Stokes shift",
      advantage: "Sezgir, arzon",
      example: "[Ru(bpy)₃]²⁺ — 620 nm emissiya"
    },
    {
      method: "TCSPC (Time-Correlated Single Photon Counting)",
      application: "Vaqtga bog'liq fluoresensiya",
      information: "τ (umr), kinetika",
      advantage: "ps-ns aniqlik",
      example: "[Ru(bpy)₃]²⁺ — 600 ns umr"
    },
    {
      method: "Flash fotoliz (nanosekund/mikrosekund)",
      application: "Uzoq umrli qo'zg'algan holatlar",
      information: "Triplet umr, intermedietlar",
      advantage: "μs-ms vaqt shkalasi",
      example: "[PtOEP] — 60 μs triplet"
    },
    {
      method: "Femtosekundli transient absorption",
      application: "Juda tez jarayonlar",
      information: "ISC tezligi, vibratsion dinamika",
      advantage: "fs-ps aniqlik",
      example: "[Ru(bpy)₃]²⁺ ISC — ~15 fs"
    },
    {
      method: "Kvant unumdorligini o'lchash",
      application: "Φ absolyut qiymati",
      information: "Integratsiyalovchi shar yoki nisbiy usul",
      advantage: "Aniq fotofizik parametrlar",
      example: "Quinine sulfate standarti"
    }
  ]
}

// ============================================================================
// JABLONSKI DIAGRAMMASI INTERAKTIV
// ============================================================================
function JablonskiDiagram() {
  const [activeProcess, setActiveProcess] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">📊</span>
        Jablonski diagrammasi
      </h3>

      <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30 mb-6">
          <svg viewBox="0 0 600 500" className="w-full h-auto" role="img" aria-label="Jablonski diagrammasi">
            <title>Jablonski diagrammasi — fotofizik jarayonlar</title>

            {/* Singlet holatlar */}
            <text x="100" y="30" fontSize="14" fill="#a78bfa" fontWeight="bold">Singlet</text>

            {/* S₂ */}
            <line x1="50" y1="80" x2="200" y2="80" stroke="#eab308" strokeWidth="3" />
            <text x="125" y="75" textAnchor="middle" fontSize="12" fill="#eab308" fontWeight="bold">S₂</text>

            {/* S₁ */}
            <line x1="50" y1="180" x2="200" y2="180" stroke="#22c55e" strokeWidth="3" />
            <text x="125" y="175" textAnchor="middle" fontSize="12" fill="#22c55e" fontWeight="bold">S₁</text>

            {/* S₀ */}
            <line x1="50" y1="420" x2="200" y2="420" stroke="#3b82f6" strokeWidth="3" />
            <text x="125" y="415" textAnchor="middle" fontSize="12" fill="#3b82f6" fontWeight="bold">S₀</text>

            {/* Vibratsion darajalar */}
            {[400, 380, 360].map((y, i) => (
              <line key={`s0-vib-${i}`} x1="60" y1={y} x2="190" y2={y} stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
            ))}
            {[160, 140, 120].map((y, i) => (
              <line key={`s1-vib-${i}`} x1="60" y1={y} x2="190" y2={y} stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
            ))}
            {[60, 40].map((y, i) => (
              <line key={`s2-vib-${i}`} x1="60" y1={y} x2="190" y2={y} stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
            ))}

            {/* Triplet holatlar */}
            <text x="400" y="30" fontSize="14" fill="#a78bfa" fontWeight="bold">Triplet</text>

            {/* T₂ */}
            <line x1="380" y1="140" x2="530" y2="140" stroke="#f97316" strokeWidth="3" />
            <text x="455" y="135" textAnchor="middle" fontSize="12" fill="#f97316" fontWeight="bold">T₂</text>

            {/* T₁ */}
            <line x1="380" y1="260" x2="530" y2="260" stroke="#ef4444" strokeWidth="3" />
            <text x="455" y="255" textAnchor="middle" fontSize="12" fill="#ef4444" fontWeight="bold">T₁</text>

            {/* Vibratsion darajalar tripletlar uchun */}
            {[240, 220].map((y, i) => (
              <line key={`t1-vib-${i}`} x1="390" y1={y} x2="520" y2={y} stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
            ))}
            {[120, 100].map((y, i) => (
              <line key={`t2-vib-${i}`} x1="390" y1={y} x2="520" y2={y} stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
            ))}

            {/* JARAYONLAR */}

            {/* Yutilish (Absorption) */}
            <line x1="125" y1="420" x2="125" y2="180" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow-yellow)" />
            <text x="140" y="300" fontSize="11" fill="#fbbf24">Yutilish</text>
            <text x="140" y="315" fontSize="9" fill="#fbbf24">hν_abs</text>

            {/* Fluoresensiya */}
            <line x1="125" y1="180" x2="125" y2="420" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)" />
            <text x="180" y="300" fontSize="11" fill="#22c55e">Fluoresensiya</text>
            <text x="180" y="315" fontSize="9" fill="#22c55e">hν_fl (ns)</text>

            {/* Ichki konversiya (IC) */}
            <path d="M 125 180 Q 160 130 125 80" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="4,2" />
            <text x="170" y="130" fontSize="10" fill="#9ca3af">IC</text>

            {/* Vibratsion relaksatsiya */}
            <path d="M 125 60 Q 145 70 125 80" stroke="#d97706" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-orange)" />
            <text x="150" y="75" fontSize="9" fill="#d97706">VR</text>

            {/* ISC */}
            <line x1="200" y1="180" x2="380" y2="260" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrow-pink)" />
            <text x="290" y="210" fontSize="11" fill="#ec4899">ISC</text>

            {/* Fosforesensiya */}
            <line x1="455" y1="260" x2="455" y2="420" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
            <text x="470" y="340" fontSize="11" fill="#ef4444">Fosforesensiya</text>
            <text x="470" y="355" fontSize="9" fill="#ef4444">hν_ph (μs-s)</text>

            {/* Arrow markers */}
            <defs>
              <marker id="arrow-yellow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#fbbf24" />
              </marker>
              <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#22c55e" />
              </marker>
              <marker id="arrow-orange" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#d97706" />
              </marker>
              <marker id="arrow-pink" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#ec4899" />
              </marker>
              <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-bold text-purple-400">Jarayonlar va vaqt shkalalari</h4>
          {PHOTOPHYSICS.jablonski.processes.map((p, i) => (
            <div
              key={i}
              onClick={() => setActiveProcess(activeProcess === i ? null : i)}
              className={`rounded-xl p-4 cursor-pointer transition-all ${
                activeProcess === i
                  ? "bg-purple-900/60 border-2 border-purple-400"
                  : "bg-purple-800/30 border border-purple-700/30 hover:border-purple-500/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-base font-bold text-purple-300">{p.name}</h5>
                <span className="text-xs font-mono text-yellow-400">{p.time}</span>
              </div>
              {activeProcess === i && (
                <div className="mt-3 pt-3 border-t border-purple-700/50 space-y-2 text-sm">
                  <p className="text-purple-200">{p.description}</p>
                  <div className="bg-purple-950/50 rounded-lg p-2 text-xs">
                    <span className="text-yellow-400 font-bold">Qoida:</span>
                    <span className="text-purple-200 ml-2">{p.rule}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// KVANT UNUMDORLIGI KALKULYATORI
// ============================================================================
function QuantumYieldCalculator() {
  const [kr, setKr] = useState(1e6)
  const [knr, setKnr] = useState(1e7)

  const phi = useMemo(() => {
    return kr / (kr + knr)
  }, [kr, knr])

  const tau = useMemo(() => {
    return 1 / (kr + knr)
  }, [kr, knr])

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">🧮</span>
        Kvant unumdorligi kalkulyatori
      </h3>

      <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="bg-purple-950/50 rounded-lg p-4 mb-4">
          <div className="text-yellow-400 text-xs font-bold mb-2">Formulalar:</div>
          <div className="text-white font-mono text-sm mb-1">Φ = k_r / (k_r + Σk_nr)</div>
          <div className="text-white font-mono text-sm">τ = 1 / (k_r + Σk_nr)</div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-yellow-400 text-xs mb-2 font-bold">
              Radiativ tezlik k_r (s⁻¹): {kr.toExponential(1)}
            </label>
            <input
              type="range"
              min="3"
              max="9"
              step="0.1"
              value={Math.log10(kr)}
              onChange={(e) => setKr(Math.pow(10, Number(e.target.value)))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>10³ (sekin)</span>
              <span>10⁹ (tez)</span>
            </div>
          </div>

          <div>
            <label className="block text-yellow-400 text-xs mb-2 font-bold">
              Noradiativ tezlik Σk_nr (s⁻¹): {knr.toExponential(1)}
            </label>
            <input
              type="range"
              min="3"
              max="12"
              step="0.1"
              value={Math.log10(knr)}
              onChange={(e) => setKnr(Math.pow(10, Number(e.target.value)))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>10³</span>
              <span>10¹²</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-green-400 text-xs mb-2">Kvant unumdorligi (Φ):</div>
            <div className="text-white font-mono text-3xl font-bold">{phi.toFixed(4)}</div>
            <div className="text-purple-400 text-xs mt-1">
              {phi > 0.5 ? "Yuqori samarador" : phi > 0.1 ? "O'rta" : "Past"}
            </div>
          </div>
          <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-4 text-center">
            <div className="text-cyan-400 text-xs mb-2">Umr (τ):</div>
            <div className="text-white font-mono text-3xl font-bold">
              {tau < 1e-6 ? `${(tau * 1e9).toFixed(1)} ns` :
               tau < 1e-3 ? `${(tau * 1e6).toFixed(1)} μs` :
               `${(tau * 1e3).toFixed(1)} ms`}
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mt-4">
          <p className="text-yellow-200 text-xs">
            <strong className="text-yellow-400">💡 Maslahat:</strong> Φ ni oshirish uchun k_r ni oshirish yoki k_nr ni kamaytirish kerak.
            Og'ir atomlar (Ir, Pt) ISC ni tezlashtirib, fosforesensiya Φ ni oshiradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function FotofizikaPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeExample, setActiveExample] = useState(0)
  const [activeApplication, setActiveApplication] = useState(0)
  const [activeMethod, setActiveMethod] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950/20 to-slate-950 text-white">
      {/* MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-pink-950 to-purple-950 border-2 border-pink-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">💡</span> FOTOFIZIKA — QO'ZG'ALGAN HOLATLAR KIMYOSI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-pink-300">MLCT qo'zg'algan holatlari</strong> ning taqdiri: Jablonski diagrammasi,
              <strong className="text-yellow-400"> Kasha qoidasi</strong>, fluoresensiya, fosforesensiya,
              <strong className="text-yellow-400"> FRET/Dexter</strong> energiya ko'chishi!
            </p>
            <div className="bg-pink-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-pink-400 font-bold mb-2">💡 Klassik emitterlar:</div>
                  <div className="text-purple-200">
                    <strong>[Ru(bpy)₃]²⁺:</strong> 620 nm, Φ=0.042
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>[Ir(ppy)₃]:</strong> 515 nm, Φ=0.4-1.0
                  </div>
                </div>
                <div>
                  <div className="text-pink-400 font-bold mb-2">📊 Jarayonlar:</div>
                  <div className="text-purple-200">
                    <strong>Fluoresensiya:</strong> ns
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Fosforesensiya:</strong> μs-s
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="hover:text-purple-300">Zaryad ko'chishi</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="hover:text-purple-300">MLCT</Link>
              <span className="text-purple-600">›</span>
              <span className="text-pink-400 font-semibold">Fotofizika</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
                  <span className="text-3xl">💡</span>
                  Fotofizika
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  Qo'zg'algan holatlar kimyosi • Jablonski diagrammasi • Kasha qoidasi
                </p>
              </div>
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="text-xs bg-pink-600/80 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← MLCT
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-pink-600 hover:bg-pink-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-600/20 border border-pink-600/30 rounded-full text-xs font-semibold text-pink-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              MLCT VA QO'ZG'ALGAN HOLATLAR
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                Fotofizika
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">Yorug'likdan keyingi jarayonlar</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-pink-400">Fotofizika</strong> — molekulaning yorug'lik yutilishi va undan keyingi
              <strong className="text-yellow-400"> fizik jarayonlarni</strong> o'rganuvchi fan.
              Qo'zg'algan elektron <strong className="text-pink-400">qanday taqdirga duchor bo'ladi?</strong>
              Fluoresensiya, fosforesensiya, energiya ko'chishi yoki noradiativ relaksatsiya —
              barchasini Jablonski diagrammasi orqali tushunamiz.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xl font-bold text-pink-400">Jablonski</div>
                <div className="text-xs text-purple-400 mt-1">Diagramma</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">✨</div>
                <div className="text-xl font-bold text-pink-400">Φ</div>
                <div className="text-xs text-purple-400 mt-1">Kvant unumdorligi</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-xl font-bold text-pink-400">τ</div>
                <div className="text-xs text-purple-400 mt-1">Umr</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔋</div>
                <div className="text-xl font-bold text-pink-400">FRET</div>
                <div className="text-xs text-purple-400 mt-1">Energiya ko'chishi</div>
              </div>
            </div>
          </div>
        </div>

        {/* ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Asosiy tushuncha
          </h2>
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-pink-400">{PHOTOPHYSICS.concept.definition}</strong>
            </p>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-pink-400 font-bold mb-3">Umumiy jarayonlar ketma-ketligi:</h3>
            <p className="text-purple-200 text-sm leading-relaxed">{PHOTOPHYSICS.concept.scope}</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">❓ Asosiy savol:</h3>
            <p className="text-purple-200 text-lg">{PHOTOPHYSICS.concept.keyQuestion}</p>
          </div>
        </div>

        {/* JABLONSKI DIAGRAMMASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <JablonskiDiagram />
        </div>

        {/* KASHA QOIDASI */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚖️</span>
            Kasha qoidasi
          </h2>
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
            <p className="text-yellow-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">{PHOTOPHYSICS.kasha.rule}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">🤔 Sababi:</h3>
              <p className="text-purple-200 text-sm">{PHOTOPHYSICS.kasha.reasoning}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">💡 Oqibati:</h3>
              <p className="text-purple-200 text-sm">{PHOTOPHYSICS.kasha.implication}</p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-yellow-400 font-bold mb-3">🔍 Istisnolar:</h3>
            <ul className="space-y-2">
              {PHOTOPHYSICS.kasha.exceptions.map((ex, i) => (
                <li key={i} className="text-purple-200 text-sm flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-pink-900/20 border border-pink-600/30 rounded-lg p-3">
            <p className="text-pink-200 text-xs">
              <strong className="text-pink-400">👤 Kashfiyotchi:</strong> {PHOTOPHYSICS.kasha.discoverer}
            </p>
          </div>
        </div>

        {/* KVANT UNUMDORLIGI VA UMR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">✨</span>
            Kvant unumdorligi (Φ) va Umr (τ)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-pink-400 mb-3">Kvant unumdorligi (Φ)</h3>
              <p className="text-purple-200 text-sm mb-4">{PHOTOPHYSICS.quantumYield.definition}</p>
              <div className="bg-purple-950/50 rounded-lg p-3 mb-3 font-mono text-center text-yellow-400">
                {PHOTOPHYSICS.quantumYield.formula}
              </div>
              <h4 className="text-pink-300 font-bold text-sm mb-2">Tipik qiymatlar:</h4>
              <ul className="space-y-1 text-xs text-purple-200">
                <li>• Fluoresensiya: {PHOTOPHYSICS.quantumYield.typicalValues.fluorescence}</li>
                <li>• Fosforesensiya: {PHOTOPHYSICS.quantumYield.typicalValues.phosphorescence}</li>
                <li>• [Ru(bpy)₃]²⁺: {PHOTOPHYSICS.quantumYield.typicalValues.MLCT_Ru}</li>
                <li>• [Ir(ppy)₃]: {PHOTOPHYSICS.quantumYield.typicalValues.MLCT_Ir}</li>
              </ul>
            </div>

            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Umr (τ)</h3>
              <p className="text-purple-200 text-sm mb-4">{PHOTOPHYSICS.lifetime.definition}</p>
              <div className="bg-purple-950/50 rounded-lg p-3 mb-3 font-mono text-center text-yellow-400">
                {PHOTOPHYSICS.lifetime.formula}
              </div>
              <h4 className="text-cyan-300 font-bold text-sm mb-2">Tipik qiymatlar:</h4>
              <ul className="space-y-1 text-xs text-purple-200">
                <li>• Fluoresensiya: {PHOTOPHYSICS.lifetime.typicalValues.fluorescence}</li>
                <li>• Fosforesensiya: {PHOTOPHYSICS.lifetime.typicalValues.phosphorescence}</li>
                <li>• [Ru(bpy)₃]²⁺: {PHOTOPHYSICS.lifetime.typicalValues.MLCT_Ru}</li>
                <li>• Lantanidlar: {PHOTOPHYSICS.lifetime.typicalValues.lanthanides}</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-3">📐 Strickler-Berg formulasi</h3>
            <div className="bg-purple-950/50 rounded-lg p-3 mb-3 font-mono text-center text-white text-sm">
              {PHOTOPHYSICS.quantumYield.stricklerBerg.formula}
            </div>
            <p className="text-purple-200 text-sm mb-2">{PHOTOPHYSICS.quantumYield.stricklerBerg.description}</p>
            <p className="text-yellow-200 text-xs">💡 {PHOTOPHYSICS.quantumYield.stricklerBerg.implication}</p>
          </div>
        </div>

        {/* KVANT UNUMDORLIGI KALKULYATORI */}
        <QuantumYieldCalculator />

        {/* STERN-VOLMER */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📉</span>
            Stern-Volmer tenglamasi
          </h2>

          <div className="bg-orange-900/20 border border-orange-600/30 rounded-xl p-6 mb-6">
            <div className="font-mono text-center text-white text-lg mb-3">
              {PHOTOPHYSICS.sternVolmer.formula}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {Object.entries(PHOTOPHYSICS.sternVolmer.parameters).map(([key, value]) => (
                <div key={key} className="bg-purple-950/50 rounded-lg p-2">
                  <span className="text-yellow-400 font-bold">{key}:</span>
                  <span className="text-purple-200 ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PHOTOPHYSICS.sternVolmer.types.map((type, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h4 className="text-orange-400 font-bold mb-2">{type.name}</h4>
                <p className="text-purple-200 text-xs">{type.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mt-4">
            <p className="text-yellow-200 text-xs">
              <strong className="text-yellow-400">Diffuziya chegarasi:</strong> {PHOTOPHYSICS.sternVolmer.diffusionLimit}
            </p>
          </div>
        </div>

        {/* ENERGIYA KO'CHISH MEXANIZMLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🔋</span>
            Energiya ko'chish mexanizmlari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Förster */}
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-3">Förster (FRET)</h3>
              <p className="text-purple-200 text-sm mb-4">{PHOTOPHYSICS.energyTransfer.forster.mechanism}</p>
              <div className="bg-purple-950/50 rounded-lg p-3 mb-3 font-mono text-center text-white text-sm">
                {PHOTOPHYSICS.energyTransfer.forster.rate}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Masofa:</span>
                  <span className="text-green-400">{PHOTOPHYSICS.energyTransfer.forster.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">R₀:</span>
                  <span className="text-green-400">{PHOTOPHYSICS.energyTransfer.forster.forsterRadius}</span>
                </div>
              </div>
              <h4 className="text-green-300 font-bold text-xs mt-3 mb-2">Talablar:</h4>
              <ul className="space-y-1 text-xs text-purple-200">
                {PHOTOPHYSICS.energyTransfer.forster.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-2 mt-3">
                <p className="text-green-200 text-xs">{PHOTOPHYSICS.energyTransfer.forster.application}</p>
              </div>
            </div>

            {/* Dexter */}
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-3">Dexter</h3>
              <p className="text-purple-200 text-sm mb-4">{PHOTOPHYSICS.energyTransfer.dexter.mechanism}</p>
              <div className="bg-purple-950/50 rounded-lg p-3 mb-3 font-mono text-center text-white text-sm">
                {PHOTOPHYSICS.energyTransfer.dexter.rate}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Masofa:</span>
                  <span className="text-red-400">{PHOTOPHYSICS.energyTransfer.dexter.distance}</span>
                </div>
              </div>
              <h4 className="text-red-300 font-bold text-xs mt-3 mb-2">Talablar:</h4>
              <ul className="space-y-1 text-xs text-purple-200">
                {PHOTOPHYSICS.energyTransfer.dexter.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-2 mt-3">
                <p className="text-red-200 text-xs">{PHOTOPHYSICS.energyTransfer.dexter.application}</p>
              </div>
            </div>
          </div>
        </div>

        {/* REHM-WELLER */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            Rehm-Weller tenglamasi
          </h2>

          <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-xl p-6 mb-6">
            <p className="text-cyan-200 text-sm mb-4">{PHOTOPHYSICS.rehmWeller.description}</p>
            <div className="bg-purple-950/50 rounded-lg p-3 mb-4 font-mono text-center text-white">
              {PHOTOPHYSICS.rehmWeller.formula}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {Object.entries(PHOTOPHYSICS.rehmWeller.parameters).map(([key, value]) => (
                <div key={key} className="bg-purple-900/50 rounded-lg p-2">
                  <span className="text-cyan-400 font-bold">{key}:</span>
                  <span className="text-purple-200 ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
            <p className="text-yellow-200 text-xs">
              <strong className="text-yellow-400">💡 Qo'llanilishi:</strong> {PHOTOPHYSICS.rehmWeller.application}
            </p>
          </div>
        </div>

        {/* MLCT MAXSUS */}
        <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            MLCT fotofizikasining xususiyatlari
          </h2>

          <div className="bg-pink-900/20 border border-pink-600/30 rounded-xl p-6 mb-6">
            <h3 className="text-pink-400 font-bold mb-3">Xarakterli belgilar:</h3>
            <ul className="space-y-2">
              {PHOTOPHYSICS.mlctPhotophysics.characteristics.map((char, i) => (
                <li key={i} className="text-purple-200 text-sm flex items-start gap-2">
                  <span className="text-pink-400">✓</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-3">📉 Energiya oralig'i qonuni</h3>
              <p className="text-purple-200 text-xs mb-2">{PHOTOPHYSICS.mlctPhotophysics.energyGapLaw.description}</p>
              <div className="bg-purple-950/50 rounded p-2 font-mono text-yellow-400 text-xs mb-2">
                {PHOTOPHYSICS.mlctPhotophysics.energyGapLaw.formula}
              </div>
              <p className="text-yellow-200 text-xs">💡 {PHOTOPHYSICS.mlctPhotophysics.energyGapLaw.consequence}</p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-3">🎨 Sozlash strategiyalari</h3>
              <ul className="space-y-2">
                {PHOTOPHYSICS.mlctPhotophysics.tuning.strategies.map((strat, i) => (
                  <li key={i} className="text-purple-200 text-sm flex items-start gap-2">
                    <span className="text-pink-400">•</span>
                    <span>{strat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* OG'IR ATOM EFFEKTİ */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚖️</span>
            Og'ir atom effekti
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-3">🔬 Ichki effekt</h3>
              <p className="text-purple-200 text-sm mb-3">{PHOTOPHYSICS.heavyAtomEffect.internal.description}</p>
              <div className="bg-purple-950/50 rounded-lg p-2 mb-2">
                <p className="text-yellow-200 text-xs">{PHOTOPHYSICS.heavyAtomEffect.internal.consequence}</p>
              </div>
              <p className="text-purple-300 text-xs italic">{PHOTOPHYSICS.heavyAtomEffect.internal.example}</p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-3">🧪 Tashqi effekt</h3>
              <p className="text-purple-200 text-sm mb-3">{PHOTOPHYSICS.heavyAtomEffect.external.description}</p>
              <div className="bg-purple-950/50 rounded-lg p-2 mb-2">
                <p className="text-yellow-200 text-xs">{PHOTOPHYSICS.heavyAtomEffect.external.consequence}</p>
              </div>
              <p className="text-purple-300 text-xs italic">{PHOTOPHYSICS.heavyAtomEffect.external.example}</p>
            </div>
          </div>
        </div>

        {/* KLASSIK MISOLLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🧪</span>
            Klassik fotofizik misollar
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {PHOTOPHYSICS.examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeExample === i
                    ? "bg-pink-600/60 text-white border border-pink-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <h3 className="text-xl font-bold text-pink-400">
                {PHOTOPHYSICS.examples[activeExample].name}
              </h3>
              <span className="text-purple-300 text-xs">{PHOTOPHYSICS.examples[activeExample].formula}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-950/50 rounded-lg p-4">
                <h4 className="text-yellow-400 text-xs font-bold mb-2">Spektral xususiyatlar:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Yutilish:</span>
                    <span className="text-white">{PHOTOPHYSICS.examples[activeExample].absorption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Emissiya:</span>
                    <span className="text-white">{PHOTOPHYSICS.examples[activeExample].emission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Φ (kvant unumdorligi):</span>
                    <span className="text-yellow-400 font-bold">{PHOTOPHYSICS.examples[activeExample].phi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">τ (umr):</span>
                    <span className="text-cyan-400 font-bold">{PHOTOPHYSICS.examples[activeExample].tau}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/50 rounded-lg p-4">
                <h4 className="text-yellow-400 text-xs font-bold mb-2">Mexanizm:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Qo'zg'algan holat:</span>
                    <span className="text-white">{PHOTOPHYSICS.examples[activeExample].state}</span>
                  </div>
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Mexanizm:</span>
                    <span className="text-purple-200 text-xs">{PHOTOPHYSICS.examples[activeExample].mechanism}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-purple-200 text-xs">{PHOTOPHYSICS.examples[activeExample].color}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3 mb-3">
              <p className="text-green-200 text-sm">
                <strong className="text-green-400">💼 Qo'llanilishi:</strong> {PHOTOPHYSICS.examples[activeExample].application}
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
              <p className="text-yellow-200 text-sm">
                <strong className="text-yellow-400">⭐ Ahamiyati:</strong> {PHOTOPHYSICS.examples[activeExample].significance}
              </p>
            </div>
          </div>
        </div>

        {/* TARIX */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">rivojlanish</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(PHOTOPHYSICS.history).map(([key, h]) => (
              <div key={key} className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-3">{h.scientist}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Yil:</span>
                    <span className="text-amber-400">{h.year}</span>
                  </div>
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Yutuq:</span>
                    <span className="text-purple-200 text-xs">{h.achievement}</span>
                  </div>
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Hissa:</span>
                    <span className="text-purple-200 text-xs">{h.contribution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QO'LLANILISH */}
        <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Amaliy qo'llanilishi
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {PHOTOPHYSICS.applications.map((app, i) => (
              <button
                key={i}
                onClick={() => setActiveApplication(i)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeApplication === i
                    ? "bg-pink-600/60 text-white border border-pink-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {app.field}
              </button>
            ))}
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-pink-400 mb-3">
              {PHOTOPHYSICS.applications[activeApplication].field}
            </h3>
            <p className="text-purple-200 mb-4">{PHOTOPHYSICS.applications[activeApplication].description}</p>
            <h4 className="text-pink-300 font-bold text-sm mb-2">Misollar:</h4>
            <ul className="space-y-2 mb-4">
              {PHOTOPHYSICS.applications[activeApplication].examples.map((ex, i) => (
                <li key={i} className="text-purple-300 text-sm flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
              <p className="text-green-200 text-sm">
                <strong className="text-green-400">Ahamiyati:</strong> {PHOTOPHYSICS.applications[activeApplication].significance}
              </p>
            </div>
          </div>
        </div>

        {/* TADQIQOT USULLARI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Tadqiqot usullari
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {PHOTOPHYSICS.researchMethods.map((method, i) => (
              <button
                key={i}
                onClick={() => setActiveMethod(i)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeMethod === i
                    ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {method.method}
              </button>
            ))}
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">
              {PHOTOPHYSICS.researchMethods[activeMethod].method}
            </h3>
            <div className="space-y-3">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Qo'llanilishi:</div>
                <p className="text-purple-200">{PHOTOPHYSICS.researchMethods[activeMethod].application}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Ma'lumot:</div>
                <p className="text-purple-200">{PHOTOPHYSICS.researchMethods[activeMethod].information}</p>
              </div>
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                <div className="text-green-400 text-xs mb-1">Afzallik:</div>
                <p className="text-purple-200">{PHOTOPHYSICS.researchMethods[activeMethod].advantage}</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                <div className="text-yellow-400 text-xs mb-1">Misol:</div>
                <p className="text-purple-200 text-sm">{PHOTOPHYSICS.researchMethods[activeMethod].example}</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li><strong className="text-pink-400">Jablonski diagrammasi</strong> — barcha fotofizik jarayonlarning vizual xaritasi</li>
            <li><strong className="text-pink-400">Kasha qoidasi:</strong> emissiya faqat eng past qo'zg'algan holatdan (S₁ yoki T₁)</li>
            <li><strong className="text-pink-400">Fluoresensiya (ns)</strong> — singlet-singlet, spin ruxsat etilgan</li>
            <li><strong className="text-pink-400">Fosforesensiya (μs-s)</strong> — triplet-singlet, spin ta'qiqlangan, og'ir atom kerak</li>
            <li><strong className="text-pink-400">Kvant unumdorligi (Φ):</strong> k_r/(k_r + Σk_nr) — samaradorlik ko'rsatkichi</li>
            <li><strong className="text-pink-400">Stern-Volmer:</strong> quenching tahlili, sensor dizayni</li>
            <li><strong className="text-pink-400">FRET vs Dexter:</strong> uzoq masofa (dipol) vs qisqa masofa (elektron almashinish)</li>
            <li><strong className="text-pink-400">MLCT emitterlar:</strong> [Ru(bpy)₃]²⁺, [Ir(ppy)₃], [PtOEP] — OLED, fotokataliz</li>
            <li><strong className="text-pink-400">Og'ir atom effekti:</strong> Ir, Pt → ISC tezlashadi → kuchli fosforesensiya</li>
            <li><strong className="text-pink-400">Qo'llanilish:</strong> OLED, DSSC, fotokataliz, biologik sensorlar</li>
          </ol>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← MLCT
          </Link>
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/solvatoxromizm" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">
            Solvatoxromizm →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Chuqurlashgan mavzular</p>
          <p className="mt-1">Fotofizika • Jablonski (1933) • Kasha (1950) • Förster (1948) • Dexter (1953)</p>
        </div>
      </footer>
    </main>
  )
}