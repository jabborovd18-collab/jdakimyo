"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// PRUSSIYA KOKI (BERLIN KOKI) — IVCT FENOMENI
// Manbalar: Diesbach (1704), Keggin (1936), Buser (1977), Robin-Day (1968),
//           Creutz-Taube (1969), Miessler-Tarr, Cotton-Wilkinson
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "Fe<sub>4</sub>[Fe(CN)<sub>6</sub>]<sub>3</sub> · nH<sub>2</sub>O",
  formulaPlain: "Fe4[Fe(CN)6]3",
  iupac: "Temir(III) geksatsianoferrat(II)",
  commonName: "Prussiya ko'ki (Berlin ko'ki)",
  molarMass: 859.25,
  casNumber: "14038-43-8",
  color: "to'q ko'k (deep blue)",
  structure: "Kubik (Fm3m, face-centered cubic)",
  metalLigand: "Fe²⁺-C (CN⁻ orqali), Fe³⁺-N (CN⁻ orqali)",
  pointGroup: "Oₕ (kristall)",
  type: "Aralash valentli kompleks (mixed-valence)",
  valence: "Fe²⁺ (4 ta) va Fe³⁺ (3 ta)",

  //  ═══════════════════════════════════════════════════════════════
  // IVCT (INTERVALENCE CHARGE TRANSFER)
  //  ═══════════════════════════════════════════════════════════════
  ivct: {
    definition: "Ikki xil oksidlanish darajasidagi metall ionlari o'rtasida elektron ko'chishi",
    mechanism: "Fe²⁺ → Fe³⁺ (CN⁻ ko'prik orqali)",
    energy: "~14,000-15,000 cm⁻¹ (700-715 nm)",
    color: "To'q ko'k (qizil-to'q sariq yutilish natijasi)",
    robin_day: "Robin-Day Class II (lokalizatsiyalangan, lekin kuchli bog'lanish)",
    hoppingRate: "~10¹² s⁻¹ (juda tez, ammo lokalizatsiyalangan)",
    couplingMatrix: "Hab ≈ 1500-2000 cm⁻¹ (kuchli elektron bog'lanish)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    fe2: {
      ion: "Fe²⁺",
      electronConfig: "[Ar] 3d⁶",
      dElectrons: 6,
      spinState: "Past spinli (low-spin)",
      orbitalOccupancy: "t₂g⁶ eg⁰",
      unpairedElectrons: 0,
      magneticMoment: "0 BM (diamagnit)",
      coordination: "Oktaedr (C orqali 6 ta CN⁻)",
      bondLength: "Fe²⁺-C: 1.92 Å"
    },
    fe3: {
      ion: "Fe³⁺",
      electronConfig: "[Ar] 3d⁵",
      dElectrons: 5,
      spinState: "Yuqori spinli (high-spin)",
      orbitalOccupancy: "t₂g³ eg²",
      unpairedElectrons: 5,
      magneticMoment: "5.9 BM (paramagnit)",
      coordination: "Oktaedr (N orqali 6 ta CN⁻)",
      bondLength: "Fe³⁺-N: 2.03 Å"
    },
    overall: {
      totalMagneticMoment: "~4.9 BM (paramagnit, Fe³⁺ hisobiga)",
      crystalFieldSplitting: "Δo(Fe²⁺) ≈ 33,000 cm⁻¹ (CN⁻ kuchli maydon)",
      crystalFieldSplitting2: "Δo(Fe³⁺) ≈ 14,000 cm⁻¹ (N orqali, kuchsizroq)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    crystalSystem: "Kubik (cubic)",
    spaceGroup: "Fm3m (#225)",
    latticeParameter: "a = 10.17 Å",
    bondLengths: {
      fe2_c: "1.92 Å (Fe²⁺-C)",
      fe3_n: "2.03 Å (Fe³⁺-N)",
      cn_bond: "1.15 Å (C≡N, uch bog')",
      fe2_fe3: "5.09 Å (Fe²⁺-Fe³⁺ masofa, CN⁻ ko'prik orqali)"
    },
    coordination: {
      fe2: "Oktaedr, C orqali (6 ta CN⁻)",
      fe3: "Oktaedr, N orqali (6 ta CN⁻, lekin ba'zi joylar bo'sh — defektli struktura)",
      vacancies: "25% Fe³⁺ joylari bo'sh (suvi bilan to'ldirilgan)"
    },
    waterContent: "n = 14-16 H₂O (zeolit-simon, bo'sh joylarda)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // ELEKTRON SPEKTR
  //  ═══════════════════════════════════════════════════════════════
  electronicSpectrum: {
    ivct_band: {
      wavelength: "700-715 nm",
      wavenumber: "14,000-14,300 cm⁻¹",
      energy: "1.74 eV",
      molarAbsorptivity: "ε ≈ 1000-2000 L/(mol·cm)",
      assignment: "IVCT: Fe²⁺(t₂g) → Fe³⁺(t₂g)",
      bandwidth: "Keng (~3000-4000 cm⁻¹, Frank-Condon prinsip)"
    },
    dd_transitions: {
      fe2: "Laporte ta'qiqlangan, kuchsiz (ε < 10)",
      fe3: "Spin-ta'qiqlangan, juda kuchsiz (ε < 1)"
    },
    chargeTransfer: {
      lmct: "CN⁻ → Fe³⁺ (~30,000 cm⁻¹, UV)",
      mlct: "Fe²⁺ → CN⁻ (~35,000 cm⁻¹, UV)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    diesbach: {
      year: 1704,
      scientist: "Johann Jacob Diesbach (Germaniya)",
      achievement: "Tasodifan kashf qildi",
      story: "Qon va temir sulfatni aralashtirib, keyin kaliy karbonat qo'shdi — ko'k cho'kma hosil bo'ldi",
      significance: "Birinchi sintetik pigment"
    },
    keggin: {
      year: 1936,
      scientist: "J.F. Keggin",
      achievement: "Rentgen difraksiya orqali strukturani aniqladi",
      contribution: "Kubik struktura, Fe-C-N-Fe ko'prik"
    },
    robin_day: {
      year: 1968,
      scientist: "M.B. Robin va P. Day",
      achievement: "Aralash valentli komplekslar tasnifi (Robin-Day klassifikatsiyasi)",
      classes: "Class I (lokalizatsiyalangan), Class II (qisman delokalizatsiyalangan), Class III (to'liq delokalizatsiyalangan)",
      prussianBlue: "Class II (lokalizatsiyalangan, lekin kuchli bog'lanish)"
    },
    creutz_taube: {
      year: 1969,
      scientist: "C. Creutz va H. Taube",
      achievement: "[(NH₃)₅Ru-pyz-Ru(NH₃)₅]⁵⁺ — klassik IVCT namunasi",
      significance: "IVCT mexanizmini tushunish uchun model sistema"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // ROBIN-DAY KLASIFIKATSIYASI
  //  ═══════════════════════════════════════════════════════════════
  robinDayClasses: [
    {
      class: "Class I",
      description: "Lokalizatsiyalangan — elektronlar bir joyda qoladi",
      characteristics: ["IVCT band yo'q", "Farqli xususiyatlar", "Sekin almashinish"],
      examples: ["Ba'zi Fe²⁺/Fe³⁺ aralashmalari"],
      prussianBlue: false
    },
    {
      class: "Class II",
      description: "Qisman delokalizatsiyalangan — IVCT band mavjud",
      characteristics: ["IVCT band ko'rinadi", "O'rta bog'lanish", "Tez hopping"],
      examples: ["Prussian Blue", "Creutz-Taube ion"],
      prussianBlue: true
    },
    {
      class: "Class III",
      description: "To'liq delokalizatsiyalangan — barcha metallar bir xil",
      characteristics: ["IVCT band yo'q (chunki barcha ekvivalent)", "Kuchli bog'lanish", "Metallik xususiyatlar"],
      examples: ["Ba'zi organik radikallar"],
      prussianBlue: false
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // QO'LLANILISHI
  //  ═══════════════════════════════════════════════════════════════
  applications: [
    {
      field: "San'at va bo'yoqlar",
      use: "Pigment (ko'k rang)",
      significance: "Eng qadimgi sintetik pigment (1704)",
      examples: ["Rasm bo'yoqlari", "Matolar", "Siyoh"]
    },
    {
      field: "Tibbiyot",
      use: "Antidot (seziy va talliy zaharlanishi)",
      significance: "Ion almashinish orqali toksik metallarni bog'laydi",
      examples: ["Radiocesium decorporation"]
    },
    {
      field: "Elektrokimyo",
      use: "Elektrokromik materiallar",
      significance: "Elektrod potensiali o'zgarishi bilan rang o'zgaradi",
      examples: ["Smart windows", "Displey texnologiyalari"]
    },
    {
      field: "Energiya saqlash",
      use: "Batareya elektrodlari",
      significance: "Yuqori sig'im, tezkor zaryadlash",
      examples: ["Na-ion batareyalar", "Li-ion batareyalar"]
    },
    {
      field: "Kataliz",
      use: "Fotokataliz, elektrokataliz",
      significance: "Katta sirt yuzasi, aktiv joylar",
      examples: ["Suv parchalash", "CO₂ qaytarish"]
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA IVCT KOMPLEKSLAR
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "Prussian Blue",
      formula: "Fe₄[Fe(CN)₆]₃",
      metals: "Fe²⁺/Fe³⁺",
      robinDay: "Class II",
      ivctEnergy: "14,000 cm⁻¹",
      color: "Ko'k"
    },
    {
      compound: "Creutz-Taube ion",
      formula: "[(NH₃)₅Ru-pyz-Ru(NH₃)₅]⁵⁺",
      metals: "Ru²⁺/Ru³⁺",
      robinDay: "Class II-III",
      ivctEnergy: "6000-8000 cm⁻¹",
      color: "Pushti-ko'k"
    },
    {
      compound: "Magnetit",
      formula: "Fe₃O₄",
      metals: "Fe²⁺/Fe³⁺",
      robinDay: "Class III",
      ivctEnergy: "—",
      color: "Qora"
    },
    {
      compound: "Turnbull's Blue",
      formula: "Fe₃[Fe(CN)₆]₂",
      metals: "Fe²⁺/Fe³⁺",
      robinDay: "Class II",
      ivctEnergy: "~14,000 cm⁻¹",
      color: "Ko'k (Prussian Blue bilan bir xil)"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "UV-Vis-NIR spektroskopiya",
      application: "IVCT band o'lchash (700 nm)",
      advantage: "Tez, oddiy, arzon",
      limitation: "Faqat optik xususiyatlar"
    },
    {
      method: "Mössbauer spektroskopiya",
      application: "Fe²⁺ va Fe³⁺ farqlash",
      advantage: "Oksidlanish darajasi, spin holati",
      limitation: "Faqat Fe uchun, maxsus uskuna"
    },
    {
      method: "EPR spektroskopiya",
      application: "Fe³⁺ (d⁵, yuqori spinli) aniqlash",
      advantage: "Paramagnit turlar, g-faktor",
      limitation: "Faqat paramagnit"
    },
    {
      method: "Rentgen difraksiya (XRD)",
      application: "Kristall struktura (Fm3m)",
      advantage: "Aniq atom pozitsiyalari",
      limitation: "Kristall kerak"
    },
    {
      method: "SQUID magnitometriya",
      application: "Magnit xususiyatlar",
      advantage: "μ_eff, Curie-Weiss",
      limitation: "Maxsus uskuna"
    },
    {
      method: "Elektrokimyo (CV)",
      application: "Redoks xususiyatlar",
      advantage: "E°₁/₂, qaytarlik",
      limitation: "Elektrod kerak"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // YaMR MA'LUMOTLARI
  //  ═══════════════════════════════════════════════════════════════
  nmrData: {
    nucleus: "⁵⁷Fe (I = 1/2, 2.1% tabiiy)",
    chemicalShift: "Keng diapazon (paramagnit ta'sir)",
    challenge: "Paramagnit Fe³⁺ tufayli signallar juda keng",
    alternative: "¹³C YaMR (CN⁻, ~177 ppm, keng)",
    solidState: "CP/MAS qattiq holat YaMR"
  }
}

export default function PrussiyaKokiPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeRobinDay, setActiveRobinDay] = useState(1)
  const [activeApplication, setActiveApplication] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-slate-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-blue-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔵</span> Prussiya ko'ki — IVCT FENOMENI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-blue-300">Fe₄[Fe(CN)₆]₃</strong> — klassik <strong className="text-yellow-400">IVCT (Intervalence Charge Transfer)</strong> namunasi.
              Fe²⁺ va Fe³⁺ aralash valentli, Robin-Day Class II, to'q ko'k rang (700 nm IVCT band).
            </p>
            <div className="bg-blue-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-blue-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>IVCT:</strong> Fe²⁺ → Fe³⁺ (700 nm)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Robin-Day:</strong> Class II
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Struktura:</strong> Kubik (Fm3m)
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold mb-2">⚛️ Elektron xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Fe²⁺:</strong> Past spinli (t₂g⁶)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Fe³⁺:</strong> Yuqori spinli (t₂g³eg²)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Magnit:</strong> ~4.9 BM (paramagnit)
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-blue-300">Tarix:</strong> Diesbach (1704, tasodifiy kashfiyot), Keggin (1936, struktura),
                Robin-Day (1968, klassifikatsiya), Creutz-Taube (1969, model sistema).
              </p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" className="hover:text-purple-300">IVCT</Link>
              <span className="text-purple-600">›</span>
              <span className="text-blue-400 font-semibold">Prussiya ko'ki</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                  <span className="text-3xl">🔵</span>
                  Prussiya ko'ki (Berlin ko'ki)
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  IVCT fenomeni — aralash valentli komplekslar
                </p>
              </div>
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← IVCT bo'limi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-blue-600 hover:bg-blue-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-600/30 rounded-full text-xs font-semibold text-blue-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              IVCT FENOMENI — ROBIN-DAY CLASS II
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Prussiya ko'ki
              </span>
              <br />
              <span className="text-white text-3xl md:text-4xl">(Berlin ko'ki)</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-blue-400">Fe₄[Fe(CN)₆]₃</strong> — eng qadimgi sintetik pigment (1704) va
              klassik <strong className="text-yellow-400">IVCT (Intervalence Charge Transfer)</strong> namunasi.
              Fe²⁺ va Fe³⁺ aralash valentli kompleks, CN⁻ ko'prik orqali elektron hopping.
              To'q ko'k rang — <strong className="text-blue-400">700 nm da IVCT band</strong> natijasi.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-xl font-bold text-blue-400">Fe²⁺/Fe³⁺</div>
                <div className="text-xs text-purple-400 mt-1">Aralash valent</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔵</div>
                <div className="text-xl font-bold text-blue-400">700 nm</div>
                <div className="text-xs text-purple-400 mt-1">IVCT band</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xl font-bold text-blue-400">Class II</div>
                <div className="text-xs text-purple-400 mt-1">Robin-Day</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧲</div>
                <div className="text-xl font-bold text-blue-400">~4.9 BM</div>
                <div className="text-xs text-purple-400 mt-1">Paramagnit</div>
              </div>
            </div>
          </div>
        </div>

        {/* IVCT NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            IVCT (Intervalence Charge Transfer)
          </h2>
          <div className="space-y-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">IVCT nima?</h3>
              <p className="text-purple-200 leading-relaxed mb-4">
                <strong className="text-yellow-400">Intervalence Charge Transfer (IVCT)</strong> — ikki xil oksidlanish darajasidagi
                metall ionlari o'rtasida elektron ko'chishi. Prussiya ko'kida:
                <strong className="text-blue-400"> Fe²⁺ → Fe³⁺</strong> (CN⁻ ko'prik orqali).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2">Mexanizm:</div>
                  <p className="text-purple-200 text-sm">{COMPOUND.ivct.mechanism}</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2">Energiya:</div>
                  <p className="text-purple-200 text-sm">{COMPOUND.ivct.energy}</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2">Rang:</div>
                  <p className="text-purple-200 text-sm">{COMPOUND.ivct.color}</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2">Hopping tezligi:</div>
                  <p className="text-purple-200 text-sm">{COMPOUND.ivct.hoppingRate}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">💡 Nima uchun ko'k rang?</h3>
              <p className="text-purple-200 leading-relaxed">
                IVCT band <strong className="text-yellow-400">700 nm</strong> da (qizil-to'q sariq yutilish).
                Qolgan ko'k-yashil yorug'lik qaytariladi → <strong className="text-blue-400">to'q ko'k rang</strong>.
                Bu d-d o'tishlar emas (ular juda kuchsiz), balki <strong>IVCT</strong> natijasi.
              </p>
            </div>
          </div>
        </div>

        {/* ROBIN-DAY KLASIFIKATSIYASI */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Robin-Day klassifikatsiyasi
          </h2>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Robin-Day (1968)</strong> aralash valentli komplekslarni 3 ta classga bo'ldi:
              elektron delokalizatsiya darajasiga qarab.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.robinDayClasses.map((cls, i) => (
              <button
                key={i}
                onClick={() => setActiveRobinDay(i)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeRobinDay === i
                    ? "bg-blue-600/60 text-white border border-blue-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {cls.class}
              </button>
            ))}
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">
              {COMPOUND.robinDayClasses[activeRobinDay].class}
            </h3>
            <p className="text-purple-200 mb-4">{COMPOUND.robinDayClasses[activeRobinDay].description}</p>
            <div className="space-y-3">
              <div>
                <div className="text-purple-400 font-semibold mb-2">Xususiyatlar:</div>
                <ul className="space-y-1 text-sm text-purple-200">
                  {COMPOUND.robinDayClasses[activeRobinDay].characteristics.map((char, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-2">Misollar:</div>
                <ul className="space-y-1 text-sm text-purple-200">
                  {COMPOUND.robinDayClasses[activeRobinDay].examples.map((ex, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {COMPOUND.robinDayClasses[activeRobinDay].prussianBlue && (
                <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-3 mt-4">
                  <p className="text-blue-200 text-sm">
                    <strong className="text-blue-400">✓ Prussiya ko'ki</strong> — Class II ga kiradi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Kristall maydon nazariyasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Fe²⁺ (past spinli)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Elektron konfiguratsiya:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe2.electronConfig}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">d-elektronlar:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe2.dElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-white">{COMPOUND.crystalField.fe2.spinState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Orbital to'ldirilishi:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe2.orbitalOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe2.unpairedElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit momenti:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe2.magneticMoment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Koordinatsiya:</span>
                  <span className="text-white text-xs">{COMPOUND.crystalField.fe2.coordination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog' uzunligi:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe2.bondLength}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Fe³⁺ (yuqori spinli)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Elektron konfiguratsiya:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe3.electronConfig}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">d-elektronlar:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe3.dElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-white">{COMPOUND.crystalField.fe3.spinState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Orbital to'ldirilishi:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe3.orbitalOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe3.unpairedElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit momenti:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe3.magneticMoment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Koordinatsiya:</span>
                  <span className="text-white text-xs">{COMPOUND.crystalField.fe3.coordination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog' uzunligi:</span>
                  <span className="text-white font-mono">{COMPOUND.crystalField.fe3.bondLength}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Umumiy xususiyatlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-purple-400 font-semibold mb-2">Umumiy magnit momenti:</div>
                <p className="text-purple-200">{COMPOUND.crystalField.overall.totalMagneticMoment}</p>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-2">Kristall maydon bo'linishi:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.crystalField.overall.crystalFieldSplitting}</p>
                <p className="text-purple-200 text-xs mt-1">{COMPOUND.crystalField.overall.crystalFieldSplitting2}</p>
              </div>
            </div>
          </div>
        </div>

        {/* STRUKTURAVIY PARAMETRLAR */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">📏</span>
            Strukturaviy parametrlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">Kristall struktura</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Kristall sistema:</span>
                  <span className="text-white">{COMPOUND.structuralData.crystalSystem}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Space group:</span>
                  <span className="text-white font-mono">{COMPOUND.structuralData.spaceGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Panjar parametri:</span>
                  <span className="text-white font-mono">{COMPOUND.structuralData.latticeParameter}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">Bog' uzunliklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe²⁺-C:</span>
                  <span className="text-white font-mono">{COMPOUND.structuralData.bondLengths.fe2_c}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe³⁺-N:</span>
                  <span className="text-white font-mono">{COMPOUND.structuralData.bondLengths.fe3_n}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">C≡N:</span>
                  <span className="text-white font-mono">{COMPOUND.structuralData.bondLengths.cn_bond}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe²⁺-Fe³⁺:</span>
                  <span className="text-white font-mono">{COMPOUND.structuralData.bondLengths.fe2_fe3}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-green-400 mb-3">Koordinatsiya va defektlar</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-purple-400 font-semibold mb-1">Fe²⁺:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.structuralData.coordination.fe2}</p>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-1">Fe³⁺:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.structuralData.coordination.fe3}</p>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-1">Vakansiyalar:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.structuralData.coordination.vacancies}</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mt-3">
                <p className="text-yellow-200 text-xs">
                  <strong className="text-yellow-400">Suv miqdori:</strong> {COMPOUND.structuralData.waterContent}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ELEKTRON SPEKTR */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🌈</span>
            Elektron spektr
          </h2>
          <div className="space-y-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-orange-400 mb-3">IVCT band</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-400">To'lqin uzunligi:</span>
                    <span className="text-white font-mono">{COMPOUND.electronicSpectrum.ivct_band.wavelength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">To'lqin soni:</span>
                    <span className="text-white font-mono">{COMPOUND.electronicSpectrum.ivct_band.wavenumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Energiya:</span>
                    <span className="text-white font-mono">{COMPOUND.electronicSpectrum.ivct_band.energy}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Molyar ekstinksiya:</span>
                    <span className="text-white font-mono text-xs">{COMPOUND.electronicSpectrum.ivct_band.molarAbsorptivity}</span>
                  </div>
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Assignment:</span>
                    <span className="text-white text-xs mt-1">{COMPOUND.electronicSpectrum.ivct_band.assignment}</span>
                  </div>
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Band kengligi:</span>
                    <span className="text-white text-xs mt-1">{COMPOUND.electronicSpectrum.ivct_band.bandwidth}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-400 mb-3">d-d o'tishlar</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-purple-400 font-semibold mb-1">Fe²⁺:</div>
                    <p className="text-purple-200 text-xs">{COMPOUND.electronicSpectrum.dd_transitions.fe2}</p>
                  </div>
                  <div>
                    <div className="text-purple-400 font-semibold mb-1">Fe³⁺:</div>
                    <p className="text-purple-200 text-xs">{COMPOUND.electronicSpectrum.dd_transitions.fe3}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-400 mb-3">Charge transfer</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-purple-400 font-semibold mb-1">LMCT:</div>
                    <p className="text-purple-200 text-xs">{COMPOUND.electronicSpectrum.chargeTransfer.lmct}</p>
                  </div>
                  <div>
                    <div className="text-purple-400 font-semibold mb-1">MLCT:</div>
                    <p className="text-purple-200 text-xs">{COMPOUND.electronicSpectrum.chargeTransfer.mlct}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TARIX */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Diesbach (1704)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.diesbach.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.diesbach.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hikoya:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.diesbach.story}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ahamiyat:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.diesbach.significance}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Keggin (1936)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.keggin.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.keggin.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.keggin.contribution}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Robin-Day (1968)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olimlar:</span>
                  <span className="text-amber-400">{COMPOUND.history.robin_day.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.robin_day.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Klasslar:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.robin_day.classes}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Prussiya ko'ki:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.robin_day.prussianBlue}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Creutz-Taube (1969)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olimlar:</span>
                  <span className="text-amber-400">{COMPOUND.history.creutz_taube.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.creutz_taube.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ahamiyat:</span>
                  <span className="text-purple-200 text-xs">{COMPOUND.history.creutz_taube.significance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QO'LLANILISHI */}
        <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Qo'llanilishi
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.applications.map((app, i) => (
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
              {COMPOUND.applications[activeApplication].field}
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-purple-400 font-semibold mb-1">Qo'llanish:</div>
                <p className="text-purple-200">{COMPOUND.applications[activeApplication].use}</p>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-1">Ahamiyat:</div>
                <p className="text-purple-200">{COMPOUND.applications[activeApplication].significance}</p>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-2">Misollar:</div>
                <ul className="space-y-1 text-purple-200">
                  {COMPOUND.applications[activeApplication].examples.map((ex, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-pink-400">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔄</span>
            Boshqa IVCT komplekslar bilan <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Formula</th>
                  <th className="py-3 px-3 text-teal-400">Metallar</th>
                  <th className="py-3 px-3 text-teal-400">Robin-Day</th>
                  <th className="py-3 px-3 text-teal-400">IVCT energiya</th>
                  <th className="py-3 px-3 text-teal-400">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.formula}</td>
                    <td className="py-3 px-3 text-xs">{comp.metals}</td>
                    <td className="py-3 px-3 text-xs">{comp.robinDay}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.ivctEnergy}</td>
                    <td className="py-3 px-3 text-xs">{comp.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TADQIQOT USULLARI */}
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Tadqiqot usullari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.researchMethods.map((method, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-indigo-400 mb-3">{method.method}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-purple-400 text-xs mb-1">Qo'llanilishi:</div>
                    <p className="text-purple-200">{method.application}</p>
                  </div>
                  <div>
                    <div className="text-purple-400 text-xs mb-1">Afzallik:</div>
                    <p className="text-green-400 text-xs">{method.advantage}</p>
                  </div>
                  <div>
                    <div className="text-purple-400 text-xs mb-1">Cheklov:</div>
                    <p className="text-red-400 text-xs">{method.limitation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YaMR MA'LUMOTLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🧲</span>
            YaMR ma'lumotlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Yadro:</span>
                  <span className="text-white font-mono">{COMPOUND.nmrData.nucleus}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Kimyoviy siljish:</span>
                  <span className="text-white text-xs mt-1">{COMPOUND.nmrData.chemicalShift}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Qiyinchilik:</span>
                  <span className="text-white text-xs mt-1">{COMPOUND.nmrData.challenge}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Alternativa:</span>
                  <span className="text-white text-xs mt-1">{COMPOUND.nmrData.alternative}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Qattiq holat:</span>
                  <span className="text-white text-xs mt-1">{COMPOUND.nmrData.solidState}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">💡 Eslatma</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Prussiya ko'ki <strong className="text-yellow-400">paramagnit</strong> (Fe³⁺ hisobiga).
                YaMR signallar juda keng (paramagnit ta'sir). Shuning uchun asosan
                <strong className="text-blue-400"> UV-Vis</strong>, <strong className="text-blue-400">Mössbauer</strong>,
                <strong className="text-blue-400"> EPR</strong> va <strong className="text-blue-400">XRD</strong> ishlatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← IVCT bo'limi
          </Link>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/lmct" className="px-6 py-3 bg-orange-600/60 hover:bg-orange-500/80 border border-orange-500/50 rounded-xl text-white font-semibold">
              LMCT
            </Link>
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="px-6 py-3 bg-pink-600/60 hover:bg-pink-500/80 border border-pink-500/50 rounded-xl text-white font-semibold">
              MLCT →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Chuqurlashgan mavzular</p>
          <p className="mt-1">Prussiya ko'ki (Berlin ko'ki) • IVCT fenomeni • Robin-Day Class II</p>
        </div>
      </footer>
    </main>
  )
}