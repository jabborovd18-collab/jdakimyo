"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — FEROTSEN (KENGAYTIRILGAN)
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Fe 2p": [
    { orbital: "Fe 2p₃/₂", be: 709.5, intensity: 1.0, fwhm: 1.4, assign: "Fe²⁺ (ferotsen, d⁶)" },
    { orbital: "Fe 2p₁/₂", be: 722.9, intensity: 0.5, fwhm: 1.4, assign: "SO split (Δ=13.4 eV)" },
    { orbital: "Fe 2p₃/₂ (satellite)", be: 714.5, intensity: 0.12, fwhm: 2.0, assign: "Shake-up (π→d*)" },
    { orbital: "Fe 2p (Fe³⁺)", be: 711.2, intensity: 0.0, fwhm: 1.6, assign: "Ferotseniy (oksidlangan)" }
  ],
  "C 1s": [
    { orbital: "C 1s (Cp ring)", be: 284.5, intensity: 1.0, fwhm: 1.3, assign: "Tsiklopentadienil (π-bog'langan)" },
    { orbital: "C 1s (C-C)", be: 285.0, intensity: 0.15, fwhm: 1.3, assign: "Sirt iflosligi (uglevodorod)" },
    { orbital: "C 1s (C-O)", be: 286.3, intensity: 0.08, fwhm: 1.4, assign: "Sirt oksidi" },
    { orbital: "C 1s (O=C)", be: 288.2, intensity: 0.04, fwhm: 1.5, assign: "Karbonil iflosligi" }
  ],
  "O 1s": [
    { orbital: "O 1s (H₂O)", be: 532.0, intensity: 0.05, fwhm: 1.5, assign: "Adsorbsion suv" },
    { orbital: "O 1s (C=O)", be: 533.2, intensity: 0.03, fwhm: 1.5, assign: "Sirt iflosligi" }
  ]
};

const surveyData = [
  { element: "Fe", orbital: "2p₃/₂", be: 709.5, atomic_percent: 9.2, color: "#a855f7", desc: "Markaziy metal (Fe²⁺, d⁶)" },
  { element: "C", orbital: "1s", be: 284.5, atomic_percent: 81.5, color: "#6b7280", desc: "Cp halqalari (10 ta C)" },
  { element: "O", orbital: "1s", be: 532.0, atomic_percent: 8.3, color: "#f59e0b", desc: "Sirt iflosligi (havo)" },
  { element: "N", orbital: "1s", be: 399.5, atomic_percent: 0.5, color: "#3b82f6", desc: "Atmosfera iflosligi" },
  { element: "Si", orbital: "2p", be: 99.5, atomic_percent: 0.5, color: "#10b981", desc: "Substrat iflosligi" }
];

// ═══════════════════════════════════════════════════════════
// QO'SHIMCHA MA'LUMOTLAR
// ═══════════════════════════════════════════════════════════
const additionalInfo = {
  chemical: {
    molecularFormula: "Fe(C₅H₅)₂ = C₁₀H₁₀Fe",
    molecularWeight: "186.03 g/mol",
    meltingPoint: "172.5–174°C",
    boilingPoint: "249°C",
    solubility: "Suvda erimaydi, organik erituvchilarda yaxshi (toluen, efir, DMSO)",
    stability: "400°C gacha barqaror. Havoda sekin oksidlanadi (ferotseniyga)",
    density: "1.49 g/cm³",
    color: "To'q sariq/oranj kristall",
    odor: "Kampforaga o'xshash hid",
    dipoleMoment: "0 D (simmetrik)"
  },
  electronic: {
    configuration: "[Ar] 3d⁶ (Fe²⁺)",
    oxidationState: "+2",
    coordinationNumber: "12 (η⁵-Cp × 2)",
    pointGroup: "D₅ₕ",
    magneticMoment: "0 BM (diamagnit)",
    spinState: "Low-spin (S=0)",
    hOMO: "Fe 3d (e₁g) — a₁g bilan aralashgan",
    lUMO: "Fe 3d (e₂g*) — π* Cp bilan",
    ionizationEnergy: "6.8 eV (birinchi)",
    aromaticity: "Har bir Cp da 6π elektron (Hückel qoidasi)"
  },
  xpsDetails: {
    fe2p: {
      fe0: "Fe⁰ (metall): 706.8 eV (2p₃/₂)",
      fe2Plus: "Fe²⁺ (ferotsen): 709.5 eV (2p₃/₂)",
      fe3Plus: "Fe³⁺ (ferotseniy): 711.2 eV (2p₃/₂)",
      feOxide: "Fe₂O₃ (gematit): 710.8 eV (2p₃/₂)",
      soSplitting: "13.4 eV (2p₃/₂ - 2p₁/₂)",
      shakeUp: "714.5 eV da shake-up satellite (π→d* o'tish)",
      multipletSplitting: "Fe³⁺ da kengaygan pik (~5 eV)",
      fwhm: "1.3–1.6 eV (ligand muhitiga bog'liq)"
    },
    c1s: {
      cpRing: "284.5 eV — Cp π-bog'langan uglerod (10 ta C)",
      contamination: "285.0 eV — sirt iflosligi (C-H)",
      oxidized: "286.3 eV (C-O), 288.2 eV (O=C)",
      shiftExplanation: "Cp uglerodlari grafitdan (284.5 eV) biroz farq qiladi",
      theoreticalRatio: "Ferotsen da C:Fe = 10:1 (nazariy)"
    },
    valenceBand: {
      region1: "0–3 eV — Fe 3d (e₁g, a₁g) va Cp π aralashuvi",
      region2: "3–7 eV — Cp π bog'lovchi orbitallar",
      region3: "7–12 eV — Cp σ va C-H bog'lari",
      region4: "12–15 eV — C 2s orbitallari",
      hOMO: "HOMO: Fe 3d (e₁g) + Cp π (aralashgan)",
      lUMO: "LUMO: Fe 3d (e₂g*) + Cp π* (aralashgan)"
    }
  },
  derivatives: [
    {
      name: "Ferotsen",
      formula: "Fe(C₅H₅)₂",
      oxidationState: "Fe²⁺",
      fe2pBE: "709.5 eV",
      c1sBE: "284.5 eV",
      color: "Sariq",
      magnetic: "Diamagnit",
      application: "Standart, katalizator, sensor"
    },
    {
      name: "Ferotseniy (oksidlangan)",
      formula: "[Fe(C₅H₅)₂]⁺",
      oxidationState: "Fe³⁺",
      fe2pBE: "711.2 eV",
      c1sBE: "284.7 eV",
      color: "Ko'k-qora",
      magnetic: "Paramagnit (S=1/2)",
      application: "Elektrokimyoviy sensorlar"
    },
    {
      name: "Asetilferotsen",
      formula: "Fe(C₅H₅)(C₅H₄COCH₃)",
      oxidationState: "Fe²⁺",
      fe2pBE: "709.6 eV",
      c1sBE: "284.5 / 286.3 (C=O)",
      color: "To'q sariq",
      magnetic: "Diamagnit",
      application: "Elektrofil aromatik almashtirish o'rganish"
    },
    {
      name: "Detsilferotsen",
      formula: "Fe(C₅H₅)(C₅H₄C₁₀H₂₁)",
      oxidationState: "Fe²⁺",
      fe2pBE: "709.5 eV",
      c1sBE: "284.5 / 285.0",
      color: "Sariq",
      magnetic: "Diamagnit",
      application: "Sirt faol moddalar, sensorlar"
    },
    {
      name: "1,1'-Diferosenil etan",
      formula: "Fe₂(C₅H₄)₂(C₂H₄)",
      oxidationState: "2×Fe²⁺",
      fe2pBE: "709.5 eV",
      c1sBE: "284.5 eV",
      color: "Sariq",
      magnetic: "Diamagnit",
      application: "Biferotsen (elektrokimyoviy)"
    },
    {
      name: "Rutenotsen",
      formula: "Ru(C₅H₅)₂",
      oxidationState: "Ru²⁺",
      fe2pBE: "— (Ru 3d: 280.5 eV)",
      c1sBE: "284.4 eV",
      color: "Qo'ng'ir",
      magnetic: "Paramagnit (S=1)",
      application: "Katalizator"
    }
  ],
  history: [
    { year: "1898", event: "Non-direct sentez urinishlari (L. Claisen va boshqalar). Fe tuzlari va Grignard reagenti reaksiyasi." },
    { year: "1951", event: "Kealy va Pauson tasodifan ferotsenni sintez qildi. FeCl₂ + 2C₅H₅MgBr → sariq kristallar." },
    { year: "1952", event: "Geoffrey Wilkinson va Ernst Otto Fischer mustaqil ravishda sandwich strukturasini taklif qildi." },
    { year: "1952", event: "Moffitt va Pauling molekulyar orbital nazariyasi bilan sandwich strukturasini tasdiqladi." },
    { year: "1973", event: "Wilkinson va Fischer Nobel mukofotini oldi (metalloaromatik birikmalar uchun)." },
    { year: "1960–1980", event: "Ferotsen katalizator va elektrokimyoda keng qo'llanilishi boshlandi." },
    { year: "1980–2000", event: "Ferotsenli sensorlar, dori vositalari va polimerlar ishlab chiqildi." },
    { year: "2000–hozir", event: "Nanotexnologiya, molekulyar elektronika va yashil energiya (batareyalar) da qo'llanilishi." }
  ],
  applications: [
    {
      category: "Elektrokimyo",
      items: [
        "Potentsiometriyada standart (E° = 0.4 V vs SHE)",
        "Sensorlar va biosensorlar",
        "Elektrokromik qurilmalar"
      ]
    },
    {
      category: "Kataliz",
      items: [
        "Ferotsenli katalizatorlar",
        "Polimerizatsiya initiatorlari",
        "Sintetik organik kimyo"
      ]
    },
    {
      category: "Materialshunoslik",
      items: [
        "Ferotsenli polimerlar (poliferotsenlar)",
        "Karbon nanotrubkalar sintezi (CVD)",
        "Yonilg'i qo'shimchalari (antidetonator)"
      ]
    },
    {
      category: "Tibbiyot",
      items: [
        "Antimalariyal dorilar (ferotsenli xloroxin)",
        "Antikanser agentlar (faol)",
        "Biologik sensorlar"
      ]
    }
  ],
  safety: {
    hazards: "Oson yonuvchan, zaharli emas, lekin uzoq muddatli ta'sir o'rganilmagan",
    storage: "Yorug'likdan himoyalangan, germetik idishda. Havo va namlikdan saqlang.",
    handling: "Qo'lqop va himoya ko'zoynak kiying. Tortuvchi shkafda ishlang.",
    disposal: "Organik chiqindi sifatida utilizatsiya qiling. Suvga to'kmang!",
    firstAid: {
      skin: "Suv va sovun bilan yuving.",
      eyes: "15 daqiqa suv bilan yuving. Tibbiy yordam.",
      inhalation: "Taza havoga chiqaring.",
      ingestion: "Shifokorga murojaat qiling."
    }
  }
};

export default function Ferotsen() {
  const [selectedRegion, setSelectedRegion] = useState("Fe 2p");
  const [showSurvey, setShowSurvey] = useState(false);
  const [compareMode, setCompareMode] = useState("none");
  
  const [moStep, setMoStep] = useState(0);
  const [sandwichRotation, setSandwichRotation] = useState(0);
  const [sandwichAnimation, setSandwichAnimation] = useState(false);
  
  const [compareDerivative1, setCompareDerivative1] = useState("Ferotsen");
  const [compareDerivative2, setCompareDerivative2] = useState("Ferotseniy (oksidlangan)");
  
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [activeAppCategory, setActiveAppCategory] = useState(0);

  useEffect(() => {
    if (sandwichAnimation) {
      const interval = setInterval(() => {
        setSandwichRotation(prev => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [sandwichAnimation]);

  const generateSpectrum = (region, refMode) => {
    const points = [];
    const peaks = xpsPeaks[region];
    if (!peaks) return [];

    const minBE = Math.min(...peaks.map(p => p.be)) - 8;
    const maxBE = Math.max(...peaks.map(p => p.be)) + 12;
    const steps = 250;

    for (let i = 0; i <= steps; i++) {
      const be = minBE + (i / steps) * (maxBE - minBE);
      let intensity = 0;

      peaks.forEach(peak => {
        const x = (be - peak.be) / peak.fwhm;
        intensity += peak.intensity * Math.exp(-0.5 * x * x);
      });

      if (refMode === "fe0" && region === "Fe 2p") {
        const x1 = (be - 706.8) / 1.2;
        intensity += 0.95 * Math.exp(-0.5 * x1 * x1);
        const x2 = (be - 719.9) / 1.2;
        intensity += 0.48 * Math.exp(-0.5 * x2 * x2);
        if (be > 706.8) {
          intensity += 0.10 * Math.exp(-(be - 706.8) / 3);
        }
      } else if (refMode === "fe3" && region === "Fe 2p") {
        const x1 = (be - 711.2) / 1.6;
        intensity += 0.85 * Math.exp(-0.5 * x1 * x1);
        const x2 = (be - 724.6) / 1.6;
        intensity += 0.42 * Math.exp(-0.5 * x2 * x2);
        const x3 = (be - 718.5) / 2.0;
        intensity += 0.25 * Math.exp(-0.5 * x3 * x3);
      }

      const bg = 0.04 * (maxBE - be) / (maxBE - minBE);
      intensity += bg;

      points.push({ be, intensity });
    }
    return points;
  };

  const spectrum = useMemo(() =>
    generateSpectrum(selectedRegion, compareMode),
    [selectedRegion, compareMode]
  );

  const maxIntensity = Math.max(...spectrum.map(p => p.intensity), 0.01);

  const generateSurveySpectrum = () => {
    const points = [];
    const allPeaks = [
      { be: 709.5, intensity: 0.8, label: "Fe 2p", color: "#a855f7" },
      { be: 284.5, intensity: 1.2, label: "C 1s", color: "#6b7280" },
      { be: 532.0, intensity: 0.15, label: "O 1s", color: "#f59e0b" },
      { be: 399.5, intensity: 0.05, label: "N 1s", color: "#3b82f6" },
      { be: 99.5, intensity: 0.08, label: "Si 2p", color: "#10b981" }
    ];
    for (let i = 0; i <= 250; i++) {
      const be = 50 + (i / 250) * 750;
      let intensity = 0.03 * (800 - be) / 750;
      allPeaks.forEach(peak => {
        const x = (be - peak.be) / 4;
        intensity += peak.intensity * Math.exp(-0.5 * x * x);
      });
      points.push({ be, intensity });
    }
    return points;
  };

  const surveySpectrum = useMemo(() => generateSurveySpectrum(), []);
  const maxSurvey = Math.max(...surveySpectrum.map(p => p.intensity), 0.01);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* ═════ HEADER ═════ */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/xps" className="hover:text-purple-300">XPS</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/xps/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-violet-400 font-semibold">Ferotsen</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-3">
                <span className="text-3xl">⚗️</span>
                <span>Ferotsen</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Fe(C₅H₅)₂ • Fe²⁺ (d⁶) • Sandwich struktura (D₅ₕ) • Metalloaromatik • Molekulyar massa: 186.03 g/mol
              </p>
            </div>
            <Link
              href="/ilmiy/tahlil/xps/birikmalar"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50 transition-colors"
            >
              ← Birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ═════ STATISTIKA ═════ */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Metal</div>
            <div className="text-xl font-bold text-violet-400">Fe²⁺</div>
            <div className="text-[10px] text-purple-400">d⁶</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-cyan-400">D₅ₕ</div>
            <div className="text-[10px] text-purple-400">Sandwich</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Fe 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-violet-400 font-mono">709.5</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-green-400">S=0</div>
            <div className="text-[10px] text-purple-400">Diamagnit</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Qo'llanilish</div>
            <div className="text-xl font-bold text-yellow-400">Standart</div>
            <div className="text-[10px] text-purple-400">Elektrokimyo</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Nobel</div>
            <div className="text-xl font-bold text-green-400">1973</div>
            <div className="text-[10px] text-purple-400">Wilkinson & Fischer</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-violet-400">Ferotsen</strong> (bis(tsiklopentadienil)temir(II), <strong>Fe(C₅H₅)₂</strong>) —
              birinchi va eng mashhur <strong>metallocene</strong> birikmasi.
              Fe²⁺ (d⁶) ikkita <strong>η⁵-tsiklopentadienil (Cp)</strong> halqasi orasida joylashgan bo'lib,
              <strong>sandwich strukturani</strong> hosil qiladi.
              <br/><br/>
              Har bir Cp halqasi <strong>6π elektron</strong>ga ega (Hückel qoidasi — aromatiklik).
              Fe²⁺ bilan Cp π-orbitallari orasida kuchli <strong>koordinatsion bog'</strong> mavjud.
              <br/><br/>
              <strong>XPS da Fe 2p₃/₂ BE = 709.5 eV</strong> Fe²⁺ holatini tasdiqlaydi.
              C 1s pik 284.5 eV da Cp uglerodlariga tegishli.
              <br/><br/>
              <strong className="text-amber-400">💡 Qiziq fakt:</strong> Ferotsen 1951-yilda tasodifan kashf etilgan.
              Wilkinson va Fischer uning sandwich strukturasini aniqlab, 1973-yilda Nobel mukofotini oldilar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar formula:</span>
                  <span className="font-mono">C₁₀H₁₀Fe</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">186.03 g/mol</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Erish harorati:</span>
                  <span className="font-mono">172.5–174°C</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Qaynash harorati:</span>
                  <span className="font-mono">249°C</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Zichlik:</span>
                  <span className="font-mono">1.49 g/cm³</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-200">To'q sariq/oranj</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Dipol momenti:</span>
                  <span className="font-mono">0 D (simmetrik)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Aromatiklik:</span>
                  <span className="font-bold text-violet-400">Ha (2×6π)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Eruvchanlik:</span>
                  <span className="text-[10px]">Organik erituvchilarda</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">[Ar] 3d⁶ (Fe²⁺)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="text-cyan-400 font-bold">Sandwich (D₅ₕ)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsiya:</span>
                  <span className="font-mono">η⁵-Cp × 2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Umumiy spin:</span>
                  <span className="font-mono">S = 0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="font-mono text-green-400 font-bold">0 ta</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">μ<sub>eff</sub>:</span>
                  <span className="font-mono">0 BM (diamagnit)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">HOMO:</span>
                  <span className="font-mono text-[10px]">Fe 3d (e₁g) + Cp π</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">LUMO:</span>
                  <span className="font-mono text-[10px]">Fe 3d (e₂g*) + Cp π*</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ionizatsiya E:</span>
                  <span className="font-mono">6.8 eV</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">📊 XPS tafsilotlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Fe 2p₃/₂ (Fe⁰):</span>
                  <span className="font-mono">706.8 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Fe 2p₃/₂ (Fe²⁺):</span>
                  <span className="font-mono text-violet-400 font-bold">709.5 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Fe 2p₃/₂ (Fe³⁺):</span>
                  <span className="font-mono">711.2 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">SO splitting:</span>
                  <span className="font-mono">13.4 eV (2p)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">FWHM:</span>
                  <span className="font-mono">1.3–1.6 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">C 1s (Cp):</span>
                  <span className="font-mono">284.5 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">C:Fe nisbati:</span>
                  <span className="font-mono text-violet-400 font-bold">10:1</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Shake-up:</span>
                  <span className="font-mono text-[10px]">714.5 eV (π→d*)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ INTERAKTIV SANDWICH STRUKTURA ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🥪</span> Interaktiv sandwich struktura
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Ferotsen ikkita <strong>η⁵-tsiklopentadienil (Cp)</strong> halqasi orasida joylashgan <strong>Fe²⁺</strong> ionidan iborat.
              Har bir Cp halqasi 5 ta uglerod atomidan tashkil topgan bo'lib, Fe²⁺ bilan <strong>π-bog'</strong> orqali bog'lanadi.
              <br/><br/>
              <strong className="text-amber-400">💡 Qiziq fakt:</strong> Cp halqalari <strong>staggered</strong> yoki <strong>eclipsed</strong> holatda bo'lishi mumkin.
              Qattiq holatda eclipsed (D₅ₕ), gaz fazasida staggered (D₅d) afzalroq.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-4">
              <svg viewBox="0 0 400 300" className="w-full h-64">
                <g transform={`translate(200, 100) rotate(${sandwichRotation})`}>
                  {[0, 1, 2, 3, 4].map(i => {
                    const angle = (i * 72 - 90) * Math.PI / 180;
                    const x = Math.cos(angle) * 60;
                    const y = Math.sin(angle) * 20;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="10" fill="#6b7280" opacity="0.8" />
                        <text x={x} y={y + 4} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">C</text>
                      </g>
                    );
                  })}
                  <ellipse cx="0" cy="0" rx="60" ry="20" fill="none" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                </g>

                <circle cx="200" cy="150" r="18" fill="#a855f7" />
                <text x="200" y="155" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">Fe²⁺</text>

                <g transform={`translate(200, 200) rotate(${-sandwichRotation})`}>
                  {[0, 1, 2, 3, 4].map(i => {
                    const angle = (i * 72 - 90) * Math.PI / 180;
                    const x = Math.cos(angle) * 60;
                    const y = Math.sin(angle) * 20;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="10" fill="#6b7280" opacity="0.8" />
                        <text x={x} y={y + 4} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">C</text>
                      </g>
                    );
                  })}
                  <ellipse cx="0" cy="0" rx="60" ry="20" fill="none" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                </g>

                <line x1="200" y1="120" x2="200" y2="132" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                <line x1="200" y1="168" x2="200" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />

                <text x="200" y="40" fill="#fbbf24" fontSize="9" textAnchor="middle">η⁵-C₅H₅ (yuqori)</text>
                <text x="200" y="270" fill="#fbbf24" fontSize="9" textAnchor="middle">η⁵-C₅H₅ (pastki)</text>
                <text x="350" y="150" fill="#a855f7" fontSize="9" textAnchor="middle">Fe²⁺ (d⁶)</text>
              </svg>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSandwichAnimation(!sandwichAnimation)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    sandwichAnimation ? "bg-red-600 text-white" : "bg-violet-600 text-white hover:bg-violet-500"
                  }`}
                >
                  {sandwichAnimation ? "⏸ To'xtatish" : "▶ Aylantirish"}
                </button>
                <button
                  onClick={() => { setSandwichRotation(0); setSandwichAnimation(false); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 transition-all"
                >
                  🔄 Qayta o'rnatish
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-violet-400 font-bold mb-3 text-sm">📏 Strukturaviy parametrlar</h3>
                <ul className="text-purple-200 space-y-2 text-xs">
                  <li className="flex justify-between">
                    <span className="text-purple-400">Fe-Cp masofa:</span>
                    <span className="font-mono">1.66 Å</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Cp-Cp masofa:</span>
                    <span className="font-mono">3.32 Å</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Fe-C bog' uzunligi:</span>
                    <span className="font-mono">2.04 Å</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">C-C halqa:</span>
                    <span className="font-mono">1.46 Å</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Simmetriya:</span>
                    <span className="font-mono text-violet-400 font-bold">D₅ₕ (eclipsed)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-violet-400 font-bold mb-3 text-sm">🔗 Bog'lanish turi</h3>
                <ul className="text-purple-200 space-y-2 text-xs">
                  <li className="flex justify-between">
                    <span className="text-purple-400">Fe-Cp bog':</span>
                    <span className="font-mono">π-koordinatsion</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Elektron berish:</span>
                    <span className="font-mono">Cp π → Fe 3d</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Elektron qaytish:</span>
                    <span className="font-mono">Fe 3d → Cp π*</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Bog' energiyasi:</span>
                    <span className="font-mono">~400 kJ/mol</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
                <p><strong className="text-amber-400">💡 Qiziq fakt:</strong> Ferotsen <strong>18 elektron qoidasiga</strong> mos keladi:
                Fe²⁺ (6e⁻) + 2 × Cp⁻ (2×6e⁻) = <strong>18 elektron</strong>.
                Bu uni barqaror va diamagnit qiladi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ INTERAKTIV MOLEKULYAR ORBITAL DIAGRAMMASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⚡</span> Interaktiv molekulyar orbital diagrammasi
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Ferotsenda <strong>Fe 3d orbitallari</strong> va <strong>Cp π orbitallari</strong> o'rtasida kuchli aralashuv mavjud.
              Natijada <strong>bog'lovchi, bog'lanmaydigan va bo'shashtiruvchi</strong> MO lar hosil bo'ladi.
              <br/><br/>
              <strong className="text-amber-400">💡 Qiziq fakt:</strong> Ferotsen <strong>18 elektron qoidasiga</strong> mos keladi,
              bu uni barcha metallotsenlar ichida eng barqaror qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-4">
              <svg viewBox="0 0 400 320" className="w-full h-72">
                <line x1="50" y1="20" x2="50" y2="300" stroke="#6b7280" strokeWidth="2" />
                <text x="30" y="160" fill="#9ca3af" fontSize="10" textAnchor="middle" transform="rotate(-90, 30, 160)">Energiya →</text>

                <g opacity={moStep >= 5 ? 1 : 0.3}>
                  <line x1="100" y1="40" x2="180" y2="40" stroke="#ef4444" strokeWidth="3" />
                  <text x="140" y="30" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">e₂g* (LUMO)</text>
                  <text x="200" y="45" fill="#9ca3af" fontSize="8">Cp π* + Fe 3d</text>
                </g>

                <g opacity={moStep >= 4 ? 1 : 0.3}>
                  <line x1="100" y1="90" x2="180" y2="90" stroke="#f59e0b" strokeWidth="3" />
                  <text x="140" y="80" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">e₁g (HOMO)</text>
                  <text x="200" y="95" fill="#9ca3af" fontSize="8">Fe 3d (asosan)</text>
                  {moStep >= 4 && (
                    <>
                      <circle cx="130" cy="90" r="4" fill="#f59e0b" />
                      <circle cx="150" cy="90" r="4" fill="#f59e0b" />
                      <circle cx="130" cy="90" r="4" fill="#f59e0b" />
                      <circle cx="150" cy="90" r="4" fill="#f59e0b" />
                    </>
                  )}
                </g>

                <g opacity={moStep >= 3 ? 1 : 0.3}>
                  <line x1="100" y1="140" x2="180" y2="140" stroke="#10b981" strokeWidth="3" />
                  <text x="140" y="130" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">a₁g</text>
                  <text x="200" y="145" fill="#9ca3af" fontSize="8">Fe 3d + Cp π</text>
                  {moStep >= 3 && (
                    <>
                      <circle cx="130" cy="140" r="4" fill="#10b981" />
                      <circle cx="150" cy="140" r="4" fill="#10b981" />
                    </>
                  )}
                </g>

                <g opacity={moStep >= 2 ? 1 : 0.3}>
                  <line x1="100" y1="200" x2="180" y2="200" stroke="#3b82f6" strokeWidth="3" />
                  <text x="140" y="190" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">e₁g (bog'lovchi)</text>
                  <text x="200" y="205" fill="#9ca3af" fontSize="8">Fe 3d + Cp π</text>
                  {moStep >= 2 && (
                    <>
                      <circle cx="120" cy="200" r="4" fill="#3b82f6" />
                      <circle cx="140" cy="200" r="4" fill="#3b82f6" />
                      <circle cx="160" cy="200" r="4" fill="#3b82f6" />
                      <circle cx="130" cy="200" r="4" fill="#3b82f6" />
                    </>
                  )}
                </g>

                <g opacity={moStep >= 1 ? 1 : 0.3}>
                  <line x1="100" y1="260" x2="180" y2="260" stroke="#8b5cf6" strokeWidth="3" />
                  <text x="140" y="250" fill="#8b5cf6" fontSize="10" textAnchor="middle" fontWeight="bold">Cp π (pastki)</text>
                  <text x="200" y="265" fill="#9ca3af" fontSize="8">Cp halqalari</text>
                  {moStep >= 1 && (
                    <>
                      <circle cx="120" cy="260" r="4" fill="#8b5cf6" />
                      <circle cx="140" cy="260" r="4" fill="#8b5cf6" />
                      <circle cx="160" cy="260" r="4" fill="#8b5cf6" />
                      <circle cx="130" cy="260" r="4" fill="#8b5cf6" />
                    </>
                  )}
                </g>

                <text x="320" y="40" fill="#ef4444" fontSize="8">LUMO (bo'sh)</text>
                <text x="320" y="60" fill="#f59e0b" fontSize="8">HOMO (to'ldirilgan)</text>
                <text x="320" y="80" fill="#10b981" fontSize="8">a₁g (to'ldirilgan)</text>
                <text x="320" y="100" fill="#3b82f6" fontSize="8">e₁g bog'lovchi</text>
                <text x="320" y="120" fill="#8b5cf6" fontSize="8">Cp π (to'ldirilgan)</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-violet-400 font-bold mb-3 text-sm">🎮 Qadamlar</h3>
                <div className="flex gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5].map(step => (
                    <button
                      key={step}
                      onClick={() => setMoStep(step)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        moStep === step 
                          ? "bg-violet-600 text-white" 
                          : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-purple-200">
                  {moStep === 0 && <p>Boshlang'ich holat: barcha orbitallar yashirin.</p>}
                  {moStep === 1 && <p>Cp π orbitallari: har bir Cp halqasidan 6π elektron (jami 12).</p>}
                  {moStep === 2 && <p>e₁g bog'lovchi MO: Fe 3d va Cp π aralashuvi (4 elektron).</p>}
                  {moStep === 3 && <p>a₁g MO: Fe 3d va Cp π aralashuvi (2 elektron).</p>}
                  {moStep === 4 && <p>e₁g HOMO: Fe 3d asosan (4 elektron). Bu ferotsenning HOMO.</p>}
                  {moStep === 5 && <p>e₂g* LUMO: Fe 3d va Cp π* aralashuvi (bo'sh). Bu ferotsenning LUMO.</p>}
                </div>
              </div>

              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
                <p><strong className="text-amber-400">💡 18 elektron qoidasi:</strong>
                Cp π (12e⁻) + e₁g bog'lovchi (4e⁻) + a₁g (2e⁻) + e₁g HOMO (4e⁻) = <strong>18 elektron</strong>.
                Bu ferotsenni barqaror va diamagnit qiladi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ XPS SPEKTR SIMULYATORI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span> XPS spektr simulyatori
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {Object.keys(xpsPeaks).map(region => (
              <button key={region} onClick={() => setSelectedRegion(region)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === region ? "bg-violet-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}>{region}</button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {selectedRegion === "Fe 2p" && (
              <div className="flex gap-1">
                <button onClick={() => setCompareMode("none")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  Yolg'iz
                </button>
                <button onClick={() => setCompareMode("fe0")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "fe0" ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Fe⁰ (metall)
                </button>
                <button onClick={() => setCompareMode("fe3")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "fe3" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Fe³⁺ (ferotseniy)
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <input type="checkbox" checked={showSurvey} onChange={(e) => setShowSurvey(e.target.checked)} className="accent-violet-500" />
              <span className="text-xs text-purple-300">Survey spektr</span>
            </label>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-4">
            {!showSurvey ? (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV) →</text>
                <text x="25" y="140" fill="#c4b5fd" fontSize="10" textAnchor="middle" transform="rotate(-90, 25, 140)">Intensivlik</text>

                {(() => {
                  const peaks = xpsPeaks[selectedRegion];
                  if (!peaks || peaks.length === 0) return null;
                  const minBE = Math.min(...peaks.map(p => p.be)) - 8;
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 12;
                  const ticks = [];
                  for (let be = Math.ceil(minBE / 5) * 5; be <= maxBE; be += 5) {
                    const x = 60 + ((be - minBE) / (maxBE - minBE)) * 520;
                    ticks.push(<g key={be}><line x1={x} y1="250" x2={x} y2="255" stroke="#6b7280" strokeWidth="1" /><text x={x} y="268" fill="#9ca3af" fontSize="9" textAnchor="middle">{be}</text></g>);
                  }
                  return ticks;
                })()}

                <polygon points={`60,250 ` + spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ') + ` 580,250`} fill="#8b5cf6" opacity="0.12" />

                <polyline points={spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="2" />

                {xpsPeaks[selectedRegion]?.map((peak, i) => {
                  const peaks = xpsPeaks[selectedRegion];
                  const minBE = Math.min(...peaks.map(p => p.be)) - 8;
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 12;
                  const x = 60 + ((peak.be - minBE) / (maxBE - minBE)) * 520;
                  return (
                    <g key={i}>
                      <line x1={x} y1="30" x2={x} y2="250" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      <text x={x} y="25" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">{peak.orbital}</text>
                      <text x={x} y="15" fill="#fbbf24" fontSize="8" textAnchor="middle">{peak.be} eV</text>
                    </g>
                  );
                })}

                <text x="500" y="45" fill="#8b5cf6" fontSize="9" textAnchor="end" fontWeight="bold">Ferotsen (Fe²⁺)</text>
                {compareMode === "fe0" && <text x="500" y="60" fill="#eab308" fontSize="9" textAnchor="end">Fe⁰ (metall, asimmetrik)</text>}
                {compareMode === "fe3" && <text x="500" y="60" fill="#ef4444" fontSize="9" textAnchor="end">Fe³⁺ (ferotseniy)</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 709.5, label: "Fe 2p", color: "#a855f7" }, { be: 284.5, label: "C 1s", color: "#6b7280" }, { be: 532.0, label: "O 1s", color: "#f59e0b" }, { be: 399.5, label: "N 1s", color: "#3b82f6" }, { be: 99.5, label: "Si 2p", color: "#10b981" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 50) / 750) * 520;
                  return (<g key={i}><line x1={x} y1="30" x2={x} y2="250" stroke={peak.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" /><text x={x} y="25" fill={peak.color} fontSize="9" textAnchor="middle" fontWeight="bold">{peak.label}</text></g>);
                })}
              </svg>
            )}
          </div>

          {!showSurvey && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {xpsPeaks[selectedRegion]?.map((peak, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-3 border border-purple-700/30">
                  <p className="text-purple-400 text-xs mb-1">{peak.orbital}</p>
                  <p className="text-violet-400 font-bold font-mono text-lg">{peak.be} eV</p>
                  <p className="text-purple-300 text-[10px]">{peak.assign}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 bg-purple-950/50 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-violet-400">💡 Spektr tafsilotlari:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><strong>Fe 2p:</strong> SO splitting Δ = 13.4 eV (2p₃/₂ - 2p₁/₂). Fe²⁺ uchun xarakterli.</li>
              <li><strong>C 1s:</strong> 284.5 eV — Cp uglerodlari (10 ta). Grafitdan (284.5 eV) biroz farq qiladi.</li>
              <li><strong>Shake-up satellite:</strong> 714.5 eV da π→d* o'tish (ferotsenda kuchsiz).</li>
              <li><strong>C:Fe nisbati:</strong> Survey XPS da 10:1 bo'lishi kerak (nazariy).</li>
            </ul>
          </div>
        </div>

        {/* ═════ FE OKSIDLANISH DARAJALARI TAQQOSLASH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔄</span> Fe oksidlanish darajalari — XPS solishtirish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-center text-yellow-400">Fe⁰</th>
                <th className="py-3 px-4 text-center text-violet-400">Fe²⁺ (Ferotsen)</th>
                <th className="py-3 px-4 text-center text-red-400">Fe³⁺ (Ferotseniy)</th>
                <th className="py-3 px-4 text-center text-orange-400">Fe³⁺ (Fe₂O₃)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Elektron konfiguratsiya", "d⁸ (4s²)", "d⁶", "d⁵", "d⁵"],
                  ["2p₃/₂ BE (eV)", "706.8", "709.5", "711.2", "710.8"],
                  ["2p₁/₂ BE (eV)", "719.9", "722.9", "724.6", "724.3"],
                  ["SO splitting (eV)", "13.1", "13.4", "13.4", "13.5"],
                  ["Pik shakli", "Asimmetrik tail", "Simmetrik", "Simmetrik", "Keng + multiplet"],
                  ["FWHM (eV)", "~1.2", "~1.4", "~1.6", "~2.0"],
                  ["Shake-up satellite", "Yo'q", "Kuchsiz (714.5 eV)", "Kuchsiz", "Kuchli (719 eV)"],
                  ["Geometriya", "FCC metall", "Sandwich (D₅ₕ)", "Sandwich (D₅ₕ)", "Korund"],
                  ["Magnit", "Ferromagnit", "Diamagnit", "Paramagnit (S=1/2)", "Antiferromagnit"],
                  ["Rang", "Kumushrang", "Sariq", "Ko'k-qora", "Qizil-qo'ng'ir"],
                  ["Misol", "Fe foil", "Fe(C₅H₅)₂", "[Fe(C₅H₅)₂]⁺", "Gematit"],
                  ["XPS referens", "706.8 eV", "709.5 eV", "711.2 eV", "710.8 eV"]
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i >= 1 && i <= 3 ? 'bg-violet-900/10' : ''}`}>
                    <td className="py-2 px-4 font-semibold">{r[0]}</td>
                    <td className="py-2 px-4 text-center">{r[1]}</td>
                    <td className="py-2 px-4 text-center font-bold text-violet-400">{r[2]}</td>
                    <td className="py-2 px-4 text-center">{r[3]}</td>
                    <td className="py-2 px-4 text-center">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 Diagnostika:</strong> Fe oksidlanish darajasini aniqlash uchun <strong>Fe 2p₃/₂ BE</strong> eng ishonchli ko'rsatkichdir.
            Har bir oksidlanish darajasi oshganda BE ~1.5–2.0 eV ga ortadi.
            Ferotsenda BE = 709.5 eV → <strong>Fe²⁺ tasdiqlanadi</strong>.
            <br/><br/>
            <strong className="text-amber-400">💡 Qiziq fakt:</strong> Fe³⁺ (ferotseniy) da <strong>multiplet splitting</strong> kuzatiladi (toq elektron tufayli),
            bu Fe₂O₃ da yanada kuchliroq (~5 eV kengayish).</p>
          </div>
        </div>

        {/* ═════ INTERAKTIV FEROTSEN HOSILALARI TAQQOSLASH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🧪</span> Interaktiv ferotsen hosilalari taqqoslash
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Ferotsen turli <strong>hosilalarini</strong> XPS ma'lumotlari va xususiyatlari bo'yicha taqqoslang.
              Har bir hosilaning Fe 2p va C 1s BE qiymatlari ligand muhitiga bog'liq.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-purple-300 text-xs mb-2 block">Birikma 1:</label>
              <select
                value={compareDerivative1}
                onChange={(e) => setCompareDerivative1(e.target.value)}
                className="w-full bg-purple-900/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-purple-200"
              >
                {additionalInfo.derivatives.map((d, i) => (
                  <option key={i}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-purple-300 text-xs mb-2 block">Birikma 2:</label>
              <select
                value={compareDerivative2}
                onChange={(e) => setCompareDerivative2(e.target.value)}
                className="w-full bg-purple-900/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-purple-200"
              >
                {additionalInfo.derivatives.map((d, i) => (
                  <option key={i}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                  <th className="py-3 px-4 text-center text-violet-400">{compareDerivative1}</th>
                  <th className="py-3 px-4 text-center text-cyan-400">{compareDerivative2}</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Formula",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative1)?.formula || "—",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative2)?.formula || "—"
                  ],
                  ["Oksidlanish darajasi",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative1)?.oxidationState || "—",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative2)?.oxidationState || "—"
                  ],
                  ["Fe 2p₃/₂ BE (eV)",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative1)?.fe2pBE || "—",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative2)?.fe2pBE || "—"
                  ],
                  ["C 1s BE (eV)",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative1)?.c1sBE || "—",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative2)?.c1sBE || "—"
                  ],
                  ["Rang",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative1)?.color || "—",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative2)?.color || "—"
                  ],
                  ["Magnit xususiyati",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative1)?.magnetic || "—",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative2)?.magnetic || "—"
                  ],
                  ["Qo'llanilish",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative1)?.application || "—",
                    additionalInfo.derivatives.find(d => d.name === compareDerivative2)?.application || "—"
                  ]
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-4 font-semibold">{row[0]}</td>
                    <td className="py-2 px-4 text-center">{row[1]}</td>
                    <td className="py-2 px-4 text-center">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 XPS da farq:</strong> Ferotsen va uning hosilalarida Fe 2p₃/₂ BE <strong>709.5–711.2 eV</strong> oraliqda.
            Oksidlangan ferotseniy (Fe³⁺) da BE ~1.7 eV ga yuqori.
            C 1s da <strong>funksional guruhlar</strong> (masalan, C=O) qo'shimcha piklar beradi.</p>
          </div>
        </div>

        {/* ═════ QO'LLANILISH SOHALARI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎯</span> Qo'llanilish sohalari
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {additionalInfo.applications.map((app, i) => (
              <button
                key={i}
                onClick={() => setActiveAppCategory(i)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeAppCategory === i ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                {app.category}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-violet-400 font-bold mb-3 text-sm">
              {additionalInfo.applications[activeAppCategory].category}
            </h3>
            <ul className="text-purple-200 space-y-2 text-sm">
              {additionalInfo.applications[activeAppCategory].items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 Qiziq fakt:</strong> Ferotsen <strong>elektrokimyoda standart</strong> sifatida ishlatiladi
            (E° = 0.4 V vs SHE). Uning <strong>qaytarilish-kaytarilmaslik</strong> xususiyati barqaror va takrorlanuvchan.</p>
          </div>
        </div>

        {/* ═════ INTERAKTIV TARIX ═════ */}
        <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-2">
            <span>📜</span> Interaktiv tarixiy xronologiya
          </h2>

          <div className="space-y-3">
            {additionalInfo.history.map((event, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl border border-purple-700/30 overflow-hidden">
                <button
                  onClick={() => setExpandedTimeline(expandedTimeline === i ? null : i)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-purple-700/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-violet-300 font-bold font-mono">{event.year}</span>
                    <span className="text-purple-200 text-sm">{event.event.substring(0, 70)}...</span>
                  </div>
                  <span className="text-violet-400 text-xl">
                    {expandedTimeline === i ? "−" : "+"}
                  </span>
                </button>

                {expandedTimeline === i && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-purple-200 text-xs leading-relaxed">
                        {event.event}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═════ XAVFSIZLIK ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔒</span> Xavfsizlik va saqlash</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3 text-sm">⚠️ Xavflilik</h3>
              <p className="text-purple-200 text-xs leading-relaxed">{additionalInfo.safety.hazards}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3 text-sm">📦 Saqlash</h3>
              <p className="text-purple-200 text-xs leading-relaxed">{additionalInfo.safety.storage}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3 text-sm">🧤 Ishlash</h3>
              <p className="text-purple-200 text-xs leading-relaxed">{additionalInfo.safety.handling}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3 text-sm">🗑️ Utilizatsiya</h3>
              <p className="text-purple-200 text-xs leading-relaxed">{additionalInfo.safety.disposal}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 md:col-span-2">
              <h3 className="text-violet-400 font-bold mb-3 text-sm">🚑 Birinchi yordam</h3>
              <ul className="text-purple-200 space-y-2 text-xs">
                <li className="flex justify-between">
                  <span className="text-purple-400">Teri:</span>
                  <span>{additionalInfo.safety.firstAid.skin}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ko'z:</span>
                  <span>{additionalInfo.safety.firstAid.eyes}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Nafas:</span>
                  <span>{additionalInfo.safety.firstAid.inhalation}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Yutish:</span>
                  <span>{additionalInfo.safety.firstAid.ingestion}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>✅</span> Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Ferotsen (<strong className="text-violet-400">Fe(C₅H₅)₂</strong>) — birinchi va eng muhim <strong>metallocene</strong> birikmasi (1951-yilda kashf etilgan).</li>
            <li>Fe²⁺ (d⁶) — <strong>sandwich struktura</strong> (D₅ₕ), <strong>diamagnit</strong> (S=0, μ<sub>eff</sub>=0 BM).</li>
            <li><strong>Fe 2p₃/₂ BE = 709.5 eV</strong> — Fe²⁺ uchun xarakterli (Fe⁰: 706.8 eV, Fe³⁺: 711.2 eV).</li>
            <li>SO splitting: <strong>13.4 eV</strong> (2p₃/₂ − 2p₁/₂), FWHM: ~1.4 eV.</li>
            <li><strong>C 1s BE = 284.5 eV</strong> — Cp uglerodlari (10 ta). C:Fe = 10:1 (nazariy).</li>
            <li><strong>18 elektron qoidasi</strong>: Fe²⁺ (6e⁻) + 2×Cp⁻ (12e⁻) = 18e⁻ → barqaror.</li>
            <li>HOMO: Fe 3d (e₁g) + Cp π; LUMO: Fe 3d (e₂g*) + Cp π*.</li>
            <li>Wilkinson va Fischer <strong>1973-yilda Nobel mukofoti</strong>ni oldi (sandwich struktura uchun).</li>
            <li>Elektrokimyoda <strong>standart</strong> sifatida ishlatiladi (E° = 0.4 V vs SHE).</li>
            <li>Ferotseniy (Fe³⁺) ga oksidlanganda BE ~1.7 eV ga ortadi.</li>
            <li><strong>Hosilalari:</strong> Asetilferotsen, detsilferotsen, biferotsen va boshqalar.</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/sisplatin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← Sisplatin</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">Birikmalar ro'yxati →</Link>
        </div>
      </section>
    </main>
  );
}