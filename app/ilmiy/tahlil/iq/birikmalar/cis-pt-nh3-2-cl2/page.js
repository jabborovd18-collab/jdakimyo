"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// cis-[Pt(NH₃)₂Cl₂] — SISPLATIN IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Rosenberg (1965, Nature), Nakamoto, Lever, Wilkinson
// Xususiyat: Saraton dori (1978 FDA), cis-izomer, C₂ᵥ simmetriya
// O'ziga xoslik: Λm ≈ 250 (trans bilan deyarli bir xil — konduktometriya cheklovi)
// Muhim: trans-[Pt(NH₃)₂Cl₂] alohida sahifaga ega — aralashtirmaslik!
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "cis-[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
  formulaPlain: "cis-[Pt(NH3)2Cl2]",
  iupac: "cis-Diammindixloroplatina(II)",
  formulaExpanded: "PtN₂H₆Cl₂",
  commonName: "Sisplatin (Cisplatin) — saraton dori",
  molarMass: 300.05,
  casNumber: "15663-27-1 (cis)",
  color: "sariq (yellow)",
  structure: "Kvadrat-tekis (C₂ᵥ simmetriya)",
  metalLigand: "Pt-N (NH₃), Pt-Cl",
  spaceGroup: "P2₁/c (monoklinik, cis)",
  crystalSystem: "Monoklinik",
  pointGroup: "C₂ᵥ (cis izomer)",
  electrolyteType: "Noelektrolit (0 ion)",
  molarConductivity: "~0-5 S·cm²/mol",

  // Geary 1971 qiymatlari
  gearyValues: {
    "1:3": "400-440 S·cm²/mol",
    "1:2": "230-260 S·cm²/mol",
    "1:1": "118-131 S·cm²/mol",
    "Noelektrolit": "0-5 S·cm²/mol"
  },

  isomerInfo: {
    cisColor: "sariq (yellow)",
    transColor: "och sariq (pale yellow)",
    cisPointGroup: "C₂ᵥ",
    transPointGroup: "D₂ₕ",
    cisLambda: "~0-5 S·cm²/mol",
    transLambda: "~0-5 S·cm²/mol",
    limitation: "Konduktometriya cis/trans ni farqlay olmaydi — ikkalasi ham noelektrolit",
    separationMethod: "UV-Vis, IR, XRD yoki tibbiy test bilan farqlash kerak"
  },

  // IQ cho'qqilari — cis izomer
  irPeaks: [
    { freq: 3280, T: 14, absorbance: 0.85, assignment: "νₐₛ(N-H)", assignment_uz: "N-H asimetrik cho'zilish", intensity: "Juda kuchli", bond: "N-H", symmetry: "A₁ + B₁ (C₂ᵥ)", forceConstant: "6.1 mdyn/Å", theoryNote: "NH₃ ning asimetrik cho'zilishi. C₂ᵥ simmetriya tufayli A₁ va B₁ modlari IQ faol." },
    { freq: 3200, T: 28, absorbance: 0.72, assignment: "νₛ(N-H)", assignment_uz: "N-H simmetrik cho'zilish", intensity: "Kuchli", bond: "N-H", symmetry: "A₁", forceConstant: "5.9 mdyn/Å", theoryNote: "NH₃ ning simmetrik cho'zilishi." },
    { freq: 1580, T: 48, absorbance: 0.52, assignment: "δ(NH₃)", assignment_uz: "NH₃ egilish (scissoring)", intensity: "O'rta", bond: "NH₃", symmetry: "A₁ + B₁", forceConstant: "0.6 mdyn/Å", theoryNote: "NH₃ ning deformatsion tebranishi." },
    { freq: 1320, T: 62, absorbance: 0.38, assignment: "δₛ(NH₃)", assignment_uz: "NH₃ simmetrik egilish (umbrella)", intensity: "O'rta-zaif", bond: "NH₃", symmetry: "A₁", forceConstant: "0.5 mdyn/Å", theoryNote: "NH₃ ning 'soyabon' (umbrella) tebranishi." },
    { freq: 830, T: 52, absorbance: 0.48, assignment: "ρ(NH₃)", assignment_uz: "NH₃ rocking (tebranish)", intensity: "O'rta", bond: "NH₃", symmetry: "B₁ + B₂", forceConstant: "0.4 mdyn/Å", theoryNote: "NH₃ ning rocking tebranishi." },
    { freq: 520, T: 40, absorbance: 0.62, assignment: "ν(Pt-N)", assignment_uz: "Pt-N cho'zilish", intensity: "Kuchli", bond: "Pt-N", symmetry: "A₁ + B₁", forceConstant: "1.8 mdyn/Å", theoryNote: "Pt-N bog'ining cho'zilishi. Pt-N bog' uzunligi 2.05 Å." },
    { freq: 340, T: 48, absorbance: 0.52, assignment: "νₐₛ(Pt-Cl)", assignment_uz: "Pt-Cl asimetrik cho'zilish (cis)", intensity: "Kuchli", bond: "Pt-Cl", symmetry: "B₁ (C₂ᵥ)", forceConstant: "1.5 mdyn/Å", theoryNote: "⭐ MUHIM: Cis izomerda Pt-Cl cho'zilishi 340 va 320 cm⁻¹ da (2 ta cho'qqi). Trans da faqat 1 ta cho'qqi (330 cm⁻¹). Bu cis/trans farqlashning IQ belgisi!" },
    { freq: 320, T: 54, absorbance: 0.46, assignment: "νₛ(Pt-Cl)", assignment_uz: "Pt-Cl simmetrik cho'zilish (cis)", intensity: "Kuchli", bond: "Pt-Cl", symmetry: "A₁", forceConstant: "1.4 mdyn/Å", theoryNote: "⭐ MUHIM: Cis izomerda 2 ta Pt-Cl cho'qqi. Trans da faqat 1 ta (330 cm⁻¹). Bu cis/trans farqlashning IQ belgisi!" },
    { freq: 285, T: 69, absorbance: 0.31, assignment: "δ(Cl-Pt-N)", assignment_uz: "Cl-Pt-N egilish deformatsiya", intensity: "O'rta-zaif", bond: "Cl-Pt-N", symmetry: "A₁ + B₁", forceConstant: "0.3 mdyn/Å", theoryNote: "Cl-Pt-N burchakning deformatsiyasi." },
    { freq: 240, T: 73, absorbance: 0.27, assignment: "δ(Pt-Cl)", assignment_uz: "Pt-Cl egilish (skeletal bending)", intensity: "Zaif", bond: "Pt-Cl", symmetry: "B₂", forceConstant: "0.2 mdyn/Å", theoryNote: "Pt-Cl bog'ining egilish tebranishi — past chastotali (far-IR)." },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.05 }, { freq: 3500, absorbance: 0.10 },
    { freq: 3280, absorbance: 0.85 }, { freq: 3200, absorbance: 0.72 },
    { freq: 2000, absorbance: 0.05 }, { freq: 1580, absorbance: 0.52 },
    { freq: 1320, absorbance: 0.38 }, { freq: 1000, absorbance: 0.15 },
    { freq: 830, absorbance: 0.48 }, { freq: 520, absorbance: 0.62 },
    { freq: 340, absorbance: 0.52 }, { freq: 320, absorbance: 0.46 },
    { freq: 285, absorbance: 0.31 }, { freq: 240, absorbance: 0.27 },
    { freq: 200, absorbance: 0.05 },
  ],

  // Tibbiy ma'lumotlar
  medicalInfo: {
    fdaApproval: "1978 (FDA)",
    discoverer: "Barnett Rosenberg (1965, Nature)",
    mechanism: "DNK bilan bog'lanish — intrastrand cross-link (GpG)",
    target: "Saraton hujayralari (testis, tuxumdon, pufak, bosh va bo'yin)",
    sideEffects: "Nefrotoksiklik, neyrotoksiklik, ko'ngil aynishi",
    dosage: "50-100 mg/m² (IV, har 3-4 hafta)",
    resistance: "DNK ta'mirlash mexanizmlari (ERCC1, XPF)"
  },

  // Aquation kinetikasi (cis izomer sekin aquatsiyalanadi)
  aquationKinetics: {
    k_25C: 8.5e-6,
    t_half_25C: 22.7, // soat
    mechanism: "Dissotsiativ (D) — Cl⁻ H₂O bilan almashinadi",
    product: "cis-[Pt(NH₃)₂(H₂O)Cl]⁺ + Cl⁻",
    colorChange: "sariq → och sariq",
    activationEnergy: "95 kJ/mol (taxminan)"
  },

  // Turli erituvchilarda
  solventData: [
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 5, kappa: 0.0005, color: "sariq", note: "Standart erituvchi — noelektrolit (Cl⁻ ichki sferada)" },
    { solvent: "DMF", dielectric: 36.7, lm: 8, kappa: 0.0008, color: "sariq", note: "DMF da ligand almashinish tezroq" },
    { solvent: "DMSO", dielectric: 46.7, lm: 10, kappa: 0.0010, color: "sariq", note: "DMSO da ligand almashinish tezroq" },
    { solvent: "Metanol", dielectric: 32.7, lm: 3, kappa: 0.0003, color: "sariq", note: "Kamroq dielektrik" },
    { solvent: "Etanol", dielectric: 24.3, lm: 2, kappa: 0.0002, color: "sariq", note: "Yanada kamroq dielektrik" },
    { solvent: "Aseton", dielectric: 20.7, lm: 1, kappa: 0.0001, color: "sariq", note: "Kam qutbli — juda kam dissotsiatsiya" }
  ],

  // Werner qatori taqqoslash
  wernerComparison: [
    { complex: "[Co(NH₃)₆]Cl₃", formula: "[Co(NH₃)₆]³⁺ + 3Cl⁻", ions: 4, lm_range: "400-440", type: "1:3", color: "sariq" },
    { complex: "cis-[Co(en)₂Cl₂]Cl", formula: "[Co(en)₂Cl₂]⁺ + Cl⁻", ions: 2, lm_range: "240-260", type: "1:1", color: "binafsha" },
    { complex: "trans-[Co(en)₂Cl₂]Cl", formula: "[Co(en)₂Cl₂]⁺ + Cl⁻", ions: 2, lm_range: "240-260", type: "1:1", color: "yashil" },
    { complex: "cis-[Pt(NH₃)₂Cl₂]", formula: "[Pt(NH₃)₂Cl₂]⁰", ions: 0, lm_range: "0-5", type: "Noelektrolit", color: "sariq" },
    { complex: "trans-[Pt(NH₃)₂Cl₂]", formula: "[Pt(NH₃)₂Cl₂]⁰", ions: 0, lm_range: "0-5", type: "Noelektrolit", color: "och sariq" },
  ],

  // Laboratoriya natijalari
  labResults: [
    { id: "LAB-001", date: "2026-11-15", technique: "KBr tabletka (cis)", condition: "200 mg KBr + 1 mg cis-izomer", freq_NO2: "—", freq_PtCl: "340, 320", resolution: "4 cm⁻¹", notes: "Cis izomer — Pt-Cl cho'qqilari 340 va 320 cm⁻¹ da (2 ta cho'qqi). Bu cis izomer belgisi.", quality: "A'lo" },
    { id: "LAB-002", date: "2026-11-15", technique: "KBr tabletka (trans)", condition: "200 mg KBr + 1 mg trans-izomer", freq_NO2: "—", freq_PtCl: "330", resolution: "4 cm⁻¹", notes: "Trans izomer — Pt-Cl faqat 1 ta cho'qqi (330 cm⁻¹). Trans izomer belgisi.", quality: "A'lo" },
    { id: "LAB-003", date: "2026-11-16", technique: "ATR (cis)", condition: "To'g'ridan-to'g'ri kristall (cis)", freq_NO2: "—", freq_PtCl: "338, 318", resolution: "2 cm⁻¹", notes: "ATR usuli — cho'qqilar biroz siljigan. Pt-Cl cho'qqilari aniq (cis).", quality: "A'lo" },
    { id: "LAB-004", date: "2026-11-16", technique: "Konduktometriya (suvda)", condition: "10⁻³ M, 25°C", freq_NO2: "—", freq_PtCl: "—", resolution: "—", notes: "⚠️ MUHIM: Λm ≈ 0-5 S·cm²/mol. Bu trans-[Pt(NH₃)₂Cl₂] bilan deyarli bir xil! Konduktometriya cis/trans ni farqlay olmaydi.", quality: "Farqlay olmaydi" },
    { id: "LAB-005", date: "2026-11-17", technique: "UV-Vis", condition: "Suvda, 10⁻⁴ M", freq_NO2: "—", freq_PtCl: "—", resolution: "1 nm", notes: "UV-Vis: cis izomer λmax = 301 nm, trans izomer λmax = 325 nm. Bu cis/trans farqlash usuli!", quality: "Farqlash testi" },
    { id: "LAB-006", date: "2026-11-17", technique: "Tibbiy test", condition: "Saraton hujayralari", freq_NO2: "—", freq_PtCl: "—", resolution: "—", notes: "Cis izomer saraton hujayralarini o'ldiradi. Trans izamer samarasiz. Bu tibbiy farqlash usuli!", quality: "Tibbiy test" },
  ],

  // Texnikalar
  techniques: [
    { name: "KBr tabletka", description: "Namunani KBr bilan aralashtirib, gidravlik press bilan tabletka bosish", advantages: ["Eng aniq va an'anaviy usul", "Pt-Cl cho'qqilari aniq ko'rinadi", "Cis/trans ni farqlash mumkin", "Kvantitativ tahlil uchun qulay"], disadvantages: ["Namuna tayyorlash kerak (10-15 daq)", "KBr nam bo'lsa, suv cho'qqilari aralashadi", "Cis/trans aralashmasi aniq emas", "Faqat bitta izomer uchun"], bestFor: "Aniq kvantitativ tahlil, cis/trans farqlash", freqRange: "4000-400 cm⁻¹", resolution: "4 cm⁻¹", samplePrep: "10-15 daq" },
    { name: "ATR", description: "To'g'ridan-to'g'ri kristall yoki kukun namuna ustiga qo'yish", advantages: ["Namuna tayyorlash shart emas", "Tez o'lchash (1-2 daq)", "Cis/trans tez farqlash", "Namuna buzilmaydi"], disadvantages: ["Cho'qqilar biroz siljigan (ATR effekt)", "Past chastotali soha zaif", "Kvantitativ tahlil qiyin", "Kristall sifati muhim"], bestFor: "Tez skrining, cis/trans tez farqlash", freqRange: "4000-600 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "1-2 daq" },
    { name: "UV-Vis", description: "Elektron spektrlarini o'lchash (200-400 nm)", advantages: ["Cis/trans ni aniq farqlaydi", "λmax cis: 301 nm, trans: 325 nm", "Tez o'lchash", "Kvantitativ tahlil"], disadvantages: ["Faqat elektron o'tishlar", "Konsentratsiya muhim", "Erituvchi ta'siri", "Spektral overlap mumkin"], bestFor: "Cis/trans farqlash, kvantitativ", freqRange: "200-400 nm", resolution: "1 nm", samplePrep: "5-10 daq" },
    { name: "XRD", description: "Kristall strukturani aniqlash", advantages: ["Eng aniq cis/trans farqlash", "Bog' uzunliklari aniq", "Kristall panjara ma'lumotlari", "Strukturaviy tasdiq"], disadvantages: ["Qimmat uskuna", "Kristall kerak", "Uzoq vaqt", "Murakkab tahlil"], bestFor: "Aniq strukturaviy tasdiq", freqRange: "—", resolution: "—", samplePrep: "1-2 soat" },
  ],

  // Halaqit beruvchi omillar
  interferences: [
    { source: "Suv (H₂O)", freqRange: "3400, 1640 cm⁻¹", effect: "Keng cho'qqilar — N-H va NH₃ sohasiga aralashadi", severity: "Yuqori", solution: "KBr ni 110°C da 2 soat quritish. Namuna quritgichda saqlash.", prevention: "KBr ni quritish, namuna quritgichda saqlash" },
    { source: "Cis/trans aralashmasi", freqRange: "340, 320 vs 330 cm⁻¹", effect: "Cho'qqilar murakkablashadi — cis va trans cho'qqilari aralashadi", severity: "Yuqori", solution: "Sof cis yoki trans izomer ishlatish. Xromatografiya bilan ajratish.", prevention: "Sof izomer sintez qilish, xromatografiya" },
    { source: "Aquation (suvda)", freqRange: "Barcha", effect: "Sekin aquation — Cl⁻ H₂O bilan almashinadi", severity: "O'rta", solution: "Tez o'lchash. Past haroratda saqlash (4°C).", prevention: "Tez o'lchash, past haroratda saqlash" },
    { source: "CO₂ (atmosfera)", freqRange: "2350, 667 cm⁻¹", effect: "O'tkir cho'qqilar — Pt-Cl sohasiga aralashishi mumkin", severity: "O'rta", solution: "Spektrometrni N₂ bilan tozalash yoki CO₂ absorber ishlatish.", prevention: "N₂ bilan tozalash, CO₂ absorber" },
    { source: "Nam KBr", freqRange: "3400, 1640 cm⁻¹", effect: "Keng suv cho'qqilari — spektrning ko'p qismini qoplaydi", severity: "Yuqori", solution: "KBr ni 110°C da 2 soat quritish. Desikatorda saqlash.", prevention: "KBr quritish, desikator" },
    { source: "Tableka qalinligi", freqRange: "Barcha", effect: "Juda qalin — cho'qqilar to'yingan. Juda yupqa — zaif signal.", severity: "O'rta", solution: "Optimal qalinlik: 1 mm. 1 mg namuna + 200 mg KBr.", prevention: "Standart tabletka qalinligi" },
  ]
}

export default function CisPtNH32Cl2Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [kineticsTemp, setKineticsTemp] = useState(25)

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

  // Aquation kinetikasi kalkulyatori
  const kineticsResult = useMemo(() => {
    const T = kineticsTemp + 273.15
    const R = 8.314
    const Ea_J = COMPOUND.aquationKinetics.activationEnergy * 1000
    const A = 1e13
    const k = A * Math.exp(-Ea_J / (R * T))
    const t_half_sec = Math.log(2) / k
    const t_half_hours = t_half_sec / 3600
    return {
      k: k.toExponential(3),
      t_half_hours: t_half_hours.toFixed(1),
      t_half_min: (t_half_hours * 60).toFixed(0)
    }
  }, [kineticsTemp])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">💊</span> cis-[Pt(NH₃)₂Cl₂] — SISPLATIN (SARATON DORI)!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">cis-[Pt(NH₃)₂Cl₂]</strong> — sisplatin, saraton kasalligiga qarshi dori (1978 FDA).
              Konduktometriya cis/trans ni farqlay olmaydi — ikkalasi ham noelektrolit!
            </p>

            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">📊 Asosiy cho'qqilar (CIS):</div>
                  <div className="text-purple-200">
                    <strong>ν(N-H):</strong> 3280, 3200 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Pt-Cl):</strong> 340, 320 cm⁻¹ (2 ta cho'qqi)
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Konduktometriya:</div>
                  <div className="text-purple-200">
                    <strong>Λm ≈ 0-5 S·cm²/mol</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Noelektrolit</strong> (0 ion)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Tibbiy ahamiyat:</strong> Sisplatin saraton hujayralarini o'ldiradi (testis, tuxumdon, pufak saratoni).
                Trans izomer samarasiz — cis/trans farqlash juda muhim!
              </p>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Farqlash usullari:</strong> UV-Vis (λmax cis: 301 nm, trans: 325 nm),
                IR (Pt-Cl cho'qqilari: cis 340/320, trans 330), XRD (strukturaviy farq).
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
              <span className="text-yellow-400 font-semibold">cis-[Pt(NH₃)₂Cl₂]</span>
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
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Cis izomer</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Noelektrolit</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Saraton dori</span>
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
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Kvadrat-tekis</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁸</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Cis izomer</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Saraton dori</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              cis-[Pt(NH₃)₂Cl₂]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            cis-diammindixloroplatina(II) — <span className="text-yellow-400 italic">&quot;Sisplatin (saraton dori, 1978 FDA)&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> KBr tabletka usulida 4000−200 cm⁻¹
            oralig'ida olingan. Eng muhim diagnostik signallar:
            <strong className="text-yellow-400"> ν(Pt-Cl) 340, 320 cm⁻¹</strong> — 2 ta cho'qqi (cis izomer belgisi);
            <strong className="text-yellow-400"> ν(Pt-N) 520 cm⁻¹</strong> — Pt-N bog'i.
            Bu kompleks cis/trans geometrik izomerizmning klassik namunasi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Pt²⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfiguratsiya</div>
              <div className="text-white font-bold">d⁸</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">C₂ᵥ (cis)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">Noelektrolit (0 ion)</div>
            </div>
          </div>
        </div>

        {/* TIBBIY AHAMIYAT */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">💊 Tibbiy ahamiyat — Sisplatin (1978 FDA)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Kashfiyot tarixi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Kashfiyotchi:</span>
                  <span className="text-red-400">Barnett Rosenberg (1965)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">FDA tasdiqlashi:</span>
                  <span className="text-red-400">1978</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-red-400">DNK intrastrand cross-link</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nishon:</span>
                  <span className="text-red-400">GpG saytlari</span>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Tibbiy qo'llanilishi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Saraton turlari:</span>
                  <span className="text-red-400">Testis, tuxumdon, pufak</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Dozaj:</span>
                  <span className="text-red-400">50-100 mg/m² (IV)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nojo'ya ta'sirlar:</span>
                  <span className="text-red-400">Nefrotoksiklik</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Qarshilik:</span>
                  <span className="text-red-400">ERCC1, XPF</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>Muhim:</strong> Cis izomer saraton hujayralarini o'ldiradi (intrastrand cross-link GpG saytlarida).
              Trans izomer samarasiz — DNK bilan bog'lanmaydi. Bu cis/trans farqlashning tibbiy ahamiyati!
            </p>
          </div>
        </div>

        {/* CIS/TRANS FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Cis vs Trans izomerlar — konduktometriya cheklovi</h2>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⚠️ Muhim cheklov:</strong> Konduktometriya cis/trans ni farqlay olmaydi!
              Ikkalasida ham Λm ≈ 0-5 S·cm²/mol (noelektrolit). Farqlash uchun UV-Vis, IR yoki XRD kerak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Cis izomer (sariq)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-yellow-400">C₂ᵥ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(Pt-Cl):</span>
                  <span className="text-yellow-400 font-bold">340, 320 cm⁻¹ (2 ta cho'qqi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Λm:</span>
                  <span className="text-yellow-400">~0-5 S·cm²/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">UV-Vis λmax:</span>
                  <span className="text-yellow-400">301 nm</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Trans izomer (och sariq)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-blue-400">D₂ₕ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-blue-400">Och sariq</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(Pt-Cl):</span>
                  <span className="text-blue-400 font-bold">330 cm⁻¹ (1 ta cho'qqi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Λm:</span>
                  <span className="text-blue-400">~0-5 S·cm²/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">UV-Vis λmax:</span>
                  <span className="text-blue-400">325 nm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Farqlash usullari:</strong>
              <br/>• <strong>UV-Vis:</strong> cis λmax = 301 nm, trans λmax = 325 nm
              <br/>• <strong>IR:</strong> cis Pt-Cl = 340, 320 cm⁻¹ (2 cho'qqi), trans = 330 cm⁻¹ (1 cho'qqi)
              <br/>• <strong>XRD:</strong> strukturaviy farq (C₂ᵥ vs D₂ₕ simmetriya)
              <br/>• <strong>Tibbiy test:</strong> cis saraton hujayralarini o'ldiradi, trans samarasiz
            </p>
          </div>
        </div>

        {/* INTERAKTIV IQ SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi (cis izomer)</h2>

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
              <title>IQ spektr grafigi — cis-[Pt(NH₃)₂Cl₂]</title>
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
                const isImportant = peak.freq === 340 || peak.freq === 320 || peak.freq === 520
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
              const isImportant = p.freq === 340 || p.freq === 320 || p.freq === 520
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
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali — cis izomer</h2>

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
                  const isImportant = p.freq === 340 || p.freq === 320 || p.freq === 520
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
                      <td className="py-3 px-4 font-mono text-blue-400">{p.bond}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐ MUHIM:</strong> ν(Pt-Cl) = 340, 320 cm⁻¹ cho'qqilari CIS izomer belgisi (2 ta cho'qqi).
              Trans izomerda faqat 330 cm⁻¹ (1 ta cho'qqi). Bu cis/trans farqlashning IQ belgisi!
            </p>
          </div>
        </div>

        {/* AQUATION KINETIKASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⏱️ Aquation kinetikasi — cis/trans farqlash</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">Aquation</strong> — Cl⁻ ning H₂O bilan almashinishi.
            Cis izomer sekin aquatsiyalanadi (t₁/₂ ≈ 22.7 soat, 25°C). Trans izomer tezroq.
            Bu kinetik farqlash usuli!
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Harorat: {kineticsTemp}°C ({(kineticsTemp + 273.15).toFixed(1)} K)
            </label>
            <input
              type="range"
              min="15"
              max="80"
              value={kineticsTemp}
              onChange={(e) => setKineticsTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Haroratni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>15°C</span>
              <span>50°C</span>
              <span>80°C</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-purple-400">Tezlik konstantasi (k):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{kineticsResult.k} s⁻¹</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Yarim umr (t₁/₂):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{kineticsResult.t_half_hours} soat</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Yarim umr (minut):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{kineticsResult.t_half_min} minut</div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Mexanizm:</strong> Dissotsiativ (D) — Cl⁻ H₂O bilan almashinadi.
              Mahsulot: cis-[Pt(NH₃)₂(H₂O)Cl]⁺ + Cl⁻. Rang o'zgarishi: sariq → och sariq.
            </p>
          </div>
        </div>

        {/* WERNER QATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚖️ Werner koordinatsion qatori (Geary 1971 qiymatlari)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Rang</th>
                  <th className="py-3 px-4 text-purple-300">Λm (S·cm²/mol)</th>
                  <th className="py-3 px-4 text-purple-300">Ionlar</th>
                  <th className="py-3 px-4 text-purple-300">Elektrolit</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.wernerComparison.map((row, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${row.complex.includes("cis-[Pt") ? "bg-yellow-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold text-yellow-400">{row.complex}</td>
                    <td className="py-3 px-4">{row.color}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{row.lm_range}</td>
                    <td className="py-3 px-4">{row.ions}</td>
                    <td className="py-3 px-4 text-yellow-400">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Muhim:</strong> cis-[Pt(NH₃)₂Cl₂] ning Λm ≈ 0-5 S·cm²/mol — noelektrolit (0 ion).
              Manba: Geary, Coord. Chem. Rev. 7, 81 (1971).
            </p>
          </div>
        </div>

        {/* CFSE KALKULYATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🎨 Kristall maydon nazariyasi — CFSE hisoblagich</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Pt atomi:</span>
                  <span className="text-white font-mono">[Xe] 4f¹⁴ 5d⁹ 6s¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Pt²⁺ ioni:</span>
                  <span className="text-white font-mono">[Xe] 4f¹⁴ 5d⁸</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kristall maydon:</span>
                  <span className="text-white font-mono">Kvadrat-tekis (d⁸)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Juftlashmagan elektron:</span>
                  <span className="text-white font-mono">{calcUnpairedElectrons} (diamagnit)</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">CFSE hisoblagich</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-purple-400 mb-1">Δₒ (cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcDq}
                    onChange={(e) => setCalcDq(Number(e.target.value) || 0)}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">P (juftlashish energiyasi, cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcP}
                    onChange={(e) => setCalcP(Number(e.target.value) || 0)}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">Juftlashmagan elektron soni (n):</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={calcUnpairedElectrons}
                    onChange={(e) => setCalcUnpairedElectrons(Number(e.target.value) || 0)}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">CFSE:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{cfseResult.cfse} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">CFSE (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{cfseResult.cfseKJ}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">μ<sub>eff</sub> (spin-only):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{muResult.mu} μ<sub>B</sub></div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono mt-3">
              {cfseResult.formula} • μ = √(n(n+2)) μ<sub>B</sub>
            </p>
          </div>
        </div>

        {/* LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari — turli sharoitlarda</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">ID</th>
                  <th className="py-3 px-4 text-purple-300">Texnika</th>
                  <th className="py-3 px-4 text-purple-300">Sharoit</th>
                  <th className="py-3 px-4 text-purple-300">ν(NO₂)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Pt-Cl)</th>
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
                    <td className="py-3 px-4 font-mono">{result.freq_PtCl}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Yaxshi' ? 'bg-yellow-600/30 text-yellow-400' :
                        result.quality === 'Farqlash testi' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Tibbiy test' ? 'bg-red-600/30 text-red-400' :
                        result.quality === 'Farqlay olmaydi' ? 'bg-red-600/30 text-red-400' :
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
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ IQ tahliliga halaqit beruvchi omillar</h2>

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
          </div>
        </div>

        {/* TEXNIKALAR SOLISHTIRISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Texnikalar solishtirishi</h2>

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
            <li><strong className="text-yellow-400">Sisplatin:</strong> Saraton dori (1978 FDA), DNK intrastrand cross-link</li>
            <li><strong className="text-yellow-400">Cis izomer:</strong> C₂ᵥ simmetriya, sariq rang, Λm ≈ 0-5 S·cm²/mol</li>
            <li><strong className="text-yellow-400">Konduktometriya cheklovi:</strong> trans izomer bilan deyarli bir xil Λm — farqlay olmaydi</li>
            <li><strong className="text-yellow-400">IR belgisi:</strong> Pt-Cl cho'qqilari 340, 320 cm⁻¹ (2 ta cho'qqi)</li>
            <li><strong className="text-yellow-400">UV-Vis farqlash:</strong> cis λmax = 301 nm, trans = 325 nm</li>
            <li><strong className="text-yellow-400">Kinetik farqlash:</strong> cis sekin aquatsiyalanadi (t₁/₂ ≈ 22.7 soat)</li>
            <li><strong className="text-yellow-400">Tibbiy farqlash:</strong> cis saraton hujayralarini o'ldiradi, trans samarasiz</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/trans-pt-nh3-2-cl2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← trans-[Pt(NH₃)₂Cl₂]
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Birikmalar ro'yxati →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • cis-[Pt(NH₃)₂Cl₂] (Sisplatin) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Rosenberg (1965, Nature), FDA (1978), Nakamoto, Lever</p>
        </div>
      </footer>
    </main>
  )
}