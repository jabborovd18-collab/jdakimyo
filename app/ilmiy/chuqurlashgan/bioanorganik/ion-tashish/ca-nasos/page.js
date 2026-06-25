"use client"
import Link from "next/link"
import { useState } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// Ca²⁺ NASOS (Ca-ATPase) — BIOANORGANIK KIMYO
// Manbalar: Skou (1957, Nobel 1997), Toyoshima (2000, Nature), Møller (2005),
//           MacLennan (1997), Carafoli (2002), Kühlbrandt (2004)
//  ═══════════════════════════════════════════════════════════════════════════════

const CA_PUMP = {
  name: "Ca²⁺-ATPase (Ca nasos)",
  type: "P-type ATPase",
  location: "Sarkoplazmatik retikulum (SR) va plazma membranasi",
  function: "Ca²⁺ ionlarini sitoplazmadan SR ga yoki hujayra tashqarisiga chiqarish",
  energySource: "ATP gidrolizi",
  stoichiometry: "1 ATP → 2 Ca²⁺ (SR ga)",

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY MA'LUMOTLAR
  //  ═══════════════════════════════════════════════════════════════
  structure: {
    molecularWeight: "110 kDa (SERCA1a)",
    aminoAcids: "994 ta aminokislota",
    transmembraneHelices: "10 ta transmembran spiral (M1-M10)",
    cytoplasmicDomains: ["N-domain (nukleotid bog'lanish)", "P-domain (fosforillanish)", "A-domain (aktuator)"],
    bindingSites: "2 ta Ca²⁺ bog'lanish sayti (I va II)",
    calciumCoordination: "7-8 ta kislorod atomi (glutamat, aspartat, suv molekulalari)",
    pdbStructure: "1SU4 (E1 holat, Ca²⁺ bog'langan), 1IWO (E2 holat, Ca²⁺ bo'sh)"
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
        description: "Yuqori affinitet Ca²⁺ ga (Kd ~ 0.1-1 μM). 2 ta Ca²⁺ bog'lanadi.",
        conformation: "Ochiq (cytoplasmic side)",
        calciumBound: true
      },
      {
        step: 2,
        state: "E1·ATP",
        description: "ATP bog'lanadi (N-domain).",
        conformation: "Ochiq",
        calciumBound: true
      },
      {
        step: 3,
        state: "E1P·ADP",
        description: "ATP gidrolizi, fosfat P-domain aspartatga o'tadi (Asp351).",
        conformation: "Yopila boshlaydi",
        calciumBound: true
      },
      {
        step: 4,
        state: "E1P",
        description: "ADP chiqib ketadi. Katta konformatsion o'zgarish.",
        conformation: "Yopiq",
        calciumBound: true
      },
      {
        step: 5,
        state: "E2P",
        description: "Ca²⁺ affiniteti pasayadi (Kd ~ 1-10 mM). Ca²⁺ lumen tomonga chiqariladi.",
        conformation: "Ochiq (lumenal side)",
        calciumBound: false
      },
      {
        step: 6,
        state: "E2",
        description: "Fosfat gidrolizi (defosforillanish). E1 holatga qaytadi.",
        conformation: "Ochiq (cytoplasmic side)",
        calciumBound: false
      }
    ],
    kinetics: {
      turnoverRate: "~30 Ca²⁺/s (37°C)",
      activationEnergy: "~80-100 kJ/mol",
      km_ATP: "~0.1-0.5 mM",
      km_Ca: "~0.1-1 μM (E1 holat)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // KALSIY KOORDINATSIYA KIMYOSI
  //  ═══════════════════════════════════════════════════════════════
  calciumCoordination: {
    site1: {
      ligands: ["Glu771 (OE1, OE2)", "Thr799 (O)", "Asp800 (OD1, OD2)", "Glu908 (OE1)", "2-3 ta H₂O"],
      coordinationNumber: "7-8",
      geometry: "Pentagonal bipiramidal yoki dodekaedr",
      bondLengths: "Ca-O: 2.3-2.5 Å"
    },
    site2: {
      ligands: ["Asn768 (O)", "Glu771 (OE2)", "Thr799 (OG1)", "Asp800 (OD2)", "Asp800 (main chain O)", "2-3 ta H₂O"],
      coordinationNumber: "7-8",
      geometry: "Pentagonal bipiramidal",
      bondLengths: "Ca-O: 2.3-2.5 Å"
    },
    cooperativity: "Ikkala sayt kooperativ — birinchisi bog'langach, ikkinchisi osonroq bog'lanadi (Hill coefficient ~1.5-2)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // TERMODINAMIKA
  //  ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    atpHydrolysis: {
      reaction: "ATP + H₂O → ADP + Pi",
      deltaG: "ΔG°' = -30.5 kJ/mol (standart sharoitda)",
      cellularDeltaG: "ΔG = -50 dan -65 kJ/mol (hujayra ichida, [ATP]/[ADP] nisbati yuqori)"
    },
    calciumTransport: {
      reaction: "2 Ca²⁺(cytoplasm) → 2 Ca²⁺(lumen)",
      deltaG: "ΔG = RT·ln([Ca²⁺]_lumen/[Ca²⁺]_cytoplasm)²",
      typicalGradient: "[Ca²⁺]_cytoplasm ~ 100 nM, [Ca²⁺]_lumen ~ 1 mM",
      energyRequired: "ΔG ≈ +40-50 kJ/mol (konsentratsiya gradientiga qarshi)"
    },
    efficiency: {
      couplingRatio: "1 ATP : 2 Ca²⁺",
      thermodynamicEfficiency: "~60-80% (juda yuqori samaradorlik)",
      energyBalance: "ATP energiyasi (50-65 kJ/mol) > transport energiyasi (40-50 kJ/mol)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // BIOLOGIK AHAMIYATI
  //  ═══════════════════════════════════════════════════════════════
  biologicalSignificance: {
    muscleContraction: {
      role: "Muskullarning bo'shashishi (relaxation)",
      mechanism: "Ca²⁺ ni sitoplazmadan SR ga qaytarish → troponin C dan Ca²⁺ ajraladi → muskul bo'shashadi",
      importance: "Tez bo'shashish uchun juda muhim (masalan, yurak mushagi)"
    },
    cellularSignaling: {
      role: "Ca²⁺ signalizatsiyasini nazorat qilish",
      mechanism: "Ca²⁺ konsentratsiyasini past darajada ushlab turish (~100 nM)",
      importance: "Signal aniq va qisqa muddatli bo'lishi uchun"
    },
    apoptosis: {
      role: "Hujayra o'limini tartibga solish",
      mechanism: "SR dan Ca²⁺ chiqishi → mitoxondriyaga o'tish → apoptoz",
      importance: "Kasal hujayralarni yo'q qilish"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TIBBIY QO'LLANILISHI
  //  ═══════════════════════════════════════════════════════════════
  medicalRelevance: {
    heartFailure: {
      problem: "Yurak etishmovchiligida SERCA2a faolligi pasayadi",
      consequence: "Ca²⁺ to'planadi, muskul bo'shashmaydi",
      therapy: "SERCA2a gen terapiyasi (CUPID sinovlari)",
      status: "Klinik sinovlarda"
    },
    brodyMyopathy: {
      problem: "SERCA1 mutatsiyasi (irsiy kasallik)",
      symptoms: "Muskul qattiqligi, bo'shashish qiyin",
      mechanism: "Ca²⁺ nasosi ishlamaydi",
      treatment: "Simptomatik davolash"
    },
    drugTargets: {
      inhibitors: ["Thapsigargin (o'simlik toksini, SERCA ingibitori)", "Cyclopiazonic acid (CPA)"],
      research: "Saraton tadqiqotlarida ishlatiladi (apoptoz induksiyasi)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TADQIQOT USULLARI
  //  ═══════════════════════════════════════════════════════════════
  researchMethods: [
    {
      method: "X-ray kristallografiya",
      application: "Strukturani aniqlash (1SU4, 1IWO)",
      resolution: "2.6-3.0 Å",
      pioneer: "Toyoshima (2000, Nobel 2017)"
    },
    {
      method: "Cryo-EM",
      application: "Konformatsion holatlarni kuzatish",
      advantage: "Kristall kerak emas",
      modern: "2015-yildan keyin inqilob"
    },
    {
      method: "EPR spektroskopiya",
      application: "Spin labeling orqali konformatsion o'zgarishlar",
      technique: "Site-directed spin labeling (SDSL)"
    },
    {
      method: "FRET (Fluorescence Resonance Energy Transfer)",
      application: "Domainlar orasidagi masofani o'lchash",
      advantage: "Real-time kinetika"
    },
    {
      method: "Molecular Dynamics (MD)",
      application: "Atom darajasida dinamika",
      timescale: "μs-ms",
      software: "GROMACS, NAMD, AMBER"
    },
    {
      method: "Stopped-flow kinetika",
      application: "Tez reaksiyalar kinetikasi",
      timescale: "ms",
      measurement: "Ca²⁺ bog'lanish, ATP gidrolizi"
    }
  ],

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    skou: {
      year: 1957,
      scientist: "Jens Christian Skou (Daniya)",
      achievement: "Birinchi marta Na⁺/K⁺-ATPase ni kashf qildi",
      nobel: "Nobel mukofoti (1997, Paul Boyer va John Walker bilan)"
    },
    hasselbach: {
      year: 1961,
      scientist: "Wilhelm Hasselbach (Germaniya)",
      achievement: "SR Ca²⁺-ATPase ni ajratib oldi",
      contribution: "Ca²⁺ transport mexanizmini tushunish"
    },
    toyoshima: {
      year: 2000,
      scientist: "Chikashi Toyoshima (Yaponiya)",
      achievement: "SERCA1a kristall strukturasini aniqladi (1SU4)",
      journal: "Nature 405, 647-655",
      impact: "P-type ATPase mexanizmini atom darajasida tushunish"
    },
    møller: {
      year: 2005,
      scientist: "Jesper Vuust Møller (Daniya)",
      achievement: "Konformatsion holatlar to'liq to'plami",
      contribution: "E1, E1P, E2P, E2 holatlari"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA ION NASOSLARI
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      pump: "SERCA (Ca²⁺-ATPase)",
      type: "P-type",
      ion: "Ca²⁺",
      stoichiometry: "1 ATP : 2 Ca²⁺",
      location: "Sarkoplazmatik retikulum",
      function: "Muskul bo'shashishi"
    },
    {
      pump: "Na⁺/K⁺-ATPase",
      type: "P-type",
      ion: "Na⁺, K⁺",
      stoichiometry: "1 ATP : 3 Na⁺ : 2 K⁺",
      location: "Plazma membranasi",
      function: "Membrana potensiali, osmotik balans"
    },
    {
      pump: "H⁺/K⁺-ATPase",
      type: "P-type",
      ion: "H⁺, K⁺",
      stoichiometry: "1 ATP : 1 H⁺ : 1 K⁺",
      location: "Oshqozon parietal hujayralari",
      function: "Oshqozon kislotasi ishlab chiqarish"
    },
    {
      pump: "PMCA (Plasma Membrane Ca²⁺-ATPase)",
      type: "P-type",
      ion: "Ca²⁺",
      stoichiometry: "1 ATP : 1 Ca²⁺",
      location: "Plazma membranasi",
      function: "Hujayra tashqarisiga Ca²⁺ chiqarish"
    },
    {
      pump: "NCX (Na⁺/Ca²⁺ Exchanger)",
      type: "Secondary active",
      ion: "Na⁺, Ca²⁺",
      stoichiometry: "3 Na⁺ : 1 Ca²⁺",
      location: "Plazma membranasi",
      function: "Tez Ca²⁺ chiqarish (ATP sarflamaydi)"
    }
  ]
}

export default function CaNasosPage() {
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
            <span className="text-yellow-400 font-semibold">Ca²⁺ Nasos</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">🔬</span>
                Ca²⁺ Nasos (Ca-ATPase)
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Bioanorganik kimyo — Ion tashish mexanizmlari
              </p>
            </div>
            <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Bioanorganik bo'limi
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
              BIOANORGANIK KIMYO
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Ca²⁺ Nasos
              </span>
              <br />
              <span className="text-white text-3xl md:text-4xl">(Ca-ATPase, SERCA)</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-yellow-400">Sarkoplazmatik retikulum Ca²⁺-ATPase</strong> — P-type nasoslari oilasiga mansub transmembran oqsil.
              ATP energiyasidan foydalanib, <strong className="text-orange-400">2 ta Ca²⁺ ionini</strong> sitoplazmadan SR lumeniga chiqaradi.
              Muskullarning bo'shashishi va Ca²⁺ signalizatsiyasi uchun juda muhim.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-xl font-bold text-yellow-400">110 kDa</div>
                <div className="text-xs text-purple-400 mt-1">Molekulyar massa</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧬</div>
                <div className="text-xl font-bold text-yellow-400">994</div>
                <div className="text-xs text-purple-400 mt-1">Aminokislota</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔗</div>
                <div className="text-xl font-bold text-yellow-400">10</div>
                <div className="text-xs text-purple-400 mt-1">Transmembran spiral</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-xl font-bold text-yellow-400">2 Ca²⁺</div>
                <div className="text-xs text-purple-400 mt-1">Bog'lanish saytlari</div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Umumiy struktura</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Molekulyar massa:</span>
                      <span className="text-white font-mono">{CA_PUMP.structure.molecularWeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Aminokislotalar:</span>
                      <span className="text-white font-mono">{CA_PUMP.structure.aminoAcids}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Transmembran spirallar:</span>
                      <span className="text-white font-mono">{CA_PUMP.structure.transmembraneHelices}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">PDB strukturalar:</span>
                      <span className="text-white font-mono text-xs mt-1">{CA_PUMP.structure.pdbStructure}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Citoplazmatik domenlar</h3>
                  <ul className="space-y-3 text-sm">
                    {CA_PUMP.structure.cytoplasmicDomains.map((domain, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-yellow-400 text-lg">•</span>
                        <span className="text-purple-200">{domain}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-yellow-400 mb-4">Kalsiy koordinatsiya kimyosi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-cyan-400 mb-3">Sayt I</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-purple-300 font-semibold mb-2">Ligandlar:</div>
                    <ul className="space-y-1 text-xs text-purple-200">
                      {CA_PUMP.calciumCoordination.site1.ligands.map((ligand, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-cyan-400">→</span>
                          <span>{ligand}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-cyan-700/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Koordinatsion son:</span>
                        <span className="text-cyan-400">{CA_PUMP.calciumCoordination.site1.coordinationNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-purple-400">Geometriya:</span>
                        <span className="text-cyan-400 text-xs">{CA_PUMP.calciumCoordination.site1.geometry}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-purple-400">Bog' uzunliklari:</span>
                        <span className="text-cyan-400">{CA_PUMP.calciumCoordination.site1.bondLengths}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-cyan-400 mb-3">Sayt II</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-purple-300 font-semibold mb-2">Ligandlar:</div>
                    <ul className="space-y-1 text-xs text-purple-200">
                      {CA_PUMP.calciumCoordination.site2.ligands.map((ligand, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-cyan-400">→</span>
                          <span>{ligand}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-cyan-700/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Koordinatsion son:</span>
                        <span className="text-cyan-400">{CA_PUMP.calciumCoordination.site2.coordinationNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-purple-400">Geometriya:</span>
                        <span className="text-cyan-400">{CA_PUMP.calciumCoordination.site2.geometry}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-purple-400">Bog' uzunliklari:</span>
                        <span className="text-cyan-400">{CA_PUMP.calciumCoordination.site2.bondLengths}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 mt-6">
                <p className="text-yellow-200 text-sm">
                  <strong className="text-yellow-400">Kooperativlik:</strong> {CA_PUMP.calciumCoordination.cooperativity}
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
                  <strong className="text-orange-400">Ca²⁺-ATPase</strong> Post-Albers sikli bo'yicha ishlaydi — E1 va E2 konformatsion holatlar orasida o'tish.
                  ATP gidrolizi energiyasi Ca²⁺ ionlarini konsentratsiya gradientiga qarshi tashish uchun ishlatiladi.
                </p>
              </div>

              <div className="space-y-4">
                {CA_PUMP.mechanism.steps.map((step) => (
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
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            step.calciumBound
                              ? "bg-green-600/30 text-green-400 border border-green-600/50"
                              : "bg-red-600/30 text-red-400 border border-red-600/50"
                          }`}>
                            {step.calciumBound ? "Ca²⁺ bog'langan" : "Ca²⁺ bo'sh"}
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

              <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Kinetik parametrlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Aylanish tezligi:</span>
                    <span className="text-white font-mono">{CA_PUMP.mechanism.kinetics.turnoverRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Aktivatsiya energiyasi:</span>
                    <span className="text-white font-mono">{CA_PUMP.mechanism.kinetics.activationEnergy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">K<sub>m</sub> (ATP):</span>
                    <span className="text-white font-mono">{CA_PUMP.mechanism.kinetics.km_ATP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">K<sub>m</sub> (Ca²⁺):</span>
                    <span className="text-white font-mono">{CA_PUMP.mechanism.kinetics.km_Ca}</span>
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
                    {CA_PUMP.thermodynamics.atpHydrolysis.reaction}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Standart ΔG°':</span>
                      <span className="text-white">{CA_PUMP.thermodynamics.atpHydrolysis.deltaG}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Hujayra ichida ΔG:</span>
                      <span className="text-white">{CA_PUMP.thermodynamics.atpHydrolysis.cellularDeltaG}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Ca²⁺ transporti</h3>
                  <div className="bg-purple-950/50 rounded-lg p-4 mb-4 font-mono text-sm text-center">
                    {CA_PUMP.thermodynamics.calciumTransport.reaction}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">ΔG formulasi:</span>
                      <span className="text-white font-mono text-xs mt-1">{CA_PUMP.thermodynamics.calciumTransport.deltaG}</span>
                    </div>
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Tipik gradient:</span>
                      <span className="text-white text-xs mt-1">{CA_PUMP.thermodynamics.calciumTransport.typicalGradient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Kerakli energiya:</span>
                      <span className="text-red-400">{CA_PUMP.thermodynamics.calciumTransport.energyRequired}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Samaradorlik</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-purple-400 mb-2">Bog'lanish nisbati</div>
                      <div className="text-2xl font-bold text-green-400">{CA_PUMP.thermodynamics.efficiency.couplingRatio}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-purple-400 mb-2">Termodinamik samaradorlik</div>
                      <div className="text-2xl font-bold text-green-400">{CA_PUMP.thermodynamics.efficiency.thermodynamicEfficiency}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-purple-400 mb-2">Energiya balansi</div>
                      <div className="text-sm text-green-400 mt-2">{CA_PUMP.thermodynamics.efficiency.energyBalance}</div>
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
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Muskul bo'shashishi</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.muscleContraction.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.muscleContraction.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ahamiyati:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.muscleContraction.importance}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Ca²⁺ signalizatsiyasi</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.cellularSignaling.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.cellularSignaling.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ahamiyati:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.cellularSignaling.importance}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Apoptoz</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Rol:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.apoptosis.role}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.apoptosis.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Ahamiyati:</div>
                      <p className="text-purple-200">{CA_PUMP.biologicalSignificance.apoptosis.importance}</p>
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
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Yurak etishmovchiligi</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Muammo:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.heartFailure.problem}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Oqibat:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.heartFailure.consequence}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Terapiya:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.heartFailure.therapy}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Holat:</div>
                      <p className="text-yellow-400">{CA_PUMP.medicalRelevance.heartFailure.status}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Brody myopatiyasi</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Muammo:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.brodyMyopathy.problem}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Belgilar:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.brodyMyopathy.symptoms}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Mexanizm:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.brodyMyopathy.mechanism}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Davolash:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.brodyMyopathy.treatment}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Dori maqsadlari</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-400 font-semibold mb-2">Ingibitorlar:</div>
                      <ul className="space-y-1 text-purple-200">
                        {CA_PUMP.medicalRelevance.drugTargets.inhibitors.map((inhibitor, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-red-400">•</span>
                            <span>{inhibitor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Tadqiqot:</div>
                      <p className="text-purple-200">{CA_PUMP.medicalRelevance.drugTargets.research}</p>
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
                {CA_PUMP.researchMethods.map((method, i) => (
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
                        <div className="flex justify-between">
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
                      {method.technique && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Texnika:</span>
                          <span className="text-cyan-400 text-xs">{method.technique}</span>
                        </div>
                      )}
                      {method.timescale && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Vaqt shkalasi:</span>
                          <span className="text-cyan-400 font-mono text-xs">{method.timescale}</span>
                        </div>
                      )}
                      {method.software && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Dastur:</span>
                          <span className="text-cyan-400 text-xs">{method.software}</span>
                        </div>
                      )}
                      {method.modern && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">Zamonaviy:</span>
                          <span className="text-green-400 text-xs">{method.modern}</span>
                        </div>
                      )}
                      {method.measurement && (
                        <div className="flex justify-between">
                          <span className="text-purple-400 text-xs">O'lchov:</span>
                          <span className="text-cyan-400 text-xs">{method.measurement}</span>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy kontekst
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Skou (1957)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{CA_PUMP.history.skou.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{CA_PUMP.history.skou.achievement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nobel:</span>
                  <span className="text-yellow-400 text-xs">{CA_PUMP.history.skou.nobel}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Hasselbach (1961)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{CA_PUMP.history.hasselbach.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{CA_PUMP.history.hasselbach.achievement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-purple-200 text-xs">{CA_PUMP.history.hasselbach.contribution}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Toyoshima (2000)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{CA_PUMP.history.toyoshima.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{CA_PUMP.history.toyoshima.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Jurnal:</span>
                  <span className="text-purple-200 text-xs mt-1">{CA_PUMP.history.toyoshima.journal}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Møller (2005)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{CA_PUMP.history.møller.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-purple-200 text-xs">{CA_PUMP.history.møller.achievement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-purple-200 text-xs">{CA_PUMP.history.møller.contribution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔄</span>
            Boshqa ion nasoslari bilan taqqoslash
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Nasos</th>
                  <th className="py-3 px-3 text-teal-400">Turi</th>
                  <th className="py-3 px-3 text-teal-400">Ion</th>
                  <th className="py-3 px-3 text-teal-400">Stexiometriya</th>
                  <th className="py-3 px-3 text-teal-400">Joylashuv</th>
                  <th className="py-3 px-3 text-teal-400">Funksiya</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {CA_PUMP.comparison.map((pump, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{pump.pump}</td>
                    <td className="py-3 px-3 text-xs">{pump.type}</td>
                    <td className="py-3 px-3 text-xs">{pump.ion}</td>
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
          <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Bioanorganik bo'limi
          </Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-black font-bold text-center">
            Chuqurlashgan mavzular →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Bioanorganik kimyo</p>
          <p className="mt-1">Ca²⁺-ATPase (SERCA) • Ion tashish mexanizmlari</p>
        </div>
      </footer>
    </main>
  )
}