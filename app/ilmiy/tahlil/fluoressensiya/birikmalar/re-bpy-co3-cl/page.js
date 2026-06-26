"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// [Re(bpy)(CO)₃Cl] — RENIY(I) KARBONIL KOMPLEKSI FLUORESENSIYA
// Manbalar: Hawke (1974), Luong (1988), Vlček (2000), Kubiak (2012)
// Xususiyat: MLCT emissiya, CO₂ qaytarish fotokatalizatori
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Re(bpy)(CO)<sub>3</sub>Cl]",
  formulaPlain: "[Re(bpy)(CO)3Cl]",
  iupac: "Xlorotrikarbonil(2,2'-bipiridin)reniy(I)",
  commonName: "Reniy(I) bipiridin karbonil (sariq-yashil)",
  molarMass: 505.82,
  casNumber: "53349-12-9",
  color: "sariq-yashil (yellow-green)",
  structure: "Oktaedr (fac-C₃ᵥ)",
  metalLigand: "Re-N (bpy), Re-C (CO), Re-Cl",
  pointGroup: "C₃ᵥ (fac-izomer)",
  electrolyteType: "Noelektrolit",
  molarConductivity: "~0 S·cm²/mol",
  
  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Re⁺",
    electronConfig: "[Xe] 4f¹⁴ 5d⁶",
    dElectrons: 6,
    spinState: "Past spinli (low-spin)",
    orbitalOccupancy: "t₂g⁶ eg⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Δo ≈ 28,000 cm⁻¹ (3.47 eV)",
    racahParameter: "B ≈ 450 cm⁻¹ (erkin ion B₀ = 800 cm⁻¹)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.56",
    pairingEnergy: "P ≈ 18,000 cm⁻¹",
    cFSE: "CFSE = -2.4 Δo + P ≈ -67,200 + 18,000 = -49,200 cm⁻¹",
    spectrochemicalSeries: "CO — eng kuchli maydon ligandi (I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ < CN⁻ < CO)",
    whyLowSpin: "Δo (28,000) >> P (18,000) → past spinli, diamagnit",
    colorOrigin: "MLCT (Re⁺ → bpy π*) ~370 nm (UV-Vis yutilish) → yashil emissiya",
    chargeTransfer: "MLCT: Re⁺ (dπ) → bpy (π*) ~27,000 cm⁻¹ (370 nm)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "C₃ᵥ (fac-izomer)",
    order: 6,
    symmetryElements: ["E", "2C₃", "3σᵥ"],
    characterTable: {
      A1: { E: 1, C3: 1, σv: 1, functions: "z, x²+y², z²" },
      A2: { E: 1, C3: 1, σv: -1, functions: "Rz" },
      E: { E: 2, C3: -1, σv: 0, functions: "(x,y), (Rx,Ry), (xz,yz)" }
    },
    nmrEquivalence: "C₃ᵥ simmetriya: 3 ta CO ekvivalent (fac), bpy simmetrik. ¹H YaMR da bpy protonlari 4 ta signal (AA'BB' sistema).",
    irActive: "A1, E — IR faol (3 ta CO cho'zilish: 2020, 1900, 1880 cm⁻¹)",
    ramanActive: "A1, E — Raman faol",
    mutualExclusion: "C₃ᵥ da IR va Raman ustma-ust tushadi (markaziy simmetriya yo'q)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // FLUORESENSIYA XUSUSIYATLARI
  //  ═══════════════════════════════════════════════════════════════
  fluorescence: {
    absorption: {
      wavelength: "370 nm (UV-Vis)",
      wavenumber: "27,000 cm⁻¹",
      energy: "3.35 eV",
      molarAbsorptivity: "ε ≈ 14,000 M⁻¹sm⁻¹",
      transition: "MLCT: Re⁺(dπ) → bpy(π*)",
      bandShape: "Keng (vibronik tuzilish)"
    },
    emission: {
      wavelength: "550 nm (yashil)",
      wavenumber: "18,200 cm⁻¹",
      energy: "2.26 eV",
      stokesShift: "8,800 cm⁻¹ (1.09 eV)",
      quantumYield: "Φ ≈ 0.01-0.05 (past)",
      lifetime: "τ ≈ 50-200 ns (nanosekund)",
      bandShape: "Keng, strukturaviy (vibronik)",
      temperatureDependence: "Harorat oshishi bilan Φ kamayadi (non-radiativ relaksatsiya)"
    },
    excitedState: {
      type: "³MLCT (triplet metal-to-ligand charge transfer)",
      configuration: "Re²⁺(d⁵) - bpy⁻(π*¹)",
      lifetime: "50-200 ns",
      quenching: "O₂, erituvchi, temperatura ta'sirida quenching",
      redoxPotential: "E°(Re²⁺/Re⁺) ≈ -1.3 V vs SCE (kuchli qaytaruvchi)"
    },
    mechanism: {
      excitation: "Re⁺(d⁶) + hν → Re⁺*(d⁵bpy⁻) (MLCT)",
      intersystemCrossing: "Tez ISC (Re og'ir atom, spin-orbital bog'lanish kuchli)",
      emission: "³MLCT → S₀ + hν (550 nm, fosforesensiya)",
      nonRadiative: "Vibronik relaksatsiya, erituvchi ta'siri"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      reN: "2.16-2.18 Å (Re-N bpy)",
      reC: "1.90-1.92 Å (Re-C CO)",
      co_bond: "1.14-1.16 Å (C≡O, uch bog')",
      reCl: "2.48-2.50 Å (Re-Cl)",
      comparison: "fac-izomerda 3 ta CO ekvivalent, mer-izomerda 2+1 ta CO"
    },
    bondAngles: {
      nReN: "76-78° (bpy bite angle)",
      cReC: "88-90° (cis CO-CO)",
      comparison: "fac-izomerda C₃ᵥ simmetriya, mer-izomerda C₂ᵥ"
    },
    geometry: {
      type: "Oktaedr (fac-izomer)",
      isomer: "fac (facial) — 3 ta CO bir yuzda",
      alternative: "mer (meridional) — 3 ta CO meridian bo'ylab",
      preferred: "fac-izomer termodinamik jihatdan barqaror"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // FOTOKATALITIK XOSSALAR
  //  ═══════════════════════════════════════════════════════════════
  photocatalysis: {
    co2Reduction: {
      reaction: "CO₂ + 2H⁺ + 2e⁻ → CO + H₂O",
      catalyst: "[Re(bpy)(CO)₃Cl]",
      coCatalyst: "Trietanolamin (TEOA) yoki trietilamin (Et₃N)",
      sacrificialDonor: "Elektron donori (qurbonlik qiluvchi)",
      products: ["CO (asosiy)", "H₂ (kam miqdorda)"],
      efficiency: "TON ≈ 10-50 (turnover number)",
      mechanism: "MLCT → Re²⁺(bpy⁻) → CO₂ ga elektron uzatish"
    },
    mechanism: {
      step1: "MLCT excitation: Re⁺ + hν → Re⁺*(MLCT)",
      step2: "Quenching: Re⁺* + TEOA → Re⁰(bpy⁻) + TEOA⁺",
      step3: "CO₂ binding: Re⁰(bpy⁻) + CO₂ → Re⁰(CO₂)(bpy⁻)",
      step4: "Reduction: Re⁰(CO₂)(bpy⁻) + e⁻ → Re⁰(CO₂)²⁻(bpy⁻)",
      step5: "Product release: Re⁰(CO₂)²⁻ → Re⁰ + CO + O²⁻",
      step6: "Catalyst regeneration: Re⁰ → Re⁺ (sikl boshidan)"
    },
    advantages: [
      "Yuqori selektivlik (CO asosiy mahsulot)",
      "Barqaror katalizator (uzoq umr)",
      "Ko'rinadigan yorug'lik bilan ishlaydi",
      "Oddiy sintez"
    ],
    limitations: [
      "Past kvant unumdorligi (Φ ≈ 0.01-0.05)",
      "Sekin kinetika",
      "Qurbonlik qiluvchi donor kerak",
      "Organik erituvchilar kerak (DMF, CH₃CN)"
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIX
  //  ═══════════════════════════════════════════════════════════════
  history: [
    { year: 1974, scientist: "Hawke", event: "Birinchi sintez va MLCT emissiya kashfiyoti" },
    { year: 1988, scientist: "Luong", event: "CO₂ qaytarish fotokatalizatori sifatida qo'llanilishi" },
    { year: 2000, scientist: "Vlček", event: "Ultrafast spektroskopiya bilan mexanizm o'rganish" },
    { year: 2012, scientist: "Kubiak", event: "Elektrokatalitik CO₂ qaytarish" }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[Re(bpy)(CO)₃Cl]",
      ligand: "bpy + 3CO + Cl",
      absorption: "370 nm",
      emission: "550 nm (yashil)",
      phi: "0.01-0.05",
      tau: "50-200 ns",
      application: "CO₂ qaytarish"
    },
    {
      compound: "[Ru(bpy)₃]²⁺",
      ligand: "3 bpy",
      absorption: "452 nm",
      emission: "620 nm (qizil)",
      phi: "0.042",
      tau: "600 ns",
      application: "Sensibilizator"
    },
    {
      compound: "[Ir(ppy)₃]",
      ligand: "3 ppy",
      absorption: "380 nm",
      emission: "515 nm (yashil)",
      phi: "0.4-1.0",
      tau: "1-2 μs",
      application: "OLED"
    },
    {
      compound: "[Re(bpy)(CO)₃(py)]⁺",
      ligand: "bpy + 3CO + py",
      absorption: "380 nm",
      emission: "560 nm",
      phi: "0.03",
      tau: "100 ns",
      application: "CO₂ qaytarish"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // YaMR MA'LUMOTLARI
  //  ═══════════════════════════════════════════════════════════════
  nmrData: {
    nucleus: "¹H, ¹³C",
    chemicalShift: "¹H: 7.5-9.0 ppm (bpy aromatik), ¹³C: 190-200 ppm (CO)",
    multiplicity: "¹H: AA'BB' sistema (murakkab), ¹³C: singlet",
    jCoupling: "J(H-H) = 5-8 Hz (bpy)",
    theoryNote: "C₃ᵥ simmetriya — 3 ta CO ekvivalent. ¹³C YaMR da CO signali 190-200 ppm da."
  },

  //  ═══════════════════════════════════════════════════════════════
  // HALAQIT BERUVCHI OMILLAR
  //  ═══════════════════════════════════════════════════════════════
  interferences: [
    {
      source: "Kislorod (O₂)",
      effect: "³MLCT emissiyani quench qiladi (triplet quenching)",
      severity: "Yuqori",
      solution: "Inert muhitda (N₂, Ar) ishlash. Degassing qilish.",
      theoryNote: "O₂ triplet holatda (³Σg⁻) — ³MLCT ni quench qiladi. Inert muhit kerak."
    },
    {
      source: "Harorat",
      effect: "Harorat oshishi bilan Φ kamayadi (non-radiativ relaksatsiya)",
      severity: "O'rta",
      solution: "Xona haroratida (298 K) yoki past haroratda (77 K) o'lchash.",
      theoryNote: "Arrhenius qonuni: k_nr = A·exp(-Eₐ/RT). Harorat oshishi bilan non-radiativ tezlik oshadi."
    },
    {
      source: "Erituvchi",
      effect: "Qutbli erituvchilar emissiyani quench qiladi",
      severity: "O'rta",
      solution: "Qutbsiz erituvchilar (CH₂Cl₂, toluol) ishlatish.",
      theoryNote: "Qutbli erituvchilar solvatatsiya orqali non-radiativ relaksatsiyani tezlashtiradi."
    },
    {
      source: "Konsentratsiya",
      effect: "Yuqori konsentratsiyada self-quenching",
      severity: "Past",
      solution: "Past konsentratsiya (10⁻⁵ - 10⁻⁴ M) ishlatish.",
      theoryNote: "Self-quenching — yuqori konsentratsiyada molekulalar o'zaro ta'sirlashadi."
    },
    {
      source: "Namlik",
      effect: "Suv molekulalari quenching agenti",
      severity: "O'rta",
      solution: "Quruq erituvchilar ishlatish. Molekulyar elaklar.",
      theoryNote: "H₂O vibronik relaksatsiyani tezlashtiradi (O-H tebranishlar)."
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // LABORATORIYA TARTIBI
  //  ═══════════════════════════════════════════════════════════════
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. CO toksik gaz. Re birikmalari zaharli. Inert muhit (N₂, Ar) kerak.",
      time: "15 daq",
      theoryNote: "CO toksik (gemoglobin bilan bog'lanadi). Re birikmalari zaharli. Inert muhitda ishlash."
    },
    {
      step: 2,
      title: "Sintez: [Re(bpy)(CO)₃Cl]",
      desc: "Re₂(CO)₁₀ + bpy → 2 [Re(bpy)(CO)₃Cl]. Reflux (qaynatish) CH₂Cl₂ yoki toluolda, 2-4 soat.",
      time: "2-4 soat",
      theoryNote: "Re₂(CO)₁₀ + bpy → 2 [Re(bpy)(CO)₃Cl]. Reflux (80-110°C) 2-4 soat. Sariq-yashil kristallar."
    },
    {
      step: 3,
      title: "Tozalash",
      desc: "Kolonna xromatografiyasi (silika gel, CH₂Cl₂). Rekristallizatsiya (CH₂Cl₂/hexane).",
      time: "1-2 soat",
      theoryNote: "Kolonna xromatografiyasi — tozalik 99%+. Rekristallizatsiya — yuqori tozalik."
    },
    {
      step: 4,
      title: "Fluoresensiya spektrometrni tayyorlash",
      desc: "Fluoresensiya spektrometrni yoqish, 30 daq stabillash. Excitation 370 nm, emission 450-700 nm.",
      time: "30 daq",
      theoryNote: "Excitation monoxromator 370 nm ga sozlash. Emission monoxromator 450-700 nm skanerlash."
    },
    {
      step: 5,
      title: "Namuna tayyorlash",
      desc: "10⁻⁵ M eritma tayyorlash (CH₂Cl₂ yoki CH₃CN). Kuvetga solish. Degassing (N₂ purging).",
      time: "10-15 daq",
      theoryNote: "Past konsentratsiya (10⁻⁵ M) — self-quenching oldini olish. Degassing — O₂ olib tashlash."
    },
    {
      step: 6,
      title: "Emissiya spektrini olish",
      desc: "Excitation 370 nm, emission 450-700 nm skanerlash. Emissiya cho'qqisi ~550 nm da.",
      time: "5-10 daq",
      theoryNote: "Emissiya cho'qqisi ~550 nm (yashil). Stokes shift ~8,800 cm⁻¹."
    },
    {
      step: 7,
      title: "Kvant unumdorligini o'lchash",
      desc: "Standart bilan taqqoslash ([Ru(bpy)₃]²⁺, Φ = 0.042). Φ = (I_sample/I_std) × (A_std/A_sample) × Φ_std.",
      time: "15-20 daq",
      theoryNote: "Nisbiy usul: Φ = (I_s/I_std) × (A_std/A_s) × (n_s/n_std)² × Φ_std. [Ru(bpy)₃]²⁺ standart."
    },
    {
      step: 8,
      title: "Umr o'lchash (TCSPC)",
      desc: "Time-Correlated Single Photon Counting. Pulsed laser (370 nm), emission 550 nm. τ ≈ 50-200 ns.",
      time: "30-60 daq",
      theoryNote: "TCSPC — pikosekund aniqlik. τ ≈ 50-200 ns. Exponential decay: I(t) = I₀·exp(-t/τ)."
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // KENGAYTIRUVCHI METODLAR
  //  ═══════════════════════════════════════════════════════════════
  advancedTechniques: [
    {
      name: "TCSPC (Time-Correlated Single Photon Counting)",
      description: "Pikosekund aniqlikda umr o'lchash",
      advantages: ["Yuqori aniqlik (ps)", "Kvant unumdorligi", "Mexanizm"],
      disadvantages: ["Qimmat uskuna", "Murakkab tahlil"],
      bestFor: "Umr o'lchash, kinetika",
      examples: "τ ≈ 50-200 ns (CH₂Cl₂ da)"
    },
    {
      name: "Ultrafast spektroskopiya (femtosekund)",
      description: "Femtosekund aniqlikda dinamikani o'rganish",
      advantages: ["ISC tezligi", "Vibronik dinamika", "Mexanizm"],
      disadvantages: ["Juda qimmat", "Murakkab"],
      bestFor: "Ultrafast dinamikani o'rganish",
      examples: "Vlček (2000) — ISC ~100 fs"
    },
    {
      name: "Elektrokimyo (CV)",
      description: "Redoks xususiyatlarni o'lchash",
      advantages: ["E°₁/₂", "Qaytarlik", "Mexanizm"],
      disadvantages: ["Elektrod kerak", "Erituvchi ta'siri"],
      bestFor: "Redoks potentsiallar",
      examples: "E°(Re²⁺/Re⁺) ≈ -1.3 V vs SCE"
    },
    {
      name: "IR spektroskopiya",
      description: "CO cho'zilish tebranishlarini o'lchash",
      advantages: ["Tez", "Oddiy", "Arzon"],
      disadvantages: ["Faqat tebranishlar"],
      bestFor: "CO ligandlarni aniqlash",
      examples: "ν(CO): 2020, 1900, 1880 cm⁻¹ (fac-izomer)"
    },
    {
      name: "Fotokatalitik test",
      description: "CO₂ qaytarish samaradorligini o'lchash",
      advantages: ["Amaliy natija", "TON, TOF"],
      disadvantages: ["Uzoq vaqt", "Murakkab"],
      bestFor: "Fotokatalitik faollikni o'lchash",
      examples: "TON ≈ 10-50 (CO₂ → CO)"
    }
  ]
}

export default function ReBpyCO3ClPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [wavelength, setWavelength] = useState(550)

  const emissionIntensity = useMemo(() => {
    // Gaussian emissiya profili
    const center = 550
    const sigma = 40
    const intensity = Math.exp(-Math.pow(wavelength - center, 2) / (2 * sigma * sigma))
    return intensity
  }, [wavelength])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-blue-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">💡</span> [Re(bpy)(CO)₃Cl] — MLCT FLUORESENSIYA!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">[Re(bpy)(CO)₃Cl]</strong> — Reniy(I) karbonil kompleksi, <strong className="text-yellow-400">MLCT emissiya</strong> (550 nm, yashil).
              <strong className="text-yellow-400"> CO₂ qaytarish fotokatalizatori</strong> — CO₂ ni CO ga aylantiradi.
            </p>
            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2">💡 Fluoressensiya:</div>
                  <div className="text-purple-200">
                    <strong>Yutilish:</strong> 370 nm (UV)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Emissiya:</strong> 550 nm (yashil)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Φ:</strong> 0.01-0.05
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>τ:</strong> 50-200 ns
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">⚗️ Fotokataliz:</div>
                  <div className="text-purple-200">
                    <strong>Reaksiya:</strong> CO₂ → CO
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>TON:</strong> 10-50
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Mexanizm:</strong> MLCT → Re²⁺
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Knowledge Base:</strong> Hawke (1974), Luong (1988), Vlček (2000), Kubiak (2012).
                MLCT emissiya, CO₂ qaytarish fotokatalizatori.
              </p>
            </div>
            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-green-200">
                <strong className="text-green-300">⚠️ XAVFSIZLIK:</strong> CO toksik gaz! Re birikmalari zaharli. Inert muhit (N₂, Ar) kerak.
              </p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <Link href="/ilmiy/tahlil/fluoressensiya" className="hover:text-purple-300">Fluoressensiya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-green-400 font-semibold">[Re(bpy)(CO)₃Cl]</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-yellow-600 px-2 py-1 rounded ml-2">💡 Fluoressensiya</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">MLCT Emissiya</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Fotokatalizator</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">CO₂ Qaytarish</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="text-xs bg-green-600/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Birikmalar katalogi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-green-600 hover:bg-green-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-green-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full text-xs font-semibold text-green-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              MLCT EMISSIYA • FOTOKATALIZATOR
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Reniy(I) Karbonil
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">CO₂ Qaytarish Fotokatalizatori</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-green-400">[Re(bpy)(CO)₃Cl]</strong> — Reniy(I) kompleksi, <strong className="text-yellow-400">MLCT emissiya</strong> (550 nm, yashil).
              <strong className="text-green-400"> CO₂ ni CO ga qaytaradi</strong> — fotokatalitik reaksiya.
              <strong className="text-green-400"> Φ ≈ 0.01-0.05</strong>, <strong className="text-green-400">τ ≈ 50-200 ns</strong>.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-xl font-bold text-green-400">Re⁺</div>
                <div className="text-xs text-purple-400 mt-1">d⁶, past spinli</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💡</div>
                <div className="text-xl font-bold text-green-400">550 nm</div>
                <div className="text-xs text-purple-400 mt-1">Yashil emissiya</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xl font-bold text-green-400">Φ ≈ 0.03</div>
                <div className="text-xs text-purple-400 mt-1">Kvant unumdorligi</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-xl font-bold text-green-400">~100 ns</div>
                <div className="text-xs text-purple-400 mt-1">Umr</div>
              </div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🔬</span>
            Kristall maydon nazariyasi
          </h2>

          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6">
            <h3 className="text-blue-400 font-bold mb-3">Re⁺ (d⁶) — past spinli</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-400">Metall ioni:</span>
                  <span className="text-blue-400">{COMPOUND.crystalField.metalIon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Elektron konfiguratsiya:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.electronConfig}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">d-elektronlar:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.dElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-blue-400">{COMPOUND.crystalField.spinState}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-400">Δo:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.crystalFieldSplitting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.cFSE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit momenti:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.magneticMoment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.unpairedElectrons}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-400">💡 Nima uchun past spinli?</strong> CO — eng kuchli maydon ligandi. Δo (28,000 cm⁻¹)  P (18,000 cm⁻¹) → past spinli, diamagnit.
            </p>
          </div>
        </div>

        {/* FLUORESENSIYA XUSUSIYATLARI */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">💡</span>
            Fluoressensiya xususiyatlari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Yutilish (Absorption)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">To'lqin uzunligi:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.absorption.wavelength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Energiya:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.absorption.energy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Molyar ekstinksiya:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.absorption.molarAbsorptivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">O'tish:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.fluorescence.absorption.transition}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Emissiya (Emission)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">To'lqin uzunligi:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.emission.wavelength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Energiya:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.emission.energy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Stokes shift:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.emission.stokesShift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kvant unumdorligi:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.emission.quantumYield}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Umr:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.fluorescence.emission.lifetime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
            <h3 className="text-purple-400 font-bold mb-3">Qo'zg'algan holat (Excited State)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-400">Turi:</span>
                  <span className="text-purple-300">{COMPOUND.fluorescence.excitedState.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="text-purple-300 font-mono">{COMPOUND.fluorescence.excitedState.configuration}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-400">Umr:</span>
                  <span className="text-purple-300 font-mono">{COMPOUND.fluorescence.excitedState.lifetime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Redoks potentsial:</span>
                  <span className="text-purple-300 font-mono">{COMPOUND.fluorescence.excitedState.redoxPotential}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV EMISSIYA SPEKTRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">📈</span>
            Interaktiv emissiya spektri
          </h2>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <label className="block text-yellow-400 text-sm font-bold mb-2">
              To'lqin uzunligi: {wavelength} nm
            </label>
            <input
              type="range"
              min="450"
              max="700"
              step="1"
              value={wavelength}
              onChange={(e) => setWavelength(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>450 nm (ko'k)</span>
              <span>550 nm (yashil, cho'qqi)</span>
              <span>700 nm (qizil)</span>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-6 border border-purple-700/30">
            <svg viewBox="0 0 600 300" className="w-full h-64">
              {/* Grid */}
              {[450, 500, 550, 600, 650, 700].map((wl, i) => {
                const x = 50 + (i / 5) * 500
                return (
                  <g key={i}>
                    <line x1={x} y1="250" x2={x} y2="260" stroke="#6b21a8" strokeWidth="1" />
                    <text x={x} y="275" textAnchor="middle" fontSize="10" fill="#a78bfa">{wl}</text>
                  </g>
                )
              })}
              <text x="300" y="295" textAnchor="middle" fontSize="12" fill="#a78bfa">To'lqin uzunligi (nm)</text>

              {/* Y o'qi */}
              <line x1="50" y1="250" x2="50" y2="20" stroke="#6b21a8" strokeWidth="1" />
              <text x="20" y="135" textAnchor="middle" fontSize="12" fill="#a78bfa" transform="rotate(-90, 20, 135)">Intensivlik</text>

              {/* Emissiya egri chizig'i (Gaussian) */}
              <path
                d={`M 50 250 Q 150 240, 200 200 Q 250 150, 300 80 Q 350 150, 400 200 Q 450 240, 550 250`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
              />

              {/* Slider pozitsiyasi */}
              {(() => {
                const x = 50 + ((wavelength - 450) / 250) * 500
                const intensity = Math.exp(-Math.pow(wavelength - 550, 2) / (2 * 40 * 40))
                const y = 250 - intensity * 170
                return (
                  <g>
                    <line x1={x} y1="250" x2={x} y2={y} stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
                    <circle cx={x} cy={y} r="6" fill="#fbbf24" />
                    <text x={x} y={y - 15} textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">
                      {intensity.toFixed(2)}
                    </text>
                  </g>
                )
              })()}

              {/* Cho'qqi belgisi */}
              <line x1="300" y1="80" x2="300" y2="250" stroke="#22c55e" strokeWidth="1" strokeDasharray="2,2" />
              <text x="300" y="70" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">
                550 nm (cho'qqi)
              </text>
            </svg>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-400">💡 Stokes shift:</strong> Yutilish 370 nm, emissiya 550 nm. Farq = 8,800 cm⁻¹ (1.09 eV).
              Bu energiya vibronik relaksatsiya va solvent reorganization ga sarflanadi.
            </p>
          </div>
        </div>

        {/* FOTOKATALIZ */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">⚗️</span>
            CO₂ qaytarish fotokatalizi
          </h2>

          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-6">
            <h3 className="text-yellow-400 font-bold mb-3">Reaksiya</h3>
            <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center text-lg">
              CO₂ + 2H⁺ + 2e⁻ → CO + H₂O
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Mexanizm (6 bosqich)</h3>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-yellow-400 font-bold">1.</span>
                  <span className="text-purple-200">{COMPOUND.photocatalysis.mechanism.step1}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400 font-bold">2.</span>
                  <span className="text-purple-200">{COMPOUND.photocatalysis.mechanism.step2}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400 font-bold">3.</span>
                  <span className="text-purple-200">{COMPOUND.photocatalysis.mechanism.step3}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400 font-bold">4.</span>
                  <span className="text-purple-200">{COMPOUND.photocatalysis.mechanism.step4}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400 font-bold">5.</span>
                  <span className="text-purple-200">{COMPOUND.photocatalysis.mechanism.step5}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400 font-bold">6.</span>
                  <span className="text-purple-200">{COMPOUND.photocatalysis.mechanism.step6}</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Afzalliklar va cheklovlar</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-green-400 font-bold mb-2 text-sm">✓ Afzalliklar:</h4>
                  <ul className="space-y-1 text-xs text-purple-200">
                    {COMPOUND.photocatalysis.advantages.map((adv, i) => (
                      <li key={i}>• {adv}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-bold mb-2 text-sm">✗ Cheklovlar:</h4>
                  <ul className="space-y-1 text-xs text-purple-200">
                    {COMPOUND.photocatalysis.limitations.map((lim, i) => (
                      <li key={i}>• {lim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TARIX */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">📜</span>
            Tarix
          </h2>

          <div className="space-y-4">
            {COMPOUND.history.map((item, i) => (
              <div key={i} className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    {item.year % 100}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-amber-400 font-bold">{item.year}</span>
                      <span className="text-purple-300">{item.scientist}</span>
                    </div>
                    <p className="text-purple-200 text-sm">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🔄</span>
            Boshqa MLCT emitterlar bilan taqqoslash
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Yutilish</th>
                  <th className="py-3 px-3 text-teal-400">Emissiya</th>
                  <th className="py-3 px-3 text-teal-400">Φ</th>
                  <th className="py-3 px-3 text-teal-400">τ</th>
                  <th className="py-3 px-3 text-teal-400">Qo'llanilish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.absorption}</td>
                    <td className="py-3 px-3 text-xs">{comp.emission}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.phi}</td>
                    <td className="py-3 px-3 text-xs">{comp.tau}</td>
                    <td className="py-3 px-3 text-xs">{comp.application}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LABORATORIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🧪</span>
            Laboratoriya tartibi
          </h2>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveLabStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeLabStep === i
                    ? "bg-green-900/40 border-2 border-green-400"
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-green-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-green-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-2">
                      <div className="text-green-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-green-400 mt-2">Vaqt: {step.time}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">⚠️</span>
            Halaqit beruvchi omillar
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-400">Manba</th>
                  <th className="py-3 px-3 text-yellow-400">Ta'sir</th>
                  <th className="py-3 px-3 text-yellow-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-yellow-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((int, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${
                      activeInterference === i ? "bg-yellow-900/20" : ""
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

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning nazariy izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].theoryNote}
            </p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🔬</span>
            Kengaytiruvchi metodlar
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.advancedTechniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
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
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-3">
              <div className="text-green-400 font-bold text-xs mb-1">Misol:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-green-400">[Re(bpy)(CO)₃Cl]</strong> — Re⁺ (d⁶), past spinli, diamagnit</li>
            <li><strong className="text-green-400">MLCT emissiya:</strong> 550 nm (yashil), Φ ≈ 0.01-0.05, τ ≈ 50-200 ns</li>
            <li><strong className="text-green-400">Stokes shift:</strong> 8,800 cm⁻¹ (1.09 eV) — vibronik relaksatsiya</li>
            <li><strong className="text-green-400">Fotokataliz:</strong> CO₂ → CO, TON ≈ 10-50</li>
            <li><strong className="text-green-400">Mexanizm:</strong> MLCT → Re²⁺(bpy⁻) → CO₂ qaytarish</li>
            <li><strong className="text-green-400">Geometriya:</strong> Oktaedr, fac-C₃ᵥ simmetriya</li>
            <li><strong className="text-green-400">IR:</strong> ν(CO) = 2020, 1900, 1880 cm⁻¹ (fac-izomer)</li>
            <li><strong className="text-green-400">Tarix:</strong> Hawke (1974), Luong (1988), Vlček (2000)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Birikmalar katalogi
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">
            Fluoressensiya asosiy sahifa →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — [Re(bpy)(CO)₃Cl] (Reniy(I) karbonil) • MLCT Fluoressensiya</p>
          <p className="mt-1">Manbalar: Hawke (1974), Luong (1988), Vlček (2000), Kubiak (2012)</p>
        </div>
      </footer>
    </main>
  )
}