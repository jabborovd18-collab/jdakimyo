"use client"
import Link from "next/link"
import { useState } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// Na⁺/K⁺-ATPase (Na-K NASOS) — BIOANORGANIK KIMYO
// Manbalar: Skou (1957, Nobel 1997), Shinagawa (2007, Nature), Morth (2007),
//           Ogawa (2009), Toyoshima (2010), Post-Albers sikli
//  ═══════════════════════════════════════════════════════════════════════════════

const NA_K_PUMP = {
  name: "Na⁺/K⁺-ATPase (Na-K nasos)",
  type: "P-type ATPase",
  location: "Plazma membranasi (barcha hayvon hujayralari)",
  function: "3 ta Na⁺ ni hujayra tashqarisiga, 2 ta K⁺ ni ichkariga chiqarish",
  energySource: "ATP gidrolizi",
  stoichiometry: "1 ATP : 3 Na⁺ (chiqarish) : 2 K⁺ (kiritish)",

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY MA'LUMOTLAR
  //  ═══════════════════════════════════════════════════════════════
  structure: {
    subunits: {
      alpha: {
        name: "α-subunit (katalitik)",
        molecularWeight: "110 kDa",
        aminoAcids: "1015-1023 ta (turli izoformalar)",
        transmembraneHelices: "10 ta (M1-M10)",
        domains: ["N-domain (ATP bog'lanish)", "P-domain (fosforillanish, Asp369)", "A-domain (aktuator)"],
        function: "Katalitik faollik, ion bog'lanish"
      },
      beta: {
        name: "β-subunit",
        molecularWeight: "55 kDa (glikozillangan)",
        aminoAcids: "302-307 ta",
        transmembraneHelices: "1 ta",
        function: "Folding, traffiking, barqarorlik"
      },
      gamma: {
        name: "γ-subunit (FXYD)",
        molecularWeight: "10 kDa",
        aminoAcids: "60-70 ta",
        transmembraneHelices: "1 ta",
        function: "Regulyator (Na⁺ affinitetini o'zgartirish)"
      }
    },
    totalWeight: "~170 kDa (α+β)",
    bindingSites: {
      naSites: "2 ta asosiy Na⁻ sayti (I va II, M4, M5, M6, M8 spirallari)",
      kSites: "2 ta K⁻ sayti (M4, M5, M6 spirallari)",
      atpSite: "N-domain (cytoplasmic)"
    },
    pdbStructures: ["2ZXE (shark rectal gland, 2.4 Å)", "3B8E (pig kidney, 3.5 Å)", "4HYT (E1·Mg²⁺ holat)"],
    ionCoordination: {
      naCoordination: "6-7 ta kislorod (karboksil, karbonil, suv)",
      kCoordination: "7-8 ta kislorod (karbonil, asosiy zanjir)",
      bondLengths: "Na-O: 2.3-2.5 Å, K-O: 2.7-3.0 Å"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // MEXANIZM — POST-ALBERS SIKLI
  //  ═══════════════════════════════════════════════════════════════
  mechanism: {
    cycle: "Post-Albers sikli (E1 ↔ E2 konformatsion o'zgarishlar)",
    steps: [
      {
        step: 1,
        state: "E1",
        description: "Yuqori Na⁺ affinitet. Cytoplasm tomoni ochiq.",
        conformation: "Ochiq (cytoplasmic side)",
        ionsBound: "Na⁺ yo'q"
      },
      {
        step: 2,
        state: "E1·3Na⁺",
        description: "3 ta Na⁺ bog'lanadi (I va II saytlar, + III sayt)",
        conformation: "Ochiq",
        ionsBound: "3 Na⁺"
      },
      {
        step: 3,
        state: "E1·3Na⁺·ATP",
        description: "ATP N-domain ga bog'lanadi",
        conformation: "Ochiq",
        ionsBound: "3 Na⁺ + ATP"
      },
      {
        step: 4,
        state: "E1P·3Na⁺",
        description: "ATP gidrolizi, Asp369 fosforillanadi. ADP chiqadi.",
        conformation: "Yopila boshlaydi",
        ionsBound: "3 Na⁺ + P"
      },
      {
        step: 5,
        state: "E2P",
        description: "Katta konformatsion o'zgarish. Na⁺ affiniteti pasayadi. 3 Na⁺ tashqariga chiqariladi.",
        conformation: "Ochiq (extracellular side)",
        ionsBound: "P (Na⁺ yo'q)"
      },
      {
        step: 6,
        state: "E2P·2K⁺",
        description: "2 ta K⁺ tashqaridan bog'lanadi",
        conformation: "Ochiq (extracellular)",
        ionsBound: "2 K⁺ + P"
      },
      {
        step: 7,
        state: "E2·2K⁺",
        description: "K⁺ bog'lanishi defosforillanishni tezlashtiradi",
        conformation: "Yopiq",
        ionsBound: "2 K⁺"
      },
      {
        step: 8,
        state: "E1",
        description: "ATP bog'lanishi K⁺ ni ichkariga chiqaradi. Sikl boshidan boshlanadi.",
        conformation: "Ochiq (cytoplasmic)",
        ionsBound: "yo'q"
      }
    ],
    kinetics: {
      turnoverRate: "~100 ion/s (37°C)",
      activationEnergy: "~90-110 kJ/mol",
      km_Na: "10-20 mM (intratsellyular)",
      km_K: "1-2 mM (ekstratsellyular)",
      km_ATP: "~0.2-0.5 mM"
    },
    electrogenicity: {
      netCharge: "+1 (har siklda)",
      contribution: "Membrana potensialiga ~5-10 mV hissa qo'shadi",
      importance: "Elektrogen — neyron, muskul faoliyati uchun muhim"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TERMODINAMIKA
  //  ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    atpHydrolysis: {
      reaction: "ATP + H₂O → ADP + Pi",
      deltaG: "ΔG°' = -30.5 kJ/mol",
      cellularDeltaG: "ΔG = -50 dan -65 kJ/mol (hujayra ichida)"
    },
    ionTransport: {
      naReaction: "3 Na⁺(in) → 3 Na⁺(out)",
      kReaction: "2 K⁺(out) → 2 K⁺(in)",
      naGradient: "[Na⁺]_out = 145 mM, [Na⁺]_in = 12 mM",
      kGradient: "[K⁺]_out = 4 mM, [K⁺]_in = 150 mM",
      membranePotential: "Vm = -70 mV (ichki manfiy)",
      energyRequired: "ΔG ≈ +35-45 kJ/mol (gradientlarga qarshi)"
    },
    efficiency: {
      couplingRatio: "1 ATP : 3 Na⁺ : 2 K⁺",
      thermodynamicEfficiency: "~70-85%",
      energyBalance: "ATP energiyasi (50-65 kJ/mol) > transport energiyasi (35-45 kJ/mol)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // BIOLOGIK AHAMIYATI
  //  ═══════════════════════════════════════════════════════════════
  biologicalSignificance: {
    membranePotential: {
      role: "Membrana potensialini saqlash (-70 mV)",
      mechanism: "Elektrogen transport (+1 net charge per cycle) + ion gradientlari",
      importance: "Neyron, muskul hujayralari faoliyati uchun asosiy"
    },
    osmoticBalance: {
      role: "Hujayra hajmini nazorat qilish",
      mechanism: "Na⁺ ni chiqarish → osmotik bosim pasayadi → suv chiqadi",
      importance: "Hujayra shishishi (edema) oldini olish"
    },
    secondaryTransport: {
      role: "Ikkinchi darajali aktiv transport uchun Na⁺ gradienti",
      examples: ["Glukoza-Na⁺ kotransporter (SGLT)", "Na⁺/Ca²⁺ almashinuvchi (NCX)", "Na⁺/H⁺ almashinuvchi", "Neyrotransmitter qayta yutilishi"],
      importance: "Oziq moddalar, ionlar, neyrotransmitterlar transporti"
    },
    neuralSignaling: {
      role: "Harakat potensiali tiklash",
      mechanism: "Depolarizatsiyadan keyin Na⁺/K⁺ gradientini qayta tiklash",
      importance: "Nerv impulslarining uzluksiz uzatilishi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TIBBIY QO'LLANILISHI
  //  ═══════════════════════════════════════════════════════════════
  medicalRelevance: {
    cardiacGlycosides: {
      drug: "Digoksin (Digitalis purpurea o'simligi)",
      mechanism: "Na⁺/K⁺-ATPase ingibitori",
      effect: "Na⁺ chiqmaydi → Na⁺/Ca²⁺ almashinuvchi pasayadi → Ca²⁺ ortadi → kuchliroq yurak urishi",
      use: "Yurak etishmovchiligi, aritmiya",
      therapeuticIndex: "Tor (dozani aniq nazorat qilish kerak)"
    },
    hypertension: {
      role: "Na⁺/K⁺-ATPase faolligi pasayishi",
      consequence: "Na⁺ to'planadi → suv to'planadi → qon bosimi oshadi",
      treatment: "Diuretiklar, ACE ingibitorlari"
    },
    neurologicalDisorders: {
      disorders: ["Migren (ATP1A2 mutatsiyasi)", "Rapid-onset dystonia-parkinsonism (ATP1A3)", "Epilepsiya"],
      mechanism: "Na⁺/K⁺ balans buzilishi → neyron giperqo'zg'aluvchanlik",
      research: "Gen terapiyasi, selektiv ingibitorlar"
    },
    drugInteractions: {
      ouabain: "O'simlik toksini, Na⁺/K⁺-ATPase ingibitori (tadqiqotda ishlatiladi)",
      vanadate: "Fosfat analogi, ATPase ingibitori"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "X-ray kristallografiya",
      application: "Strukturani aniqlash (2ZXE, 3B8E, 4HYT)",
      resolution: "2.4-3.5 Å",
      pioneer: "Shinagawa (2007), Morth (2007)"
    },
    {
      method: "Cryo-EM",
      application: "Konformatsion holatlar, turli izoformalar",
      advantage: "Kristall kerak emas, tabiiy muhit",
      modern: "2015-yildan keyin inqilob"
    },
    {
      method: "Patch-clamp elektrofiziologiya",
      application: "Na⁺/K⁺ tok o'lchash, kinetika",
      timescale: "ms-μs",
      measurement: "Ion tok, membrana potensiali"
    },
    {
      method: "Radioaktiv izotoplar (²²Na⁺, ⁸⁶Rb⁺)",
      application: "Ion transport tezligini o'lchash",
      advantage: "Yuqori sezgirlik",
      use: "Rb⁺ = K⁺ analogi"
    },
    {
      method: "FRET spektroskopiya",
      application: "Domainlar orasidagi masofa o'zgarishi",
      advantage: "Real-time konformatsion o'zgarishlar",
      timescale: "ms"
    },
    {
      method: "Molecular Dynamics (MD)",
      application: "Atom darajasida dinamika, ion yo'llari",
      timescale: "μs-ms",
      software: "GROMACS, NAMD, CHARMM"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    skou: {
      year: 1957,
      scientist: "Jens Christian Skou (Daniya)",
      achievement: "Na⁺/K⁺-ATPase ni birinchi marta kashf qildi",
      tissue: "Krab nervidan ajratib oldi",
      nobel: "Nobel mukofoti (1997, Paul Boyer va John Walker bilan birga)"
    },
    post: {
      year: "1960-yillar",
      scientist: "Robert Post (AQSh)",
      achievement: "Post-Albers sikli (kinetik model)",
      contribution: "E1 va E2 konformatsion holatlar tushunchasi"
    },
    shinagawa: {
      year: 2007,
      scientist: "Yoshinori Shinagawa (Yaponiya)",
      achievement: "Birinchi kristall struktura (shark rectal gland)",
      journal: "Nature 450, 387-393",
      pdb: "2ZXE"
    },
    morth: {
      year: 2007,
      scientist: "Jens Preben Morth (Daniya)",
      achievement: "Cho'chqa buyrak Na⁺/K⁺-ATPase strukturasi",
      journal: "Nature 450, 1043-1049",
      pdb: "3B8E"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA P-TYPE ATPase
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      pump: "Na⁺/K⁺-ATPase",
      type: "P-type",
      ions: "Na⁺, K⁺",
      stoichiometry: "1 ATP : 3 Na⁺ : 2 K⁺",
      location: "Plazma membranasi",
      function: "Membrana potensiali, osmotik balans"
    },
    {
      pump: "SERCA (Ca²⁺-ATPase)",
      type: "P-type",
      ions: "Ca²⁺",
      stoichiometry: "1 ATP : 2 Ca²⁺",
      location: "Sarkoplazmatik retikulum",
      function: "Muskul bo'shashishi"
    },
    {
      pump: "H⁺/K⁺-ATPase",
      type: "P-type",
      ions: "H⁺, K⁺",
      stoichiometry: "1 ATP : 1 H⁺ : 1 K⁺",
      location: "Oshqozon parietal hujayralari",
      function: "Oshqozon kislotasi"
    },
    {
      pump: "PMCA (Plasma Membrane Ca²⁺-ATPase)",
      type: "P-type",
      ions: "Ca²⁺",
      stoichiometry: "1 ATP : 1 Ca²⁺",
      location: "Plazma membranasi",
      function: "Ca²⁺ chiqarish"
    },
    {
      pump: "Cu⁺-ATPase",
      type: "P-type",
      ions: "Cu⁺",
      stoichiometry: "1 ATP : 1-2 Cu⁺",
      location: "Golgi, plazma membranasi",
      function: "Mis transporti, Menkes/Wilson kasalliklari"
    }
  ]
}

export default function NaKKanalPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [activeDomain, setActiveDomain] = useState("structure")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="hover:text-purple-300">Bioanorganik</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish" className="hover:text-purple-300">Ion tashish</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">Na⁺/K⁺ kanal</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">⚡</span>
                Na⁺/K⁺-ATPase (Na-K nasos)
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Bioanorganik kimyo — Membrana transporti va elektrofiziologiya
              </p>
            </div>
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Ion tashish bo'limi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-xs font-semibold text-yellow-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              BIOANORGANIK KIMYO — NOBEL 1997
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Na⁺/K⁺ Nasos
              </span>
              <br />
              <span className="text-white text-3xl md:text-4xl">(Na⁺/K⁺-ATPase)</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-yellow-400">Natriy-kaliy nasosi</strong> — barcha hayvon hujayralarining plazma membranasida joylashgan P-type ATPase.
              ATP energiyasidan foydalanib, <strong className="text-orange-400">3 ta Na⁺ ni chiqaradi</strong> va
              <strong className="text-blue-400"> 2 ta K⁺ ni kiritadi</strong>. Membrana potensiali, osmotik balans va
              ikkinchi darajali transport uchun asosiy mexanizm.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-xl font-bold text-yellow-400">~170 kDa</div>
                <div className="text-xs text-purple-400 mt-1">Umumiy massa (α+β)</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔋</div>
                <div className="text-xl font-bold text-yellow-400">3:2</div>
                <div className="text-xs text-purple-400 mt-1">Na⁺:K⁺ nisbati</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-xl font-bold text-yellow-400">1997</div>
                <div className="text-xs text-purple-400 mt-1">Nobel mukofoti</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💊</div>
                <div className="text-xl font-bold text-yellow-400">25-50%</div>
                <div className="text-xs text-purple-400 mt-1">Hujayra energiyasi</div>
              </div>
            </div>
          </div>
        </div>

        {/* DOMAIN SWITCHER */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveDomain("structure")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeDomain === "structure"
                ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🏗️ Struktura
          </button>
          <button
            onClick={() => setActiveDomain("mechanism")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeDomain === "mechanism"
                ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            ⚙️ Mexanizm
          </button>
          <button
            onClick={() => setActiveDomain("thermodynamics")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeDomain === "thermodynamics"
                ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🔥 Termodinamika
          </button>
          <button
            onClick={() => setActiveDomain("biology")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeDomain === "biology"
                ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🧬 Biologiya
          </button>
          <button
            onClick={() => setActiveDomain("medical")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeDomain === "medical"
                ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            💊 Tibbiyot
          </button>
          <button
            onClick={() => setActiveDomain("research")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeDomain === "research"
                ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            🔬 Tadqiqot
          </button>
        </div>

        {/* STRUKTURA */}
        {activeDomain === "structure" && (
          <div className="space-y-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🏗️</span>
                Strukturaviy tashkil etilishi
              </h2>

              <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">3 ta subunit</h3>
                <div className="space-y-4">
                  <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🔴</span>
                      <h4 className="text-lg font-bold text-yellow-400">{NA_K_PUMP.structure.subunits.alpha.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-400">Molekulyar massa:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.alpha.molecularWeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">Aminokislotalar:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.alpha.aminoAcids}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">TM spirallar:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.alpha.transmembraneHelices}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">Funksiya:</span>
                        <span className="text-white text-xs">{NA_K_PUMP.structure.subunits.alpha.function}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-700/50">
                      <div className="text-purple-400 text-xs mb-2">Domenlar:</div>
                      <div className="flex flex-wrap gap-2">
                        {NA_K_PUMP.structure.subunits.alpha.domains.map((domain, i) => (
                          <span key={i} className="px-2 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full text-xs">
                            {domain}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🔵</span>
                      <h4 className="text-lg font-bold text-yellow-400">{NA_K_PUMP.structure.subunits.beta.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-400">Molekulyar massa:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.beta.molecularWeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">Aminokislotalar:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.beta.aminoAcids}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">TM spirallar:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.beta.transmembraneHelices}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">Funksiya:</span>
                        <span className="text-white text-xs">{NA_K_PUMP.structure.subunits.beta.function}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🟢</span>
                      <h4 className="text-lg font-bold text-yellow-400">{NA_K_PUMP.structure.subunits.gamma.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-400">Molekulyar massa:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.gamma.molecularWeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">Aminokislotalar:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.gamma.aminoAcids}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">TM spirallar:</span>
                        <span className="text-white font-mono">{NA_K_PUMP.structure.subunits.gamma.transmembraneHelices}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">Funksiya:</span>
                        <span className="text-white text-xs">{NA_K_PUMP.structure.subunits.gamma.function}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Bog'lanish saytlari</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Na⁺ saytlari:</div>
                      <p className="text-purple-200 text-xs">{NA_K_PUMP.structure.bindingSites.naSites}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">K⁺ saytlari:</div>
                      <p className="text-purple-200 text-xs">{NA_K_PUMP.structure.bindingSites.kSites}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">ATP sayti:</div>
                      <p className="text-purple-200 text-xs">{NA_K_PUMP.structure.bindingSites.atpSite}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Ion koordinatsiyasi</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Na⁺ koordinatsiyasi:</div>
                      <p className="text-purple-200 text-xs">{NA_K_PUMP.structure.ionCoordination.naCoordination}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">K⁺ koordinatsiyasi:</div>
                      <p className="text-purple-200 text-xs">{NA_K_PUMP.structure.ionCoordination.kCoordination}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Bog' uzunliklari:</div>
                      <p className="text-purple-200 text-xs">{NA_K_PUMP.structure.ionCoordination.bondLengths}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4">
                <p className="text-yellow-200 text-sm">
                  <strong className="text-yellow-400">PDB strukturalar:</strong> {NA_K_PUMP.structure.pdbStructures.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MEXANIZM */}
        {activeDomain === "mechanism" && (
          <div className="space-y-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">⚙️</span>
                Post-Albers sikli — Transport mexanizmi
              </h2>

              <div className="bg-orange-900/30 border border-orange-700/50 rounded-xl p-6 mb-8">
                <p className="text-orange-200 leading-relaxed">
                  <strong className="text-orange-400">Na⁺/K⁺-ATPase</strong> Post-Albers sikli bo'yicha ishlaydi — E1 va E2 konformatsion holatlar orasida o'tish.
                  Har siklda 3 ta Na⁺ chiqariladi, 2 ta K⁺ kiritiladi (+1 net zaryad = elektrogen).
                </p>
              </div>

              <div className="space-y-4">
                {NA_K_PUMP.mechanism.steps.map((step) => (
                  <div
                    key={step.step}
                    onClick={() => setActiveStep(step.step)}
                    className={`rounded-xl p-6 cursor-pointer transition-all ${
                      activeStep === step.step
                        ? "bg-orange-900/40 border-2 border-orange-400 shadow-xl shadow-orange-500/20"
                        : "bg-purple-900/30 border border-purple-700/50 hover:border-orange-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        activeStep === step.step ? "bg-orange-500 text-white" : "bg-purple-800 text-purple-400"
                      }`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-yellow-400">{step.state}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/30 text-blue-400 border border-blue-600/50">
                            {step.ionsBound}
                          </span>
                        </div>
                        <p className="text-purple-300 text-sm mt-1">{step.conformation}</p>
                      </div>
                    </div>
                    {activeStep === step.step && (
                      <div className="mt-4 pt-4 border-t border-purple-700/50">
                        <p className="text-purple-200 leading-relaxed">{step.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Kinetik parametrlar</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Aylanish tezligi:</span>
                      <span className="text-white font-mono">{NA_K_PUMP.mechanism.kinetics.turnoverRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Aktivatsiya energiyasi:</span>
                      <span className="text-white font-mono">{NA_K_PUMP.mechanism.kinetics.activationEnergy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">K<sub>m</sub> (Na⁺):</span>
                      <span className="text-white font-mono">{NA_K_PUMP.mechanism.kinetics.km_Na}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">K<sub>m</sub> (K⁺):</span>
                      <span className="text-white font-mono">{NA_K_PUMP.mechanism.kinetics.km_K}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">K<sub>m</sub> (ATP):</span>
                      <span className="text-white font-mono">{NA_K_PUMP.mechanism.kinetics.km_ATP}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Elektrogenlik</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Net zaryad:</span>
                      <span className="text-white font-mono">{NA_K_PUMP.mechanism.electrogenicity.netCharge}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Hissasi:</span>
                      <span className="text-white text-xs mt-1">{NA_K_PUMP.mechanism.electrogenicity.contribution}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Ahamiyati:</span>
                      <span className="text-white text-xs mt-1">{NA_K_PUMP.mechanism.electrogenicity.importance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TERMODINAMIKA */}
        {activeDomain === "thermodynamics" && (
          <div className="space-y-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🔥</span>
                Termodinamik tahlil
              </h2>

              <div className="space-y-6">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">ATP gidrolizi</h3>
                  <div className="bg-purple-950/50 rounded-lg p-4 mb-4 font-mono text-sm text-center">
                    {NA_K_PUMP.thermodynamics.atpHydrolysis.reaction}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Standart ΔG°':</span>
                      <span className="text-white">{NA_K_PUMP.thermodynamics.atpHydrolysis.deltaG}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Hujayra ichida ΔG:</span>
                      <span className="text-white">{NA_K_PUMP.thermodynamics.atpHydrolysis.cellularDeltaG}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Ion transporti</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Na⁺ transporti:</div>
                      <div className="bg-purple-950/50 rounded-lg p-3 font-mono text-xs text-center">
                        {NA_K_PUMP.thermodynamics.ionTransport.naReaction}
                      </div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">K⁺ transporti:</div>
                      <div className="bg-purple-950/50 rounded-lg p-3 font-mono text-xs text-center">
                        {NA_K_PUMP.thermodynamics.ionTransport.kReaction}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="bg-purple-950/50 rounded-lg p-3">
                        <div className="text-purple-400 text-xs mb-1">Na⁺ gradienti:</div>
                        <p className="text-white text-xs">{NA_K_PUMP.thermodynamics.ionTransport.naGradient}</p>
                      </div>
                      <div className="bg-purple-950/50 rounded-lg p-3">
                        <div className="text-purple-400 text-xs mb-1">K⁺ gradienti:</div>
                        <p className="text-white text-xs">{NA_K_PUMP.thermodynamics.ionTransport.kGradient}</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Membrana potensiali:</span>
                      <span className="text-white font-mono">{NA_K_PUMP.thermodynamics.ionTransport.membranePotential}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Kerakli energiya:</span>
                      <span className="text-red-400">{NA_K_PUMP.thermodynamics.ionTransport.energyRequired}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Samaradorlik</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-purple-400 mb-2">Bog'lanish nisbati</div>
                      <div className="text-2xl font-bold text-green-400">{NA_K_PUMP.thermodynamics.efficiency.couplingRatio}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-purple-400 mb-2">Termodinamik samaradorlik</div>
                      <div className="text-2xl font-bold text-green-400">{NA_K_PUMP.thermodynamics.efficiency.thermodynamicEfficiency}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-purple-400 mb-2">Energiya balansi</div>
                      <div className="text-sm text-green-400 mt-2">{NA_K_PUMP.thermodynamics.efficiency.energyBalance}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BIOLOGIYA */}
        {activeDomain === "biology" && (
          <div className="space-y-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🧬</span>
                Biologik ahamiyati
              </h2>

              <div className="space-y-6">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Membrana potensiali</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.membranePotential.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.membranePotential.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ahamiyati:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.membranePotential.importance}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Osmotik balans</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.osmoticBalance.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.osmoticBalance.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ahamiyati:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.osmoticBalance.importance}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Ikkinchi darajali transport</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.secondaryTransport.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-2">Misollar:</div>
                      <ul className="space-y-1 text-purple-200">
                        {NA_K_PUMP.biologicalSignificance.secondaryTransport.examples.map((example, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-green-400">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ahamiyati:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.secondaryTransport.importance}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Neyron signallari</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.neuralSignaling.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.neuralSignaling.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ahamiyati:</div>
                      <p className="text-purple-200">{NA_K_PUMP.biologicalSignificance.neuralSignaling.importance}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIBBIYOT */}
        {activeDomain === "medical" && (
          <div className="space-y-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">💊</span>
                Tibbiy qo'llanilishi
              </h2>

              <div className="space-y-6">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Yurak glikozidlari (Digoksin)</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Dori:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.cardiacGlycosides.drug}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.cardiacGlycosides.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Effekt:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.cardiacGlycosides.effect}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Qo'llanilishi:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.cardiacGlycosides.use}</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mt-3">
                      <p className="text-yellow-200 text-xs">
                        <strong className="text-yellow-400">Terapevtik indeks:</strong> {NA_K_PUMP.medicalRelevance.cardiacGlycosides.therapeuticIndex}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Gipertoniya</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.hypertension.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Oqibat:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.hypertension.consequence}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Davolash:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.hypertension.treatment}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Nevrologik kasalliklar</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-2">Kasalliklar:</div>
                      <ul className="space-y-1 text-purple-200">
                        {NA_K_PUMP.medicalRelevance.neurologicalDisorders.disorders.map((disorder, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-red-400">•</span>
                            <span>{disorder}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.neurologicalDisorders.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Tadqiqot:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.neurologicalDisorders.research}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Dori o'zaro ta'sirlari</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ouabain:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.drugInteractions.ouabain}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Vanadate:</div>
                      <p className="text-purple-200">{NA_K_PUMP.medicalRelevance.drugInteractions.vanadate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TADQIQOT USULLARI */}
        {activeDomain === "research" && (
          <div className="space-y-6">
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🔬</span>
                Tadqiqot usullari
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NA_K_PUMP.researchMethods.map((method, i) => (
                  <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5 hover:border-cyan-500/50 transition-all">
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">{method.method}</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Qo'llanilishi:</div>
                        <p className="text-purple-200">{method.application}</p>
                      </div>
                      {method.resolution && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Rezolyutsiya:</span>
                          <span className="text-cyan-400 font-mono text-xs">{method.resolution}</span>
                        </div>
                      )}
                      {method.advantage && (
                        <div className="flex justify-between flex-col">
                          <span className="text-purple-400 text-xs">Afzallik:</span>
                          <span className="text-cyan-400 text-xs">{method.advantage}</span>
                        </div>
                      )}
                      {method.pioneer && (
                        <div className="flex justify-between flex-col">
                          <span className="text-purple-400 text-xs">Kashfiyotchi:</span>
                          <span className="text-yellow-400 text-xs mt-1">{method.pioneer}</span>
                        </div>
                      )}
                      {method.pdb && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">PDB:</span>
                          <span className="text-cyan-400 font-mono text-xs">{method.pdb}</span>
                        </div>
                      )}
                      {method.timescale && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Vaqt shkalasi:</span>
                          <span className="text-cyan-400 font-mono text-xs">{method.timescale}</span>
                        </div>
                      )}
                      {method.measurement && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">O'lchov:</span>
                          <span className="text-cyan-400 text-xs">{method.measurement}</span>
                        </div>
                      )}
                      {method.use && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Qo'llanilishi:</span>
                          <span className="text-cyan-400 text-xs">{method.use}</span>
                        </div>
                      )}
                      {method.modern && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Zamonaviy:</span>
                          <span className="text-green-400 text-xs">{method.modern}</span>
                        </div>
                      )}
                      {method.software && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Dastur:</span>
                          <span className="text-cyan-400 text-xs">{method.software}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TARIX */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Skou (1957)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{NA_K_PUMP.history.skou.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{NA_K_PUMP.history.skou.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">To'qima:</span>
                  <span className="text-purple-200 text-xs">{NA_K_PUMP.history.skou.tissue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nobel:</span>
                  <span className="text-yellow-400 text-xs">{NA_K_PUMP.history.skou.nobel}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Post (1960-yillar)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{NA_K_PUMP.history.post.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{NA_K_PUMP.history.post.achievement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-purple-200 text-xs">{NA_K_PUMP.history.post.contribution}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Shinagawa (2007)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{NA_K_PUMP.history.shinagawa.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{NA_K_PUMP.history.shinagawa.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Jurnal:</span>
                  <span className="text-purple-200 text-xs mt-1">{NA_K_PUMP.history.shinagawa.journal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">PDB:</span>
                  <span className="text-cyan-400 font-mono text-xs">{NA_K_PUMP.history.shinagawa.pdb}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Morth (2007)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{NA_K_PUMP.history.morth.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{NA_K_PUMP.history.morth.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Jurnal:</span>
                  <span className="text-purple-200 text-xs mt-1">{NA_K_PUMP.history.morth.journal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">PDB:</span>
                  <span className="text-cyan-400 font-mono text-xs">{NA_K_PUMP.history.morth.pdb}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔄</span>
            Boshqa P-type ATPase bilan <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Nasos</th>
                  <th className="py-3 px-3 text-teal-400">Turi</th>
                  <th className="py-3 px-3 text-teal-400">Ionlar</th>
                  <th className="py-3 px-3 text-teal-400">Stexiometriya</th>
                  <th className="py-3 px-3 text-teal-400">Joylashuv</th>
                  <th className="py-3 px-3 text-teal-400">Funksiya</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {NA_K_PUMP.comparison.map((pump, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{pump.pump}</td>
                    <td className="py-3 px-3 text-xs">{pump.type}</td>
                    <td className="py-3 px-3 text-xs">{pump.ions}</td>
                    <td className="py-3 px-3 text-xs font-mono">{pump.stoichiometry}</td>
                    <td className="py-3 px-3 text-xs">{pump.location}</td>
                    <td className="py-3 px-3 text-xs">{pump.function}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Ion tashish bo'limi
          </Link>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/ca-nasos" className="px-6 py-3 bg-blue-600/60 hover:bg-blue-500/80 border border-blue-500/50 rounded-xl text-white font-semibold">
              🔬 Ca²⁺ nasos
            </Link>
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/transferrin" className="px-6 py-3 bg-red-600/60 hover:bg-red-500/80 border border-red-500/50 rounded-xl text-white font-semibold">
              🩸 Transferrin →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Bioanorganik kimyo</p>
          <p className="mt-1">Na⁺/K⁺-ATPase (Na-K nasos) • Membrana transporti • Nobel 1997</p>
        </div>
      </footer>
    </main>
  )
}