"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// SOLVATOXROMIZM — ERITUVCHI TA'SIRIDA SPEKTR O'ZGARISHI
// Manbalar: Reichardt (2003), Lippert (1957), Mataga (1956),
//           Bakhshiev, Kawski, Suppan (1990), Maroncelli (1993)
//  ═══════════════════════════════════════════════════════════════════════════════

const SOLVATO_DATA = {
  //  ═══════════════════════════════════════════════════════════════
  // ASOSIY TUSHUNCHA
  //  ═══════════════════════════════════════════════════════════════
  concept: {
    definition: "Solvatoxromizm — erituvchi o'zgarishi bilan molekulaning elektron yutilish yoki nurlanish spektrining siljishi va intensivligi o'zgarishi",
    abbreviation: "Solvatochromism",
    fullName: "Solvent-induced chromism",
    type: "Spektroskopik fenomen",
    origin: "Yunoncha: solvato (erituvchi) + chroma (rang)",
    result: "Rang yoki spektr o'zgarishi — erituvchi-molekula o'zaro ta'siri natijasi"
  },

  //  ═══════════════════════════════════════════════════════════════
  // TURLARI
  //  ═══════════════════════════════════════════════════════════════
  types: {
    positive: {
      name: "Ijobiy solvatoxromizm",
      alias: "Bathoxromik (qizil) siljish",
      description: "Erituvchi qutbliligi oshishi bilan spektr uzun to'lqin (qizil) tomon siljiydi",
      mechanism: "Qo'zg'algan holat (excited state) asosiy holatdan ko'ra kuchliroq qutblangan. Qutbli erituvchi qo'zg'algan holatni barqarorlashtiradi → energiya farqi kamayadi → uzun to'lqin siljish",
      energyDiagram: "E(excited) kamayadi, E(ground) deyarli o'zgarmaydi → ΔE kamayadi",
      examples: ["Reichardt bo'yoqi (ET(30))", "4-Nitroanilin", "Kumarinlar", "Merocyanine bo'yoqlari"],
      colorChange: "Rang qizil tomonga o'zgaradi (sariq → qizil)",
      symbol: "λ_max ↑ (qutblilik bilan)"
    },
    negative: {
      name: "Salbiy solvatoxromizm",
      alias: "Gipsoxromik (ko'k) siljish",
      description: "Erituvchi qutbliligi oshishi bilan spektr qisqa to'lqin (ko'k) tomon siljiydi",
      mechanism: "Asosiy holat qo'zg'algan holatdan ko'ra kuchliroq qutblangan. Qutbli erituvchi asosiy holatni barqarorlashtiradi → energiya farqi oshadi → qisqa to'lqin siljish",
      energyDiagram: "E(ground) kamayadi, E(excited) deyarli o'zgarmaydi → ΔE oshadi",
      examples: ["[Cu(H₂O)₆]²⁺ → [Cu(NH₃)₄(H₂O)₂]²⁺", "n→π* o'tishlar (aseton)", "Fenolat ioni"],
      colorChange: "Rang ko'k tomonga o'zgaradi (qizil → sariq)",
      symbol: "λ_max ↓ (qutblilik bilan)"
    },
    inverse: {
      name: "Teskari solvatoxromizm",
      alias: "Non-monotonic behavior",
      description: "Ba'zi molekulalarda spektr siljishi qutblilik bilan monotonic emas",
      mechanism: "Murakkab erituvchi-molekula o'zaro ta'siri — vodorod bog'lanish va dipol effektlari raqobatlashadi",
      energyDiagram: "E(ground) va E(excited) har xil qutblilikda turli xilda o'zgaradi",
      examples: ["Betain bo'yoqlari", "Ba'zi spiropiranlar"],
      colorChange: "Murakkab rang o'zgarishlari",
      symbol: "λ_max ↕ (noto'g'ri bog'liqlik)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // MEXANIZM — ERITUVCHI TA'SIRI
  //  ═══════════════════════════════════════════════════════════════
  mechanism: {
    interactions: [
      {
        type: "Dipol-dipol o'zaro ta'sir",
        description: "Erituvchi va erigan modda dipollari orasidagi elektrostatik ta'sir",
        strength: "O'rta (1-10 kJ/mol)",
        timeScale: "Juda tez (fs-ps)",
        effect: "Spektral siljishning asosiy sababi"
      },
      {
        type: "Vodorod bog'lanish",
        description: "Erituvchi va molekula o'rtasidagi H-bog'lanish",
        strength: "Kuchli (10-40 kJ/mol)",
        timeScale: "Tez (ps)",
        effect: "n→π* o'tishlarga katta ta'sir"
      },
      {
        type: "π-π stacking",
        description: "Aromatik tizimlar orasidagi o'zaro ta'sir",
        strength: "O'rta (5-15 kJ/mol)",
        timeScale: "O'rta (ps-ns)",
        effect: "Aromatik bo'yoqlar spektriga ta'sir"
      },
      {
        type: "Dispersion (London) kuchlar",
        description: "Vaqtinchalik dipollar orasidagi ta'sir",
        strength: "Kuchsiz (0.1-5 kJ/mol)",
        timeScale: "Juda tez (fs)",
        effect: "Barcha molekulalarda mavjud, kichik hissa"
      }
    ],
    solventParameters: {
      polarity: {
        name: "Erituvchi qutbliligi",
        parameters: ["Dielectric constant (ε)", "Refractive index (n)", "Dipol moment (μ)"],
        significance: "Spektral siljishning asosiy omili"
      },
      hydrogenBonding: {
        name: "Vodorod bog'lanish qobiliyati",
        parameters: ["α (H-bond donor)", "β (H-bond acceptor)", "π* (dipolarity/polarizability)"],
        significance: "Kamlet-Taft parametrlari"
      },
      kamletTaft: {
        name: "Kamlet-Taft tenglamasi",
        formula: "ν = ν₀ + aα + bβ + sπ*",
        description: "α — H-bond donorlik, β — H-bond akseptorlik, π* — dipolarity/polarizability"
      }
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // LIPPERT-MATAGA TENGLAMASI
  //  ═══════════════════════════════════════════════════════════════
  lippertMataga: {
    formula: "ν_abs - ν_em = (2/hc) × [(μ_e - μ_g)²/a³] × Δf + const",
    deltaF: "Δf = [(ε-1)/(2ε+1)] - [(n²-1)/(2n²+1)]",
    parameters: {
      nu_abs: "Yutilish chastotasi (sm⁻¹)",
      nu_em: "Nurlanish chastotasi (sm⁻¹)",
      mu_e: "Qo'zg'algan holat dipol momenti (D)",
      mu_g: "Asosiy holat dipol momenti (D)",
      a: "Onsager radiusi (Å)",
      epsilon: "Dielectric constant",
      n: "Refractive index"
    },
    application: "Stokes shift ni erituvchi qutbliligi bilan bog'lash → Δμ (dipol momenti o'zgarishi) ni aniqlash",
    assumptions: [
      "Sferik molekula modeli (Onsager)",
      "Erituvchi uzluksiz dielektrik muhit",
      "Nuqtaviy dipol yaqinlashuvi",
      "Qo'zg'algan holat geometriyasi o'zgarmaydi"
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // REICHARDT BO'YOG'I (ET(30))
  //  ═══════════════════════════════════════════════════════════════
  reichardt: {
    name: "Reichardt bo'yoqi (Betaine 30)",
    fullName: "2,6-Diphenyl-4-(2,4,6-triphenylpyridinium-1-yl)phenolate",
    et30Definition: "ET(30) = h·c·ν_max / (N_A) [kcal/mol] — eng keng tarqalgan qutblilik parametri",
    range: "ET(30) = 30.7 (tetrametilsilan) - 63.1 kcal/mol (suv)",
    colorChange: "Yashil (past qutblilik) → Qizil (o'rta) → Rangsiz (yuqori qutblilik)",
    sensitivity: "Juda sezgir — λ_max 453 nm (suv) dan 810 nm (difenil efir) gacha",
    applications: [
      "Erituvchi qutbliligini o'lchash",
      "Mikro-muhit polarity sensorlari",
      "Polimer, mitsell, biologik membranalar",
      "Katalitik sistemalar"
    ],
    limitations: [
      "Kuchli kislotali muhitda beqaror",
      "Kuchli qaytaruvchi muhitda beqaror",
      "Ba'zi erituvchilarda erimeydi"
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // KLASSIK MISOLLAR
  //  ═══════════════════════════════════════════════════════════════
  examples: [
    {
      name: "Mis(II) akva kompleksi",
      formula: "[Cu(H₂O)₆]²⁺ → [Cu(NH₃)₄(H₂O)₂]²⁺",
      formulaHTML: "[Cu(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup> → [Cu(NH<sub>3</sub>)<sub>4</sub>(H<sub>2</sub>O)<sub>2</sub>]<sup>2+</sup>",
      colorBefore: "Och ko'k",
      colorAfter: "To'q ko'k",
      lambdaBefore: "~800 nm",
      lambdaAfter: "~620 nm",
      shift: "Gipsoxromik (ko'k siljish)",
      mechanism: "NH₃ kuchliroq ligand → Δ₀ oshadi → qisqa to'lqin siljish",
      type: "Salbiy solvatoxromizm (ligand almashinish)"
    },
    {
      name: "Reichardt bo'yoqi",
      formula: "Betaine 30",
      formulaHTML: "C<sub>41</sub>H<sub>31</sub>NO",
      colorBefore: "Yashil (n-hexane)",
      colorAfter: "Qizil (etanol)",
      lambdaBefore: "810 nm",
      lambdaAfter: "550 nm",
      shift: "Bathoxromik (qizil siljish)",
      mechanism: "ICT (intramolecular charge transfer) — qo'zg'algan holat kuchli qutblangan",
      type: "Ijobiy solvatoxromizm"
    },
    {
      name: "4-Nitroanilin",
      formula: "p-NO₂-C₆H₄-NH₂",
      formulaHTML: "p-NO<sub>2</sub>-C<sub>6</sub>H<sub>4</sub>-NH<sub>2</sub>",
      colorBefore: "Och sariq (hexane)",
      colorAfter: "Sariq (etanol)",
      lambdaBefore: "330 nm",
      lambdaAfter: "365 nm",
      shift: "Bathoxromik (qizil siljish)",
      mechanism: "π→π* o'tish, qo'zg'algan holat qutbliligi yuqori",
      type: "Ijobiy solvatoxromizm"
    },
    {
      name: "Aseton n→π* o'tishi",
      formula: "CH₃COCH₃",
      formulaHTML: "CH<sub>3</sub>COCH<sub>3</sub>",
      colorBefore: "280 nm (hexane)",
      colorAfter: "265 nm (suv)",
      lambdaBefore: "280 nm",
      lambdaAfter: "265 nm",
      shift: "Gipsoxromik (ko'k siljish)",
      mechanism: "n→π* o'tish. Suv n-elektronlarni H-bog' bilan barqarorlashtiradi",
      type: "Salbiy solvatoxromizm"
    },
    {
      name: "Kumarin 153",
      formula: "Kumarin bo'yoq",
      formulaHTML: "Kumarin 153",
      colorBefore: "Ko'k nurlanish (hexane)",
      colorAfter: "Yashil nurlanish (suv)",
      lambdaBefore: "420 nm (em)",
      lambdaAfter: "510 nm (em)",
      shift: "Bathoxromik (qizil siljish)",
      mechanism: "ICT — qo'zg'algan holat kuchli qutblangan",
      type: "Ijobiy solvatoxromizm"
    },
    {
      name: "Spiropiran",
      formula: "Spiropiran → Merocyanine",
      formulaHTML: "Spiropiran → Merocyanine",
      colorBefore: "Rangsiz (yopiq shakl)",
      colorAfter: "Qizil (ochiq shakl)",
      lambdaBefore: "UV",
      lambdaAfter: "550 nm",
      shift: "Foto-xromizm + solvatoxromizm",
      mechanism: "UV bilan ochiladi, qutbli erituvchida barqaror",
      type: "Murakkab (foto + solvato)"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // ERITUVCHILAR JADVALI
  //  ═══════════════════════════════════════════════════════════════
  solvents: [
    { name: "Tetrametilsilan", formula: "(CH₃)₄Si", epsilon: 1.9, n: 1.358, et30: 30.7, polarity: "Juda past" },
    { name: "n-Hexane", formula: "C₆H₁₄", epsilon: 1.9, n: 1.375, et30: 31.0, polarity: "Juda past" },
    { name: "Toluol", formula: "C₆H₅CH₃", epsilon: 2.4, n: 1.496, et30: 33.9, polarity: "Past" },
    { name: "Dietil efir", formula: "Et₂O", epsilon: 4.3, n: 1.352, et30: 34.6, polarity: "Past" },
    { name: "THF", formula: "C₄H₈O", epsilon: 7.6, n: 1.407, et30: 37.4, polarity: "O'rta" },
    { name: "Dixlorometan", formula: "CH₂Cl₂", epsilon: 9.1, n: 1.424, et30: 40.7, polarity: "O'rta" },
    { name: "Aseton", formula: "(CH₃)₂CO", epsilon: 20.7, n: 1.359, et30: 42.2, polarity: "O'rta-yuqori" },
    { name: "Etanol", formula: "C₂H₅OH", epsilon: 24.3, n: 1.361, et30: 51.9, polarity: "Yuqori" },
    { name: "Metanol", formula: "CH₃OH", epsilon: 32.6, n: 1.329, et30: 55.4, polarity: "Yuqori" },
    { name: "DMSO", formula: "(CH₃)₂SO", epsilon: 46.7, n: 1.477, et30: 45.1, polarity: "Yuqori" },
    { name: "DMF", formula: "(CH₃)₂NCHO", epsilon: 36.7, n: 1.430, et30: 43.9, polarity: "Yuqori" },
    { name: "Asetonitril", formula: "CH₃CN", epsilon: 37.5, n: 1.344, et30: 46.0, polarity: "Yuqori" },
    { name: "Suv", formula: "H₂O", epsilon: 78.5, n: 1.333, et30: 63.1, polarity: "Juda yuqori" }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TARIX
  //  ═══════════════════════════════════════════════════════════════
  history: {
    hantzsch: {
      year: 1890,
      scientist: "Arthur Rudolf Hantzsch",
      achievement: "Birinchi solvatoxromizm kuzatuvi",
      contribution: "Organik bo'yoqlarning rang o'zgarishini erituvchiga bog'liqligini tavsifladi"
    },
    lippert: {
      year: 1957,
      scientist: "Ernst Lippert (Germaniya)",
      achievement: "Lippert tenglamasi — Stokes shift va erituvchi bog'liqligi",
      contribution: "Nazariy model — Onsager sferik modeli asosida"
    },
    mataga: {
      year: 1956,
      scientist: "Noboru Mataga (Yaponiya)",
      achievement: "Mataga tenglamasi — Lippert bilan parallel ravishda",
      contribution: "Fluoresensiya solvatoxromizmi nazariyasi"
    },
    bakhshiev: {
      year: "1960-yillar",
      scientist: "N.G. Bakhshiev (SSSR)",
      achievement: "Universal solvatoxromizm tenglamasi",
      contribution: "Kengaytirilgan nazariy model"
    },
    reichardt: {
      year: 1963,
      scientist: "Christian Reichardt (Germaniya)",
      achievement: "ET(30) parametri — empirik qutblilik shkalasi",
      contribution: "Standart solvatoxrom bo'yoq — Betaine 30"
    },
    kamlet_taft: {
      year: 1976,
      scientist: "M.J. Kamlet va R.W. Taft (AQSh)",
      achievement: "Kamlet-Taft parametrlari (α, β, π*)",
      contribution: "Ko'p parametrli solvatoxromizm modeli"
    },
    maroncelli: {
      year: 1993,
      scientist: "Mark Maroncelli (AQSh)",
      achievement: "Dinamik solvatoxromizm — vaqtga bog'liq effektlar",
      contribution: "Femtosekundli spektroskopiya yordamida"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // QO'LLANILISH
  //  ═══════════════════════════════════════════════════════════════
  applications: [
    {
      field: "Erituvchi qutbliligini o'lchash",
      description: "ET(30) yoki boshqa parametrlar orqali",
      examples: ["Yangi erituvchilar", "Erituvchi aralashmalari", "Ionik suyuqliklar"]
    },
    {
      field: "Mikro-muhit sensorlari",
      description: "Mahalliy polarity ni o'lchash",
      examples: ["Polimer ichida", "Mitsellalarda", "Biologik membranalar"]
    },
    {
      field: "Biologik tadqiqotlar",
      description: "Oqsil, lipid membranalar tuzilishi",
      examples: ["Oqsil buklanishi", "Membrana oquvchanligi", "Lipid raflar"]
    },
    {
      field: "Materialshunoslik",
      description: "Funksional materiallar dizayni",
      examples: ["Solvatoxrom sensorlar", "Foto-xrom materiallar", "Smart windows"]
    },
    {
      field: "Kataliz",
      description: "Katalitik muhit qutbliligi",
      examples: ["Fazaviy o'tish katalizatorlari", "Mitsellyar kataliz"]
    },
    {
      field: "Fluoresensiya spektroskopiyasi",
      description: "Muhit haqida ma'lumot",
      examples: ["Hujayra ichi polarity", "Oqsil bog'lanish joylari", "DNK interkalatsiyasi"]
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "UB-Vis spektroskopiya",
      application: "Yutilish spektrlarini o'lchash",
      information: "λ_max, ε, band shakli",
      advantage: "Tez, arzon, oddiy",
      example: "Reichardt bo'yoqi 453-810 nm oralig'ida"
    },
    {
      method: "Fluoresensiya spektroskopiyasi",
      application: "Nurlanish spektrlari va Stokes shift",
      information: "λ_em, kvant unumdorligi, umr",
      advantage: "Yuqori sezgirlik, mikro-muhit haqida",
      example: "Kumarin 153 nurlanishi 420-510 nm"
    },
    {
      method: "Vaqtga bog'liq fluoresensiya (TCSPC)",
      application: "Dinamik solvatoxromizm",
      information: "Solvatatsiya kinetikasi, τ",
      advantage: "ps-ns vaqt shkalasi",
      example: "Suv solvatatsiyasi ~1 ps, etanol ~20 ps"
    },
    {
      method: "Femtosekundli spektroskopiya",
      application: "Juda tez solvatatsiya jarayonlari",
      information: "Inertsiyal komponent",
      advantage: "fs-ps vaqt shkalasi",
      example: "Maroncelli (1993) — suv inertsiyal komponenti"
    },
    {
      method: "TD-DFT hisob-kitoblari",
      application: "Nazariy tahlil",
      information: "μ_g, μ_e, spektral siljishlar",
      advantage: "Mexanizm tushunish",
      example: "PCM (Polarizable Continuum Model)"
    },
    {
      method: "NMR spektroskopiya",
      application: "Erituvchi-molekula komplekslari",
      information: "Strukturaviy ma'lumotlar",
      advantage: "Atom darajasida tafsilot",
      example: "H-bog'lanishni aniqlash"
    }
  ]
}

// ============================================================================
// ERITUVCHI TANLASH INTERAKTIV KOMPONENTI
// ============================================================================
function SolventSelector() {
  const [selectedSolvent, setSelectedSolvent] = useState("Etanol")
  const solvent = SOLVATO_DATA.solvents.find(s => s.name === selectedSolvent)

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">🧪</span>
        Erituvchini tanlang
      </h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
          {SOLVATO_DATA.solvents.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelectedSolvent(s.name)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedSolvent === s.name
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:bg-purple-700/40"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {solvent && (
          <div className="bg-purple-900/50 rounded-xl p-6 border border-purple-600/30">
            <h4 className="text-xl font-bold text-cyan-400 mb-4">{solvent.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Formula:</div>
                <div className="text-white font-mono">{solvent.formula}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Dielectric constant (ε):</div>
                <div className="text-white font-mono">{solvent.epsilon}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Refractive index (n):</div>
                <div className="text-white font-mono">{solvent.n}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">ET(30) (kcal/mol):</div>
                <div className="text-white font-mono font-bold">{solvent.et30}</div>
              </div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
              <div className="text-yellow-400 text-xs mb-1 font-bold">Qutblilik:</div>
              <div className="text-white">{solvent.polarity}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// LIPPERT-MATAGA KALKULYATORI
// ============================================================================
function LippertCalculator() {
  const [epsilon, setEpsilon] = useState(24.3)
  const [refractiveIndex, setRefractiveIndex] = useState(1.361)
  const [muG, setMuG] = useState(3.0)
  const [muE, setMuE] = useState(8.0)
  const [radius, setRadius] = useState(5.0)

  const deltaF = useMemo(() => {
    const f1 = (epsilon - 1) / (2 * epsilon + 1)
    const f2 = (refractiveIndex ** 2 - 1) / (2 * refractiveIndex ** 2 + 1)
    return f1 - f2
  }, [epsilon, refractiveIndex])

  const stokesShift = useMemo(() => {
    const deltaMu = muE - muG
    const a3 = radius ** 3
    // Soddalashtirilgan hisob (const qismi tashlab ketilgan)
    const factor = 2 * (deltaMu ** 2) / a3
    return factor * deltaF * 5034 // sm⁻¹ ga o'tkazish (soddalashtirilgan)
  }, [deltaF, muG, muE, radius])

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">🧮</span>
        Lippert-Mataga kalkulyatori
      </h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="bg-purple-900/50 rounded-lg p-4 mb-4">
          <div className="text-yellow-400 text-xs mb-2 font-bold">Formula:</div>
          <div className="text-white font-mono text-sm">
            ν_abs - ν_em = (2/hc) × [(μ_e - μ_g)²/a³] × Δf + const
          </div>
          <div className="text-purple-400 text-xs mt-2">
            Δf = [(ε-1)/(2ε+1)] - [(n²-1)/(2n²+1)]
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-yellow-400 text-xs mb-2 font-bold">
              Dielectric constant (ε): {epsilon.toFixed(1)}
            </label>
            <input
              type="range"
              min="1"
              max="80"
              step="0.1"
              value={epsilon}
              onChange={(e) => setEpsilon(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>1 (hexane)</span>
              <span>80 (suv)</span>
            </div>
          </div>
          <div>
            <label className="block text-yellow-400 text-xs mb-2 font-bold">
              Refractive index (n): {refractiveIndex.toFixed(3)}
            </label>
            <input
              type="range"
              min="1.3"
              max="1.6"
              step="0.001"
              value={refractiveIndex}
              onChange={(e) => setRefractiveIndex(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>1.30</span>
              <span>1.60</span>
            </div>
          </div>
          <div>
            <label className="block text-yellow-400 text-xs mb-2 font-bold">
              μ_g (asosiy holat dipol, D): {muG.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={muG}
              onChange={(e) => setMuG(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>0 D</span>
              <span>15 D</span>
            </div>
          </div>
          <div>
            <label className="block text-yellow-400 text-xs mb-2 font-bold">
              μ_e (qo'zg'algan holat dipol, D): {muE.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={muE}
              onChange={(e) => setMuE(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>0 D</span>
              <span>20 D</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-yellow-400 text-xs mb-2 font-bold">
              Onsager radiusi (a, Å): {radius.toFixed(1)}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              step="0.1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>3 Å</span>
              <span>10 Å</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-4 text-center">
            <div className="text-cyan-400 text-xs mb-2">Δf (orientation polarizability):</div>
            <div className="text-white font-mono text-2xl font-bold">{deltaF.toFixed(4)}</div>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-green-400 text-xs mb-2">Stokes shift (≈):</div>
            <div className="text-white font-mono text-2xl font-bold">
              {Math.abs(stokesShift).toFixed(0)} sm⁻¹
            </div>
            <div className="text-purple-400 text-[10px] mt-1">(proporsional qiymat)</div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3 mt-4 text-xs">
          <div className="text-yellow-400 font-bold mb-1">💡 Tushuntirish:</div>
          <div className="text-purple-200">
            ε (dielectric constant) oshishi bilan Δf oshadi → Stokes shift kattalashadi.
            μ_e - μ_g farqi katta bo'lsa, solvatoxrom effekti kuchliroq.
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function SolvatoxromizmPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeType, setActiveType] = useState("positive")
  const [activeExample, setActiveExample] = useState(0)
  const [activeMechanism, setActiveMechanism] = useState(0)
  const [activeMethod, setActiveMethod] = useState(0)
  const [activeApplication, setActiveApplication] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-cyan-950/20 to-slate-950 text-white">
      {/* MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-cyan-950 to-purple-950 border-2 border-cyan-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🌈</span> SOLVATOXROMIZM — ERITUVCHI SPEKTRI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-cyan-300">Solvatoxromizm</strong> — erituvchi o'zgarishi bilan molekulaning
              <strong className="text-yellow-400"> elektron spektrining siljishi</strong>.
              Ijobiy (qizil) va salbiy (ko'k) siljishlar. Lippert-Mataga tenglamasi, ET(30) parametri!
            </p>
            <div className="bg-cyan-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-cyan-400 font-bold mb-2">🌈 Turlari:</div>
                  <div className="text-purple-200">
                    <strong>Ijobiy:</strong> Qutblilik ↑ → λ ↑
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Salbiy:</strong> Qutblilik ↑ → λ ↓
                  </div>
                </div>
                <div>
                  <div className="text-cyan-400 font-bold mb-2">📊 Parametrlar:</div>
                  <div className="text-purple-200">
                    <strong>ET(30):</strong> 30.7-63.1 kcal/mol
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Kamlet-Taft:</strong> α, β, π*
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-cyan-400 font-semibold">Solvatoxromizm</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                  <span className="text-3xl">🌈</span>
                  Solvatoxromizm
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  Erituvchi ta'sirida spektr o'zgarishi • Lippert-Mataga • ET(30)
                </p>
              </div>
              <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="text-xs bg-cyan-600/80 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Zaryad ko'chishi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-cyan-600 hover:bg-cyan-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-cyan-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-600/20 border border-cyan-600/30 rounded-full text-xs font-semibold text-cyan-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              SPEKTROSKOPIK FENOMEN
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Solvatoxromizm
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">Erituvchi ta'sirida spektr o'zgarishi</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-cyan-400">Solvatoxromizm</strong> — erituvchi o'zgarishi bilan
              molekulaning <strong className="text-yellow-400">elektron yutilish yoki nurlanish spektrining</strong> siljishi.
              Erituvchi-molekula o'zaro ta'siri (dipol-dipol, vodorod bog'lanish) natijasi.
              <strong className="text-cyan-400"> Ijobiy</strong> (qizil siljish) va
              <strong className="text-cyan-400"> salbiy</strong> (ko'k siljish) turlari mavjud.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🌈</div>
                <div className="text-xl font-bold text-cyan-400">2</div>
                <div className="text-xs text-purple-400 mt-1">Asosiy tur</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xl font-bold text-cyan-400">ET(30)</div>
                <div className="text-xs text-purple-400 mt-1">Qutblilik parametri</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧮</div>
                <div className="text-xl font-bold text-cyan-400">Lippert</div>
                <div className="text-xs text-purple-400 mt-1">Nazariy model</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧪</div>
                <div className="text-xl font-bold text-cyan-400">13+</div>
                <div className="text-xs text-purple-400 mt-1">Erituvchilar</div>
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

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">{SOLVATO_DATA.concept.definition}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-3">📝 Terminologiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Qisqartma:</span>
                  <span className="text-white font-mono">{SOLVATO_DATA.concept.abbreviation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">To'liq nom:</span>
                  <span className="text-white">{SOLVATO_DATA.concept.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Turi:</span>
                  <span className="text-white">{SOLVATO_DATA.concept.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kelib chiqishi:</span>
                  <span className="text-white text-xs">{SOLVATO_DATA.concept.origin}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-3">💡 Asosiy tamoyil</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Erituvchi va erigan modda orasidagi <strong className="text-yellow-400">elektrostatik o'zaro ta'sir</strong>
                molekulaning asosiy va qo'zg'algan holatlari energiyasini har xil darajada o'zgartiradi.
                Natijada spektral siljish kuzatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* TURLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🌈</span>
            Solvatoxromizm turlari
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(SOLVATO_DATA.types).map(([key, type]) => (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeType === key
                    ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          <div className={`rounded-xl p-6 border ${
            activeType === "positive" ? "bg-red-600/10 border-red-500/30" :
            activeType === "negative" ? "bg-blue-600/10 border-blue-500/30" :
            "bg-yellow-600/10 border-yellow-500/30"
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              activeType === "positive" ? "text-red-400" :
              activeType === "negative" ? "text-blue-400" :
              "text-yellow-400"
            }`}>
              {SOLVATO_DATA.types[activeType].name}
            </h3>
            <p className="text-purple-300 text-sm italic mb-4">
              ({SOLVATO_DATA.types[activeType].alias})
            </p>
            <p className="text-purple-200 mb-4">{SOLVATO_DATA.types[activeType].description}</p>

            <div className="space-y-3">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Mexanizm:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.types[activeType].mechanism}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Energiya diagrammasi:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.types[activeType].energyDiagram}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Rang o'zgarishi:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.types[activeType].colorChange}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-2">Klassik misollar:</div>
                <ul className="space-y-1">
                  {SOLVATO_DATA.types[activeType].examples.map((ex, i) => (
                    <li key={i} className="text-purple-200 text-sm flex items-center gap-2">
                      <span className={activeType === "positive" ? "text-red-400" : activeType === "negative" ? "text-blue-400" : "text-yellow-400"}>•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* MEXANIZM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            Mexanizm — Erituvchi-molekula o'zaro ta'siri
          </h2>

          <div className="space-y-3 mb-6">
            {SOLVATO_DATA.mechanism.interactions.map((interaction, i) => (
              <div
                key={i}
                onClick={() => setActiveMechanism(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeMechanism === i
                    ? "bg-cyan-900/40 border-2 border-cyan-400"
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    activeMechanism === i ? "bg-cyan-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-cyan-400">{interaction.type}</h3>
                  </div>
                </div>
                {activeMechanism === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50 space-y-2">
                    <p className="text-purple-200 text-sm">{interaction.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div className="bg-purple-950/50 rounded p-2">
                        <span className="text-yellow-400 font-bold">Kuch:</span>
                        <span className="text-white ml-1">{interaction.strength}</span>
                      </div>
                      <div className="bg-purple-950/50 rounded p-2">
                        <span className="text-yellow-400 font-bold">Vaqt:</span>
                        <span className="text-white ml-1">{interaction.timeScale}</span>
                      </div>
                      <div className="bg-purple-950/50 rounded p-2">
                        <span className="text-yellow-400 font-bold">Effekt:</span>
                        <span className="text-white ml-1">{interaction.effect}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">Erituvchi parametrlari</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-cyan-400 text-xs font-bold mb-2">Qutblilik:</div>
                <p className="text-purple-200 text-sm mb-2">{SOLVATO_DATA.mechanism.solventParameters.polarity.name}</p>
                <ul className="space-y-1 text-xs text-purple-300">
                  {SOLVATO_DATA.mechanism.solventParameters.polarity.parameters.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-cyan-400 text-xs font-bold mb-2">Kamlet-Taft:</div>
                <div className="bg-purple-900/50 rounded p-2 mb-2 font-mono text-xs text-yellow-400">
                  {SOLVATO_DATA.mechanism.solventParameters.kamletTaft.formula}
                </div>
                <p className="text-purple-300 text-xs">
                  {SOLVATO_DATA.mechanism.solventParameters.kamletTaft.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ERITUVCHI TANLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolventSelector />
        </div>

        {/* LIPPERT-MATAGA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LippertCalculator />

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">⚠️ Taxminlar va cheklovlar</h3>
            <ul className="space-y-2">
              {SOLVATO_DATA.lippertMataga.assumptions.map((a, i) => (
                <li key={i} className="text-purple-200 text-sm flex items-start gap-2">
                  <span className="text-yellow-400 flex-shrink-0">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* REICHARDT BO'YOG'I */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            Reichardt bo'yoqi (ET(30))
          </h2>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-pink-400 mb-3">{SOLVATO_DATA.reichardt.name}</h3>
            <p className="text-purple-300 text-sm italic mb-4">{SOLVATO_DATA.reichardt.fullName}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">ET(30) ta'rifi:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.reichardt.et30Definition}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">ET(30) oralig'i:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.reichardt.range}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Rang o'zgarishi:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.reichardt.colorChange}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Sezgirlik:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.reichardt.sensitivity}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-5">
              <h4 className="text-green-400 font-bold mb-3">✓ Qo'llanilishi</h4>
              <ul className="space-y-2">
                {SOLVATO_DATA.reichardt.applications.map((app, i) => (
                  <li key={i} className="text-purple-200 text-sm flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-5">
              <h4 className="text-red-400 font-bold mb-3">✗ Cheklovlar</h4>
              <ul className="space-y-2">
                {SOLVATO_DATA.reichardt.limitations.map((lim, i) => (
                  <li key={i} className="text-purple-200 text-sm flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* KLASSIK MISOLLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🧪</span>
            Klassik solvatoxromizm misollari
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {SOLVATO_DATA.examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeExample === i
                    ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              {SOLVATO_DATA.examples[activeExample].name}
            </h3>

            <div className="bg-purple-950/50 rounded-lg p-3 mb-4">
              <div className="text-purple-400 text-xs mb-1">Formula:</div>
              <div className="text-white font-mono" dangerouslySetInnerHTML={{ __html: SOLVATO_DATA.examples[activeExample].formulaHTML }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <div className="text-yellow-400 text-xs font-bold mb-2">Past qutblilikda:</div>
                <div className="text-white text-sm mb-1">{SOLVATO_DATA.examples[activeExample].colorBefore}</div>
                <div className="text-cyan-400 font-mono text-sm">λ = {SOLVATO_DATA.examples[activeExample].lambdaBefore}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <div className="text-yellow-400 text-xs font-bold mb-2">Yuqori qutblilikda:</div>
                <div className="text-white text-sm mb-1">{SOLVATO_DATA.examples[activeExample].colorAfter}</div>
                <div className="text-cyan-400 font-mono text-sm">λ = {SOLVATO_DATA.examples[activeExample].lambdaAfter}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Siljish turi:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.examples[activeExample].shift}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Mexanizm:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.examples[activeExample].mechanism}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">Solvatoxromizm turi:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.examples[activeExample].type}</p>
              </div>
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
            {Object.entries(SOLVATO_DATA.history).map(([key, h]) => (
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
            {SOLVATO_DATA.applications.map((app, i) => (
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
              {SOLVATO_DATA.applications[activeApplication].field}
            </h3>
            <p className="text-purple-200 mb-4">{SOLVATO_DATA.applications[activeApplication].description}</p>
            <ul className="space-y-2">
              {SOLVATO_DATA.applications[activeApplication].examples.map((ex, i) => (
                <li key={i} className="text-purple-300 text-sm flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* TADQIQOT USULLARI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Tadqiqot usullari
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {SOLVATO_DATA.researchMethods.map((method, i) => (
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
              {SOLVATO_DATA.researchMethods[activeMethod].method}
            </h3>
            <div className="space-y-3">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Qo'llanilishi:</div>
                <p className="text-purple-200">{SOLVATO_DATA.researchMethods[activeMethod].application}</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Ma'lumot:</div>
                <p className="text-purple-200">{SOLVATO_DATA.researchMethods[activeMethod].information}</p>
              </div>
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                <div className="text-green-400 text-xs mb-1">Afzallik:</div>
                <p className="text-purple-200">{SOLVATO_DATA.researchMethods[activeMethod].advantage}</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                <div className="text-yellow-400 text-xs mb-1 font-mono">Misol:</div>
                <p className="text-purple-200 text-sm">{SOLVATO_DATA.researchMethods[activeMethod].example}</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li><strong className="text-cyan-400">Solvatoxromizm</strong> — erituvchi o'zgarishi bilan spektral siljish, erituvchi-molekula o'zaro ta'siri natijasi</li>
            <li><strong className="text-cyan-400">Ijobiy solvatoxromizm:</strong> Qutblilik ↑ → λ ↑ (qizil siljish). Qo'zg'algan holat qutbliligi yuqori</li>
            <li><strong className="text-cyan-400">Salbiy solvatoxromizm:</strong> Qutblilik ↑ → λ ↓ (ko'k siljish). Asosiy holat qutbliligi yuqori</li>
            <li><strong className="text-cyan-400">Lippert-Mataga tenglamasi:</strong> Stokes shift va erituvchi qutbliligini bog'laydi → Δμ aniqlash</li>
            <li><strong className="text-cyan-400">ET(30) parametri:</strong> Reichardt bo'yoqi — empirik qutblilik shkalasi (30.7-63.1 kcal/mol)</li>
            <li><strong className="text-cyan-400">Kamlet-Taft:</strong> α, β, π* parametrlari — ko'p o'lchovli tahlil</li>
            <li><strong className="text-cyan-400">Qo'llanilishi:</strong> Mikro-muhit sensorlari, biologik membranalar, materialshunoslik</li>
          </ol>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← IVCT & MMCT
          </Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">
            Chuqurlashgan mavzular →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Chuqurlashgan mavzular</p>
          <p className="mt-1">Solvatoxromizm • Reichardt (1963) • Lippert (1957) • Mataga (1956) • Kamlet-Taft (1976)</p>
        </div>
      </footer>
    </main>
  )
}