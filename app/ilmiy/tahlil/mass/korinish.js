"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// MASS-SPEKTROMETRIYA — ASOSIY NAZARIY SAHIFA (PREMIUM SCIENTIFIC)
// Manbalar:
//   • J. H. Gross — Mass Spectrometry: A Textbook (3rd ed., Springer, 2017)
//   • E. de Hoffmann, V. Stroobant — Mass Spectrometry: Principles and Applications (3rd ed., Wiley)
//   • F. W. McLafferty, F. Tureček — Interpretation of Mass Spectra (4th ed., University Science Books)
//   • W. Henderson, J. S. McIndoe — Mass Spectrometry of Inorganic and Organometallic Compounds (Wiley, 2005)
//   • R. A. W. Johnstone, M. E. Rose — Mass Spectrometry for Chemists and Biochemists (2nd ed., CUP)
//   • IUPAC Gold Book — Mass spectrometry terminology (2013 recommendations)
//   • NIST — Atomic Weights and Isotopic Compositions (2021 CODATA)
//   • J. B. Fenn — Nobel Lecture (2002, ESI)
//   • K. Tanaka — Nobel Lecture (2002, MALDI)
//   • M. Yamashita, J. B. Fenn — J. Phys. Chem. 88 (1984) 4451 [ESI kashf]
//   • A. G. Marshall — FT-ICR: Anal. Chem. 74 (2002) 252A
//   • A. Makarov — Orbitrap: Anal. Chem. 72 (2000) 1156
// Xususiyat: Ionlashtirish nazariyasi, mass-analizatorlar fizikasi, izotopik
//            taqsimot statistikasi, HRMS aniqligi, fragmentlanish qoidalari
//            (McLafferty, α-uzilish, RDA), kompleks birikmalar uchun maxsus
//            yondashuvlar, ppm hisob-kitobi, halqa+π bog'lar (RDBE) formulasi.
// Til: 100% o'zbek (lotin)
// ═══════════════════════════════════════════════════════════════════════════════

const MASS_DATA = {

  // ─── Mass-spektrometriyaning fizik asosi (Lorentz kuchi)
  physicalBasis: {
    lorentzForce: "F = q(E + v × B)",
    kineticEnergy: "½mv² = zeV  →  v = √(2zeV/m)",
    massToChargeRatio: "m/z = (r²B²e)/(2V)  [magnit sektor uchun]",
    resolution: "R = m/Δm  (FWHM asosida)",
    ppmError: "Δppm = (m_kuzatilgan − m_hisoblangan)/m_hisoblangan × 10⁶",
  },

  // ─── Ionlashtirish usullari — batafsil ilmiy tavsif
  ionizationMethods: [
    {
      abbr: "EI",
      name: "Elektron ionlashtirish (Electron Ionization)",
      inventor: "A. J. Dempster (1918), R. Nier (1940)",
      energy: "70 eV (standart)",
      type: "Qattiq (hard) ionlashtirish",
      mechanism: "M + e⁻(70 eV) → M•⁺ + 2e⁻ — molekulyar radikal-kation hosil bo'ladi",
      pros: "Ko'p fragmentlar → NIST kutubxonasida qidirish mumkin",
      cons: "Kompleks birikmalarda M⁺ ko'pincha yo'q; faqat uchuvchan namunalar",
      applicability: "[Fe(CO)₅], [Ni(CO)₄], [Cr(C₆H₆)₂], metallosenlar",
      spectrumType: "Fragmentlar boyligi",
      color: "text-orange-400",
    },
    {
      abbr: "ESI",
      name: "Elektrosprey ionlashtirish (Electrospray Ionization)",
      inventor: "J. B. Fenn (1984, Nobel 2002)",
      energy: "3–5 kV (kapillyar taranglik)",
      type: "Yumshoq (soft) ionlashtirish",
      mechanism: "Eritma → yuqori kuchlanishli ninadan Taylor konusi → zaryadlangan tomchilar → Coulomb parchalanishi (Rayleigh chegarasi) → gaz fazasidagi ionlar",
      pros: "Ko'p zaryadli ionlar; termik nozik birikmalar; oqim (LC-MS) bilan mos",
      cons: "Bufer tuzlariga sezgir; matritsa ta'siri",
      applicability: "Kompleks birikmalarning ~95%: [Ru(bpy)₃]²⁺, sisplatin metabolitlari, oqsil-metall komplekslari",
      spectrumType: "Molekulyar ion dominant, adduktlar",
      color: "text-cyan-400",
    },
    {
      abbr: "MALDI",
      name: "Matritsa yordamida lazer desorbsiya (Matrix-Assisted Laser Desorption/Ionization)",
      inventor: "K. Tanaka, M. Karas, F. Hillenkamp (1985–88)",
      energy: "337 nm (N₂ lazer) yoki 355 nm (Nd:YAG)",
      type: "Yumshoq ionlashtirish",
      mechanism: "Namuna + matritsa (DHB, CHCA, sinapin kislotasi) kokristall → lazer impulsi matritsani qo'zg'atadi → proton uzatish → [M+H]⁺",
      pros: "Yuqori massalar (>100 kDa); tez tahlil; aralashmalarga toza",
      cons: "Matritsa piklari (m/z < 500), miqdoriy tahlilda cheklangan",
      applicability: "Metallo-porfirinlar, klaster birikmalar, polioksometallatlar",
      spectrumType: "Asosan [M+H]⁺ yoki [M−H]⁻, bir zaryadli",
      color: "text-pink-400",
    },
    {
      abbr: "APCI",
      name: "Atmosfera bosimida kimyoviy ionlashtirish",
      inventor: "E. C. Horning (1974)",
      energy: "Corona razryad (2–5 μA)",
      type: "Yumshoq ionlashtirish",
      mechanism: "N₂ + e⁻ → N₂•⁺ → H₃O⁺ (proton reaktivi) → [M+H]⁺",
      pros: "Kam qutbli birikmalar (ESI ga muqobil); LC-MS bilan mos",
      cons: "Termik parchalanish xavfi",
      applicability: "β-diketonat komplekslar, ferrosen hosilalari",
      spectrumType: "[M+H]⁺, [M−H]⁻, ba'zi adduktlar",
      color: "text-green-400",
    },
    {
      abbr: "FAB",
      name: "Tez atomlar zarbasi (Fast Atom Bombardment)",
      inventor: "M. Barber (1981)",
      energy: "Xe/Ar atomlari 6–10 keV",
      type: "Yumshoq ionlashtirish (o'rta)",
      mechanism: "Namuna glitserol matritsada → Xe/Ar zarbasi → [M+H]⁺, [M+glycerol]⁺",
      pros: "Tarixiy — ESI dan oldingi standart",
      cons: "Yuqori shovqin, matritsa piklari",
      applicability: "Klassik metall komplekslar (1980–90 yillar adabiyoti)",
      spectrumType: "[M+H]⁺, matritsa adduktlari",
      color: "text-yellow-400",
    },
    {
      abbr: "ICP-MS",
      name: "Induktiv bog'langan plazma (Inductively Coupled Plasma)",
      inventor: "R. S. Houk (1980)",
      energy: "Ar plazma 6000–10000 K",
      type: "Qattiq ionlashtirish (elementar)",
      mechanism: "Namuna to'liq atomizatsiya → M → M⁺ ionlashtirish",
      pros: "Elementar tahlil, ppt darajasidagi sezgirlik, izotop nisbatlari",
      cons: "Molekulyar ma'lumot yo'qoladi",
      applicability: "Miqdoriy element tahlili, izotop dating",
      spectrumType: "Faqat M⁺ atom ionlari",
      color: "text-red-400",
    },
  ],

  // ─── Mass-analizatorlar — fizik prinsiplar bo'yicha
  analyzers: [
    {
      name: "Kvadrupol (Q)",
      inventor: "W. Paul (1953, Nobel 1989)",
      principle: "Mathieu tenglamalari: 4 ta parallel elektrodda RF + DC maydon; faqat ma'lum m/z barqaror trayektoriya",
      resolution: "R ≈ 1 000 – 4 000",
      massRange: "m/z 1 – 4 000",
      accuracy: "±0.1 – 0.3 Da (past)",
      speed: "Juda tez skanerlash",
      cost: "Arzon",
      useCase: "GC-MS, LC-MS rutinali, MRM miqdoriy tahlil",
    },
    {
      name: "Uch kvadrupol (QqQ)",
      inventor: "Yost & Enke (1978)",
      principle: "Q1 (tanlash) → q2 (CID kolliziyasi) → Q3 (fragment tahlili) — MS/MS",
      resolution: "R ≈ 1 000 – 4 000",
      massRange: "m/z 1 – 4 000",
      accuracy: "±0.1 Da",
      speed: "MRM da 100+ o'tish/soniya",
      cost: "O'rtacha",
      useCase: "Kompleks birikmalarning fragmentatsion tadqiqi, dori-darmon miqdoriy tahlili",
    },
    {
      name: "Ion tutqich (Ion Trap, IT)",
      inventor: "W. Paul (1953), G. Stafford (1980-lar)",
      principle: "3D yoki linear tutqichda ionlar RF maydonda saqlanadi; ketma-ket ejeksiya",
      resolution: "R ≈ 4 000 – 10 000",
      massRange: "m/z 50 – 6 000",
      accuracy: "±0.05 – 0.1 Da",
      speed: "O'rtacha",
      cost: "O'rtacha",
      useCase: "MSⁿ (ko'p bosqichli fragmentlash) — koordinatsion ligandlarning ketma-ket yo'qolishini o'rganish",
    },
    {
      name: "Uchish vaqti (Time-of-Flight, TOF)",
      inventor: "W. E. Stephens (1946), Wiley-McLaren (1955)",
      principle: "t = L·√(m/2zeV) — barcha ionlar bir vaqtda tezlashtirilib, uzun trubada uchadi; yengil ionlar oldin yetib keladi",
      resolution: "R ≈ 10 000 – 60 000 (reflektron bilan)",
      massRange: "m/z 1 – 500 000+",
      accuracy: "±1 – 5 ppm",
      speed: "Juda tez (μs)",
      cost: "O'rtacha-qimmat",
      useCase: "MALDI-TOF, HRMS, katta klasterlar va biomolekulalar",
    },
    {
      name: "Orbitrap",
      inventor: "A. Makarov (1999, patent; 2005 tijoratlashtirilgan)",
      principle: "Ionlar markaziy elektrod atrofida garmonik tebranadi; chastota ω = √(k·z/m); FT bilan m/z chastotadan olinadi",
      resolution: "R ≈ 100 000 – 1 000 000",
      massRange: "m/z 50 – 6 000",
      accuracy: "<1 ppm",
      speed: "Sekin (yuqori R uchun)",
      cost: "Qimmat",
      useCase: "HRMS gold standard — molekulyar formulani bevosita tasdiqlash",
    },
    {
      name: "FT-ICR",
      inventor: "M. Comisarow, A. G. Marshall (1974)",
      principle: "Ionlar magnit maydonda siklotron chastotasida aylanadi: ω = zeB/m; FT signal → mass-spektr",
      resolution: "R > 1 000 000 (dunyo rekordi)",
      massRange: "m/z 50 – 30 000",
      accuracy: "<0.1 ppm",
      speed: "Juda sekin",
      cost: "Juda qimmat (superconducting magnit)",
      useCase: "Neft petroleomika, ultra-yuqori aniqlik, izotop nozik ajratish",
    },
  ],

  // ─── Elementar izotopik ma'lumotlar (NIST 2021)
  isotopes: [
    { el: "H",  isotopes: [{m: 1.00783,  ab: 99.9885}, {m: 2.01410,  ab: 0.0115}], pattern: "M+1 juda kichik", color: "text-gray-300" },
    { el: "C",  isotopes: [{m: 12.00000, ab: 98.93},   {m: 13.00336, ab: 1.07}],   pattern: "har 100 C atomiga ~1.1% M+1", color: "text-blue-300" },
    { el: "N",  isotopes: [{m: 14.00307, ab: 99.636},  {m: 15.00011, ab: 0.364}],  pattern: "Kichik M+1", color: "text-purple-300" },
    { el: "O",  isotopes: [{m: 15.99491, ab: 99.757},  {m: 16.99913, ab: 0.038}, {m: 17.99916, ab: 0.205}], pattern: "M+2 ~0.2%", color: "text-red-300" },
    { el: "S",  isotopes: [{m: 31.97207, ab: 94.99},   {m: 32.97146, ab: 0.75}, {m: 33.96787, ab: 4.25}], pattern: "M+2 ~4.4% — diagnostik", color: "text-yellow-300" },
    { el: "Cl", isotopes: [{m: 34.96885, ab: 75.76},   {m: 36.96590, ab: 24.24}],  pattern: "M+2 = 32% — 3:1 nisbat", color: "text-green-300" },
    { el: "Br", isotopes: [{m: 78.91834, ab: 50.69},   {m: 80.91629, ab: 49.31}],  pattern: "M+2 = 98% — deyarli 1:1", color: "text-orange-300" },
    { el: "Fe", isotopes: [{m: 53.93961, ab: 5.845}, {m: 55.93494, ab: 91.754}, {m: 56.93540, ab: 2.119}, {m: 57.93328, ab: 0.282}], pattern: "M−2 ≈ 6.4%, M+1 ≈ 2.3%", color: "text-red-400" },
    { el: "Ni", isotopes: [{m: 57.93534, ab: 68.077}, {m: 59.93079, ab: 26.223}, {m: 60.93106, ab: 1.140}, {m: 61.92835, ab: 3.635}, {m: 63.92797, ab: 0.926}], pattern: "M+2 ≈ 38%", color: "text-emerald-400" },
    { el: "Cu", isotopes: [{m: 62.92960, ab: 69.15},  {m: 64.92779, ab: 30.85}],   pattern: "M+2 ≈ 45% — 2.24:1 nisbat", color: "text-amber-400" },
    { el: "Zn", isotopes: [{m: 63.92914, ab: 48.63},  {m: 65.92603, ab: 27.90}, {m: 66.92713, ab: 4.10}, {m: 67.92484, ab: 18.75}], pattern: "5 ta izotop — keng cluster", color: "text-blue-400" },
    { el: "Ag", isotopes: [{m: 106.90509, ab: 51.839}, {m: 108.90475, ab: 48.161}], pattern: "Deyarli 1:1 — klassik dublet", color: "text-slate-300" },
    { el: "Pt", isotopes: [{m: 191.96104, ab: 0.012}, {m: 193.96268, ab: 32.864}, {m: 194.96479, ab: 33.775}, {m: 195.96495, ab: 25.211}, {m: 197.96789, ab: 7.356}], pattern: "4 ta yaqin pik — ¹⁹⁴,¹⁹⁵,¹⁹⁶,¹⁹⁸", color: "text-cyan-300" },
    { el: "Co", isotopes: [{m: 58.93319, ab: 100}], pattern: "Yagona izotop — toza pik", color: "text-blue-500" },
    { el: "Mn", isotopes: [{m: 54.93804, ab: 100}], pattern: "Yagona izotop", color: "text-pink-400" },
    { el: "Au", isotopes: [{m: 196.96654, ab: 100}], pattern: "Yagona izotop", color: "text-yellow-400" },
    { el: "Cr", isotopes: [{m: 49.94604, ab: 4.345}, {m: 51.94051, ab: 83.789}, {m: 52.94065, ab: 9.501}, {m: 53.93888, ab: 2.365}], pattern: "⁵²Cr dominant, M−2 ≈ 5.2%", color: "text-teal-400" },
  ],

  // ─── Fragmentlanish qoidalari (McLafferty, Tureček)
  fragmentationRules: [
    {
      name: "Ketma-ket ligand yo'qolishi",
      formula: "[MLn]⁺ → [MLn−1]⁺ + L → [MLn−2]⁺ + 2L → ...",
      applicable: "Karbonil komplekslar: [Fe(CO)₅]⁺ → [Fe(CO)₄]⁺ → ... → Fe⁺",
      diagnostic: "Har bir bosqichda −28 Da (CO uchun); 5 ta bir xil masofa — 5 ta CO",
      color: "text-cyan-400",
    },
    {
      name: "α-uzilish (α-cleavage)",
      formula: "R−CH₂−X → R• + CH₂=X⁺ yoki R⁺ + •CH₂−X",
      applicable: "Amin, spirt, efir ligandlar",
      diagnostic: "Geteroatomga qo'shni C−C bog'i uziladi",
      color: "text-green-400",
    },
    {
      name: "McLafferty qayta guruhlanishi",
      formula: "γ-H atomi karbonilga o'tadi → alkenning elimintsiyasi",
      applicable: "Karbonil guruhli ligandlar (aseton, β-diketonatlar)",
      diagnostic: "Juft massa fragmenti (odd-electron reordering)",
      color: "text-purple-400",
    },
    {
      name: "Retro-Diels-Alder (RDA)",
      formula: "Sikloheksen halqasi → dien + dienofil",
      applicable: "Ferrosen, arenli komplekslar",
      diagnostic: "C₅H₅ halqasi butun holda ajraladi (m/z 65)",
      color: "text-orange-400",
    },
    {
      name: "Redoks fragmentlanish",
      formula: "[MLn]²⁺ → [MLn]⁺ + e⁻ (elektronni ligandda qoldirib)",
      applicable: "Kuchli LMCT/MLCT xarakterli komplekslar",
      diagnostic: "Zaryad kamayishi kuzatiladi",
      color: "text-red-400",
    },
    {
      name: "Halka ochilishi va ligand almashinishi",
      formula: "[M(chelate)]⁺ → [M(open-chelate)]⁺ → [M]⁺",
      applicable: "Xelat komplekslar (EDTA, acac, en)",
      diagnostic: "Halkaning simmetrik nuqtalarida uzilish",
      color: "text-yellow-400",
    },
  ],

  // ─── HRMS aniqligi va molekulyar formula qidiruvi
  hrmsAccuracy: [
    { instrument: "Kvadrupol",       ppm: "±100–500",     example: "m/z 300 uchun ±0.03–0.15 Da", verdict: "Faqat nominal massa" },
    { instrument: "Ion tutqich",     ppm: "±50–100",      example: "±0.015–0.03 Da",              verdict: "Past aniqlik" },
    { instrument: "TOF (reflektron)", ppm: "±1–5",        example: "±0.0003–0.0015 Da",           verdict: "HRMS — formula tasdiqlash" },
    { instrument: "Q-TOF",           ppm: "±1–3",         example: "±0.0003–0.0009 Da",           verdict: "Zamonaviy standart" },
    { instrument: "Orbitrap",        ppm: "±0.5–1",       example: "±0.00015–0.0003 Da",          verdict: "Gold standard HRMS" },
    { instrument: "FT-ICR (12 T+)",  ppm: "±0.05–0.1",    example: "±0.00002 Da",                 verdict: "Ultra-yuqori aniqlik" },
  ],

  // ─── Kompleks birikmalar uchun m/z hisoblash misollari
  massCalculations: [
    {
      compound: "[Fe(CO)₅]",
      formula: "FeC₅O₅",
      exactMass: "195.9095",
      monoisotopic: "⁵⁶Fe(55.9349) + 5×¹²C(12.0000) + 5×¹⁶O(15.9949) = 195.9094",
      averageMass: "195.90",
      note: "M⁺• = 196 (nominal), 195.9094 (aniq)",
    },
    {
      compound: "[Ru(bpy)₃]²⁺",
      formula: "RuC₃₀H₂₄N₆²⁺",
      exactMass: "285.0538 (z=2)",
      monoisotopic: "¹⁰²Ru(101.9044) + 30×¹²C + 24×¹H(1.00783) + 6×¹⁴N(14.0031) = 570.1224; ÷2 = 285.0612",
      averageMass: "285.16",
      note: "Ikki zaryadli — izotop piklari 0.5 Da masofada!",
    },
    {
      compound: "sis-[Pt(NH₃)₂Cl₂]",
      formula: "PtN₂H₆Cl₂",
      exactMass: "298.9915 (¹⁹⁵Pt + 2×³⁵Cl)",
      monoisotopic: "195Pt(194.9648) + 2×N(14.0031) + 6×H(1.0078) + 2×³⁵Cl(34.9689) = 298.9601",
      averageMass: "300.05",
      note: "Pt (4 izotop) × Cl₂ (3 kombinatsiya) = 12 pik cluster!",
    },
  ],

  // ─── Halqa va π-bog'lar soni (RDBE) formulasi
  rdbe: {
    formula: "RDBE = C − H/2 − X/2 + N/2 + 1",
    explanation: "C₄H₄ uchun RDBE = 4 − 2 + 1 = 3 (siklobutadien: 2 π + 1 halqa)",
    note: "Kompleks birikmalarda metall M ni H₄ kabi hisoblash mumkin (koordinatsion boglar hisobga olinadi)",
  },
}

export default function MassSpektrometriya() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [activeTab, setActiveTab] = useState("nazariya")
  const [selectedIonization, setSelectedIonization] = useState("ESI")
  const [selectedElement, setSelectedElement] = useState("Cl")

  const currentIonization = useMemo(
    () => MASS_DATA.ionizationMethods.find(m => m.abbr === selectedIonization),
    [selectedIonization]
  )

  const currentElement = useMemo(
    () => MASS_DATA.isotopes.find(e => e.el === selectedElement),
    [selectedElement]
  )

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-purple-950/80 border-b border-[var(--v3-chiziq)]">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-4">
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg transition-colors">
            ← Tahlil usullari
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
               Mass-spektrometriya
            </h1>
            <p className="text-purple-400 text-xs md:text-sm">
              Molekulyar massa • Izotopik taqsimot • Fragmentatsiya • HRMS • m/z fizikasi
            </p>
          </div>
          <span className="hidden md:inline-block bg-pink-600/20 text-pink-300 border border-pink-600/40 px-3 py-1 rounded-full text-xs font-mono">
            Nobel'2002 (Fenn & Tanaka)
          </span>
        </div>
      </header>

      {/* ═══ BIRIKMALAR KATALOGI KARTASI ═══ */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <Link 
          href="/ilmiy/tahlil/mass/birikmalar"
          className="group block bg-gradient-to-r from-pink-900/40 via-fuchsia-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6 hover:border-pink-400/70 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20"
        >
          <div className="flex items-center gap-5">
            <div className="text-6xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"></div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
                Birikmalarning mass-spektr tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-2 group-hover:text-purple-200 transition-colors leading-relaxed">
                Kompleks birikmalarning to'liq mass-spektr talqini: molekulyar ion aniqlash, 
                ketma-ket fragmentatsiya yo'llari, izotopik cluster simulyatsiyasi va HRMS orqali 
                molekulyar formula tasdiqlash — har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-4xl text-pink-400 group-hover:translate-x-2 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="bg-pink-600/20 text-pink-300 border border-pink-600/30 px-3 py-1 rounded-full text-xs">20+ ta birikma</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Izotopik cluster</span>
            <span className="bg-blue-600/20 text-blue-300 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Fragmentatsiya sxemasi</span>
            <span className="bg-yellow-600/20 text-yellow-300 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">HRMS ppm</span>
            <span className="bg-green-600/20 text-green-300 border border-green-600/30 px-3 py-1 rounded-full text-xs">m/z hisob-kitobi</span>
            <span className="bg-cyan-600/20 text-cyan-300 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">ESI+/ESI− rejimlar</span>
          </div>
        </Link>
      </section>

      {/* ═══ TAB NAVIGATSIYA ═══ */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex flex-wrap gap-2 border-b border-[var(--v3-chiziq)] pb-2">
          {[
            { id: "nazariya",     label: "📖 Nazariy asoslar" },
            { id: "ionlash",      label: " Ionlashtirish" },
            { id: "analizator",   label: " Mass-analizatorlar" },
            { id: "izotop",       label: " Izotopik taqsimot" },
            { id: "fragmentatsiya", label: "💥 Fragmentatsiya" },
            { id: "hrms",         label: " HRMS aniqligi" },
            { id: "misollar",     label: " m/z hisoblash" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-pink-600/30 text-pink-300 border-b-2 border-pink-400"
                  : "text-purple-400 hover:text-purple-200 hover:bg-purple-800/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ KONTENT ═══ */}
      <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ─── 1. NAZARIY ASOSLAR ─── */}
        {activeTab === "nazariya" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/40 border border-[var(--v3-chiziq)] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">📖 Mass-spektrometriyaning fizik asosi</h2>
              <p className="text-purple-200 text-lg leading-relaxed mb-6">
                <strong className="text-pink-400">Mass-spektrometriya</strong> — moddaning atom-molekulyar 
                tarkibini <strong className="text-pink-400">ionlarning massa-zaryad nisbati</strong> (m/z) 
                bo'yicha aniqlaydigan analitik usul. Har qanday mass-spektrometr uchta asosiy bosqichdan iborat:
                <strong className="text-yellow-400"> ionlashtirish</strong> → 
                <strong className="text-yellow-400"> massalarga ajratish</strong> → 
                <strong className="text-yellow-400"> aniqlash</strong>. 
                Ilk mass-spektrograf <em>J. J. Thomson</em> tomonidan 1912-yilda yaratilgan; <em>F. W. Aston</em> 
                buning uchun 1922-yilda Nobel mukofoti bilan taqdirlandi. Kompleks birikmalar kimyosida 
                bu usul <strong className="text-pink-400">molekulyar identifikatsiyaning oltin standarti</strong>ga aylandi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-950/60 border border-purple-700/40 rounded-xl p-5">
                  <h3 className="text-yellow-400 font-bold mb-3">🔑 Asosiy fizik tenglamalar</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-black/40 p-3 rounded-lg border border-[var(--v3-chiziq)]">
                      <p className="text-cyan-400 mb-1">Lorentz kuchi:</p>
                      <p className="text-white">F = q(E + v × B)</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-[var(--v3-chiziq)]">
                      <p className="text-cyan-400 mb-1">Kinetik energiya (tezlashuv):</p>
                      <p className="text-white">½mv² = zeV  →  v = √(2zeV/m)</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-[var(--v3-chiziq)]">
                      <p className="text-cyan-400 mb-1">Magnit sektor m/z:</p>
                      <p className="text-white">m/z = (r²B²e) / (2V)</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-[var(--v3-chiziq)]">
                      <p className="text-cyan-400 mb-1">Rezolyutsiya (FWHM):</p>
                      <p className="text-white">R = m / Δm</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-[var(--v3-chiziq)]">
                      <p className="text-cyan-400 mb-1">ppm xatosi:</p>
                      <p className="text-white">Δppm = (m<sub>obs</sub> − m<sub>calc</sub>)/m<sub>calc</sub> × 10⁶</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-950/60 border border-purple-700/40 rounded-xl p-5">
                  <h3 className="text-yellow-400 font-bold mb-3"> Massa turlari (aniqliklar iyerarxiyasi)</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="border-l-4 border-red-400 pl-3">
                      <p className="text-red-300 font-bold">Nominal massa</p>
                      <p className="text-purple-300">Butun sonli: H=1, C=12, N=14, O=16. Past aniqlikdagi asboblarda ishlatiladi.</p>
                    </li>
                    <li className="border-l-4 border-yellow-400 pl-3">
                      <p className="text-yellow-300 font-bold">O'rtacha (average) massa</p>
                      <p className="text-purple-300">Barcha izotoplarning tabiiy o'rtachasi: C = 12.011. Molar massa bilan bir xil.</p>
                    </li>
                    <li className="border-l-4 border-green-400 pl-3">
                      <p className="text-green-300 font-bold">Monoizotopik massa</p>
                      <p className="text-purple-300">Faqat eng ko'p tarqalgan izotoplar: ¹H, ¹²C, ¹⁴N, ¹⁶O. HRMS ishlatadi.</p>
                    </li>
                    <li className="border-l-4 border-cyan-400 pl-3">
                      <p className="text-cyan-300 font-bold">Aniq (exact) massa</p>
                      <p className="text-purple-300">Nazariy hisoblangan (4–6 xona): ¹²C = 12.00000, ¹H = 1.00783. HRMS ma'lumotlari bilan solishtiriladi.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Halqa+π formulasi */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/40 border border-indigo-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">🧮 Halqa va π-bog'lar soni (RDBE — Ring + Double Bond Equivalents)</h3>
              <p className="text-purple-200 mb-4 leading-relaxed">
                HRMS orqali topilgan molekulyar formuladan <strong className="text-cyan-400">to'yinmaganlik darajasi</strong>ni 
                (halqalar + qo'shbog'lar sonini) hisoblash mumkin. Bu kompleks birikmaning struktura taxminini tekshirishda hal qiluvchi ahamiyatga ega.
              </p>
              <div className="bg-black/50 rounded-xl p-5 border border-indigo-700/30 font-mono">
                <p className="text-2xl text-cyan-400 text-center mb-2">
                  RDBE = C − H/2 − X/2 + N/2 + 1
                </p>
                <p className="text-purple-300 text-sm text-center">
                  (C — uglerod, H — vodorod, X — galogenlar, N — azot)
                </p>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-800/40">
                  <p className="text-yellow-300 font-bold">Benzol (C₆H₆)</p>
                  <p className="text-purple-300">RDBE = 6 − 3 + 1 = <span className="text-cyan-400 font-bold">4</span> (3π + 1 halqa) ✓</p>
                </div>
                <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-800/40">
                  <p className="text-yellow-300 font-bold">bpy (C₁₀H₈N₂)</p>
                  <p className="text-purple-300">RDBE = 10 − 4 + 1 + 1 = <span className="text-cyan-400 font-bold">8</span> (2 halqa + 6π) ✓</p>
                </div>
                <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-800/40">
                  <p className="text-yellow-300 font-bold">Ferrosen (C₁₀H₁₀Fe)</p>
                  <p className="text-purple-300">RDBE = 10 − 5 + 1 = <span className="text-cyan-400 font-bold">6</span> (2 Cp halqa + 4π koordinatsion)</p>
                </div>
              </div>
            </div>

            {/* Azot qoidasi */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-300 mb-3"> Azot qoidasi (Nitrogen Rule)</h3>
              <p className="text-purple-200 leading-relaxed">
                Agar organik molekulada <strong className="text-emerald-400">toq sonda N atom</strong> bo'lsa, 
                uning nominal molekulyar massasi ham <strong className="text-emerald-400">toq son</strong> bo'ladi. 
                Bu qoida N sonini tez baholash uchun ishlatiladi. Kompleks birikmalarda ammiakli komplekslar ([Co(NH₃)₆]³⁺, 
                [Ni(en)₃]²⁺) uchun ham amal qiladi — masalan, [Co(NH₃)₆]Cl₃ da 6 ta N (juft) → M = 267 (toq bo'lmaydi, 
                lekin Cl ekvivalentini hisobga olish kerak).
              </p>
            </div>
          </div>
        )}

        {/* ─── 2. IONLASHTIRISH USULLARI ─── */}
        {activeTab === "ionlash" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="v3-panel-karta p-8">
              <h2 className="text-2xl font-bold text-white mb-4"> Ionlashtirish usullari</h2>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Ionlashtirish — mass-spektrometriyaning eng muhim bosqichi: neytral molekulani gaz fazasidagi ionga aylantirish.
                Ikki asosiy toifa: <strong className="text-cyan-400">yumshoq (soft)</strong> — molekulyar ionni saqlaydi (ESI, MALDI, APCI);
                <strong className="text-orange-400"> qattiq (hard)</strong> — kuchli fragmentlanish beradi (EI, ICP).
                Kompleks birikmalar uchun 2026-yil holatida <strong className="text-pink-400">ESI ~90%</strong> hollarda tanlanadi.
              </p>

              {/* Ionlashtirish tanlash tugmalari */}
              <div className="flex flex-wrap gap-2 mb-6">
                {MASS_DATA.ionizationMethods.map(m => (
                  <button
                    key={m.abbr}
                    onClick={() => setSelectedIonization(m.abbr)}
                    className={`px-4 py-2 rounded-lg font-mono font-bold text-sm transition-all ${
                      selectedIonization === m.abbr
                        ? "bg-pink-600 text-white shadow-lg shadow-pink-500/40 scale-105"
                        : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60 border border-[var(--v3-chiziq)]"
                    }`}
                  >
                    {m.abbr}
                  </button>
                ))}
              </div>

              {/* Tanlangan usul batafsili */}
              {currentIonization && (
                <div className="bg-gradient-to-br from-purple-950/80 to-slate-950/80 border border-purple-700/40 rounded-xl p-6">
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className={`text-2xl font-bold ${currentIonization.color}`}>
                      {currentIonization.abbr} — {currentIonization.name}
                    </h3>
                    <span className="bg-purple-800/50 text-purple-300 px-3 py-1 rounded-full text-xs">
                      {currentIonization.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <p className="text-yellow-400 font-bold">Kashfiyotchi / yil:</p>
                        <p className="text-purple-200">{currentIonization.inventor}</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold">Energiya / kuchlanish:</p>
                        <p className="text-purple-200 font-mono">{currentIonization.energy}</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold">Mexanizm:</p>
                        <p className="text-purple-200">{currentIonization.mechanism}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-3">
                        <p className="text-green-400 font-bold mb-1">✓ Afzalliklar</p>
                        <p className="text-purple-200">{currentIonization.pros}</p>
                      </div>
                      <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                        <p className="text-red-400 font-bold mb-1">✗ Kamchiliklari</p>
                        <p className="text-purple-200">{currentIonization.cons}</p>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3">
                        <p className="text-blue-400 font-bold mb-1"> Qo'llanishi</p>
                        <p className="text-purple-200">{currentIonization.applicability}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3">
                    <p className="text-yellow-300 text-sm">
                      <strong>Spektr xarakteri:</strong> {currentIonization.spectrumType}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ESI ni chuqurroq tushuntirish */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-700/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-300 mb-3">🌊 ESI mexanizmi batafsil (Fenn nazariyasi)</h3>
              <ol className="space-y-2 text-purple-200 text-sm list-decimal pl-6">
                <li><strong className="text-cyan-400">Eritma sprey:</strong> namuna (10⁻⁶–10⁻⁴ M) kapillyar orqali 3–5 kV kuchlanishda purkaladi</li>
                <li><strong className="text-cyan-400">Taylor konusi:</strong> zaryadlangan eritma konus shakliga keladi (Rayleigh chegarasi)</li>
                <li><strong className="text-cyan-400">Coulomb parchalanishi:</strong> tomchi q² ≥ 8π²ε₀γr³ da kichik tomchilarga bo'linadi</li>
                <li><strong className="text-cyan-400">Erituvchi bug'lanishi:</strong> N₂ oqimida erituvchi to'liq bug'lanadi</li>
                <li><strong className="text-cyan-400">Ion evaporatsiyasi (IEM):</strong> kichik ionlar to'g'ridan gaz fazasiga chiqadi (Iribarne-Thomson)</li>
                <li><strong className="text-cyan-400">Zaryad qoldiq modeli (CRM):</strong> katta ionlar erituvchi to'liq ketguncha zaryadli qoladi (Dole)</li>
              </ol>
            </div>
          </div>
        )}

        {/* ─── 3. MASS-ANALIZATORLAR ─── */}
        {activeTab === "analizator" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="v3-panel-karta p-8">
              <h2 className="text-2xl font-bold text-white mb-4"> Mass-analizatorlar — fizik prinsiplar</h2>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Mass-analizator — ionlarni m/z bo'yicha ajratadigan qurilma. Har birining o'ziga xos 
                <strong className="text-yellow-400"> rezolyutsiyasi (R = m/Δm)</strong>, aniqligi (ppm) va massa diapazoni bor.
                2026-yil holatida <strong className="text-pink-400">Orbitrap va Q-TOF</strong> HRMS uchun etakchi tanlov.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {MASS_DATA.analyzers.map((a, i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-950/60 to-blue-950/60 border border-purple-700/40 rounded-xl p-5 hover:border-pink-500/50 transition-all hover:transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-pink-400">{a.name}</h3>
                      <span className="bg-purple-800/50 text-xs text-purple-300 px-2 py-0.5 rounded">
                        R ≈ {a.resolution.split("≈")[1] || a.resolution}
                      </span>
                    </div>
                    <p className="text-purple-400 text-xs italic mb-3">Ixtirochi: {a.inventor}</p>
                    <p className="text-purple-200 text-sm leading-relaxed mb-3">
                      <strong className="text-cyan-400">Prinsip:</strong> {a.principle}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-black/30 rounded p-2">
                        <p className="text-yellow-300">Rezolyutsiya:</p>
                        <p className="text-white font-mono">{a.resolution}</p>
                      </div>
                      <div className="bg-black/30 rounded p-2">
                        <p className="text-yellow-300">m/z diapazon:</p>
                        <p className="text-white font-mono">{a.massRange}</p>
                      </div>
                      <div className="bg-black/30 rounded p-2">
                        <p className="text-yellow-300">Aniqlik:</p>
                        <p className="text-white font-mono">{a.accuracy}</p>
                      </div>
                      <div className="bg-black/30 rounded p-2">
                        <p className="text-yellow-300">Tezlik:</p>
                        <p className="text-white">{a.speed}</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-blue-900/20 border border-blue-700/30 rounded-lg p-2 text-xs">
                      <p className="text-blue-300"><strong>Qo'llanishi:</strong> {a.useCase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── 4. IZOTOPIK TAQSIMOT ─── */}
        {activeTab === "izotop" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="v3-panel-karta p-8">
              <h2 className="text-2xl font-bold text-white mb-4"> Izotopik taqsimot — elementning "barmoq izi"</h2>
              <p className="text-purple-200 mb-4 leading-relaxed">
                Har bir elementning izotoplari tabiatda ma'lum <strong className="text-yellow-400">nisbatda</strong> uchraydi 
                (NIST 2021 ma'lumotlari). Kompleks birikmaning mass-spektrida bu nisbatlar <strong className="text-yellow-400">saqlanadi</strong> — 
                shu bois izotop cluster metallni <strong className="text-pink-400">bir qarashda</strong> aniqlash imkonini beradi.
              </p>

              <div className="bg-cyan-900/20 border border-cyan-700/40 rounded-xl p-4 mb-6">
                <p className="text-cyan-300 text-sm font-mono">
                  <strong>Poyavlanish ehtimoli (multinomial):</strong> P(n₁,n₂,…) = N!/(n₁!·n₂!·…) × p₁ⁿ¹ · p₂ⁿ² · …
                </p>
                <p className="text-purple-300 text-xs mt-1">
                  n ta atomda k-nchi izotopni topish ehtimoli — cluster shakli shu binomial/multinomial taqsimotdan kelib chiqadi.
                </p>
              </div>

              {/* Element tanlash */}
              <div className="flex flex-wrap gap-2 mb-6">
                {MASS_DATA.isotopes.map(e => (
                  <button
                    key={e.el}
                    onClick={() => setSelectedElement(e.el)}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-all ${
                      selectedElement === e.el
                        ? "bg-pink-600 text-white shadow-lg shadow-pink-500/40 scale-110"
                        : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60 border border-[var(--v3-chiziq)]"
                    }`}
                  >
                    {e.el}
                  </button>
                ))}
              </div>

              {/* Tanlangan element */}
              {currentElement && (
                <div className="bg-gradient-to-br from-slate-950 to-purple-950/80 border border-[var(--v3-chiziq)] rounded-xl p-6">
                  <h3 className={`text-3xl font-bold mb-4 ${currentElement.color}`}>{currentElement.el}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-purple-700">
                          <th className="py-2 px-3 text-purple-300">Izotop</th>
                          <th className="py-2 px-3 text-purple-300">Aniq massa (u)</th>
                          <th className="py-2 px-3 text-purple-300">Tabiiy tarqalish (%)</th>
                          <th className="py-2 px-3 text-purple-300">Nisbiy (asosiyga %)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentElement.isotopes.map((iso, i) => {
                          const maxAb = Math.max(...currentElement.isotopes.map(x => x.ab))
                          const relative = ((iso.ab / maxAb) * 100).toFixed(2)
                          return (
                            <tr key={i} className="border-b border-purple-800/30">
                              <td className="py-2 px-3 font-mono text-yellow-300">
                                {Math.round(iso.m)}{currentElement.el}
                              </td>
                              <td className="py-2 px-3 font-mono text-cyan-300">{iso.m.toFixed(5)}</td>
                              <td className="py-2 px-3 text-white">{iso.ab}</td>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-purple-950/50 rounded-full h-3 overflow-hidden">
                                    <div 
                                      className="bg-gradient-to-r from-pink-500 to-purple-400 h-full"
                                      style={{ width: `${relative}%` }}
                                    />
                                  </div>
                                  <span className="text-purple-300 font-mono text-xs w-14">{relative}%</span>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3">
                    <p className="text-yellow-300 text-sm">
                      <strong>Spektrda ko'rinishi:</strong> {currentElement.pattern}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostik xulosalar */}
            <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-700/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-pink-300 mb-4"> Klassik diagnostik naqshlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-green-400 font-bold">Cl₁ → 3:1 dublet (M, M+2)</p>
                  <p className="text-purple-300 text-xs">³⁵Cl:³⁷Cl = 75.76:24.24</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-orange-500">
                  <p className="text-orange-400 font-bold">Br₁ → 1:1 dublet (M, M+2)</p>
                  <p className="text-purple-300 text-xs">⁷⁹Br:⁸¹Br = 50.69:49.31</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-cyan-500">
                  <p className="text-cyan-400 font-bold">Cu → 2.24:1 dublet</p>
                  <p className="text-purple-300 text-xs">⁶³Cu:⁶⁵Cu = 69.15:30.85</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-slate-400">
                  <p className="text-slate-300 font-bold">Ag → 1.08:1 dublet (deyarli teng)</p>
                  <p className="text-purple-300 text-xs">¹⁰⁷Ag:¹⁰⁹Ag = 51.84:48.16</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-red-500">
                  <p className="text-red-400 font-bold">Fe → M−2 pik (⁵⁴Fe, 6.4%)</p>
                  <p className="text-purple-300 text-xs">⁵⁶Fe dominant (91.75%)</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-cyan-300">
                  <p className="text-cyan-300 font-bold">Pt → 4 ta yaqin pik</p>
                  <p className="text-purple-300 text-xs">¹⁹⁴,¹⁹⁵,¹⁹⁶,¹⁹⁸ ≈ 33:34:25:7</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-blue-400 font-bold">Co, Mn, Au → toza pik</p>
                  <p className="text-purple-300 text-xs">Yagona izotop — cluster yo'q</p>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3 border-l-4 border-yellow-500">
                  <p className="text-yellow-400 font-bold">Cl₂ → 9:6:1 uchlik</p>
                  <p className="text-purple-300 text-xs">M, M+2, M+4 — sisplatin patternidan</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 5. FRAGMENTATSIYA ─── */}
        {activeTab === "fragmentatsiya" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="v3-panel-karta p-8">
              <h2 className="text-2xl font-bold text-white mb-4">💥 Fragmentatsiya qoidalari</h2>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Molekulyar ion parchalanib, tarkibiy fragmentlar hosil qiladi. <strong className="text-pink-400">McLafferty va Tureček</strong> 
                asos solgan qoidalar organik ligandlar uchun, koordinatsion kimyoda esa <strong className="text-pink-400">Henderson-McIndoe</strong> 
                metodologiyasi qo'llaniladi. Har bir uzilish <strong className="text-yellow-400">termodinamik (bog' energiyasi)</strong> va 
                <strong className="text-yellow-400"> kinetik (barcha holatlar)</strong> omillar bilan boshqariladi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MASS_DATA.fragmentationRules.map((r, i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-950/70 to-slate-950/70 border border-purple-700/40 rounded-xl p-5 hover:border-pink-500/50 transition-all">
                    <h3 className={`text-lg font-bold mb-2 ${r.color}`}>{r.name}</h3>
                    <div className="bg-black/40 rounded-lg p-3 mb-3 font-mono text-xs text-cyan-300">
                      {r.formula}
                    </div>
                    <p className="text-purple-200 text-sm mb-2">
                      <strong className="text-yellow-400">Qo'llanadi:</strong> {r.applicable}
                    </p>
                    <p className="text-purple-300 text-xs italic">
                      <strong>Diagnostik:</strong> {r.diagnostic}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bog' energiyalari */}
            <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-700/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-3">🔗 Kompleks birikmalarda M−L bog' energiyalari (fragmentatsiyaning termodinamik asosi)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-red-700/50">
                    <tr>
                      <th className="text-left py-2 px-3 text-red-300">M−L bog'i</th>
                      <th className="text-left py-2 px-3 text-red-300">D (kJ/mol)</th>
                      <th className="text-left py-2 px-3 text-red-300">Fragmentatsiyada</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    {[
                      ["M−CO (o'rtacha)", "100–200", "Ketma-ket CO yo'qolishi (Fe(CO)₅)"],
                      ["M−NH₃", "80–150", "Ammiakli komplekslar (Werner tipi)"],
                      ["M−H₂O", "40–100", "Akvakomplekslar — birinchi navbatda ajraladi"],
                      ["M−Cl", "200–350", "Kuchli — Cl LMCT bilan mustahkam"],
                      ["M−CN", "300–500", "Juda kuchli — siyanid komplekslar (K₃[Fe(CN)₆])"],
                      ["M−Cp (η⁵-C₅H₅)", "400–500", "Ferrosen — halqa butun ajraladi"],
                      ["M−bpy", "250–350", "Xelat effekt — barqarorroq"],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-red-800/20">
                        <td className="py-2 px-3 font-mono text-yellow-300">{row[0]}</td>
                        <td className="py-2 px-3 font-mono text-cyan-300">{row[1]}</td>
                        <td className="py-2 px-3">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── 6. HRMS ANIQLIGI ─── */}
        {activeTab === "hrms" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="v3-panel-karta p-8">
              <h2 className="text-2xl font-bold text-white mb-4"> HRMS — Yuqori aniqlikdagi mass-spektrometriya</h2>
              <p className="text-purple-200 mb-6 leading-relaxed">
                <strong className="text-cyan-400">HRMS (High-Resolution Mass Spectrometry)</strong> — mass aniqligi 
                <strong className="text-cyan-400"> &lt; 5 ppm</strong> bo'lgan usullar. Bu darajada <strong className="text-yellow-400">molekulyar formula 
                bevosita aniqlanadi</strong>: bir xil nominal massa (masalan m/z=300) da ko'plab formulalar bo'lishi mumkin, 
                lekin aniq massa (298.9601 vs 300.1234) ularni ajratib beradi. IUPAC 2013 tavsiyasiga ko'ra, jurnal maqolalarida 
                yangi kompleks birikma <strong className="text-pink-400">HRMS bilan tasdiqlanmasa</strong> chop etilmaydi.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-purple-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-purple-300">Asbob turi</th>
                      <th className="text-left py-3 px-4 text-purple-300">Aniqlik (ppm)</th>
                      <th className="text-left py-3 px-4 text-purple-300">m/z ~300 uchun</th>
                      <th className="text-left py-3 px-4 text-purple-300">Xulosa</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    {MASS_DATA.hrmsAccuracy.map((row, i) => (
                      <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-yellow-300">{row.instrument}</td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{row.ppm}</td>
                        <td className="py-3 px-4 font-mono text-white">{row.example}</td>
                        <td className="py-3 px-4">{row.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* HRMS misoli */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border border-emerald-700/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-300 mb-3"> HRMS misoli: m/z = 300 dagi formulalar</h3>
              <p className="text-purple-200 mb-4 text-sm">
                Nominal m/z=300 da 500+ dan ortiq molekulyar formula bo'lishi mumkin. HRMS ularni ajratadi:
              </p>
              <div className="bg-black/50 rounded-xl overflow-hidden">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-emerald-900/40">
                    <tr>
                      <th className="py-2 px-3 text-left text-emerald-300">Formula</th>
                      <th className="py-2 px-3 text-left text-emerald-300">Aniq massa</th>
                      <th className="py-2 px-3 text-left text-emerald-300">Farq (mDa)</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    <tr className="border-b border-emerald-800/20"><td className="py-2 px-3">Pt(NH₃)₂Cl₂ (sisplatin)</td><td className="py-2 px-3 text-cyan-300">298.9601</td><td className="py-2 px-3">baseline</td></tr>
                    <tr className="border-b border-emerald-800/20"><td className="py-2 px-3">C₂₀H₃₈O</td><td className="py-2 px-3 text-cyan-300">294.2923</td><td className="py-2 px-3 text-red-400">−4668</td></tr>
                    <tr className="border-b border-emerald-800/20"><td className="py-2 px-3">C₁₆H₂₀N₄O</td><td className="py-2 px-3 text-cyan-300">284.1637</td><td className="py-2 px-3 text-red-400">−14796</td></tr>
                    <tr><td className="py-2 px-3">C₁₀H₁₀Fe·C₆H₆ (ferrosen-benzol)</td><td className="py-2 px-3 text-cyan-300">264.0232</td><td className="py-2 px-3 text-red-400">baseline</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-emerald-300 text-xs mt-3">
                 Orbitrap aniqligi (±0.3 mDa) da bu formulalar bir-biridan minglab mDa masofa bilan ajraladi.
              </p>
            </div>
          </div>
        )}

        {/* ─── 7. m/z HISOBLASH MISOLLARI ─── */}
        {activeTab === "misollar" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="v3-panel-karta p-8">
              <h2 className="text-2xl font-bold text-white mb-4"> m/z hisoblash — amaliy misollar</h2>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Har bir kompleks birikma uchun uchta massa hisoblanadi: <strong className="text-yellow-400">nominal</strong>, 
                <strong className="text-yellow-400"> monoizotopik (aniq)</strong> va <strong className="text-yellow-400">o'rtacha (molar)</strong>. 
                HRMS bilan solishtirish monoizotopik qiymatga asoslanadi.
              </p>

              <div className="space-y-5">
                {MASS_DATA.massCalculations.map((c, i) => (
                  <div key={i} className="bg-gradient-to-r from-purple-950/70 to-slate-950/70 border border-purple-700/40 rounded-xl p-5">
                    <div className="flex flex-wrap items-baseline justify-between mb-3 gap-2">
                      <h3 className="text-xl font-bold text-pink-400 font-mono">{c.compound}</h3>
                      <span className="bg-purple-800/50 text-purple-300 px-3 py-1 rounded text-xs font-mono">{c.formula}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div className="bg-black/40 rounded-lg p-3 border border-cyan-700/30">
                        <p className="text-cyan-400 text-xs font-bold">Aniq massa (HRMS)</p>
                        <p className="text-white font-mono text-lg">{c.exactMass}</p>
                      </div>
                      <div className="bg-black/40 rounded-lg p-3 border border-yellow-700/30">
                        <p className="text-yellow-400 text-xs font-bold">O'rtacha massa</p>
                        <p className="text-white font-mono text-lg">{c.averageMass}</p>
                      </div>
                      <div className="bg-black/40 rounded-lg p-3 border border-pink-700/30">
                        <p className="text-pink-400 text-xs font-bold">Izoh</p>
                        <p className="text-white text-xs">{c.note}</p>
                      </div>
                    </div>
                    <div className="bg-slate-950/70 border border-purple-800/40 rounded-lg p-3">
                      <p className="text-purple-400 text-xs font-bold mb-1">Monoizotopik hisob:</p>
                      <p className="text-purple-200 font-mono text-xs">{c.monoisotopic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adduktlar */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-700/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">➕ ESI da tipik adduktlar (M ga qo'shiladigan qiymatlar)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {[
                  ["[M+H]⁺", "+1.0078"],
                  ["[M+Na]⁺", "+22.9898"],
                  ["[M+K]⁺", "+38.9637"],
                  ["[M+NH₄]⁺", "+18.0344"],
                  ["[M+H+MeCN]⁺", "+42.0344"],
                  ["[M−H]⁻", "−1.0078"],
                  ["[M+Cl]⁻", "+34.9689"],
                  ["[M+HCOO]⁻", "+44.9977"],
                ].map((a, i) => (
                  <div key={i} className="bg-blue-950/40 border border-blue-800/30 rounded-lg p-2 text-center">
                    <p className="text-cyan-300 font-mono font-bold">{a[0]}</p>
                    <p className="text-purple-300 font-mono text-xs">{a[1]} Da</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </section>

      {/* ═══ MANBALAR ═══ */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-slate-900/80 to-purple-950/80 border border-purple-800/40 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">📚 Ilmiy manbalar</h2>
          <ul className="space-y-2 text-purple-300 text-sm">
            <li>• <strong className="text-yellow-300">J. H. Gross</strong> — <em>Mass Spectrometry: A Textbook</em> (3rd ed., Springer, 2017)</li>
            <li>• <strong className="text-yellow-300">E. de Hoffmann, V. Stroobant</strong> — <em>Mass Spectrometry: Principles and Applications</em> (3rd ed., Wiley)</li>
            <li>• <strong className="text-yellow-300">F. W. McLafferty, F. Tureček</strong> — <em>Interpretation of Mass Spectra</em> (4th ed., University Science Books)</li>
            <li>• <strong className="text-yellow-300">W. Henderson, J. S. McIndoe</strong> — <em>Mass Spectrometry of Inorganic and Organometallic Compounds</em> (Wiley, 2005)</li>
            <li>• <strong className="text-yellow-300">R. A. W. Johnstone, M. E. Rose</strong> — <em>Mass Spectrometry for Chemists and Biochemists</em> (2nd ed., CUP)</li>
            <li>• <strong className="text-yellow-300">IUPAC Gold Book</strong> — Mass spectrometry terminology (2013 tavsiyalari)</li>
            <li>• <strong className="text-yellow-300">NIST 2021</strong> — Atomic Weights and Isotopic Compositions (CODATA)</li>
            <li>• <strong className="text-yellow-300">J. B. Fenn</strong> — Nobel Lecture (2002, ESI kashfi)</li>
            <li>• <strong className="text-yellow-300">K. Tanaka</strong> — Nobel Lecture (2002, MALDI kashfi)</li>
            <li>• <strong className="text-yellow-300">M. Yamashita, J. B. Fenn</strong> — <em>J. Phys. Chem.</em> 88 (1984) 4451</li>
            <li>• <strong className="text-yellow-300">A. G. Marshall</strong> — FT-ICR: <em>Anal. Chem.</em> 74 (2002) 252A</li>
            <li>• <strong className="text-yellow-300">A. Makarov</strong> — Orbitrap: <em>Anal. Chem.</em> 72 (2000) 1156</li>
            <li>• <strong className="text-yellow-300">W. Paul</strong> — Nobel Lecture (1989, kvadrupol va ion tutqich)</li>
          </ul>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>

    </div>
  )
}
