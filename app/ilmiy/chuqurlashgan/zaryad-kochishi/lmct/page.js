"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// LMCT (LIGAND-TO-METAL CHARGE TRANSFER) — CHUQURLASHGAN MAVZU
// Manbalar: Jørgensen (1962), Lever (1968), Miessler-Tarr, Cotton-Wilkinson,
//           Ballhausen, Gray-Beach, Solomon (2000)
//  ═══════════════════════════════════════════════════════════════════════════════

const LMCT_DATA = {
  //  ═══════════════════════════════════════════════════════════════
  // ASOSIY TUSHUNCHA
  //  ═══════════════════════════════════════════════════════════════
  concept: {
    definition: "LMCT (Ligand-to-Metal Charge Transfer) — elektronning ligand orbitallaridan metall orbitallariga o'tishi natijasida yuzaga keladigan yutilish jarayoni",
    abbreviation: "LMCT",
    fullName: "Ligand-to-Metal Charge Transfer",
    type: "Zaryad ko'chishi (Charge Transfer)",
    direction: "Ligand → Metall",
    result: "Metall qisman qaytariladi, ligand qisman oksidlanadi"
  },

  //  ═══════════════════════════════════════════════════════════════
  // MEXANIZM
  //  ═══════════════════════════════════════════════════════════════
  mechanism: {
    steps: [
      {
        step: 1,
        title: "Dastlabki holat",
        description: "Metall yuqori oksidlanish darajasida (Mⁿ⁺), ligand esa elektron donori (L⁻). Ligandning to'ldirilgan orbitallari metallning bo'sh orbitallariga nisbatan yuqori energiyada.",
        energy: "L(HOMO) > M(LUMO)"
      },
      {
        step: 2,
        title: "Yorug'lik yutilishi",
        description: "UV yoki ko'rinadigan yorug'lik kvanti (hν) elektronni liganddan metallga o'tkazish uchun energiya beradi.",
        energy: "hν = E(M) - E(L)"
      },
      {
        step: 3,
        title: "Qo'zg'algan holat",
        description: "Elektron ko'chgach, qo'zg'algan holat hosil bo'ladi: [M⁽ⁿ⁻¹⁾⁺-L⁰]*. Bu vaqtinchalik (10⁻¹⁰-10⁻⁸ s).",
        energy: "Metall qisman qaytariladi"
      },
      {
        step: 4,
        title: "Relaksatsiya",
        description: "Qo'zg'algan holat issiqlik yoki nurlanish orqali asosiy holatga qaytadi.",
        energy: "Non-radiative yoki fluorescence"
      }
    ],
    conditions: [
      "Metall yuqori oksidlanish darajasida (Mn⁷⁺, Cr⁶⁺, V⁵⁺)",
      "Ligand elektron donori (O²⁻, S²⁻, Cl⁻, Br⁻, I⁻)",
      "Metallning bo'sh d-orbitallari mavjud",
      "Energiya mosligi (ΔE = 20,000-50,000 cm⁻¹)"
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // ENERGETIK SHARTLAR
  //  ═══════════════════════════════════════════════════════════════
  energetics: {
    energyRange: "20,000 - 50,000 cm⁻¹ (UV-Vis)",
    wavelengthRange: "200 - 500 nm",
    molarAbsorptivity: "ε = 1,000 - 50,000 L/(mol·cm)",
    selectionRules: {
      laporte: "Laporte ruxsat etilgan (g → u)",
      spin: "Spin ruxsat etilgan (ΔS = 0)",
      symmetry: "Simmetriya ruxsat etilgan"
    },
    factorsAffecting: [
      {
        factor: "Metall oksidlanish darajasi",
        effect: "Yuqori → kuchliroq LMCT (past energiyada)",
        example: "Mn⁷⁺ > Mn⁴⁺ > Mn²⁺"
      },
      {
        factor: "Ligand turi",
        effect: "Kuchli donor → past energiyali LMCT",
        example: "I⁻ > Br⁻ > Cl⁻ > F⁻ > O²⁻"
      },
      {
        factor: "Geometriya",
        effect: "Simmetriya tanlash qoidalariga ta'sir qiladi",
        example: "Oktaedr vs tetraedr"
      },
      {
        factor: "Kovalentlik",
        effect: "Yuqori kovalentlik → kuchli LMCT",
        example: "S²⁻ > O²⁻ (kovalentlik)"
      }
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // ASOSIY MISOLLAR
  //  ═══════════════════════════════════════════════════════════════
  examples: [
    {
      name: "Permanganat ion",
      formula: "MnO₄⁻",
      formulaHTML: "MnO<sub>4</sub><sup>−</sup>",
      metal: "Mn⁷⁺",
      dElectrons: "d⁰",
      ligand: "O²⁻ (4 ta)",
      geometry: "Tetraedr (Td)",
      color: "To'q binafsha",
      lmctWavelength: "~520-540 nm",
      lmctEnergy: "~19,000 cm⁻¹",
      epsilon: "2,000-3,000 L/(mol·cm)",
      transition: "t₁ → 2e (O 2p → Mn 3d)",
      application: "Analitik kimyo, titrlash",
      whyNoDD: "d⁰ — d-elektronlar yo'q, shuning uchun d-d o'tishlar bo'lmaydi"
    },
    {
      name: "Xromat ion",
      formula: "CrO₄²⁻",
      formulaHTML: "CrO<sub>4</sub><sup>2−</sup>",
      metal: "Cr⁶⁺",
      dElectrons: "d⁰",
      ligand: "O²⁻ (4 ta)",
      geometry: "Tetraedr (Td)",
      color: "Sariq",
      lmctWavelength: "~370 nm",
      lmctEnergy: "~27,000 cm⁻¹",
      epsilon: "4,000-5,000 L/(mol·cm)",
      transition: "t₁ → 2e (O 2p → Cr 3d)",
      application: "Pigment, analitik kimyo",
      whyNoDD: "d⁰ — d-elektronlar yo'q"
    },
    {
      name: "Dixromat ion",
      formula: "Cr₂O₇²⁻",
      formulaHTML: "Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup>",
      metal: "Cr⁶⁺ (2 ta)",
      dElectrons: "d⁰",
      ligand: "O²⁻ (7 ta, ko'prikli)",
      geometry: "Ikki tetraedr (ko'prikli)",
      color: "To'q sariq",
      lmctWavelength: "~350-450 nm",
      lmctEnergy: "~22,000-28,000 cm⁻¹",
      epsilon: "3,000-5,000 L/(mol·cm)",
      transition: "O 2p → Cr 3d",
      application: "Oksidlovchi, titrlash",
      whyNoDD: "d⁰ — d-elektronlar yo'q"
    },
    {
      name: "Tetraxloroferrat(III)",
      formula: "FeCl₄⁻",
      formulaHTML: "FeCl<sub>4</sub><sup>−</sup>",
      metal: "Fe³⁺",
      dElectrons: "d⁵",
      ligand: "Cl⁻ (4 ta)",
      geometry: "Tetraedr (Td)",
      color: "Sariq-jigar",
      lmctWavelength: "~350-400 nm",
      lmctEnergy: "~25,000-29,000 cm⁻¹",
      epsilon: "2,000-4,000 L/(mol·cm)",
      transition: "Cl 3p → Fe 3d",
      application: "Katalizator",
      whyNoDD: "d-d o'tishlar juda kuchsiz (spin-ta'qiqlangan)"
    },
    {
      name: "Temir(III) tsiotsianat",
      formula: "[Fe(SCN)]²⁺",
      formulaHTML: "[Fe(SCN)]<sup>2+</sup>",
      metal: "Fe³⁺",
      dElectrons: "d⁵",
      ligand: "SCN⁻",
      geometry: "Oktaedr",
      color: "To'q qizil",
      lmctWavelength: "~450-500 nm",
      lmctEnergy: "~20,000-22,000 cm⁻¹",
      epsilon: "5,000-7,000 L/(mol·cm)",
      transition: "SCN π → Fe 3d",
      application: "Fe³⁺ ni aniqlash (analitik)",
      whyNoDD: "LMCT dominant, d-d o'tishlar yashirilgan"
    },
    {
      name: "Renat ion",
      formula: "ReO₄⁻",
      formulaHTML: "ReO<sub>4</sub><sup>−</sup>",
      metal: "Re⁷⁺",
      dElectrons: "d⁰",
      ligand: "O²⁻ (4 ta)",
      geometry: "Tetraedr (Td)",
      color: "Rangsiz",
      lmctWavelength: "~230 nm (UV)",
      lmctEnergy: "~43,000 cm⁻¹",
      epsilon: "~3,000 L/(mol·cm)",
      transition: "O 2p → Re 5d",
      application: "Kataliz, materialshunoslik",
      whyNoDD: "d⁰ — d-elektronlar yo'q"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // D-D vs LMCT FARQLARI
  //  ═══════════════════════════════════════════════════════════════
  comparison: {
    dd: {
      title: "d-d o'tishlar",
      mechanism: "Metall d-orbitallari ichida",
      epsilon: "1-100 L/(mol·cm)",
      selection: "Laporte ta'qiqlangan",
      intensity: "Kuchsiz",
      colorIntensity: "Och rang",
      example: "[Ti(H₂O)₆]³⁺ (och binafsha)"
    },
    lmct: {
      title: "LMCT",
      mechanism: "Ligand → Metall",
      epsilon: "1,000-50,000 L/(mol·cm)",
      selection: "Laporte ruxsat etilgan",
      intensity: "Kuchli",
      colorIntensity: "To'q rang",
      example: "MnO₄⁻ (to'q binafsha)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    jorgensen: {
      year: 1962,
      scientist: "Chr. Klixbüll Jørgensen (Daniya)",
      achievement: "Charge transfer tushunchasini tizimli o'rgandi",
      contribution: "LMCT va MLCT ni farqlash, energetik model"
    },
    lever: {
      year: 1968,
      scientist: "A.B.P. Lever (Kanada)",
      achievement: "Spektrokimyoviy parametrlar",
      contribution: "Optical electronegativity tushunchasi"
    },
    gray_beach: {
      year: "1960-yillar",
      scientist: "H.B. Gray va N.A. Beach",
      achievement: "MO diagrammalar orqali tushuntirish",
      contribution: "MO nazariyasini qo'llash"
    },
    solomon: {
      year: "2000-yillar",
      scientist: "E.I. Solomon (Stanford)",
      achievement: "Zamonaviy spektroskopik tahlil",
      contribution: "MCD, resonance Raman, XAS orqali batafsil o'rganish"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // SPEKTRAL XUSUSIYATLAR
  //  ═══════════════════════════════════════════════════════════════
  spectralProperties: {
    bandShape: "Keng (Gaussian, vibronic coupling)",
    bandwidth: "~3,000-5,000 cm⁻¹ (FWHM)",
    solventEffect: "Kuchsiz (zaryad ko'chishi mahalliylashtirilgan)",
    temperatureEffect: "Kuchsiz (vibronic coupling biroz o'zgaradi)",
    concentrationEffect: "Beer-Lambert qonuniga bo'ysunadi (A = εcl)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // QO'LLANILISHI
  //  ═══════════════════════════════════════════════════════════════
  applications: [
    {
      field: "Analitik kimyo",
      description: "Metall ionlarini miqdoriy aniqlash",
      examples: [
        "Fe³⁺ — [Fe(SCN)]²⁺ (qizil, kolorimetrik)",
        "Mn⁷⁺ — MnO₄⁻ (binafsha, permanganatometriya)",
        "Cr⁶⁺ — CrO₄²⁻ (sariq, dixromatometriya)"
      ],
      advantage: "Yuqori ε → yuqori sezgirlik"
    },
    {
      field: "Pigmentlar va bo'yoqlar",
      description: "Intensiv rang beruvchi moddalar",
      examples: [
        "CrO₄²⁻ — sariq pigment",
        "Cr₂O₇²⁻ — to'q sariq pigment",
        "MnO₄⁻ — binafsha (kam qo'llaniladi)"
      ],
      advantage: "Kuchli yutilish → intensiv rang"
    },
    {
      field: "Oksidlovchi moddalar",
      description: "Yuqori oksidlanish darajali komplekslar",
      examples: [
        "MnO₄⁻ — kuchli oksidlovchi",
        "Cr₂O₇²⁻ — kuchli oksidlovchi",
        "VO₂⁺ — o'rta oksidlovchi"
      ],
      advantage: "Yuqori oksidlanish darajasi"
    },
    {
      field: "Kataliz",
      description: "Oksidlanish-qaytarilish katalizatorlari",
      examples: [
        "ReO₄⁻ — oksidlanish katalizatori",
        "MoO₄²⁻ — epoksidlanish katalizatori",
        "VO₄³⁻ — selektiv oksidlanish"
      ],
      advantage: "Elektron ko'chish mexanizmi"
    },
    {
      field: "Materialshunoslik",
      description: "Fotoaktiv materiallar",
      examples: [
        "TiO₂ — fotokataliz (LMCT asosida)",
        "WO₃ — elektrokromik materiallar",
        "MoS₂ — yarim o'tkazgichlar"
      ],
      advantage: "Yorug'lik bilan qo'zg'atish"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "UV-Vis-NIR spektroskopiya",
      application: "LMCT band o'lchash",
      information: "λ_max, ε, band shakli",
      advantage: "Tez, oddiy, arzon"
    },
    {
      method: "Resonance Raman (RR)",
      application: "Vibronik tuzilish",
      information: "Bog' uzunliklari o'zgarishi, normal modlar",
      advantage: "Selektiv, batafsil"
    },
    {
      method: "MCD (Magnetic Circular Dichroism)",
      application: "Simmetriya va polarizatsiya",
      information: "Orbital simmetriya, degeneratsiya",
      advantage: "Simmetriya tahlili"
    },
    {
      method: "XAS (X-ray Absorption Spectroscopy)",
      application: "Elektron struktura",
      information: "Oksidlanish darajasi, bog' uzunliklari",
      advantage: "Element-selektiv"
    },
    {
      method: "TD-DFT hisob-kitoblari",
      application: "Nazariy tahlil",
      information: "O'tish energiyasi, orbital tahlil",
      advantage: "Batafsil tushunish"
    },
    {
      method: "EPR spektroskopiya",
      application: "Qo'zg'algan holatlar",
      information: "Spin holati, g-faktor",
      advantage: "Paramagnit holatlar"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TANLASH QOIDALARI
  //  ═══════════════════════════════════════════════════════════════
  selectionRules: {
    laporte: {
      rule: "g → u yoki u → g (markaziy simmetriya o'zgarishi)",
      lmct: "Ruxsat etilgan (ligand va metall orbitallari farqli simmetriyada)",
      dd: "Ta'qiqlangan (g → g, markaziy simmetriya saqlanadi)",
      example: "Oktaedrda: t₂g(g) → eg(g) — ta'qiqlangan; ligand p(u) → metal d(g) — ruxsat"
    },
    spin: {
      rule: "ΔS = 0 (spin saqlanishi)",
      lmct: "Odatda ruxsat etilgan",
      dd: "Ba'zan ta'qiqlangan (high-spin → low-spin)",
      example: "d⁵ high-spin: d-d spin-ta'qiqlangan, LMCT ruxsat"
    },
    symmetry: {
      rule: "Γ_i × Γ_μ × Γ_f ⊃ A₁g (to'liq simmetrik)",
      lmct: "Ko'pincha ruxsat etilgan",
      dd: "Ko'pincha ta'qiqlangan",
      example: "O_h simmetriyada t₁u × t₁u × eg = A₁g (LMCT ruxsat)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // OPTICAL ELECTRONEGATIVITY
  //  ═══════════════════════════════════════════════════════════════
  opticalElectronegativity: {
    concept: "Optical electronegativity (χ_opt) — Jørgensen tomonidan kiritilgan, LMCT energiyasini bashorat qilish uchun",
    formula: "ν_LMCT = 30,000 [χ_opt(X) - χ_opt(M)] cm⁻¹",
    metalValues: {
      "Mn⁷⁺": 2.9,
      "Cr⁶⁺": 2.7,
      "V⁵⁺": 2.5,
      "Fe³⁺": 2.0,
      "Co³⁺": 1.9,
      "Ni²⁺": 1.8
    },
    ligandValues: {
      "I⁻": 2.5,
      "Br⁻": 2.8,
      "Cl⁻": 3.0,
      "F⁻": 3.9,
      "O²⁻": 3.5,
      "S²⁻": 2.4
    },
    example: "MnO₄⁻: ν_LMCT = 30,000 [3.5(O) - 2.9(Mn)] = 18,000 cm⁻¹ (≈555 nm, binafsha)"
  }
}

export default function LMCTPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeMechanismStep, setActiveMechanismStep] = useState(1)
  const [activeExample, setActiveExample] = useState(0)
  const [activeApplication, setActiveApplication] = useState(0)
  const [activeMethod, setActiveMethod] = useState(0)
  const [activeNucleus, setActiveNucleus] = useState("mechanism")
  const [selectedMetal, setSelectedMetal] = useState("Mn⁷⁺")
  const [selectedLigand, setSelectedLigand] = useState("O²⁻")

  // Optical electronegativity hisoblash
  const calculatedEnergy = useMemo(() => {
    const metalValue = LMCT_DATA.opticalElectronegativity.metalValues[selectedMetal] || 2.0
    const ligandValue = LMCT_DATA.opticalElectronegativity.ligandValues[selectedLigand] || 3.0
    const energy = 30000 * Math.abs(ligandValue - metalValue)
    const wavelength = energy > 0 ? (10000000 / energy) : 0 // nm ga o'tkazish
    return { energy: energy.toFixed(0), wavelength: wavelength.toFixed(0) }
  }, [selectedMetal, selectedLigand])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-orange-950/20 to-slate-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-orange-950 to-purple-950 border-2 border-orange-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🌈</span> LMCT — LIGAND-TO-METAL CHARGE TRANSFER!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-orange-300">LMCT</strong> — elektronning ligand orbitallaridan metall orbitallariga ko'chishi.
              <strong className="text-orange-300"> Kuchli yutilish</strong> (ε = 1,000-50,000), intensiv ranglar!
            </p>
            <div className="bg-orange-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-orange-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Yo'nalish:</strong> Ligand → Metall
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ε:</strong> 1,000-50,000 L/(mol·cm)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Energiya:</strong> 20,000-50,000 cm⁻¹
                  </div>
                </div>
                <div>
                  <div className="text-orange-400 font-bold mb-2">🎯 Klassik misollar:</div>
                  <div className="text-purple-200">
                    <strong>MnO₄⁻:</strong> To'q binafsha
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>CrO₄²⁻:</strong> Sariq
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>[Fe(SCN)]²⁺:</strong> To'q qizil
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Tarix:</strong> Jørgensen (1962), Lever (1968), Gray-Beach (1960-yillar),
                Solomon (2000-yillar). Knowledge Base: Miessler-Tarr, Cotton-Wilkinson, Ballhausen.
              </p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-orange-400 font-semibold">LMCT</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-2">
                  <span className="text-3xl">🌈</span>
                  LMCT (Ligand-to-Metal Charge Transfer)
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  Chuqurlashgan mavzu — Zaryad ko'chishi fenomenlari
                </p>
              </div>
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="text-xs bg-orange-600/80 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Zaryad ko'chishi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-orange-600 hover:bg-orange-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-orange-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600/20 border border-orange-600/30 rounded-full text-xs font-semibold text-orange-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ZARYAD KO'CHISHI — LIGAND → METALL
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
                LMCT
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">Ligand-to-Metal Charge Transfer</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-orange-400">LMCT</strong> — elektronning ligand orbitallaridan metall orbitallariga
              <strong className="text-yellow-400"> o'tishi</strong> natijasida yuzaga keladigan yutilish jarayoni.
              Yuqori oksidlanish darajali metallar (Mn⁷⁺, Cr⁶⁺, V⁵⁺) va elektron donor ligandlar (O²⁻, S²⁻, Cl⁻) uchun xos.
              <strong className="text-orange-400"> Kuchli yutilish</strong> (ε = 1,000-50,000) → intensiv ranglar.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-xl font-bold text-orange-400">L → M</div>
                <div className="text-xs text-purple-400 mt-1">Yo'nalish</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🌈</div>
                <div className="text-xl font-bold text-orange-400">20-50k</div>
                <div className="text-xs text-purple-400 mt-1">cm⁻¹</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xl font-bold text-orange-400">10³-10⁴</div>
                <div className="text-xs text-purple-400 mt-1">ε (kuchli)</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-xl font-bold text-orange-400">To'q</div>
                <div className="text-xs text-purple-400 mt-1">Rang</div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveNucleus("mechanism")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "mechanism"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            ⚙️ Mexanizm
          </button>
          <button
            onClick={() => setActiveNucleus("examples")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "examples"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🧪 Misollar
          </button>
          <button
            onClick={() => setActiveNucleus("comparison")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "comparison"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🔄 d-d vs LMCT
          </button>
          <button
            onClick={() => setActiveNucleus("rules")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "rules"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            📏 Tanlash qoidalari
          </button>
          <button
            onClick={() => setActiveNucleus("calculator")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "calculator"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🧮 Kalkulyator
          </button>
          <button
            onClick={() => setActiveNucleus("applications")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "applications"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🔬 Qo'llanilishi
          </button>
          <button
            onClick={() => setActiveNucleus("research")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "research"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🔬 Tadqiqot usullari
          </button>
          <button
            onClick={() => setActiveNucleus("history")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeNucleus === "history"
                ? "bg-orange-600/60 text-white border border-orange-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            📜 Tarix
          </button>
        </div>

        {/* MEXANIZM */}
        {activeNucleus === "mechanism" && (
          <div className="space-y-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">⚙️</span>
                LMCT Mexanizmi
              </h2>

              <div className="bg-orange-900/30 border border-orange-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-orange-400 mb-3">Ta'rif</h3>
                <p className="text-purple-200 leading-relaxed mb-3">
                  {LMCT_DATA.concept.definition}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-purple-950/50 rounded-lg p-3">
                    <span className="text-purple-400 font-semibold">Yo'nalish:</span>
                    <span className="text-white ml-2">{LMCT_DATA.concept.direction}</span>
                  </div>
                  <div className="bg-purple-950/50 rounded-lg p-3">
                    <span className="text-purple-400 font-semibold">Natija:</span>
                    <span className="text-white ml-2">{LMCT_DATA.concept.result}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-orange-400 mb-4">Jarayon bosqichlari</h3>
              <div className="space-y-4">
                {LMCT_DATA.mechanism.steps.map((step) => (
                  <div
                    key={step.step}
                    onClick={() => setActiveMechanismStep(step.step)}
                    className={`rounded-xl p-5 cursor-pointer transition-all ${
                      activeMechanismStep === step.step
                        ? "bg-orange-900/40 border-2 border-orange-400"
                        : "bg-purple-900/30 border border-purple-700/30 hover:border-orange-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        activeMechanismStep === step.step ? "bg-orange-500 text-white" : "bg-purple-800 text-purple-400"
                      }`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-orange-400">{step.title}</h4>
                      </div>
                    </div>
                    {activeMechanismStep === step.step && (
                      <div className="mt-3 pt-3 border-t border-purple-700/50">
                        <p className="text-purple-200 leading-relaxed mb-2">{step.description}</p>
                        <div className="bg-purple-950/50 rounded-lg p-2 text-xs font-mono text-yellow-400">
                          {step.energy}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">💡 Zaruriy shartlar</h3>
                <ul className="space-y-2 text-sm text-purple-200">
                  {LMCT_DATA.mechanism.conditions.map((condition, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400 flex-shrink-0">•</span>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* MISOLLAR */}
        {activeNucleus === "examples" && (
          <div className="space-y-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🧪</span>
                Klassik LMCT misollari
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {LMCT_DATA.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveExample(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeExample === i
                        ? "bg-orange-600/60 text-white border border-orange-400/50"
                        : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                    }`}
                  >
                    {ex.formula}
                  </button>
                ))}
              </div>

              <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-4">
                  {LMCT_DATA.examples[activeExample].name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-sm">
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Formula:</div>
                      <div className="text-white font-mono text-lg" dangerouslySetInnerHTML={{ __html: LMCT_DATA.examples[activeExample].formulaHTML }} />
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Metall:</div>
                      <div className="text-white">{LMCT_DATA.examples[activeExample].metal}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">d-elektronlar:</div>
                      <div className="text-white">{LMCT_DATA.examples[activeExample].dElectrons}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Ligand:</div>
                      <div className="text-white">{LMCT_DATA.examples[activeExample].ligand}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Geometriya:</div>
                      <div className="text-white">{LMCT_DATA.examples[activeExample].geometry}</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Rang:</div>
                      <div className="text-white font-bold">{LMCT_DATA.examples[activeExample].color}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">LMCT to'lqin uzunligi:</div>
                      <div className="text-white font-mono">{LMCT_DATA.examples[activeExample].lmctWavelength}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">LMCT energiyasi:</div>
                      <div className="text-white font-mono">{LMCT_DATA.examples[activeExample].lmctEnergy}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">ε (molyar ekstinksiya):</div>
                      <div className="text-white font-mono">{LMCT_DATA.examples[activeExample].epsilon}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">O'tish:</div>
                      <div className="text-white text-xs">{LMCT_DATA.examples[activeExample].transition}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                    <div className="text-green-400 text-xs mb-1 font-semibold">Qo'llanilishi:</div>
                    <div className="text-purple-200 text-sm">{LMCT_DATA.examples[activeExample].application}</div>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                    <div className="text-yellow-400 text-xs mb-1 font-semibold">Nima uchun d-d o'tishlar yo'q?</div>
                    <div className="text-purple-200 text-sm">{LMCT_DATA.examples[activeExample].whyNoDD}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D-D vs LMCT */}
        {activeNucleus === "comparison" && (
          <div className="space-y-6">
            <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🔄</span>
                d-d o'tishlar vs LMCT
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                      <th className="py-3 px-4 text-teal-400">Xususiyat</th>
                      <th className="py-3 px-4 text-blue-400">d-d o'tishlar</th>
                      <th className="py-3 px-4 text-orange-400">LMCT</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 text-purple-400 font-semibold">Mexanizm</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.dd.mechanism}</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.lmct.mechanism}</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-purple-950/20">
                      <td className="py-3 px-4 text-purple-400 font-semibold">ε (L/(mol·cm))</td>
                      <td className="py-3 px-4 font-mono text-blue-400">{LMCT_DATA.comparison.dd.epsilon}</td>
                      <td className="py-3 px-4 font-mono text-orange-400">{LMCT_DATA.comparison.lmct.epsilon}</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 text-purple-400 font-semibold">Tanlash qoidalari</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.dd.selection}</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.lmct.selection}</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-purple-950/20">
                      <td className="py-3 px-4 text-purple-400 font-semibold">Intensivlik</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.dd.intensity}</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.lmct.intensity}</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 text-purple-400 font-semibold">Rang intensivligi</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.dd.colorIntensity}</td>
                      <td className="py-3 px-4">{LMCT_DATA.comparison.lmct.colorIntensity}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-purple-400 font-semibold">Klassik misol</td>
                      <td className="py-3 px-4 text-xs">{LMCT_DATA.comparison.dd.example}</td>
                      <td className="py-3 px-4 text-xs">{LMCT_DATA.comparison.lmct.example}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">💡 Muhim eslatma</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-yellow-400">LMCT</strong> — <strong>Laporte ruxsat etilgan</strong> (g → u yoki u → g),
                  shuning uchun <strong className="text-orange-400">kuchli yutilish</strong> (ε &gt; 1,000).
                  <strong className="text-yellow-400"> d-d o'tishlar</strong> esa <strong>Laporte ta'qiqlangan</strong> (g → g),
                  shuning uchun <strong className="text-blue-400">kuchsiz yutilish</strong> (ε &lt; 100).
                  Kompleks rangi ko'pincha <strong>LMCT</strong> natijasida paydo bo'ladi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TANLASH QOIDALARI */}
        {activeNucleus === "rules" && (
          <div className="space-y-6">
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">📏</span>
                Tanlash qoidalari (Selection Rules)
              </h2>

              <div className="space-y-6">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-pink-400 mb-3">Laporte qoidasi</h3>
                  <p className="text-purple-200 text-sm mb-4">{LMCT_DATA.selectionRules.laporte.rule}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">LMCT:</div>
                      <div className="text-green-400">{LMCT_DATA.selectionRules.laporte.lmct}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">d-d:</div>
                      <div className="text-red-400">{LMCT_DATA.selectionRules.laporte.dd}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Misol:</div>
                      <div className="text-white text-xs">{LMCT_DATA.selectionRules.laporte.example}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-pink-400 mb-3">Spin qoidasi</h3>
                  <p className="text-purple-200 text-sm mb-4">{LMCT_DATA.selectionRules.spin.rule}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">LMCT:</div>
                      <div className="text-green-400">{LMCT_DATA.selectionRules.spin.lmct}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">d-d:</div>
                      <div className="text-yellow-400">{LMCT_DATA.selectionRules.spin.dd}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Misol:</div>
                      <div className="text-white text-xs">{LMCT_DATA.selectionRules.spin.example}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-pink-400 mb-3">Simmetriya qoidasi</h3>
                  <p className="text-purple-200 text-sm mb-4">{LMCT_DATA.selectionRules.symmetry.rule}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">LMCT:</div>
                      <div className="text-green-400">{LMCT_DATA.selectionRules.symmetry.lmct}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">d-d:</div>
                      <div className="text-red-400">{LMCT_DATA.selectionRules.symmetry.dd}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-purple-400 text-xs mb-1">Misol:</div>
                      <div className="text-white text-xs">{LMCT_DATA.selectionRules.symmetry.example}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KALKULYATOR */}
        {activeNucleus === "calculator" && (
          <div className="space-y-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🧮</span>
                Optical Electronegativity Kalkulyatori
              </h2>

              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Jørgensen formulasi</h3>
                <p className="text-purple-200 text-sm mb-3">{LMCT_DATA.opticalElectronegativity.concept}</p>
                <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center text-yellow-400 text-lg">
                  {LMCT_DATA.opticalElectronegativity.formula}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-4">Metall tanlang</h3>
                  <div className="space-y-2">
                    {Object.entries(LMCT_DATA.opticalElectronegativity.metalValues).map(([metal, value]) => (
                      <button
                        key={metal}
                        onClick={() => setSelectedMetal(metal)}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${
                          selectedMetal === metal
                            ? "bg-orange-600/60 text-white border border-orange-400/50"
                            : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                        }`}
                      >
                        <span>{metal}</span>
                        <span className="font-mono text-xs">χ = {value}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-4">Ligand tanlang</h3>
                  <div className="space-y-2">
                    {Object.entries(LMCT_DATA.opticalElectronegativity.ligandValues).map(([ligand, value]) => (
                      <button
                        key={ligand}
                        onClick={() => setSelectedLigand(ligand)}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${
                          selectedLigand === ligand
                            ? "bg-orange-600/60 text-white border border-orange-400/50"
                            : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                        }`}
                      >
                        <span>{ligand}</span>
                        <span className="font-mono text-xs">χ = {value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold text-green-400 mb-4">Hisoblash natijasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-950/50 rounded-lg p-4">
                    <div className="text-purple-400 text-xs mb-1">LMCT energiyasi:</div>
                    <div className="text-white font-mono text-2xl">{calculatedEnergy.energy} cm⁻¹</div>
                  </div>
                  <div className="bg-purple-950/50 rounded-lg p-4">
                    <div className="text-purple-400 text-xs mb-1">To'lqin uzunligi:</div>
                    <div className="text-white font-mono text-2xl">{calculatedEnergy.wavelength} nm</div>
                  </div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-4 mt-4">
                  <div className="text-purple-400 text-xs mb-1">Hisoblash:</div>
                  <div className="text-white text-sm font-mono">
                    ν = 30,000 × |{LMCT_DATA.opticalElectronegativity.ligandValues[selectedLigand]} - {LMCT_DATA.opticalElectronegativity.metalValues[selectedMetal]}| = {calculatedEnergy.energy} cm⁻¹
                  </div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mt-4">
                  <p className="text-yellow-200 text-xs">
                    <strong className="text-yellow-400">💡 Eslatma:</strong> {LMCT_DATA.opticalElectronegativity.example}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QO'LLANILISHI */}
        {activeNucleus === "applications" && (
          <div className="space-y-6">
            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🔬</span>
                LMCT ning amaliy qo'llanilishi
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {LMCT_DATA.applications.map((app, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveApplication(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeApplication === i
                        ? "bg-indigo-600/60 text-white border border-indigo-400/50"
                        : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                    }`}
                  >
                    {app.field}
                  </button>
                ))}
              </div>

              <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-400 mb-3">
                  {LMCT_DATA.applications[activeApplication].field}
                </h3>
                <p className="text-purple-200 mb-4">{LMCT_DATA.applications[activeApplication].description}</p>

                <div className="bg-purple-950/50 rounded-lg p-4 mb-4">
                  <div className="text-purple-400 text-xs mb-2 font-semibold">Misollar:</div>
                  <ul className="space-y-2 text-sm text-purple-200">
                    {LMCT_DATA.applications[activeApplication].examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 flex-shrink-0">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                  <div className="text-green-400 text-xs mb-1 font-semibold">Afzalligi:</div>
                  <div className="text-purple-200 text-sm">{LMCT_DATA.applications[activeApplication].advantage}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TADQIQOT USULLARI */}
        {activeNucleus === "research" && (
          <div className="space-y-6">
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🔬</span>
                LMCT ni tadqiq qilish usullari
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {LMCT_DATA.researchMethods.map((method, i) => (
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
                  {LMCT_DATA.researchMethods[activeMethod].method}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-purple-950/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs mb-1 font-semibold">Qo'llanilishi:</div>
                    <div className="text-purple-200">{LMCT_DATA.researchMethods[activeMethod].application}</div>
                  </div>
                  <div className="bg-purple-950/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs mb-1 font-semibold">Ma'lumot:</div>
                    <div className="text-purple-200">{LMCT_DATA.researchMethods[activeMethod].information}</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                    <div className="text-green-400 text-xs mb-1 font-semibold">Afzalligi:</div>
                    <div className="text-purple-200">{LMCT_DATA.researchMethods[activeMethod].advantage}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TARIX */}
        {activeNucleus === "history" && (
          <div className="space-y-6">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="text-4xl">📜</span>
                Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-3">Jørgensen (1962)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Olim:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.jorgensen.scientist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Yil:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.jorgensen.year}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Yutuq:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.jorgensen.achievement}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Hissa:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.jorgensen.contribution}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-3">Lever (1968)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Olim:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.lever.scientist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Yil:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.lever.year}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Yutuq:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.lever.achievement}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Hissa:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.lever.contribution}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-3">Gray-Beach (1960-yillar)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Olimlar:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.gray_beach.scientist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Yil:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.gray_beach.year}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Yutuq:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.gray_beach.achievement}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Hissa:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.gray_beach.contribution}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-3">Solomon (2000-yillar)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Olim:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.solomon.scientist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Yil:</span>
                      <span className="text-amber-400">{LMCT_DATA.history.solomon.year}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Yutuq:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.solomon.achievement}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Hissa:</span>
                      <span className="text-purple-200 text-xs">{LMCT_DATA.history.solomon.contribution}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Zaryad ko'chishi
          </Link>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/d-d-vs-ct" className="px-6 py-3 bg-purple-600/60 hover:bg-purple-500/80 border border-purple-500/50 rounded-xl text-white font-semibold">
              d-d vs CT
            </Link>
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-black font-bold">
              MLCT →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Chuqurlashgan mavzular</p>
          <p className="mt-1">LMCT (Ligand-to-Metal Charge Transfer) • Zaryad ko'chishi fenomenlari</p>
        </div>
      </footer>
    </main>
  )
}