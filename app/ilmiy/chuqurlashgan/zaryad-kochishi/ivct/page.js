"use client"
import Link from "next/link"
import { useState } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// IVCT & MMCT — METALL-METALL ZARYAD KO'CHISHI (ILMIY BOYITILGAN)
// Manbalar: Robin-Day (1967), Hush (1967), Creutz-Taube (1969),
//           Brunschwig-Creutz-Sutin (2002), Demissie (2020)
//  ═══════════════════════════════════════════════════════════════════════════════

const IVCT_DATA = {
  //  ═══════════════════════════════════════════════════════════════
  // ROBIN-DAY KLASIFIKATSIYASI
  //  ═══════════════════════════════════════════════════════════════
  robinDayClasses: {
    1: {
      title: "I sinf — To'liq lokalizatsiyalangan",
      desc: "Elektron faqat bitta metall markazida lokalizatsiyalangan. IVCT yo'q yoki juda kuchsiz. Metall markazlari orasidagi o'zaro ta'sir juda kuchsiz — ular mustaqil komplekslar kabi harakat qiladi. Valentlik 'muzlatilgan'.",
      ivct: "IVCT kuzatilmaydi yoki juda kuchsiz (ε < 100 M⁻¹sm⁻¹)",
      example: "[Pt(NH₃)₄]²⁺/[PtCl₄]²⁻ aralashmasi",
      eCoupling: "H_ab ≈ 0 (< 100 sm⁻¹)",
      deltaE: "ΔE° katta — termal aktivatsiya kerak",
      color: "Har bir ion o'z rangida",
      spectroscopy: "UB-Vis: alohida ionlarning d−d va CT spektrlari",
      epr: "EPR: ikkita alohida signal",
      xray: "Ikki xil M−L masofasi",
      theory: "2H_ab << λ (lokalizatsiya)",
      colorClass: "bg-red-600/10 border-red-500/30",
      textColor: "text-red-400"
    },
    2: {
      title: "II sinf — Qisman delokalizatsiyalangan",
      desc: "Elektron asosan bir markazda, lekin ikkinchi markazga o'tish ehtimoli mavjud. IVCT yutilishi kuzatiladi — bu aralash valentli komplekslarning xarakterli belgisi. Termal aktivatsiya orqali elektron ko'chishi sodir bo'ladi.",
      ivct: "IVCT kuzatiladi (ε ≈ 10²−10⁴ M⁻¹sm⁻¹) — xarakterli rang!",
      example: "Prussiya ko'ki (Fe₄[Fe(CN)₆]₃) — Fe²⁺ → Fe³⁺ IVCT (~680 nm)",
      eCoupling: "H_ab ≈ 500−2000 sm⁻¹ (o'rtacha bog'lanish)",
      deltaE: "ΔE° o'rtacha — termal + optik ko'chish",
      color: "IVCT tufayli intensiv rang — ko'k (Prussiya ko'ki)",
      spectroscopy: "UB-Vis-NIR: IVCT polosa — keng, intensiv. Solvatoxromizm.",
      epr: "EPR: haroratga bog'liq, almashinuv torayishi",
      xray: "Ikki xil M−L masofasi, farq I sinfdan kichikroq",
      theory: "2H_ab ≈ λ (qisman delokalizatsiya, Hush modeli)",
      colorClass: "bg-yellow-600/10 border-yellow-500/30",
      textColor: "text-yellow-400"
    },
    3: {
      title: "III sinf — To'liq delokalizatsiyalangan",
      desc: "Elektron ikkala metall markazi o'rtasida to'liq delokalizatsiyalangan — ular orasidagi farq yo'qoladi. Ikkala metall bir xil 'o'rtacha' oksidlanish darajasiga ega. Molekulyar orbital tavsifi qo'llaniladi.",
      ivct: "IVCT juda intensiv (ε > 10⁴ M⁻¹sm⁻¹) — tor pik",
      example: "Creutz-Taube ioni: [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ (Ru²⁺.⁵)",
      eCoupling: "H_ab katta (> 2000 sm⁻¹) — kuchli bog'lanish",
      deltaE: "ΔE° ≈ 0 — elektron erkin harakatlanadi",
      color: "IVCT — NIR sohada (~1570 nm, ko'rinmaydi)",
      spectroscopy: "UB-Vis-NIR: IVCT tor va intensiv",
      epr: "EPR: bitta signal yoki yo'q (delokalizatsiya)",
      xray: "Bir xil M−L masofasi — farqlab bo'lmaydi!",
      theory: "2H_ab > λ (to'liq delokalizatsiya, MO nazariyasi)",
      colorClass: "bg-green-600/10 border-green-500/30",
      textColor: "text-green-400"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // KLASSIK MISOLLAR
  //  ═══════════════════════════════════════════════════════════════
  classicExamples: [
    {
      name: "Prussiya ko'ki",
      formula: "Fe₄[Fe(CN)₆]₃·xH₂O",
      formulaHTML: "Fe<sub>4</sub>[Fe(CN)<sub>6</sub>]<sub>3</sub>·xH<sub>2</sub>O",
      metals: "Fe²⁺ (HS, d⁶) → Fe³⁺ (LS, d⁵)",
      bridge: "CN⁻ — kichik, chiziqli",
      ivctLambda: "~680 nm (ko'rinadigan)",
      ivctEpsilon: "~10 000 M⁻¹sm⁻¹",
      halfWidth: "~5 000 sm⁻¹ (keng)",
      robinDay: "II sinf",
      h_ab: "~1 000 sm⁻¹",
      lambda: "~8 000 sm⁻¹",
      delocalization: "Qisman — termal ko'chish",
      xray: "Ikki xil Fe−CN masofasi",
      color: "Ko'k (IVCT + d−d)",
      applications: "Pigment, elektroxromizm, sensorlar",
      slug: "prussiya-koki",
      highlight: true
    },
    {
      name: "Creutz-Taube ioni",
      formula: "[(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺",
      formulaHTML: "[(NH<sub>3</sub>)<sub>5</sub>Ru(pyz)Ru(NH<sub>3</sub>)<sub>5</sub>]<sup>5+</sup>",
      metals: "Ru²⁺ (d⁶) → Ru³⁺ (d⁵)",
      bridge: "Pirazin (pyz) — π-konjugatsiyalangan",
      ivctLambda: "~1570 nm (NIR, ko'rinmas)",
      ivctEpsilon: "~5 000 M⁻¹sm⁻¹",
      halfWidth: "~1 000 sm⁻¹ (tor)",
      robinDay: "III sinf",
      h_ab: "~4 000 sm⁻¹",
      lambda: "~2 000 sm⁻¹",
      delocalization: "To'liq — bar'ersiz ko'chish",
      xray: "Bir xil Ru−N(pyz) masofasi",
      color: "To'q qizil (d−d), IVCT NIR da",
      applications: "Molekulyar simlar, elektron tashish",
      slug: null,
      highlight: false
    },
    {
      name: "Magniy-ftalosianin dimer",
      formula: "[PcMg−MgPc]",
      formulaHTML: "[PcMg−MgPc]",
      metals: "Mg⁺ → Mg²⁺ (aralash valentli)",
      bridge: "Bevosita Mg−Mg bog'i",
      ivctLambda: "~1100 nm",
      ivctEpsilon: "~8 000 M⁻¹sm⁻¹",
      halfWidth: "~2 000 sm⁻¹",
      robinDay: "II-III sinf chegarasi",
      h_ab: "~3 000 sm⁻¹",
      lambda: "~3 500 sm⁻¹",
      delocalization: "Kuchli delokalizatsiya",
      xray: "Qisqa Mg−Mg masofasi",
      color: "Yashil-ko'k",
      applications: "Organik elektronika",
      slug: null,
      highlight: false
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // HUSH-ROBINSON NAZARIYASI
  //  ═══════════════════════════════════════════════════════════════
  hushRobinson: {
    formulas: {
      ivctEnergy: {
        formula: "E_opt = λ + ΔG°",
        description: "λ — qayta tashkilanish energiyasi, ΔG° — reaksiya erkin energiyasi",
        note: "Simmetrik komplekslarda (ΔG°=0): E_opt = λ"
      },
      thermalActivation: {
        formula: "E_th = (λ − 2H_ab)² / 4λ",
        description: "Termal aktivatsiya energiyasi",
        note: "III sinfda 2H_ab > λ → E_th = 0 (bar'ersiz o'tish!)"
      },
      halfWidth: {
        formula: "Δν₁/₂ = √(16RT·ln2·λ) ≈ √(2310·λ)",
        description: "IVCT yarim kengligi (II sinf)",
        note: "λ sm⁻¹ da. Nazariy qiymatdan kengroq bo'lsa — II sinf tasdiqlanadi"
      },
      classIII: {
        formula: "E_opt = 2H_ab",
        description: "III sinf — IVCT energiyasi",
        note: "λ hissasi yo'qoladi — elektron to'liq delokalizatsiyalangan!"
      }
    },
    parameters: {
      h_ab: {
        title: "H_ab — elektron bog'lanish energiyasi",
        description: "Ikki metall markazi o'rtasidagi elektron bog'lanish kuchi",
        factors: [
          "Ko'prik ligand tabiati (konjugatsiya, uzunlik, donor/akseptorlik)",
          "Metall-ligand masofasi (qisqa → kuchliroq)",
          "Metall tabiati (4d, 5d → orbitallar kengroq → H_ab katta)",
          "Simmetriya (simmetrik komplekslarda H_ab kattaroq)"
        ]
      },
      lambda: {
        title: "λ — qayta tashkilanish energiyasi",
        description: "Elektron ko'chishi paytida sodir bo'ladigan strukturaviy o'zgarishlar energiyasi",
        inner: {
          title: "Ichki sfera (λ_in):",
          points: [
            "Metall-ligand bog' uzunliklarining o'zgarishi",
            "M−L masofasi oksidlanish darajasiga qarab o'zgaradi",
            "Ru²⁺/Ru³⁺ misolida: Δr ≈ 0.04 Å (Ru−N)",
            "Qancha kichik bo'lsa, λ_in shuncha kichik"
          ]
        },
        outer: {
          title: "Tashqi sfera (λ_out):",
          points: [
            "Erituvchi molekulalarining qayta tashkilanishi",
            "Qutbli erituvchida kattaroq",
            "Qutbsiz erituvchida kichikroq",
            "Katta ligandlar → λ_out kichik (erituvchi ta'siri kam)"
          ]
        },
        significance: "λ qancha kichik bo'lsa, III sinfga o'tish ehtimoli shuncha yuqori. Katta makrotsiklik ligandlar (porfirin, ftalosianin) λ ni kamaytiradi."
      }
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIX
  //  ═══════════════════════════════════════════════════════════════
  history: {
    robin_day: {
      year: 1967,
      scientist: "M.B. Robin va P. Day",
      achievement: "Aralash valentli komplekslar tasnifi (I, II, III sinflar)",
      journal: "Advances in Inorganic Chemistry and Radiochemistry"
    },
    hush: {
      year: 1967,
      scientist: "N.S. Hush",
      achievement: "IVCT nazariyasi — intervalence charge transfer modeli",
      contribution: "E_opt, E_th formulalari, H_ab va λ parametrlari"
    },
    creutz_taube: {
      year: 1969,
      scientist: "C. Creutz va H. Taube",
      achievement: "[(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ — klassik III sinf namunasi",
      significance: "To'liq delokalizatsiya uchun model sistema"
    },
    brunschwig: {
      year: 2002,
      scientist: "B.S. Brunschwig, C. Creutz, N. Sutin",
      achievement: "Zamonaviy IVCT nazariyasini ishlab chiqish",
      contribution: "Optik va termal elektron uzatish integratsiyasi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "UB-Vis-NIR spektroskopiya",
      application: "IVCT band o'lchash",
      information: "λ_max, ε, Δν₁/₂",
      advantage: "Robin-Day sinfi aniqlash",
      example: "Prussiya ko'ki: ~680 nm (II sinf)"
    },
    {
      method: "EPR spektroskopiya",
      application: "Spin holati va delokalizatsiya",
      information: "g-faktor, A-tensor",
      advantage: "Lokalizatsiyalangan vs delokalizatsiyalangan",
      example: "II sinf: haroratga bog'liq; III sinf: bitta signal"
    },
    {
      method: "Rentgen difraksiyasi",
      application: "Strukturaviy tahlil",
      information: "M−L masofalari",
      advantage: "Ikki xil vs bir xil masofa",
      example: "Creutz-Taube: bir xil Ru−N"
    },
    {
      method: "Resonance Raman",
      application: "Vibronik tuzilish",
      information: "Bog' uzunliklari o'zgarishi",
      advantage: "λ_in baholash",
      example: "Ru−N vibratsiyalar"
    },
    {
      method: "Elektrokimyo (CV)",
      application: "Redoks xususiyatlar",
      information: "ΔE₁/₂, K_com",
      advantage: "Termodinamik parametrlar",
      example: "ΔE₁/₂ = 0 → III sinf"
    },
    {
      method: "TD-DFT hisob-kitoblari",
      application: "Nazariy tahlil",
      information: "H_ab, λ, E_opt",
      advantage: "Mexanizm tushunish",
      example: "Creutz-Taube ion nazariyasi"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // QO'LLANILISH
  //  ═══════════════════════════════════════════════════════════════
  applications: [
    {
      field: "Molekulyar elektronika",
      description: "Molekulyar simlar va switchlar",
      examples: ["Elektron tashish zanjirlari", "Molekulyar switchlar", "Yagona elektron tranzistorlar"]
    },
    {
      field: "Elektroxrom qurilmalar",
      description: "Rang o'zgartiruvchi materiallar",
      examples: ["Smart windows", "Displey texnologiyalari", "Oynali qurilmalar"]
    },
    {
      field: "Sensorlar",
      description: "Kimyoviy va biologik sensorlar",
      examples: ["Elektrokimyoviy sensorlar", "Ion-selektiv elektrodlar", "Biosensorlar"]
    },
    {
      field: "Kataliz",
      description: "Ko'p markazli katalizatorlar",
      examples: ["Oksidlanish-qaytarilish katalizi", "Fotoelektrokimyoviy kataliz", "Energiya saqlash"]
    },
    {
      field: "Materialshunoslik",
      description: "Yangi funksional materiallar",
      examples: ["MOF (Metal-Organic Frameworks)", "Koordina tsion polimerlar", "Pigmentlar"]
    }
  ]
}

// ============================================================================
// ROBIN-DAY INTERAKTIV SLAYDER
// ============================================================================
function IVCTSlayder() {
  const [classType, setClassType] = useState(2)
  const c = IVCT_DATA.robinDayClasses[classType]

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">🎚️</span>
        Robin-Day klassifikatsiyasi
      </h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs text-red-400 font-bold whitespace-nowrap">I sinf</span>
          <input
            type="range"
            min="1" max="3"
            value={classType}
            onChange={(e) => setClassType(+e.target.value)}
            className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-green-400 font-bold whitespace-nowrap">III sinf</span>
        </div>

        <div className={`rounded-xl p-6 border ${c.colorClass}`}>
          <h4 className={`font-bold text-xl mb-3 ${c.textColor}`}>{c.title}</h4>
          <p className="text-purple-200 text-sm mb-6 leading-relaxed">{c.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">IVCT:</p>
              <p className="text-purple-200">{c.ivct}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Elektron bog'lanish:</p>
              <p className="text-purple-200">{c.eCoupling}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Redoks asimmetriyasi:</p>
              <p className="text-purple-200">{c.deltaE}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Nazariy mezon:</p>
              <p className="text-purple-200">{c.theory}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Klassik misol:</p>
              <p className="text-purple-200">{c.example}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Rang:</p>
              <p className="text-purple-200">{c.color}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">UB-Vis-NIR:</p>
              <p className="text-purple-200">{c.spectroscopy}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">EPR:</p>
              <p className="text-purple-200">{c.epr}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Rentgen:</p>
              <p className="text-purple-200">{c.xray}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HUSH-ROBINSON NAZARIYASI
// ============================================================================
function HushRobinson() {
  const [param, setParam] = useState("hab")

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">📐</span>
        Hush-Robinson nazariyasi
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "hab", label: "H_ab ta'siri" },
          { key: "lambda", label: "λ ta'siri" },
          { key: "formula", label: "Formulalar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setParam(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              param === t.key
                ? "bg-purple-600/80 text-white border border-purple-400/50"
                : "bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
        {param === "hab" && (
          <div className="space-y-4">
            <h4 className="text-purple-400 font-bold text-lg">{IVCT_DATA.hushRobinson.parameters.h_ab.title}</h4>
            <p className="text-purple-200 text-sm mb-4">{IVCT_DATA.hushRobinson.parameters.h_ab.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400 font-bold text-lg mb-1">H_ab ≈ 0</p>
                <p className="text-purple-300 font-semibold mb-2">I sinf</p>
                <p className="text-purple-400">Ikki mustaqil kompleks. Valentlik 'muzlatilgan'. IVCT yo'q.</p>
              </div>
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-yellow-400 font-bold text-lg mb-1">H_ab ≈ λ/2</p>
                <p className="text-purple-300 font-semibold mb-2">II sinf</p>
                <p className="text-purple-400">Qisman delokalizatsiya. IVCT keng polosa.</p>
              </div>
              <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-green-400 font-bold text-lg mb-1">H_ab {'>'} λ/2</p>
                <p className="text-purple-300 font-semibold mb-2">III sinf</p>
                <p className="text-purple-400">To'liq delokalizatsiya. IVCT tor va intensiv.</p>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
              <p className="text-yellow-400 font-bold mb-2">H_ab ga ta'sir etuvchi omillar:</p>
              <ul className="text-purple-200 space-y-1 text-sm">
                {IVCT_DATA.hushRobinson.parameters.h_ab.factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {param === "lambda" && (
          <div className="space-y-4">
            <h4 className="text-purple-400 font-bold text-lg">{IVCT_DATA.hushRobinson.parameters.lambda.title}</h4>
            <p className="text-purple-200 text-sm mb-4">{IVCT_DATA.hushRobinson.parameters.lambda.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-yellow-400 font-bold mb-2">{IVCT_DATA.hushRobinson.parameters.lambda.inner.title}</p>
                <ul className="text-purple-200 space-y-1">
                  {IVCT_DATA.hushRobinson.parameters.lambda.inner.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-yellow-400 font-bold mb-2">{IVCT_DATA.hushRobinson.parameters.lambda.outer.title}</p>
                <ul className="text-purple-200 space-y-1">
                  {IVCT_DATA.hushRobinson.parameters.lambda.outer.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
              <p className="text-yellow-400 font-bold mb-2">λ ning ahamiyati:</p>
              <p className="text-purple-200 text-sm">{IVCT_DATA.hushRobinson.parameters.lambda.significance}</p>
            </div>
          </div>
        )}

        {param === "formula" && (
          <div className="space-y-4">
            <h4 className="text-purple-400 font-bold text-lg">Hush-Robinson formulalari</h4>
            <div className="space-y-3 text-xs">
              {Object.entries(IVCT_DATA.hushRobinson.formulas).map(([key, f]) => (
                <div key={key} className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-bold mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</p>
                  <p className="font-mono text-purple-200 text-base mb-2">{f.formula}</p>
                  <p className="text-purple-400 mb-1">{f.description}</p>
                  <p className="text-purple-300 italic">{f.note}</p>
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
// KLASSIK MISOLLAR
// ============================================================================
function IVCTMisollar() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">🔬</span>
        Klassik IVCT misollari
      </h3>

      <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-3 text-yellow-400">Xususiyat</th>
                <th className="text-left py-3 px-3 text-blue-400">Prussiya ko'ki</th>
                <th className="text-left py-3 px-3 text-purple-400">Creutz-Taube ioni</th>
                <th className="text-left py-3 px-3 text-pink-400">Mg-Pc dimer</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {IVCT_DATA.classicExamples[0] && (
                <>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">Formula</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 font-mono text-[10px]" dangerouslySetInnerHTML={{ __html: ex.formulaHTML }} />
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">Metallar</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px]">{ex.metals}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">Ko'prik</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px]">{ex.bridge}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">IVCT λ_max</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px]">{ex.ivctLambda}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">IVCT ε</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px]">{ex.ivctEpsilon}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">Δν₁/₂</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px]">{ex.halfWidth}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">Robin-Day</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px] font-bold">{ex.robinDay}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">H_ab</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px] font-mono">{ex.h_ab}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">λ</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px] font-mono">{ex.lambda}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold">Rang</td>
                    {IVCT_DATA.classicExamples.map((ex, i) => (
                      <td key={i} className="py-2 px-3 text-[10px]">{ex.color}</td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function IVCTPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-slate-950 text-white">
      {/* MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-purple-950 to-blue-950 border-2 border-purple-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🟣</span> IVCT & MMCT — METALL-METALL ZARYAD KO'CHISHI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-purple-300">IVCT (InterValence Charge Transfer)</strong> — aralash valentli komplekslarda
              bir metall markazidan ikkinchisiga ko'prik ligand orqali elektron ko'chishi.
              <strong className="text-yellow-400"> Robin-Day klassifikatsiyasi</strong> va
              <strong className="text-yellow-400"> Hush-Robinson nazariyasi</strong> bilan!
            </p>
            <div className="bg-purple-900/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-purple-400 font-bold mb-2">🔬 Asosiy misollar:</div>
                  <div className="text-purple-200">
                    <strong>Prussiya ko'ki:</strong> II sinf
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Creutz-Taube:</strong> III sinf
                  </div>
                </div>
                <div>
                  <div className="text-purple-400 font-bold mb-2">📊 Parametrlar:</div>
                  <div className="text-purple-200">
                    <strong>H_ab:</strong> elektron bog'lanish
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>λ:</strong> qayta tashkilanish energiyasi
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-purple-400 font-semibold">IVCT & MMCT</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-purple-400 flex items-center gap-2">
                  <span className="text-3xl">🟣</span>
                  IVCT & MMCT
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  Metall-Metall zaryad ko'chishi • Aralash valentli komplekslar
                </p>
              </div>
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="text-xs bg-purple-600/80 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Zaryad ko'chishi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-purple-600 hover:bg-purple-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-600/20 border border-purple-600/30 rounded-full text-xs font-semibold text-purple-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ARALASH VALENTLI KOMPLEKSLAR
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                IVCT & MMCT
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">Metall-Metall zaryad ko'chishi</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-purple-400">IVCT (InterValence Charge Transfer)</strong> — aralash valentli
              komplekslarda bir metall markazidan ikkinchisiga <strong className="text-yellow-400">ko'prik ligand orqali</strong> elektron ko'chishi.
              Bu — <strong className="text-purple-400">MMCT (Metal-to-Metal Charge Transfer)</strong> ning maxsus turi.
              <strong className="text-purple-400"> Robin-Day klassifikatsiyasi</strong> va
              <strong className="text-purple-400"> Hush-Robinson nazariyasi</strong> bilan to'liq tushunish.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🟣</div>
                <div className="text-xl font-bold text-purple-400">3</div>
                <div className="text-xs text-purple-400 mt-1">Robin-Day sinfi</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-xl font-bold text-purple-400">H_ab</div>
                <div className="text-xs text-purple-400 mt-1">Elektron bog'lanish</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">λ</div>
                <div className="text-xl font-bold text-purple-400">λ</div>
                <div className="text-xs text-purple-400 mt-1">Qayta tashkilanish</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔵</div>
                <div className="text-xl font-bold text-purple-400">680 nm</div>
                <div className="text-xs text-purple-400 mt-1">Prussiya ko'ki</div>
              </div>
            </div>
          </div>
        </div>

        {/* PRUSSIYA KO'KI CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 border-2 border-blue-500/50 rounded-3xl p-8 relative overflow-hidden hover:border-blue-400/70 transition-all">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🔵</div>
          <div className="relative z-10">
            <div className="flex items-start gap-6 flex-col md:flex-row">
              <div className="text-7xl">🔵</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-400">Prussiya ko'ki</h3>
                  <span className="px-3 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs font-bold">
                    ROBIN-DAY II SINF
                  </span>
                </div>
                <p className="text-purple-200 mb-4 leading-relaxed">
                  <strong className="text-blue-400">Fe₄[Fe(CN)₆]₃</strong> — klassik II sinf IVCT namunasi.
                  Fe²⁺ va Fe³⁺ aralash valentli, CN⁻ ko'prik orqali elektron ko'chishi.
                  <strong className="text-yellow-400"> ~680 nm da IVCT band</strong> → to'q ko'k rang.
                  Robin-Day klassifikatsiyasi, Hush-Robinson nazariyasi uchun eng yaxshi o'quv materiali.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-purple-950/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-purple-400">IVCT</div>
                    <div className="text-lg font-bold text-blue-400">~680 nm</div>
                  </div>
                  <div className="bg-purple-950/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-purple-400">ε</div>
                    <div className="text-lg font-bold text-blue-400">~10 000</div>
                  </div>
                  <div className="bg-purple-950/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-purple-400">H_ab</div>
                    <div className="text-lg font-bold text-blue-400">~1000</div>
                  </div>
                  <div className="bg-purple-950/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-purple-400">λ</div>
                    <div className="text-lg font-bold text-blue-400">~8000</div>
                  </div>
                </div>
                <Link
                  href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct/prussiya-koki"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-2xl text-white font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                >
                  <span>🔵</span>
                  <span>Prussiya ko'ki — Batafsil o'rganish</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            IVCT — aralash valentli komplekslarning xarakterli belgisi
          </h2>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">IVCT (InterValence Charge Transfer)</strong> —
              aralash valentli komplekslarda bir metall markazidan ikkinchisiga
              <strong className="text-yellow-400"> ko'prik ligand orqali</strong> elektron ko'chishi. Bu —
              <strong className="text-purple-400"> MMCT (Metal-to-Metal Charge Transfer)</strong> ning maxsus turi.
              IVCT <strong className="text-purple-400">Robin-Day klassifikatsiyasi</strong> (1967) bo'yicha
              I, II, III sinflarga bo'linadi — elektron delokalizatsiyasi darajasiga qarab.
              <strong className="text-purple-400"> Hush-Robinson nazariyasi</strong> IVCT energiyasi, shakli va intensivligini
              <strong className="text-yellow-400"> H_ab</strong> va <strong className="text-yellow-400">λ</strong> orqali tushuntiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-3">IVCT shartlari</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 flex-shrink-0">•</span>
                  <span><strong>Kamida ikkita metall markazi</strong> — ko'prik ligand orqali bog'langan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 flex-shrink-0">•</span>
                  <span><strong>Turli oksidlanish darajalari</strong> — Mⁿ⁺ va M⁽ⁿ⁺¹⁾⁺</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 flex-shrink-0">•</span>
                  <span><strong>Ko'prik ligand</strong> — elektron o'tish uchun yo'l</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 flex-shrink-0">•</span>
                  <span><strong>Termal yoki optik</strong> elektron ko'chishi</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-3">Robin-Day klassifikatsiyasi</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-red-600/10 border border-red-500/30 rounded p-2">
                  <p className="text-red-400 font-bold">I sinf:</p>
                  <p className="text-purple-300">To'liq lokalizatsiyalangan — 2H_ab {'<<'} λ</p>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2">
                  <p className="text-yellow-400 font-bold">II sinf:</p>
                  <p className="text-purple-300">Qisman delokalizatsiyalangan — 2H_ab ≈ λ</p>
                </div>
                <div className="bg-green-600/10 border border-green-500/30 rounded p-2">
                  <p className="text-green-400 font-bold">III sinf:</p>
                  <p className="text-purple-300">To'liq delokalizatsiyalangan — 2H_ab {'>'} λ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IVCTSlayder />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <HushRobinson />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IVCTMisollar />
        </div>

        {/* TARIX */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(IVCT_DATA.history).map(([key, h]) => (
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
                  {h.contribution && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Hissa:</span>
                      <span className="text-purple-200 text-xs">{h.contribution}</span>
                    </div>
                  )}
                  {h.journal && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Jurnal:</span>
                      <span className="text-purple-200 text-xs">{h.journal}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TADQIQOT USULLARI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Tadqiqot usullari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IVCT_DATA.researchMethods.map((method, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">{method.method}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-purple-400 text-xs mb-1">Qo'llanilishi:</div>
                    <p className="text-purple-200">{method.application}</p>
                  </div>
                  <div>
                    <div className="text-purple-400 text-xs mb-1">Ma'lumot:</div>
                    <p className="text-purple-200">{method.information}</p>
                  </div>
                  <div>
                    <div className="text-purple-400 text-xs mb-1">Afzallik:</div>
                    <p className="text-green-400 text-xs">{method.advantage}</p>
                  </div>
                  <div className="bg-purple-950/50 rounded-lg p-2 mt-2">
                    <p className="text-yellow-400 text-xs font-mono">{method.example}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {IVCT_DATA.applications.map((app, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-pink-400 mb-3">{app.field}</h3>
                <p className="text-purple-200 text-sm mb-3">{app.description}</p>
                <ul className="space-y-1 text-xs text-purple-300">
                  {app.examples.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li>IVCT — <strong className="text-purple-400">aralash valentli komplekslarda Mⁿ⁺ → M⁽ⁿ⁺¹⁾⁺</strong> elektron ko'chishi, ko'prik ligand orqali</li>
            <li><strong className="text-purple-400">Robin-Day:</strong> I sinf (lokalizatsiyalangan), II sinf (qisman), III sinf (to'liq delokalizatsiyalangan)</li>
            <li><strong className="text-purple-400">Hush-Robinson:</strong> 2H_ab {'<<'} λ → I sinf; 2H_ab ≈ λ → II sinf; 2H_ab {'>'} λ → III sinf</li>
            <li><strong className="text-purple-400">Prussiya ko'ki:</strong> II sinf, λ_max ~680 nm, ko'k rang; <strong className="text-purple-400">Creutz-Taube:</strong> III sinf, λ_max ~1570 nm (NIR)</li>
            <li>IVCT — <strong className="text-purple-400">molekulyar simlar, elektron tashish, elektroxrom qurilmalar</strong> uchun asos</li>
          </ol>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← MLCT
          </Link>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct/prussiya-koki"
              className="px-6 py-3 bg-blue-600/80 hover:bg-blue-500 rounded-xl text-white font-bold flex items-center gap-2"
            >
              <span>🔵</span>
              <span>Prussiya ko'ki</span>
            </Link>
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/solvatoxromizm" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">
              Solvatoxromizm →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Chuqurlashgan mavzular</p>
          <p className="mt-1">IVCT & MMCT • Robin-Day (1967) • Hush (1967) • Creutz-Taube (1969)</p>
        </div>
      </footer>
    </main>
  )
}