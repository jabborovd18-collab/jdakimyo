"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// YaMR SPEKTROSKOPIYA — ASOSIY SAHIFA (PREMIUM)
// Manbalar: Pople (Nobel 1998), Ernst (Nobel 1991), Wüthrich (Nobel 2002)
// Xususiyat: Kimyoviy siljish, spin-spin bog'lanish, dinamik jarayonlar
// O'ziga xoslik: ¹H, ¹³C, ³¹P, ¹⁹⁵Pt, ⁵⁹Co, ¹⁹F, ¹⁵N yadrolari
// ═══════════════════════════════════════════════════════════════════════════════

// Yadro ma'lumotlari
const NUCLEI_DATA = [
  {
    symbol: "¹H",
    name: "Proton",
    spin: "1/2",
    gamma: 267.522,
    frequency: 400.13,
    abundance: 99.98,
    sensitivity: 1.0,
    range: "0-12 ppm",
    reference: "TMS (0 ppm)",
    typicalShifts: "Kompleks ligandlari: 0-10 ppm",
    description: "Eng sezgir va eng ko'p ishlatiladigan yadro. Barcha organik ligandlar uchun."
  },
  {
    symbol: "¹³C",
    name: "Uglerod-13",
    spin: "1/2",
    gamma: 67.283,
    frequency: 100.62,
    abundance: 1.11,
    sensitivity: 0.0159,
    range: "0-220 ppm",
    reference: "TMS (0 ppm)",
    typicalShifts: "Alifatik: 0-50 ppm, aromatik: 100-150 ppm",
    description: "Organik ligandlar tuzilishi uchun. Tabiiy tarqalishi past (1.11%)."
  },
  {
    symbol: "³¹P",
    name: "Fosfor-31",
    spin: "1/2",
    gamma: 108.291,
    frequency: 161.98,
    abundance: 100,
    sensitivity: 0.0663,
    range: "-250 dan +250 ppm",
    reference: "85% H₃PO₄ (0 ppm)",
    typicalShifts: "Fosfin ligandlari: -50 dan +50 ppm",
    description: "Fosfin ligandlari (PPh₃, dppe) uchun. 100% tabiiy tarqalish."
  },
  {
    symbol: "¹⁹F",
    name: "Ftor-19",
    spin: "1/2",
    gamma: 251.662,
    frequency: 376.50,
    abundance: 100,
    sensitivity: 0.830,
    range: "-300 dan +50 ppm",
    reference: "CFCl₃ (0 ppm)",
    typicalShifts: "CF₃ guruhlari: -70 dan -80 ppm",
    description: "Ftorli ligandlar uchun. Yuqori sezgirlik (¹H ga yaqin)."
  },
  {
    symbol: "¹⁹⁵Pt",
    name: "Platina-195",
    spin: "1/2",
    gamma: 57.681,
    frequency: 86.03,
    abundance: 33.8,
    sensitivity: 0.00336,
    range: "-8000 dan +2000 ppm",
    reference: "Na₂PtCl₆ (0 ppm)",
    typicalShifts: "Pt(II): -1500 dan -3000 ppm, Pt(IV): -5000 dan -7000 ppm",
    description: "Platina komplekslari uchun. Keng diapazon, sis-trans farqlash."
  },
  {
    symbol: "⁵⁹Co",
    name: "Kobalt-59",
    spin: "7/2",
    gamma: 63.299,
    frequency: 94.85,
    abundance: 100,
    sensitivity: 0.00125,
    range: "-2000 dan +14000 ppm",
    reference: "K₃[Co(CN)₆] (0 ppm)",
    typicalShifts: "Co(III) oktaedrik: 8000-12000 ppm, Co(II): -1000 dan +2000 ppm",
    description: "Kobalt komplekslari uchun. Keng diapazon, paramagnit effektlar."
  },
  {
    symbol: "¹⁵N",
    name: "Azot-15",
    spin: "1/2",
    gamma: -27.116,
    frequency: 40.55,
    abundance: 0.37,
    sensitivity: 0.00101,
    range: "-200 dan +900 ppm",
    reference: "NH₃ (suyuq) (0 ppm)",
    typicalShifts: "NH₃ ligandlari: 0-100 ppm, NO₂⁻: 500-700 ppm",
    description: "Azotli ligandlar uchun. Past sezgirlik, ¹⁵N boyitilgan namunalar kerak."
  },
  {
    symbol: "¹⁰³Rh",
    name: "Rodiy-103",
    spin: "1/2",
    gamma: 8.468,
    frequency: 12.76,
    abundance: 100,
    sensitivity: 0.0000311,
    range: "-2000 dan +12000 ppm",
    reference: "Rh(acac)₃ (0 ppm)",
    typicalShifts: "Rh(I): 300-800 ppm, Rh(III): 6000-9000 ppm",
    description: "Rodiy komplekslari uchun. Juda past sezgirlik."
  },
]

// Kimyoviy siljishlar jadvali (kengaytirilgan)
const CHEMICAL_SHIFTS = [
  // ¹H NMR
  { complex: "[Co(NH₃)₆]³⁺", nucleus: "¹H", ligand: "NH₃", shift: 3.5, multiplicity: "singlet", J: "—", notes: "Diamagnit, oktaedrik, barcha NH₃ ekvivalent" },
  { complex: "cis-[PtCl₂(NH₃)₂]", nucleus: "¹H", ligand: "NH₃", shift: 4.2, multiplicity: "triplet", J: "45 Hz (¹⁹⁵Pt-H)", notes: "¹⁹⁵Pt-H bog'lanishi (J = 45 Hz)" },
  { complex: "trans-[PtCl₂(NH₃)₂]", nucleus: "¹H", ligand: "NH₃", shift: 3.8, multiplicity: "triplet", J: "65 Hz (¹⁹⁵Pt-H)", notes: "trans-¹J(Pt-H) > cis-¹J(Pt-H)" },
  { complex: "[Fe(CN)₆]⁴⁻", nucleus: "¹³C", ligand: "CN⁻", shift: 177, multiplicity: "singlet", J: "—", notes: "¹³C NMR, barcha CN⁻ ekvivalent" },
  { complex: "[Co(NH₃)₆]³⁺", nucleus: "⁵⁹Co", ligand: "Co markaz", shift: 8120, multiplicity: "singlet", J: "—", notes: "Oktaedrik Co(III), diamagnit" },
  { complex: "cis-[PtCl₂(NH₃)₂]", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: -2100, multiplicity: "quintet", J: "45 Hz", notes: "Sisplatin, 2 ta NH₃ bilan bog'lanish" },
  { complex: "trans-[PtCl₂(NH₃)₂]", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: -1850, multiplicity: "quintet", J: "65 Hz", notes: "Transplatin, trans effekt" },
  { complex: "[PtCl₄]²⁻", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: 1620, multiplicity: "singlet", J: "—", notes: "Tekis kvadrat Pt(II)" },
  { complex: "[Rh(acac)₃]", nucleus: "¹⁰³Rh", ligand: "Rh markaz", shift: 6700, multiplicity: "multiplet", J: "—", notes: "Oktaedrik Rh(III)" },
  { complex: "[Al(H₂O)₆]³⁺", nucleus: "²⁷Al", ligand: "Al markaz", shift: 0, multiplicity: "singlet", J: "—", notes: "Simmetrik oktaedrik, referens" },
  { complex: "[Co(en)₃]³⁺", nucleus: "⁵⁹Co", ligand: "Co markaz", shift: 7180, multiplicity: "singlet", J: "—", notes: "Xelat effekti, D₃ simmetriya" },
  { complex: "[Fe(phen)₃]²⁺", nucleus: "¹H", ligand: "phen", shift: "7.5-9.2", multiplicity: "multiplet", J: "—", notes: "Fenantrolin ligandlari" },
  { complex: "[Fe(acac)₃]", nucleus: "¹H", ligand: "acac", shift: "2.1, 6.2", multiplicity: "singlet", J: "—", notes: "Paramagnit (paramagnit siljish)" },
  { complex: "[Co(NH₃)₅NO₂]²⁺", nucleus: "¹⁵N", ligand: "NO₂⁻ (N)", shift: 650, multiplicity: "singlet", J: "—", notes: "Nitro izomer, N-bonded" },
  { complex: "[Co(NH₃)₅ONO]²⁺", nucleus: "¹⁵N", ligand: "ONO⁻ (N)", shift: 580, multiplicity: "singlet", J: "—", notes: "Nitrito izomer, O-bonded" },
]

// Dinamik jarayonlar
const DYNAMIC_PROCESSES = [
  {
    name: "Ligand almashinish",
    timescale: "10⁻¹ - 10⁴ s⁻¹",
    method: "¹H NMR (variable temperature)",
    examples: [
      "[Co(NH₃)₆]³⁺ — inert (sekin almashinish, k < 10⁻⁶ s⁻¹)",
      "[Ni(H₂O)₆]²⁺ — labil (tez almashinish, k > 10⁴ s⁻¹)",
      "[Co(en)₃]³⁺ — inert (xelat effekti)"
    ],
    theory: "Sekin almashinishda ikkala signal ko'rinadi (erkin va bog'langan ligand). Tez almashinishda bitta o'rtacha signal. Oraliq tezlikda kengaygan signallar."
  },
  {
    name: "Fluksional jarayonlar",
    timescale: "10² - 10⁵ s⁻¹",
    method: "Variable temperature NMR (VT-NMR)",
    examples: [
      "[Fe(CO)₅] — Berry pseudorotation",
      "[Co(acac)₃] — Ray-Dutt twist",
      "trigonal bipiramidal komplekslar"
    ],
    theory: "Fluksional jarayonlar kompleksning simmetriyasini o'zgartiradi. VT-NMR yordamida aktivatsiya energiyasi (Eₐ) aniqlanadi."
  },
  {
    name: "Linkage izomerizm",
    timescale: "soatlar-kunlar",
    method: "¹⁵N NMR, ¹H NMR, UV-Vis",
    examples: [
      "[Co(NH₃)₅NO₂]²⁺ (nitro, sariq)",
      "[Co(NH₃)₅ONO]²⁺ (nitrito, qizil)",
      "Qorong'ida nitrito → nitro konversiyasi"
    ],
    theory: "SCN⁻, NO₂⁻ ambidentat ligandlar N yoki O orqali bog'lanishi mumkin. YaMR linkage izomerlarni farqlashda muhim."
  },
]

// Paramagnit effektlar
const PARAMAGNETIC_EFFECTS = [
  {
    name: "Contact shift (Fermi kontakt)",
    description: "Paramagnit markaziy atomdan ligandga spin zichligi o'tishi",
    formula: "δ_contact = (A/γₙ)·(γₑ/γₙ)·(gₑβₑS(S+1))/(3kT)",
    range: "±1000 ppm gacha",
    examples: [
      "[Fe(acac)₃] — ¹H shift: -60 dan +60 ppm",
      "[Co(acac)₂] — ¹H shift: -30 dan +50 ppm",
      "[Ni(acac)₂] — ¹H shift: -20 dan +40 ppm"
    ],
    distance: "Bog' orqali — yaqin ligandlar katta shift"
  },
  {
    name: "Pseudocontact shift (dipolyar)",
    description: "Paramagnit markaziy atomning dipolyar maydonidan kelib chiqadigan shift",
    formula: "δ_pc = (1/r³)·(3cos²θ - 1)·(D)",
    range: "±200 ppm gacha",
    examples: [
      "Lantanid komplekslari (Ln³⁺)",
      "[Eu(fod)₃] — shift reagenti",
      "Masofa bog'liq (1/r³)"
    ],
    distance: "Masofa bog'liq — uzoq ligandlar kichik shift"
  },
  {
    name: "Relaksatsiya kengayishi",
    description: "Paramagnit markaziy atom T₁ va T₂ relaksatsiyani tezlashtiradi",
    formula: "1/T₂ ∝ 1/r⁶",
    range: "Signal kengligi 10-1000 Hz",
    examples: [
      "Cu²⁺, Mn²⁺, Fe³⁺ komplekslari",
      "Yaqin protonlar kengayadi",
      " Solomon tenglamasi"
    ],
    distance: "1/r⁶ bog'liq — juda masofa bog'liq"
  },
]

// Kengaytiruvchi metodlar
const ADVANCED_TECHNIQUES = [
  {
    name: "2D NMR (COSY, NOESY, HSQC)",
    description: "Ikki o'lchamli YaMR — bog'lanishlar va masofalar",
    advantages: ["Bog'lanishlar tarmog'ini aniqlash", "Masofa o'lchash (NOESY)", "Geteronuklear bog'lanish (HSQC)"],
    disadvantages: ["Uzoq o'lchash vaqti", "Murakkab tahlil", "Katta namuna kerak"],
    bestFor: "Murakkab ligandlar tuzilishi",
    examples: "COSY: ¹H-¹H bog'lanishlar, NOESY: masofa, HSQC: ¹H-¹³C"
  },
  {
    name: "VT-NMR (Variable Temperature)",
    description: "Haroratni o'zgartirib dinamik jarayonlarni o'rganish",
    advantages: ["Almashinish tezligini o'lchash", "Eₐ aktivatsiya energiyasi", "Fluksional jarayonlar"],
    disadvantages: ["Uzoq vaqt", "Harorat nazorati kerak"],
    bestFor: "Dinamik jarayonlar, almashinish kinetikasi",
    examples: "Co(III) inert, Ni(II) labil almashinish"
  },
  {
    name: "Solid-state NMR (CP/MAS)",
    description: "Qattiq holatda YaMR — erimaydigan komplekslar uchun",
    advantages: ["Qattiq namunalar", "Erimaydigan komplekslar", "Kristall struktura"],
    disadvantages: ["Keng signallar", "Murakkab uskuna", "Uzoq o'lchash"],
    bestFor: "Qattiq komplekslar, MOF, koordinatsion polimerlar",
    examples: "MOF, koordinatsion polimerlar, qattiq katalizatorlar"
  },
  {
    name: "DOSY (Diffusion Ordered SpectroscopY)",
    description: "Diffuziya asosida o'lcham o'lchash",
    advantages: ["O'lcham o'lchash", "Aralashmalarni ajratish", "Oligomerlanish"],
    disadvantages: ["Uzoq o'lchash", "Katta namuna kerak"],
    bestFor: "Oligomerlanish, agregatsiya, o'lcham taqsimoti",
    examples: "Klasterlar, supramolekulyar komplekslar"
  },
]

// Halaqit beruvchi omillar
const INTERFERENCES = [
  {
    source: "Paramagnit markaziy atom",
    effect: "Signallarni kengaytiradi va siljitadi",
    severity: "Yuqori",
    solution: "Diamagnit komplekslarni afzal ko'rish. Paramagnit shift reagentlaridan foydalanish.",
    theoryNote: "Paramagnit markaziy atom (Cu²⁺, Mn²⁺, Fe³⁺) yaqin protonlarni kengaytiradi (1/r⁶ bog'liq)."
  },
  {
    source: "Erituvchi cho'qqilari",
    effect: "Erituvchi signallari ligand signallarini qoplaydi",
    severity: "O'rta",
    solution: "Deyterlangan erituvchilar (CDCl₃, DMSO-d₆, D₂O) ishlatish.",
    theoryNote: "Deyterlangan erituvchilar ¹H NMR da signal bermaydi (²H signali boshqa chastotada)."
  },
  {
    source: "Namuna tozaligi",
    effect: "Aralashmalar qo'shimcha signallar beradi",
    severity: "O'rta",
    solution: "Sof namuna ishlatish. Xromatografiya orqali tozalash.",
    theoryNote: "Aralashmalar qo'shimcha signallar beradi, tahlilni qiyinlashtiradi."
  },
  {
    source: "Harorat effekti",
    effect: "Harorat o'zgarishi kimyoviy siljishni o'zgartiradi",
    severity: "O'rta",
    solution: "Haroratni nazorat qilish. VT-NMR yordamida dinamik jarayonlarni o'rganish.",
    theoryNote: "Kimyoviy siljish haroratga bog'liq. VT-NMR dinamik jarayonlarni o'rganishda foydali."
  },
  {
    source: "Konsentratsiya effekti",
    effect: "Konsentratsiya o'zgarishi siljishni o'zgartiradi",
    severity: "Past",
    solution: "Standart konsentratsiya ishlatish (10⁻² - 10⁻³ M).",
    theoryNote: "Yuqori konsentratsiyada agregatsiya bo'lishi mumkin."
  },
  {
    source: "Oksidlanish/qaytarilish",
    effect: "Paramagnit markaziy atom hosil bo'lishi",
    severity: "O'rta",
    solution: "Inert atmosfera (N₂, Ar). Antioksidantlar qo'shish.",
    theoryNote: "Fe²⁺ → Fe³⁺ oksidlanish paramagnit effektni keltirib chiqaradi."
  },
]

// Laboratoriya tartibi
const LAB_PROCEDURE = [
  {
    step: 1,
    title: "⚠️ Xavfsizlik tayyorgarligi",
    desc: "Qo'lqop, ko'zoynak. Deyterlangan erituvchilar toksik. Paramagnit moddalardan ehtiyot bo'lish.",
    time: "15 daq",
    theoryNote: "Deyterlangan erituvchilar (CDCl₃, DMSO-d₆) toksik. CDCl₃ karsinogen bo'lishi mumkin."
  },
  {
    step: 2,
    title: "Namuna tayyorlash",
    desc: "5-10 mg namunani 0.6 mL deyterlangan erituvchida eritish. NMR naychaga solish.",
    time: "10-15 daq",
    theoryNote: "Deyterlangan erituvchilar ¹H NMR da signal bermaydi. Namuna toza bo'lishi kerak."
  },
  {
    step: 3,
    title: "NMR spektrometrni tayyorlash",
    desc: "Spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming) qilish.",
    time: "30 daq",
    theoryNote: "Shimlash — magnit maydonining bir xilligini ta'minlash. Yaxshi shimlash — o'tkir signallar."
  },
  {
    step: 4,
    title: "¹H NMR spektrini olish",
    desc: "¹H NMR spektrini olish (16-64 skan). Referens signali (TMS) tekshirish.",
    time: "5-10 daq",
    theoryNote: "16-64 skan yetarli. TMS (0 ppm) referens signal."
  },
  {
    step: 5,
    title: "¹³C NMR spektrini olish",
    desc: "¹³C NMR spektrini olish (1000-10000 skan). Proton decoupling yoqish.",
    time: "30-60 daq",
    theoryNote: "¹³C past sezgirlik (1.11% tabiiy tarqalish). Proton decoupling — signallarni o'tkirlashtiradi."
  },
  {
    step: 6,
    title: "Kimyoviy siljishlarni aniqlash",
    desc: "Har bir signalning kimyoviy siljishini (δ) aniqlash. Multipletlikni tahlil qilish.",
    time: "15 daq",
    theoryNote: "Kimyoviy siljish (δ, ppm) — ligand muhitini aniqlaydi. Multipletlik — qo'shni protonlar soni."
  },
  {
    step: 7,
    title: "Spin-spin bog'lanishlarni tahlil qilish",
    desc: "J bog'lanish konstantalarini o'lchash (Hz). Bog'lanishlar tarmog'ini aniqlash.",
    time: "10 daq",
    theoryNote: "J bog'lanish (Hz) — qo'shni yadrolar orasidagi bog'lanish. ³J(H-H) = 7 Hz — tipik alifatik bog'lanish."
  },
]

export default function YaMRSpektroskopiya() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeNucleus, setActiveNucleus] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [shiftSlider, setShiftSlider] = useState(5)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> YaMR SPEKTROSKOPIYA — YADRO MAGNIT REZONANSI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">YaMR</strong> — molekulalarning tuzilishini aniqlashda eng kuchli usul.
              ¹H, ¹³C, ³¹P, ¹⁹⁵Pt, ⁵⁹Co, ¹⁹F, ¹⁵N yadrolari!
            </p>

            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2">🧲 Asosiy yadrolar:</div>
                  <div className="text-purple-200">
                    <strong>¹H:</strong> 400 MHz, eng sezgir
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹³C:</strong> 100 MHz, organik ligandlar
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁹⁵Pt:</strong> Pt komplekslari
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>⁵⁹Co:</strong> Co komplekslari
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">🔬 Qo&apos;llanish:</div>
                  <div className="text-purple-200">
                    <strong>Kimyoviy siljish</strong> (δ, ppm)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Spin-spin bog'lanish</strong> (J, Hz)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Dinamik jarayonlar</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Sis-trans izomerlar</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Nobel mukofotlari:</strong> Ernst (1991, FT-NMR), Pople (1998, kvant kimyo), Wüthrich (2002, oqsil NMR).
                YaMR — tuzilish va dinamikani o&apos;rganishda eng kuchli usul.
              </p>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-green-200">
                <strong className="text-green-300">⚠️ XAVFSIZLIK:</strong> Deyterlangan erituvchilar toksik! CDCl₃ karsinogen. Kuchli magnit maydoni — metall buyumlardan ehtiyot bo&apos;ling!
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
              <span className="text-green-400 font-semibold">YaMR spektroskopiya</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
                  <span className="text-3xl">🧲</span>
                  YaMR spektroskopiya
                </h1>
                <p className="text-purple-400 text-sm mt-1">Yadro magnit rezonansi • Kimyoviy siljish • Tuzilish aniqlash</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">¹H, ¹³C, ³¹P</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">¹⁹⁵Pt, ⁵⁹Co</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Kimyoviy siljish</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Multipletlik</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Paramagnit effekti</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-green-600/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Birikmalar tahlili →
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!setShowHeader(!showHeader))}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-green-600 hover:bg-green-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Yadro magnit rezonansi</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Tuzilish aniqlash</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Dinamik jarayonlar</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              YaMR Spektroskopiya
            </h2>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            Yadro magnit rezonansi — <span className="text-green-400 italic">&quot;Molekulalarning tuzilishini aniqlashda eng kuchli usul&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-green-400">YaMR</strong> — molekulalarning <strong className="text-green-400">tuzilishini aniqlashda</strong> eng kuchli usullardan biri.
            Kompleks birikmalarda <strong className="text-green-400">ligandlarning joylashuvi</strong>,
            <strong className="text-green-400"> dinamik jarayonlar</strong> (ligand almashinish) va
            <strong className="text-green-400"> eritmadagi muvozanat</strong> o&apos;rganiladi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Kimyoviy siljish</div>
              <div className="text-white font-bold">δ (ppm)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Spin-spin bog'lanish</div>
              <div className="text-white font-bold">J (Hz)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Yadrolar</div>
              <div className="text-white font-bold">¹H, ¹³C, ³¹P</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall yadrolari</div>
              <div className="text-white font-bold">¹⁹⁵Pt, ⁵⁹Co</div>
            </div>
          </div>
        </div>

        {/* BIRIKMALAR KARTASI */}
        <Link
          href="/ilmiy/tahlil/nmr/birikmalar"
          className="group block bg-gradient-to-r from-green-900/40 to-purple-900/40 border border-green-700/50 rounded-2xl p-6 hover:bg-green-900/60 hover:border-green-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔍</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                Birikmalarning YaMR tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning ¹H, ¹³C, ¹⁹⁵Pt, ⁵⁹Co YaMR spektrlari tahlili.
                Kimyoviy siljishlar, multipletlik, diamagnit va paramagnit komplekslar farqi.
              </p>
            </div>
            <div className="text-3xl text-green-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">12+ ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">¹H, ¹³C, ¹⁹⁵Pt, ⁵⁹Co</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Kimyoviy siljish</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Multipletlik</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit effekti</span>
          </div>
        </Link>

        {/* YADROLAR MA'LUMOTLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧲 YaMR faol yadrolar (kompleks birikmalarda)</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {NUCLEI_DATA.map((nuc, i) => (
              <button
                key={i}
                onClick={() => setActiveNucleus(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeNucleus === i
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {nuc.symbol}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">{NUCLEI_DATA[activeNucleus].symbol} — {NUCLEI_DATA[activeNucleus].name}</h3>
            <p className="text-purple-200 text-sm mb-4">{NUCLEI_DATA[activeNucleus].description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Spin:</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].spin}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">γ (10⁷ rad/T·s):</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].gamma}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Chastota (MHz):</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].frequency}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Tabiiy tarqalish (%):</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].abundance}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Sezgirlik (¹H ga nisbatan):</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].sensitivity}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Diapazon:</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].range}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Referens:</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].reference}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Tipik siljishlar:</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].typicalShifts}</div>
              </div>
            </div>
          </div>
        </div>

        {/* KIMYOVIY SILJISHLAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Kimyoviy siljishlar jadvali (kengaytirilgan)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Yadro</th>
                  <th className="py-3 px-4 text-purple-300">Ligand</th>
                  <th className="py-3 px-4 text-purple-300">δ (ppm)</th>
                  <th className="py-3 px-4 text-purple-300">Multipletlik</th>
                  <th className="py-3 px-4 text-purple-300">J (Hz)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {CHEMICAL_SHIFTS.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-green-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4">{r.nucleus}</td>
                    <td className="py-3 px-4">{r.ligand}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{r.shift}</td>
                    <td className="py-3 px-4">{r.multiplicity}</td>
                    <td className="py-3 px-4 font-mono">{r.J}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTERAKTIV YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv YaMR spektr simulyatsiyasi</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            Kimyoviy siljishni o&apos;zgartiring. Signallar qanday o&apos;zgarishini ko&apos;ring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-green-400 font-bold mb-2">
              Kimyoviy siljish (δ): {shiftSlider} ppm
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.1"
              value={shiftSlider}
              onChange={(e) => setShiftSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0 ppm (TMS)</span>
              <span>6 ppm (aromatik)</span>
              <span>12 ppm (kislota)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-green-400">{shiftSlider} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ligand turi:</div>
                <div className="text-xl font-mono font-bold text-green-400">
                  {shiftSlider < 2 ? "Alifatik" : shiftSlider < 5 ? "Aromatik" : shiftSlider < 8 ? "Aromatik (deshildlangan)" : "Kislota (COOH)"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Muhit:</div>
                <div className="text-xl font-mono font-bold text-green-400">
                  {shiftSlider < 2 ? "Alifatik C-H" : shiftSlider < 5 ? "Aromatik C-H" : shiftSlider < 8 ? "Aromatik (elektron tortuvchi)" : "Kislota protoni"}
                </div>
              </div>
            </div>
          </div>

          {/* YaMR spektr simulyatsiyasi SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>YaMR spektr simulyatsiyasi — [Cu(NH₃)₄]²⁺</title>
              {[0, 2, 4, 6, 8, 10, 12].map((ppm, i) => (
                <g key={i}>
                  <line x1={580 - ((ppm/12)*530)} y1="220" x2={580 - ((ppm/12)*530)} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={580 - ((ppm/12)*530)} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* Asosiy signal */}
              <line
                x1={580 - ((shiftSlider/12)*530)}
                y1="220"
                x2={580 - ((shiftSlider/12)*530)}
                y2="40"
                stroke="#22c55e"
                strokeWidth="2"
              />
              <text x={580 - ((shiftSlider/12)*530)} y="35" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">
                {shiftSlider} ppm
              </text>

              {/* TMS referens */}
              <line x1="580" y1="220" x2="580" y2="180" stroke="#fbbf24" strokeWidth="2" />
              <text x="580" y="175" textAnchor="middle" fontSize="8" fill="#fbbf24">TMS</text>
            </svg>
          </div>
        </div>

        {/* DINAMIK JARAYONLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⏱️ Dinamik jarayonlar (ligand almashinish)</h2>

          <div className="space-y-4">
            {DYNAMIC_PROCESSES.map((proc, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-green-400 font-bold mb-2">{i+1}. {proc.name}</h3>
                <p className="text-purple-200 text-sm mb-2">{proc.description}</p>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="bg-purple-900/50 rounded-lg p-2">
                    <div className="text-purple-400 text-xs">Vaqt shkalasi:</div>
                    <div className="text-white font-bold">{proc.timescale}</div>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-2">
                    <div className="text-purple-400 text-xs">Usul:</div>
                    <div className="text-white font-bold">{proc.method}</div>
                  </div>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-3">
                  <div className="text-green-400 font-bold text-xs mb-1">Misollar:</div>
                  <ul className="text-purple-200 text-xs space-y-1">
                    {proc.examples.map((ex, j) => (
                      <li key={j}>• {ex}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariya:</div>
                  <p className="text-purple-200 text-xs">{proc.theory}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARAMAGNIT EFFEKTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧲 Paramagnit effektlar (paramagnit komplekslarda)</h2>

          <div className="space-y-4">
            {PARAMAGNETIC_EFFECTS.map((effect, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-green-400 font-bold mb-2">{effect.name}</h3>
                <p className="text-purple-200 text-sm mb-2">{effect.description}</p>
                <div className="bg-purple-900/50 rounded-lg p-3 mb-3">
                  <div className="text-purple-400 text-xs mb-1">Formula:</div>
                  <div className="text-white font-mono text-sm">{effect.formula}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="bg-purple-900/50 rounded-lg p-2">
                    <div className="text-purple-400 text-xs">Diapazon:</div>
                    <div className="text-white font-bold">{effect.range}</div>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-2">
                    <div className="text-purple-400 text-xs">Masofa bog'liqligi:</div>
                    <div className="text-white font-bold">{effect.distance}</div>
                  </div>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <div className="text-green-400 font-bold text-xs mb-1">Misollar:</div>
                  <ul className="text-purple-200 text-xs space-y-1">
                    {effect.examples.map((ex, j) => (
                      <li key={j}>• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LABORATORIYA BAJARISH TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi (KENGAYTIRILGAN)</h2>

          <div className="space-y-3">
            {LAB_PROCEDURE.map((step, i) => (
              <div key={i} className={`rounded-xl p-5 cursor-pointer transition-all ${
                activeLabStep === i ? "bg-green-900/40 border-2 border-green-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-green-500/50"
              }`}
              onClick={() => setActiveLabStep(i)}>
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
                    <div className="text-[10px] text-green-400 mt-2">
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
          <h2 className="text-xl font-bold text-white">⚠️ Halaqit beruvchi omillar (NAZARIY IZOHLAR)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Manba</th>
                  <th className="py-3 px-4 text-purple-300">Ta'sir</th>
                  <th className="py-3 px-4 text-purple-300">Jiddiylik</th>
                  <th className="py-3 px-4 text-purple-300">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {INTERFERENCES.map((int, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeInterference === i ? 'bg-green-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">{int.source}</td>
                    <td className="py-3 px-4 text-xs">{int.effect}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        int.severity === 'Yuqori' ? 'bg-red-600/30 text-red-400' :
                        int.severity === 'O\'rta' ? 'bg-yellow-600/30 text-yellow-400' :
                        'bg-green-600/30 text-green-400'
                      }`}>
                        {int.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">{int.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning nazariy izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {INTERFERENCES[activeInterference].theoryNote}
            </p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Kengaytiruvchi metodlar</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {ADVANCED_TECHNIQUES.map((tech, i) => (
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
            <h3 className="text-green-400 font-bold mb-3">{ADVANCED_TECHNIQUES[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">{ADVANCED_TECHNIQUES[activeTechnique].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {ADVANCED_TECHNIQUES[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {ADVANCED_TECHNIQUES[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3">
              <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
              <div className="text-white text-sm">{ADVANCED_TECHNIQUES[activeTechnique].bestFor}</div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-3">
              <div className="text-green-400 font-bold text-xs mb-1">Misollar:</div>
              <p className="text-purple-200 text-xs">{ADVANCED_TECHNIQUES[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>YaMR — <strong className="text-green-400">tuzilish va dinamikani</strong> o&apos;rganishda asosiy usul</li>
            <li>Sis-trans izomerlar <strong>har xil kimyoviy siljish</strong> beradi</li>
            <li>Ligand almashinish tezligini <strong>signallar shaklidan</strong> aniqlash mumkin</li>
            <li>Paramagnit metallar signallarni <strong>kengaytiradi va siljitadi</strong></li>
            <li>¹⁹⁵Pt YaMR — <strong>sis-trans izomerlarni</strong> aniq farqlaydi</li>
            <li>⁵⁹Co YaMR — <strong>oktaedrik Co(III)</strong> komplekslari uchun (8000-12000 ppm)</li>
            <li>Linkage izomerizm — <strong>¹⁵N YaMR</strong> orqali farqlash</li>
            <li>2D YaMR (COSY, NOESY, HSQC) — <strong>murakkab ligandlar</strong> tuzilishi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← IQ spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/rentgen" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Rentgen difraksiyasi →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Pople (Nobel 1998), Ernst (Nobel 1991), Wüthrich (Nobel 2002)</p>
        </div>
      </footer>
    </main>
  )
}