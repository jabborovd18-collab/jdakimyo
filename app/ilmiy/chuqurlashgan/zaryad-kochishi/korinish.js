"use client"
import Link from "next/link"
import { useState } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// ZARYAD KO'CHISHI (CHARGE TRANSFER) — CHUQURLASHGAN MAVZU
// Manbalar: Mulliken (1950s, Nobel 1966), Taube (Nobel 1983),
//           Robin-Day (1967), Grätzel (1991), Lever (1968)
//  ═══════════════════════════════════════════════════════════════════════════════

const CT_DATA = {
  //  ═══════════════════════════════════════════════════════════════
  // ASOSIY TUSHUNCHA
  //  ═══════════════════════════════════════════════════════════════
  concept: {
    definition: "Zaryad ko'chishi (Charge Transfer, CT) — koordinatsion birikmalarda elektronning bir molekulyar orbitaldan boshqasiga ko'chishi natijasida yuzaga keladigan elektron o'tish",
    fullName: "Charge Transfer Transitions",
    keyFeature: "CT o'tishlar d−d o'tishlardan tubdan farq qiladi — ular Laporte bo'yicha ruxsat etilgan, intensivligi yuqori (ε ≈ 10³−10⁵) va erituvchi qutbliligiga kuchli bog'liq",
    comparison: "d−d o'tishlar: Laporte ta'qiqlangan, ε ≈ 0.1-100, kuchsiz rang",
    molarAbsorptivity: "10³ − 10⁵ M⁻¹sm⁻¹",
    spectralRegion: "UV-Vis-NIR (200-2500 nm)",
    intensityFactor: "100-1000× intensivroq (d−d ga nisbatan)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // CT O'TISH TURLARI
  //  ═══════════════════════════════════════════════════════════════
  types: [
    {
      code: "LMCT",
      name: "Ligand → Metall",
      fullName: "Ligand-to-Metal Charge Transfer",
      description: "π/σ-donor ligandlardan yuqori oksidlanish darajasidagi metall d-orbitallariga elektron ko'chishi",
      conditions: "Yuqori oksidlanish darajasi (Mn⁷⁺, Cr⁶⁺, V⁵⁺) + kuchli donor ligand (O²⁻, Cl⁻, S²⁻)",
      color: "red",
      colorClass: "bg-red-600/10 border-red-500/30",
      textColor: "text-red-400",
      examples: ["MnO₄⁻ (to'q binafsha, 520 nm)", "CrO₄²⁻ (sariq, 370 nm)", "FeCl₄⁻ (sariq-jigar)", "[Fe(SCN)]²⁺ (to'q qizil)"],
      energyFormula: "hν = E(d) − E(L)",
      trend: "Oksidlanish darajasi ↑ → energiya ↓ (qizil siljish)",
      link: "/ilmiy/chuqurlashgan/zaryad-kochishi/lmct"
    },
    {
      code: "MLCT",
      name: "Metall → Ligand",
      fullName: "Metal-to-Ligand Charge Transfer",
      description: "To'ldirilgan metall d-orbitallardan π-akseptor ligand π* orbitallariga elektron ko'chishi",
      conditions: "Past oksidlanish darajasi (Ru²⁺, Re⁺, Ir³⁺) + π-akseptor ligand (bpy, phen, CO)",
      color: "blue",
      colorClass: "bg-blue-600/10 border-blue-500/30",
      textColor: "text-blue-400",
      examples: ["[Ru(bpy)₃]²⁺ (to'q sariq, 452 nm)", "[Re(bpy)(CO)₃Cl] (sariq, 370 nm)", "[Ir(ppy)₃] (yashil emissiya)"],
      energyFormula: "hν = E(π*) − E(d)",
      trend: "Oksidlanish darajasi ↓ → energiya ↓ (qizil siljish)",
      link: "/ilmiy/chuqurlashgan/zaryad-kochishi/mlct"
    },
    {
      code: "MMCT",
      name: "Metall → Metall",
      fullName: "Metal-to-Metal Charge Transfer",
      description: "Ko'prik ligand orqali bir metall markazidan ikkinchisiga elektron ko'chishi",
      conditions: "Ikki xil metall yoki aralash valentli kompleks, ko'prik ligand (CN⁻, pyz, O²⁻)",
      color: "purple",
      colorClass: "bg-purple-600/10 border-purple-500/30",
      textColor: "text-purple-400",
      examples: ["Prussiya ko'ki (Fe²⁺/Fe³⁺, ~700 nm)", "Kreutz-Taube ioni (Ru²⁺/Ru³⁺, 1570 nm)"],
      energyFormula: "hν = λ (qayta tashkilanish energiyasi)",
      trend: "H_ab kuchli → energiya ↓, polosa tor",
      link: "/ilmiy/chuqurlashgan/zaryad-kochishi/ivct"
    },
    {
      code: "IVCT",
      name: "Intervalent CT",
      fullName: "Intervalence Charge Transfer",
      description: "Aralash valentli komplekslarda Mⁿ⁺ → M⁽ⁿ⁺¹⁾⁺ ko'chishi (MMCT ning maxsus turi)",
      conditions: "Aralash valentli kompleks (M²⁺/M³⁺), Robin-Day klassifikatsiyasi",
      color: "pink",
      colorClass: "bg-pink-600/10 border-pink-500/30",
      textColor: "text-pink-400",
      examples: ["Prussiya ko'ki (II sinf, 700 nm)", "Kreutz-Taube ioni (II-III sinf, 1570 nm)"],
      energyFormula: "hν = λ + ΔG° (Hush-Robinson)",
      trend: "2H_ab > λ → III sinf (to'liq delokalizatsiya)",
      link: "/ilmiy/chuqurlashgan/zaryad-kochishi/ivct"
    },
    {
      code: "XLCT",
      name: "Ligand → Ligand",
      fullName: "Ligand-to-Ligand Charge Transfer (ILCT/XLCT)",
      description: "Bir ligandning π-orbitalidan ikkinchi ligandning π* orbitaliga elektron ko'chishi",
      conditions: "Ikki xil ligand (donor + akseptor), aralash ligandli komplekslar",
      color: "green",
      colorClass: "bg-green-600/10 border-green-500/30",
      textColor: "text-green-400",
      examples: ["Ditiolen komplekslari", "Diimin komplekslari", "Push-pull tizimlar"],
      energyFormula: "hν = E(L₂ π*) − E(L₁ π)",
      trend: "Donor-akseptor kuchi ↑ → energiya ↓",
      link: null
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // ENERGETIK TAQQOSLASH
  //  ═══════════════════════════════════════════════════════════════
  energetics: {
    lmct: {
      description: "Ligand π/σ orbitallari → Metall d orbitallari",
      formula: "hν = E(d) − E(L)",
      trend: "Oksidlanish darajasi ↑ → energiya ↓",
      typicalEnergy: "20,000 - 50,000 cm⁻¹",
      wavelength: "200 - 500 nm (UV-Vis)"
    },
    mlct: {
      description: "Metall d orbitallari → Ligand π* orbitallari",
      formula: "hν = E(π*) − E(d)",
      trend: "Oksidlanish darajasi ↓ → energiya ↓",
      typicalEnergy: "15,000 - 30,000 cm⁻¹",
      wavelength: "330 - 670 nm (Vis)"
    },
    ivct: {
      description: "M₁(d) → M₂(d) (ko'prik orqali)",
      formula: "hν = λ (qayta tashkilanish)",
      trend: "H_ab kuchli → energiya ↓",
      typicalEnergy: "5,000 - 20,000 cm⁻¹",
      wavelength: "500 - 2000 nm (Vis-NIR)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIX
  //  ═══════════════════════════════════════════════════════════════
  history: [
    {
      year: "1940-50-yillar",
      scientist: "Robert S. Mulliken",
      achievement: "CT tushunchasini birinchi marta taklif qildi",
      contribution: "Molekulyar orbital nazariyasi asosida CT o'tishlar tushuntirildi",
      nobel: "Nobel mukofoti 1966 (kimyoviy bog'lanish nazariyasi)"
    },
    {
      year: "1954",
      scientist: "Henry Taube",
      achievement: "Elektron uzatish mexanizmlari (inner-sphere vs outer-sphere)",
      contribution: "Ko'prik ligand orqali elektron uzatish tushunchasi",
      nobel: "Nobel mukofoti 1983"
    },
    {
      year: "1967",
      scientist: "M.B. Robin va P. Day",
      achievement: "Aralash valentli komplekslar klassifikatsiyasi",
      contribution: "I, II, III sinflar — elektron delokalizatsiyasi darajasi",
      nobel: "—"
    },
    {
      year: "1968",
      scientist: "A.B.P. Lever",
      achievement: "Optik elektronegativlik tushunchasi",
      contribution: "LMCT energiyasini bashorat qilish formulasi",
      nobel: "—"
    },
    {
      year: "1970-yillar",
      scientist: "Crosby, Balzani",
      achievement: "[Ru(bpy)₃]²⁺ MLCT fotofizikasi",
      contribution: "Quyosh energiyasi konversiyasi uchun asos",
      nobel: "—"
    },
    {
      year: "1991",
      scientist: "Michael Grätzel",
      achievement: "DSSC (Dye-Sensitized Solar Cell)",
      contribution: "MLCT orqali TiO₂ ga elektron injeksiyasi",
      nobel: "—"
    },
    {
      year: "2010+",
      scientist: "Turli tadqiqotchilar",
      achievement: "TADF, OLED, fotoredoks kataliz",
      contribution: "MLCT qo'zg'algan holatlarning yangi qo'llanilishi",
      nobel: "—"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // CT vs d-d TAQQOSLASH
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    { parameter: "Intensivlik (ε, M⁻¹sm⁻¹)", ct: "10³ − 10⁵", dd: "0.1 − 100 (ba'zan 500)" },
    { parameter: "Laporte ruxsati", ct: "Ruxsat etilgan", dd: "Taqiqlangan (vibronik)" },
    { parameter: "Yarim kenglik (Δν₁/₂, sm⁻¹)", ct: "3 000 − 5 000 (keng)", dd: "1 000 − 2 000 (tor)" },
    { parameter: "Erituvchi ta'siri", ct: "Kuchli (solvatoxromizm)", dd: "Juda kuchsiz" },
    { parameter: "Temperatura ta'siri", ct: "Kuchsiz (keng polosa)", dd: "Kuchli (termal kengayish)" },
    { parameter: "O'tish mexanizmi", ct: "Markazlararo (LMCT/MLCT) yoki ichki (IVCT)", dd: "Faqat bir markaz ichida" },
    { parameter: "O'tish ehtimoli (f)", ct: "~0.1 − 1", dd: "~10⁻³ − 10⁻⁵" },
    { parameter: "Molar so'nish (ε_max)", ct: "~10⁴", dd: "~10" },
    { parameter: "Energiya sohasi", ct: "UV − Vis (ba'zan NIR)", dd: "Vis − NIR" },
    { parameter: "Nazariy asos", ct: "Molekulyar orbital nazariyasi", dd: "Ligand maydon nazariyasi" },
    { parameter: "O'tishga sabab", ct: "Elektron zichlikning qayta taqsimlanishi", dd: "d-orbitallar orasidagi farq" },
    { parameter: "Qo'llanilishi", ct: "Fotokataliz, OLED, sensorlar, DSSC", dd: "Rang, magnitlik, geometriya" }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // QO'LLANILISH
  //  ═══════════════════════════════════════════════════════════════
  applications: [
    {
      field: "Fotokataliz",
      icon: "☀️",
      description: "MLCT qo'zg'algan holat — quyosh energiyasini kimyoviy energiyaga aylantirish",
      examples: ["Suv parchalash (H₂ ishlab chiqarish)", "CO₂ qaytarish", "Organik sintez"],
      keyComplex: "[Ru(bpy)₃]²⁺, [Re(bpy)(CO)₃Cl]"
    },
    {
      field: "OLED (Organic Light-Emitting Diodes)",
      icon: "💡",
      description: "MLCT emissiyasi orqali yorug'lik chiqarish",
      examples: ["Yashil piksel: [Ir(ppy)₃]", "Qizil piksel: [Ir(piq)₃]", "Ko'k piksel: TADF emitterlar"],
      keyComplex: "Ir(III), Pt(II) komplekslari"
    },
    {
      field: "DSSC (Dye-Sensitized Solar Cells)",
      icon: "🔋",
      description: "MLCT orqali TiO₂ ga elektron injeksiyasi",
      examples: ["N3 bo'yoq (Ru)", "Organik bo'yoqlar", "Perovskitlar"],
      keyComplex: "N3, N719 (Ru komplekslari)"
    },
    {
      field: "Sensorlar",
      icon: "🔬",
      description: "CT o'tishlarning analitga sezgirligi",
      examples: ["O₂ sensorlar ([PtOEP])", "pH sensorlar", "Metal ion sensorlar"],
      keyComplex: "Solvatoxrom bo'yoqlar"
    },
    {
      field: "Elektron tashish",
      icon: "🔌",
      description: "IVCT — molekulyar simlar va qurilmalar",
      examples: ["Molekulyar simlar", "Molekulyar switchlar", "Elektrokrom qurilmalar"],
      keyComplex: "Kreutz-Taube ioni"
    },
    {
      field: "Fotoredoks kataliz",
      icon: "⚗️",
      description: "MLCT orqali organik reaksiyalar",
      examples: ["C-C bog' hosil qilish", "Oksidlanish-qaytarilish", "Polimerizatsiya"],
      keyComplex: "[Ru(bpy)₃]²⁺, [Ir(ppy)₃]"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "UB-Vis-NIR spektroskopiya",
      application: "CT bandlarini o'lchash",
      information: "λ_max, ε, band shakli",
      advantage: "Tez, arzon, oddiy",
      example: "MnO₄⁻ — 520 nm (LMCT), [Ru(bpy)₃]²⁺ — 452 nm (MLCT)"
    },
    {
      method: "Rezonans Raman (RR)",
      application: "Vibronik tuzilish, bog' uzunliklari",
      information: "Qo'zg'algan holat strukturasi",
      advantage: "Selektiv, batafsil",
      example: "Ru-bpy bog' uzunligi o'zgarishi"
    },
    {
      method: "Elektrokimyo (CV)",
      application: "Redoks potentsiallari, HOMO-LUMO",
      information: "E_ox, E_red, HOMO-LUMO oralig'i",
      advantage: "CT energiyasini bashorat qilish",
      example: "Rehm-Weller tenglamasi"
    },
    {
      method: "TD-DFT hisob-kitoblari",
      application: "Nazariy tahlil, orbital tahlil",
      information: "O'tish tabiati, energiyasi",
      advantage: "Mexanizm tushunish",
      example: "MLCT vs LC o'tishlarni ajratish"
    },
    {
      method: "Femtosekundli spektroskopiya",
      application: "CT dinamikasi",
      information: "Elektron ko'chish tezligi",
      advantage: "fs-ps aniqlik",
      example: "[Ru(bpy)₃]²⁺ MLCT — ~15 fs"
    },
    {
      method: "MCD (Magnetic Circular Dichroism)",
      application: "Simmetriya va polarizatsiya",
      information: "Orbital simmetriya, degeneratsiya",
      advantage: "Murakkab spektrlarni tahlil",
      example: "LMCT va d-d o'tishlarni ajratish"
    }
  ]
}

// ============================================================================
// INTERAKTIV CT TANISHTIRUV SLAYDERI
// ============================================================================
function CTTanishuv() {
  const [tab, setTab] = useState("umumiy")

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">📚</span>
        Interaktiv tanishuv
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "umumiy", label: "📋 Umumiy" },
          { key: "turlari", label: "🔬 Turlari" },
          { key: "energetika", label: "📊 Energetika" },
          { key: "tarix", label: "📜 Tarix" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-lime-600/60 text-white border border-lime-400/50"
                : "bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
        {tab === "umumiy" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold text-lg">Zaryad ko'chishi (CT) — asosiy tushuncha</h4>
            <p className="leading-relaxed">
              <strong className="text-yellow-400">Zaryad ko'chishi (Charge Transfer, CT)</strong> —
              koordinatsion birikmalarda elektronning bir molekulyar orbitaldan boshqasiga
              ko'chishi natijasida yuzaga keladigan elektron o'tish. CT o'tishlar
              <strong className="text-lime-400"> d−d o'tishlardan tubdan farq qiladi</strong> — ular Laporte bo'yicha
              ruxsat etilgan, intensivligi yuqori (ε ≈ 10³−10⁵) va erituvchi qutbliligiga kuchli bog'liq.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center mt-4">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-lime-400 font-bold text-2xl">10³−10⁵</p>
                <p className="text-purple-300 text-xs mt-1">Molyar so'nish (ε)</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-lime-400 font-bold text-2xl">UV-Vis-NIR</p>
                <p className="text-purple-300 text-xs mt-1">Spektral soha</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-lime-400 font-bold text-2xl">100-1000×</p>
                <p className="text-purple-300 text-xs mt-1">d−d dan intensivroq</p>
              </div>
            </div>
          </div>
        )}

        {tab === "turlari" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold text-lg">CT o'tish turlari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CT_DATA.types.map((item, i) => (
                <Link
                  key={i}
                  href={item.link || "#"}
                  className={`${item.colorClass} border rounded-lg p-4 hover:opacity-80 transition-opacity`}
                >
                  <p className={`font-bold ${item.textColor}`}>{item.code} — {item.name}</p>
                  <p className="text-xs text-purple-300 mt-2">{item.description}</p>
                  <p className="text-[10px] text-purple-400 mt-2 italic">{item.conditions}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "energetika" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold text-lg">CT energetik diagrammasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400 font-bold text-lg">LMCT</p>
                <p className="text-purple-300 mt-2 text-xs">{CT_DATA.energetics.lmct.description}</p>
                <p className="text-purple-400 mt-2 text-xs font-mono">{CT_DATA.energetics.lmct.formula}</p>
                <p className="text-purple-400 mt-1 text-[10px]">{CT_DATA.energetics.lmct.trend}</p>
                <div className="mt-3 pt-3 border-t border-red-700/30 text-xs">
                  <p className="text-red-400 font-bold">Energiya:</p>
                  <p className="text-purple-300">{CT_DATA.energetics.lmct.typicalEnergy}</p>
                  <p className="text-purple-300">{CT_DATA.energetics.lmct.wavelength}</p>
                </div>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-blue-400 font-bold text-lg">MLCT</p>
                <p className="text-purple-300 mt-2 text-xs">{CT_DATA.energetics.mlct.description}</p>
                <p className="text-purple-400 mt-2 text-xs font-mono">{CT_DATA.energetics.mlct.formula}</p>
                <p className="text-purple-400 mt-1 text-[10px]">{CT_DATA.energetics.mlct.trend}</p>
                <div className="mt-3 pt-3 border-t border-blue-700/30 text-xs">
                  <p className="text-blue-400 font-bold">Energiya:</p>
                  <p className="text-purple-300">{CT_DATA.energetics.mlct.typicalEnergy}</p>
                  <p className="text-purple-300">{CT_DATA.energetics.mlct.wavelength}</p>
                </div>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <p className="text-purple-400 font-bold text-lg">IVCT</p>
                <p className="text-purple-300 mt-2 text-xs">{CT_DATA.energetics.ivct.description}</p>
                <p className="text-purple-400 mt-2 text-xs font-mono">{CT_DATA.energetics.ivct.formula}</p>
                <p className="text-purple-400 mt-1 text-[10px]">{CT_DATA.energetics.ivct.trend}</p>
                <div className="mt-3 pt-3 border-t border-purple-700/30 text-xs">
                  <p className="text-purple-400 font-bold">Energiya:</p>
                  <p className="text-purple-300">{CT_DATA.energetics.ivct.typicalEnergy}</p>
                  <p className="text-purple-300">{CT_DATA.energetics.ivct.wavelength}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "tarix" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold text-lg">CT spektroskopiyasi tarixi</h4>
            <div className="space-y-3">
              {CT_DATA.history.map((item, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-lime-400 font-mono font-bold shrink-0 w-24">{item.year}</span>
                    <div className="flex-1">
                      <p className="text-yellow-400 font-bold">{item.scientist}</p>
                      <p className="text-purple-200 text-xs mt-1">{item.achievement}</p>
                      <p className="text-purple-300 text-xs mt-1">{item.contribution}</p>
                      {item.nobel !== "—" && (
                        <p className="text-lime-400 text-xs mt-1 italic">🏆 {item.nobel}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// CT vs d-d TAQQOSLASH INTERAKTIV JADVALI
// ============================================================================
function CTvsDD() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">⚖️</span>
        CT vs d−d o'tishlar — batafsil taqqoslash
      </h3>

      <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                <th className="text-left py-3 px-3 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-3 text-lime-400">CT o'tishlar</th>
                <th className="text-left py-3 px-3 text-amber-400">d−d o'tishlar</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {CT_DATA.comparison.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i % 2 === 0 ? "bg-purple-950/20" : ""}`}>
                  <td className="py-3 px-3 font-semibold">{row.parameter}</td>
                  <td className="py-3 px-3 text-lime-300">{row.ct}</td>
                  <td className="py-3 px-3 text-amber-300">{row.dd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mt-4">
          <p className="text-yellow-200 text-xs">
            <strong className="text-yellow-400">💡 Muhim:</strong> CT o'tishlar Laporte ruxsat etilgan (g → u yoki u → g),
            shuning uchun ular d−d o'tishlardan 100-1000 marta intensivroq.
            Bu ularni komplekslarning <strong>yorqin rangini</strong> ta'minlaydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function ZaryadKochishiPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-lime-950 to-purple-950 border-2 border-lime-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">💫</span> ZARYAD KO'CHISHI — CT SPEKTRLARI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-lime-300">Charge Transfer (CT)</strong> — elektronning metall va ligand o'rtasida ko'chishi.
              <strong className="text-yellow-400"> 5 ta asosiy tur:</strong> LMCT, MLCT, MMCT, IVCT, XLCT.
              <strong className="text-yellow-400"> d−d dan 100-1000× intensivroq!</strong>
            </p>
            <div className="bg-lime-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-lime-400 font-bold mb-2">🔬 CT turlari:</div>
                  <div className="text-purple-200">
                    <strong>LMCT:</strong> Ligand → Metall
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>MLCT:</strong> Metall → Ligand
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>IVCT:</strong> Metall → Metall
                  </div>
                </div>
                <div>
                  <div className="text-lime-400 font-bold mb-2">📊 Xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>ε:</strong> 10³-10⁵ M⁻¹sm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Solvatoxromizm:</strong> Kuchli
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Laporte:</strong> Ruxsat etilgan
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-lime-600 hover:bg-lime-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-lime-400 font-semibold">Zaryad ko'chishi</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-lime-400 flex items-center gap-2">
                  <span className="text-3xl">💫</span>
                  Zaryad ko'chishi spektrlari
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  MLCT • LMCT • MMCT • IVCT • XLCT • Solvatoxromizm
                </p>
              </div>
              <Link href="/ilmiy/chuqurlashgan" className="text-xs bg-lime-600/80 hover:bg-lime-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Chuqurlashgan
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-lime-600 hover:bg-lime-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-lime-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-600/20 border border-lime-600/30 rounded-full text-xs font-semibold text-lime-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              CHARGE TRANSFER SPEKTROSKOPIYASI
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-lime-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                Zaryad ko'chishi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">Elektronning fazoviy qayta taqsimlanishi</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-lime-400">CT spektrlari</strong> — koordinatsion birikmalarda elektronning
              <strong className="text-yellow-400"> metall va ligand o'rtasida</strong> yoki
              <strong className="text-yellow-400"> ikki metall markazi o'rtasida</strong> ko'chishi natijasida
              yuzaga keladigan yutilish spektrlari. CT o'tishlar <strong className="text-lime-400">d−d o'tishlardan ancha intensiv</strong>
              (ε ≈ 10³−10⁵) va kompleksning <strong className="text-lime-400">yorqin rangini</strong> ta'minlaydi.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-xl font-bold text-lime-400">5</div>
                <div className="text-xs text-purple-400 mt-1">CT turlari</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xl font-bold text-lime-400">10³-10⁵</div>
                <div className="text-xs text-purple-400 mt-1">ε (M⁻¹sm⁻¹)</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧪</div>
                <div className="text-xl font-bold text-lime-400">Kuchli</div>
                <div className="text-xs text-purple-400 mt-1">Solvatoxromizm</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">☀️</div>
                <div className="text-xl font-bold text-lime-400">OLED</div>
                <div className="text-xs text-purple-400 mt-1">Qo'llanilish</div>
              </div>
            </div>
          </div>
        </div>

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Zaryad ko'chishi spektrlari haqida
          </h2>

          <div className="bg-lime-600/10 border border-lime-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-lime-400">{CT_DATA.concept.definition}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-lime-400 font-bold mb-3">CT o'tish turlari</h3>
              <div className="space-y-2 text-xs">
                {CT_DATA.types.map((item, i) => (
                  <div key={i} className="bg-purple-900/50 rounded p-2">
                    <span className={`font-bold ${item.textColor}`}>{item.code}:</span>{" "}
                    <span className="text-purple-300">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-lime-400 font-bold mb-3">Nima uchun CT muhim?</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-lime-400">•</span>
                  <span><strong>Rang manbai:</strong> Ko'pchilik yorqin rangli komplekslarning rangi CT o'tishlardan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-400">•</span>
                  <span><strong>Fotokataliz:</strong> MLCT qo'zg'algan holat — quyosh energiyasini kimyoviy energiyaga aylantiradi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-400">•</span>
                  <span><strong>Sensorlar:</strong> CT o'tishlarning analitga sezgirligi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-400">•</span>
                  <span><strong>OLED:</strong> Ir, Pt komplekslarda MLCT — yorug'lik emissiyasi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-400">•</span>
                  <span><strong>Elektron tashish:</strong> IVCT — molekulyar simlar va qurilmalar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* MAVZULAR KARTALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📂</span>
            Bo'limlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CT_DATA.types.slice(0, 4).map((item, i) => (
              <Link
                key={i}
                href={item.link || "#"}
                className={`${item.colorClass} border rounded-xl p-5 hover:opacity-80 transition-opacity group`}
              >
                <div className="text-3xl mb-2">
                  {item.code === "LMCT" && "🔴"}
                  {item.code === "MLCT" && "🔵"}
                  {item.code === "MMCT" && "🟣"}
                  {item.code === "IVCT" && "🟣"}
                </div>
                <h3 className={`${item.textColor} font-bold text-lg group-hover:opacity-80`}>
                  {item.code} — {item.name}
                </h3>
                <p className="text-purple-300 text-xs mt-2">{item.description}</p>
                <p className="text-purple-400 text-[10px] mt-2 italic">{item.conditions}</p>
              </Link>
            ))}

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/solvatoxromizm"
              className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 hover:bg-cyan-600/20 transition-colors group">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="text-cyan-400 font-bold text-lg group-hover:text-cyan-300">Solvatoxromizm</h3>
              <p className="text-purple-300 text-xs mt-2">
                Erituvchi ta'siri • Gipsoxrom vs batroxrom • Diagnostik ahamiyati • DSSC
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/d-d-vs-ct"
              className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5 hover:bg-amber-600/20 transition-colors group">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="text-amber-400 font-bold text-lg group-hover:text-amber-300">d−d vs CT taqqoslash</h3>
              <p className="text-purple-300 text-xs mt-2">
                12 parametr bo'yicha solishtirish • Laporte ruxsati • Tanlash qoidalari
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct/fotofizika"
              className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 hover:bg-green-600/20 transition-colors group">
              <div className="text-3xl mb-2">🌈</div>
              <h3 className="text-green-400 font-bold text-lg group-hover:text-green-300">MLCT Fotofizikasi</h3>
              <p className="text-purple-300 text-xs mt-2">
                Qo'zg'algan holatlar • Lyuminessensiya • SOC • TADF • Quyosh energetikasi
              </p>
            </Link>
          </div>
        </div>

        {/* INTERAKTIV SLAYDERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CTTanishuv />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CTvsDD />
        </div>

        {/* QO'LLANILISH */}
        <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            Amaliy qo'llanilishi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CT_DATA.applications.map((app, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <div className="text-3xl mb-2">{app.icon}</div>
                <h3 className="text-pink-400 font-bold mb-2">{app.field}</h3>
                <p className="text-purple-200 text-xs mb-3">{app.description}</p>
                <h4 className="text-purple-300 font-bold text-xs mb-1">Misollar:</h4>
                <ul className="space-y-1 text-xs text-purple-300 mb-3">
                  {app.examples.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-purple-950/50 rounded p-2 text-[10px]">
                  <span className="text-yellow-400 font-bold">Asosiy kompleks:</span>
                  <span className="text-purple-300 ml-1">{app.keyComplex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TADQIQOT USULLARI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            Tadqiqot usullari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CT_DATA.researchMethods.map((method, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-cyan-400 font-bold mb-2">{method.method}</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-purple-400">Qo'llanilishi:</div>
                    <p className="text-purple-200">{method.application}</p>
                  </div>
                  <div>
                    <div className="text-purple-400">Ma'lumot:</div>
                    <p className="text-purple-200">{method.information}</p>
                  </div>
                  <div>
                    <div className="text-purple-400">Afzallik:</div>
                    <p className="text-green-400">{method.advantage}</p>
                  </div>
                  <div className="bg-purple-950/50 rounded p-2">
                    <span className="text-yellow-400 font-bold">Misol:</span>
                    <span className="text-purple-300 ml-1">{method.example}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-lime-600/10 to-purple-600/10 border border-lime-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li>CT o'tishlar — <strong className="text-lime-400">d−d o'tishlardan 100−1000 marta intensivroq</strong>, Laporte ruxsat etilgan</li>
            <li>5 ta asosiy tur: <strong className="text-lime-400">LMCT, MLCT, MMCT, IVCT, XLCT</strong></li>
            <li>CT spektrlari <strong className="text-lime-400">erituvchi qutbliligiga kuchli bog'liq</strong> (solvatoxromizm) — diagnostik belgi</li>
            <li>MLCT qo'zg'algan holatlari — <strong className="text-lime-400">fotokataliz, OLED, quyosh energetikasi</strong> uchun asos</li>
            <li>IVCT — <strong className="text-lime-400">Robin-Day klassifikatsiyasi</strong> bo'yicha elektron delokalizatsiyasi darajasini aniqlaydi</li>
            <li>Tarix: <strong className="text-lime-400">Mulliken (1950s), Taube (1954), Robin-Day (1967), Grätzel (1991)</strong></li>
          </ol>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Chuqurlashgan
          </Link>
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/lmct" className="px-6 py-3 bg-lime-600/80 rounded-xl hover:bg-lime-500 text-white font-semibold">
            LMCT →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Chuqurlashgan mavzular</p>
          <p className="mt-1">Zaryad ko'chishi (CT) • Mulliken • Taube • Robin-Day • Grätzel</p>
        </div>
      </footer>
    </main>
  )
}