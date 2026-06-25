"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — Ni(CO)₄ (TETRAKARBONILNikel(0))
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Ni 2p": [
    { orbital: "Ni 2p₃/₂", be: 852.8, intensity: 1.0, fwhm: 1.3, assign: "Ni⁰ (Ni(CO)₄, d¹⁰)" },
    { orbital: "Ni 2p₁/₂", be: 870.1, intensity: 0.5, fwhm: 1.3, assign: "SO split (Δ=17.3 eV)" },
    { orbital: "Ni 2p (Ni²⁺)", be: 855.5, intensity: 0.0, fwhm: 1.6, assign: "Oksidlangan (masalan, NiO)" },
    { orbital: "Ni 2p (satellite)", be: 861.0, intensity: 0.0, fwhm: 2.5, assign: "Shake-up (Ni²⁺ da kuchli)" }
  ],
  "C 1s": [
    { orbital: "C 1s (CO)", be: 286.2, intensity: 1.0, fwhm: 1.3, assign: "Koordinatsion CO (4 ta)" },
    { orbital: "C 1s (C-H)", be: 285.0, intensity: 0.1, fwhm: 1.4, assign: "Sirt iflosligi" },
    { orbital: "C 1s (C-O)", be: 287.8, intensity: 0.08, fwhm: 1.4, assign: "Erkin CO iflosligi" }
  ],
  "O 1s": [
    { orbital: "O 1s (CO)", be: 532.5, intensity: 1.0, fwhm: 1.4, assign: "Koordinatsion CO" },
    { orbital: "O 1s (H₂O)", be: 533.5, intensity: 0.05, fwhm: 1.5, assign: "Adsorbsion suv" }
  ]
};

const surveyData = [
  { element: "Ni", orbital: "2p₃/₂", be: 852.8, atomic_percent: 14.3, color: "#a855f7", desc: "Markaziy metal (Ni⁰, d¹⁰)" },
  { element: "C", orbital: "1s", be: 286.2, atomic_percent: 57.1, color: "#6b7280", desc: "4 × CO ligandlar" },
  { element: "O", orbital: "1s", be: 532.5, atomic_percent: 28.6, color: "#f59e0b", desc: "4 × CO ligandlar" }
];

// ═══════════════════════════════════════════════════════════
// QO'SHIMCHA MA'LUMOTLAR
// ═══════════════════════════════════════════════════════════
const additionalInfo = {
  chemical: {
    molecularFormula: "Ni(CO)₄",
    molecularWeight: "170.73 g/mol",
    meltingPoint: "−19.3°C",
    boilingPoint: "43.1°C",
    solubility: "Suvda parchalanadi, organik erituvchilarda eruvchan",
    stability: "200°C da parchalanadi (Ni + 4CO). Havoda o'z-o'zidan yonadi!",
    density: "1.32 g/cm³ (suyuq)",
    color: "Rangsiz suyuqlik",
    odor: "Achchiq, yoqimsiz hid",
    vaporPressure: "400 mmHg (20°C da)",
    toxicity: "JUDA ZAHARLI! LC₅₀ = 34 ppm (4 soat, sichqon)"
  },
  electronic: {
    configuration: "[Ar] 3d¹⁰ (Ni⁰)",
    oxidationState: "0",
    coordinationNumber: "4 (tetraedrik)",
    pointGroup: "T_d",
    magneticMoment: "0 BM (diamagnit)",
    spinState: "Low-spin (S=0)",
    hOMO: "Ni 3d (t₂) + CO π* aralashuvi",
    lUMO: "CO π* (bo'shashtiruvchi)",
    ionizationEnergy: "8.3 eV (birinchi)",
    backBonding: "Kuchli π-backdonatsiya (Ni 3d → CO π*)"
  },
  xpsDetails: {
    ni2p: {
      ni0: "Ni⁰ (Ni(CO)₄): 852.8 eV (2p₃/₂)",
      ni2Plus: "Ni²⁺ (NiO): 855.5 eV (2p₃/₂)",
      ni3Plus: "Ni³⁺ (Ni₂O₃): 856.8 eV (2p₃/₂)",
      soSplitting: "17.3 eV (2p₃/₂ - 2p₁/₂)",
      satellite: "Ni⁰ da satellite yo'q (d¹⁰)",
      ni2Satellite: "Ni²⁺ da kuchli shake-up ~861 eV",
      fwhm: "1.2–1.4 eV"
    },
    c1s: {
      coordinated: "286.2 eV — CO ligandlar (4 ta)",
      freeCO: "287.8 eV — erkin CO",
      contamination: "285.0 eV — sirt iflosligi (C-H)",
      shiftExplanation: "CO uglerodlari erkin CO dan (287.8 eV) pastroq — π-backdonatsiya tufayli",
      theoreticalRatio: "Ni(CO)₄ da C:Ni = 4:1 (nazariy)"
    },
    o1s: {
      coordinated: "532.5 eV — koordinatsion CO",
      water: "533.5 eV — adsorbsion suv",
      note: "O 1s CO da yuqori — kuchli elektronegativlik"
    }
  },
  bonding: {
    sigmaDonation: {
      title: "σ-donatsiya",
      description: "CO ning HOMO (5σ orbitali) Ni ning bo'sh 4s/4p orbitallariga elektron juftini beradi.",
      orbital: "CO 5σ → Ni 4s, 4p",
      energy: "~2 eV bog' energiyasi"
    },
    piBackDonation: {
      title: "π-backdonatsiya",
      description: "Ni ning to'ldirilgan 3d orbitallaridan CO ning bo'sh π* (LUMO) orbitallariga elektron zichlik o'tadi.",
      orbital: "Ni 3d (t₂) → CO 2π*",
      energy: "~3 eV bog' energiyasi",
      importance: "Bu Ni⁰ (d¹⁰) da juda kuchli — shuning uchun Ni(CO)₄ barqaror!"
    },
    synergy: {
      title: "Sinergik effekt",
      description: "σ-donatsiya va π-backdonatsiya bir-birini kuchaytiradi. CO qancha kuchli σ-donor bo'lsa, Ni shuncha kuchli π-backdonor bo'ladi.",
      result: "Ni-CO bog' energiyasi: ~160 kJ/mol (juda kuchli)"
    }
  },
  eighteenElectron: {
    ni0: "Ni⁰: 10 ta valent elektron (3d¹⁰)",
    co: "Har bir CO: 2 ta elektron beradi (σ-donor)",
    total: "10 + 4×2 = 18 elektron",
    rule: "18 elektron qoidasiga to'liq mos keladi!",
    stability: "Bu Ni(CO)₄ ni barqaror va diamagnit qiladi"
  },
  synthesis: {
    mondProcess: {
      title: "Mond protsessi (1890)",
      steps: [
        "Tozalanmagan Ni metallini 50–60°C da CO gazi bilan reaksiyaga kirishish",
        "Ni + 4CO → Ni(CO)₄ (rangsiz gaz/suyuqlik)",
        "Ni(CO)₄ ni 200–250°C da parchalash",
        "Ni(CO)₄ → Ni (toza, 99.99%) + 4CO",
        "Toza Ni cho'kadi, CO qayta ishlatiladi"
      ],
      equation: "Ni (notoza) + 4CO ⇌ Ni(CO)₄ ⇌ Ni (toza) + 4CO"
    },
    laboratory: {
      title: "Laboratoriya sintezi",
      steps: [
        "NiCl₂ yoki NiBr₂ ni suvda eritish",
        "Kuchli qaytaruvchi qo'shish (masalan, Zn yoki Na)",
        "CO gazini o'tkazish (1 atm, 50°C)",
        "Ni(CO)₄ rangsiz suyuqlik sifatida ajraladi",
        "Distilyatsiya orqali tozalash (43°C da qaynaydi)"
      ],
      equation: "NiCl₂ + Zn + 4CO → Ni(CO)₄ + ZnCl₂"
    }
  },
  comparison: {
    ni0: {
      name: "Ni⁰ (Ni(CO)₄)",
      formula: "Ni(CO)₄",
      ni2pBE: "852.8 eV",
      c1sBE: "286.2 eV",
      color: "Rangsiz",
      magnetic: "Diamagnit",
      geometry: "Tetraedrik (T_d)",
      application: "Mond protsessi"
    },
    ni2Plus: {
      name: "Ni²⁺ (NiO)",
      formula: "NiO",
      ni2pBE: "855.5 eV",
      c1sBE: "—",
      color: "Yashil",
      magnetic: "Paramagnit (S=1)",
      geometry: "Oktaedrik",
      application: "Katalizator"
    },
    ni3Plus: {
      name: "Ni³⁺ (Ni₂O₃)",
      formula: "Ni₂O₃",
      ni2pBE: "856.8 eV",
      c1sBE: "—",
      color: "Qora",
      magnetic: "Paramagnit (S=1/2)",
      geometry: "Oktaedrik",
      application: "Batareyalar"
    }
  },
  applications: [
    {
      category: "Mond protsessi",
      items: [
        "Toza nikel (99.99%) olish",
        "Notoza Ni dan ajratish",
        "Sanoatda keng qo'llaniladi"
      ]
    },
    {
      category: "Kataliz",
      items: [
        "Gidrogenlanish reaksiyalari",
        "Reppe sintezi (alkinlar + CO)",
        "Polimerizatsiya katalizatorlari"
      ]
    },
    {
      category: "Materialshunoslik",
      items: [
        "CVD orqali Ni yupqa qatlamlar",
        "Karbon nanotrubkalar sintezi",
        "Nanopartikulalar"
      ]
    },
    {
      category: "Organik sintez",
      items: [
        "Tsiklooligomerizatsiya",
        "Karbonillash reaksiyalari",
        "Farmatsevtika oraliq moddalari"
      ]
    }
  ],
  history: [
    { year: "1868", event: "Mons va Moritz kishilari Ni va CO reaksiyasini birinchi marta kuzatdi, lekin mahsulotni aniqlay olmadi." },
    { year: "1889", event: "Ludwig Mond Ni(CO)₄ ni birinchi marta sintez qildi va xususiyatlarini o'rgandi." },
    { year: "1890", event: "Mond protsessini patentladi — toza nikel olish uchun sanoat usuli." },
    { year: "1899", event: "Mond Companies (keyinchalik INCO) Clyachton da Mond protsessini sanoatda qo'lladi." },
    { year: "1930-1950", event: "Ni(CO)₄ ning tuzilishi va bog'lanish mexanizmi o'rganildi." },
    { year: "1951", event: "Fischer va Wilkinson ferotsen strukturasini aniqladi — metallotsen kimyosi inqilobi." },
    { year: "1960-1970", event: "Ni(CO)₄ katalizator sifatida keng qo'llanila boshlandi (Reppe sintezi)." },
    { year: "1980–hozir", event: "CVD texnologiyasi va nanotexnologiyada qo'llanilishi kengaydi." }
  ],
  safety: {
    hazards: "JUDA ZAHARLI! O'lim xavfi past konsentratsiyalarda ham. Havoda o'z-o'zidan yonadi (pH₂ < 0.5%). Teri orqali so'riladi.",
    storage: "Inert gaz (Ar, N₂) ostida, qorong'i va sovuq joyda. Maxsus gaz tsilindrlarida.",
    handling: "Faqat tortuvchi shkafda, maxsus gaz detektori bilan. To'liq himoya kiyimi.",
    disposal: "Maxsus zaharli chiqindi sifatida. Kontrolli parchalash (200°C da).",
    firstAid: {
      skin: "Darhol suv bilan 15 daqiqa yuving. Zudlik bilan tibbiy yordam!",
      eyes: "15 daqiqa suv bilan yuving. Zudlik bilan shifokor!",
      inhalation: "Taza havoga chiqaring. SUN'IY NAFAS bermang! Zudlik bilan shifokor!",
      ingestion: "Og'izni chayqang. Hech narsa ichmang! Zudlik bilan shifokor!"
    },
    symptoms: [
      "Bosh og'rig'i, ko'ngil aynishi (darhol)",
      "Ko'krak qafasida og'riq (2-4 soat)",
      "O'pka shishi (24-48 soat)",
      "Buyrak va jigar shikastlanishi",
      "Neyrologik buzilishlar (uzoq muddatli)"
    ]
  }
};

export default function NiCO4() {
  const [selectedRegion, setSelectedRegion] = useState("Ni 2p");
  const [showSurvey, setShowSurvey] = useState(false);
  const [compareMode, setCompareMode] = useState("none"); // none, ni0, ni2
  
  const [moStep, setMoStep] = useState(0);
  const [tetrahedralRotation, setTetrahedralRotation] = useState(0);
  const [tetrahedralAnimation, setTetrahedralAnimation] = useState(false);
  
  const [synthesisRoute, setSynthesisRoute] = useState("mondProcess");
  const [synthesisStep, setSynthesisStep] = useState(0);
  
  const [activeBondingTab, setActiveBondingTab] = useState(0);
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [activeAppCategory, setActiveAppCategory] = useState(0);

  // Tetraedrik rotatsiya animatsiyasi
  useEffect(() => {
    if (tetrahedralAnimation) {
      const interval = setInterval(() => {
        setTetrahedralRotation(prev => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [tetrahedralAnimation]);

  // ═══════════════════════════════════════════════════════════
  // SPEKTR GENERATORI
  // ═══════════════════════════════════════════════════════════
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

      if (refMode === "ni0" && region === "Ni 2p") {
        const x1 = (be - 852.8) / 1.2;
        intensity += 0.95 * Math.exp(-0.5 * x1 * x1);
        const x2 = (be - 870.1) / 1.2;
        intensity += 0.48 * Math.exp(-0.5 * x2 * x2);
        if (be > 852.8) {
          intensity += 0.08 * Math.exp(-(be - 852.8) / 3);
        }
      } else if (refMode === "ni2" && region === "Ni 2p") {
        const x1 = (be - 855.5) / 1.6;
        intensity += 0.85 * Math.exp(-0.5 * x1 * x1);
        const x2 = (be - 872.8) / 1.6;
        intensity += 0.42 * Math.exp(-0.5 * x2 * x2);
        // Shake-up satellite
        const x3 = (be - 861.0) / 2.5;
        intensity += 0.40 * Math.exp(-0.5 * x3 * x3);
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
      { be: 852.8, intensity: 0.8, label: "Ni 2p", color: "#a855f7" },
      { be: 286.2, intensity: 1.5, label: "C 1s", color: "#6b7280" },
      { be: 532.5, intensity: 1.0, label: "O 1s", color: "#f59e0b" }
    ];
    for (let i = 0; i <= 250; i++) {
      const be = 50 + (i / 250) * 850;
      let intensity = 0.03 * (900 - be) / 850;
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
            <span className="text-violet-400 font-semibold">Ni(CO)₄</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <span>Ni(CO)₄</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Tetrakarbonilnikel(0) • Ni⁰ (d¹⁰) • Tetraedrik (T_d) • Mond protsessi • Molekulyar massa: 170.73 g/mol
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
            <div className="text-xl font-bold text-violet-400">Ni⁰</div>
            <div className="text-[10px] text-purple-400">d¹⁰</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-cyan-400">T_d</div>
            <div className="text-[10px] text-purple-400">Tetraedrik</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Ni 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-violet-400 font-mono">852.8</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-green-400">S=0</div>
            <div className="text-[10px] text-purple-400">Diamagnit</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Qo'llanilish</div>
            <div className="text-xl font-bold text-yellow-400">Mond</div>
            <div className="text-[10px] text-purple-400">Toza Ni</div>
          </div>
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-red-400 mb-1">Xavflilik</div>
            <div className="text-xl font-bold text-red-400">☠️</div>
            <div className="text-[10px] text-red-400">Juda zaharli</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-violet-400">Ni(CO)₄</strong> (tetrakarbonilnikel(0)) —
              Ni⁰ (d¹⁰) markaziy metaliga ega bo'lgan <strong>tetraedrik</strong> kompleks.
              To'rtta <strong>CO</strong> ligandi Ni bilan kuchli <strong>σ-donatsiya</strong> va <strong>π-backdonatsiya</strong> orqali bog'lanadi.
              <br/><br/>
              <strong>XPS da Ni 2p₃/₂ BE = 852.8 eV</strong> — Ni⁰ holatini tasdiqlaydi.
              Bu Ni²⁺ (855.5 eV) dan <strong>−2.7 eV past</strong>.
              <br/><br/>
              <strong className="text-amber-400">💡 Muhim:</strong> Ni(CO)₄ <strong>18 elektron qoidasiga</strong> to'liq mos keladi:
              Ni⁰ (10e⁻) + 4×CO (4×2e⁻) = <strong>18 elektron</strong>.
              <br/><br/>
              <strong className="text-red-400">⚠️ OGohlantirish:</strong> Ni(CO)₄ <strong>JUDA ZAHARLI</strong> va havoda <strong>o'z-o'zidan yonadi</strong>.
              LC₅₀ = 34 ppm (4 soat). Sanoatda ehtiyotkorlik bilan ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kimyoviy xususiyatlar */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar formula:</span>
                  <span className="font-mono">Ni(CO)₄</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">170.73 g/mol</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Erish harorati:</span>
                  <span className="font-mono">−19.3°C</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Qaynash harorati:</span>
                  <span className="font-mono">43.1°C</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Zichlik:</span>
                  <span className="font-mono">1.32 g/cm³</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-white">Rangsiz suyuqlik</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Hid:</span>
                  <span className="text-[10px]">Achchiq, yoqimsiz</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Bug' bosimi:</span>
                  <span className="font-mono">400 mmHg (20°C)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Zaharlilik:</span>
                  <span className="text-red-400 font-bold">LC₅₀ = 34 ppm</span>
                </li>
              </ul>
            </div>

            {/* Elektron struktura */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">[Ar] 3d¹⁰ (Ni⁰)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="text-cyan-400 font-bold">Tetraedrik (T_d)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsiya:</span>
                  <span className="font-mono">4 × CO</span>
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
                  <span className="font-mono text-[10px]">Ni 3d (t₂) + CO π*</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">LUMO:</span>
                  <span className="font-mono text-[10px]">CO π* (bo'shashtiruvchi)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">π-backdonatsiya:</span>
                  <span className="text-yellow-400 font-bold">Kuchli</span>
                </li>
              </ul>
            </div>

            {/* XPS tafsilotlari */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">📊 XPS tafsilotlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Ni 2p₃/₂ (Ni⁰):</span>
                  <span className="font-mono text-violet-400 font-bold">852.8 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ni 2p₃/₂ (Ni²⁺):</span>
                  <span className="font-mono">855.5 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ni 2p₃/₂ (Ni³⁺):</span>
                  <span className="font-mono">856.8 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">vs Ni²⁺:</span>
                  <span className="font-mono text-green-400">−2.7 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">SO splitting:</span>
                  <span className="font-mono">17.3 eV (2p)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">C 1s (CO):</span>
                  <span className="font-mono">286.2 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">O 1s (CO):</span>
                  <span className="font-mono">532.5 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">FWHM:</span>
                  <span className="font-mono">1.2–1.4 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Satellite:</span>
                  <span className="font-mono text-[10px]">Yo'q (d¹⁰)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ INTERAKTIV TETRAEDRIK STRUKTURA ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔷</span> Interaktiv tetraedrik struktura
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Ni(CO)₄ da Ni⁰ markaziy atomi <strong>tetraedrik</strong> geometriyada joylashgan.
              To'rtta CO ligandi Ni atrofida <strong>109.5°</strong> burchak ostida joylashgan.
              <br/><br/>
              <strong className="text-amber-400">💡 Farq:</strong> Tekis kvadrat (sisplatin, K₂[PtCl₄]) dan farqli o'laroq,
              Ni(CO)₄ tetraedrik geometriyaga ega — bu <strong>d¹⁰</strong> konfiguratsiyasi uchun xarakterli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tetraedrik animatsiya */}
            <div className="bg-purple-950/50 rounded-xl p-4">
              <svg viewBox="0 0 400 300" className="w-full h-64">
                {/* Markaziy Ni */}
                <circle cx="200" cy="150" r="20" fill="#a855f7" />
                <text x="200" y="155" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Ni⁰</text>

                {/* 4 ta CO ligand — tetraedrik */}
                {/* Yuqori old */}
                <g transform={`rotate(${tetrahedralRotation}, 200, 150)`}>
                  <line x1="200" y1="150" x2="200" y2="60" stroke="#fbbf24" strokeWidth="2" />
                  <circle cx="200" cy="50" r="12" fill="#6b7280" />
                  <text x="200" y="54" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">CO</text>
                </g>

                {/* Pastki o'ng */}
                <g transform={`rotate(${tetrahedralRotation + 120}, 200, 150)`}>
                  <line x1="200" y1="150" x2="280" y2="210" stroke="#fbbf24" strokeWidth="2" />
                  <circle cx="290" cy="220" r="12" fill="#6b7280" />
                  <text x="290" y="224" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">CO</text>
                </g>

                {/* Pastki chap */}
                <g transform={`rotate(${tetrahedralRotation + 240}, 200, 150)`}>
                  <line x1="200" y1="150" x2="120" y2="210" stroke="#fbbf24" strokeWidth="2" />
                  <circle cx="110" cy="220" r="12" fill="#6b7280" />
                  <text x="110" y="224" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">CO</text>
                </g>

                {/* Orqa (kichik) */}
                <g transform={`rotate(${tetrahedralRotation + 180}, 200, 150)`}>
                  <line x1="200" y1="150" x2="200" y2="240" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
                  <circle cx="200" cy="250" r="10" fill="#6b7280" opacity="0.5" />
                  <text x="200" y="254" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">CO</text>
                </g>

                {/* Burchak belgisi */}
                <text x="200" y="30" fill="#fbbf24" fontSize="9" textAnchor="middle">109.5°</text>
                <text x="320" y="150" fill="#a855f7" fontSize="9" textAnchor="middle">T_d simmetriya</text>
              </svg>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setTetrahedralAnimation(!tetrahedralAnimation)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    tetrahedralAnimation ? "bg-red-600 text-white" : "bg-violet-600 text-white hover:bg-violet-500"
                  }`}
                >
                  {tetrahedralAnimation ? "⏸ To'xtatish" : "▶ Aylantirish"}
                </button>
                <button
                  onClick={() => { setTetrahedralRotation(0); setTetrahedralAnimation(false); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 transition-all"
                >
                  🔄 Qayta o'rnatish
                </button>
              </div>
            </div>

            {/* Strukturaviy ma'lumotlar */}
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-violet-400 font-bold mb-3 text-sm">📏 Strukturaviy parametrlar</h3>
                <ul className="text-purple-200 space-y-2 text-xs">
                  <li className="flex justify-between">
                    <span className="text-purple-400">Ni-C masofa:</span>
                    <span className="font-mono">1.82 Å</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">C-O masofa:</span>
                    <span className="font-mono">1.15 Å</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Ni-C-O burchak:</span>
                    <span className="font-mono">180° (chiziqli)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">C-Ni-C burchak:</span>
                    <span className="font-mono text-violet-400 font-bold">109.5°</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Simmetriya:</span>
                    <span className="font-mono text-violet-400 font-bold">T_d (tetraedrik)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-violet-400 font-bold mb-3 text-sm">🔗 Bog'lanish turi</h3>
                <ul className="text-purple-200 space-y-2 text-xs">
                  <li className="flex justify-between">
                    <span className="text-purple-400">Ni-C bog':</span>
                    <span className="font-mono">σ + π (kuchli)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">σ-donatsiya:</span>
                    <span className="font-mono">CO 5σ → Ni 4s,4p</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">π-backdonatsiya:</span>
                    <span className="font-mono text-yellow-400 font-bold">Ni 3d → CO 2π*</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-400">Bog' energiyasi:</span>
                    <span className="font-mono">~160 kJ/mol</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
                <p><strong className="text-amber-400">💡 18 elektron qoidasi:</strong>
                Ni⁰ (10e⁻) + 4 × CO (2×4e⁻) = <strong>18 elektron</strong>.
                Bu Ni(CO)₄ ni barqaror va diamagnit qiladi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ INTERAKTIV BOGLANISH MEXANIZMI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⚡</span> Interaktiv bog'lanish mexanizmi
          </h2>

          <div className="flex gap-2 mb-6">
            {["σ-donatsiya", "π-backdonatsiya", "Sinergik effekt"].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveBondingTab(i)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeBondingTab === i ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3 text-sm">
                {["📤", "📥", "🔄"][activeBondingTab]} {["σ-donatsiya", "π-backdonatsiya", "Sinergik effekt"][activeBondingTab]}
              </h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-3">
                {activeBondingTab === 0 && additionalInfo.bonding.sigmaDonation.description}
                {activeBondingTab === 1 && additionalInfo.bonding.piBackDonation.description}
                {activeBondingTab === 2 && additionalInfo.bonding.synergy.description}
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-purple-400 text-xs mb-1">Orbital:</p>
                <p className="font-mono text-sm text-yellow-300">
                  {activeBondingTab === 0 && additionalInfo.bonding.sigmaDonation.orbital}
                  {activeBondingTab === 1 && additionalInfo.bonding.piBackDonation.orbital}
                  {activeBondingTab === 2 && "σ + π → kuchli bog'"}
                </p>
              </div>
              <div className="mt-3 bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
                <p><strong className="text-amber-400">💡 Energiya:</strong>
                {" "}{activeBondingTab === 0 && additionalInfo.bonding.sigmaDonation.energy}
                {activeBondingTab === 1 && additionalInfo.bonding.piBackDonation.energy}
                {activeBondingTab === 2 && additionalInfo.bonding.synergy.result}</p>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-4">
              <svg viewBox="0 0 400 300" className="w-full h-64">
                {/* Ni atom */}
                <circle cx="200" cy="150" r="30" fill="#a855f7" opacity="0.8" />
                <text x="200" y="155" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Ni⁰</text>

                {/* CO ligand */}
                <circle cx="320" cy="150" r="20" fill="#6b7280" />
                <text x="320" y="155" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">CO</text>

                {/* σ-donatsiya */}
                {activeBondingTab === 0 && (
                  <>
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                      </marker>
                    </defs>
                    <line x1="280" y1="150" x2="235" y2="150" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead)" />
                    <text x="260" y="140" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">5σ</text>
                    <text x="260" y="170" fill="#3b82f6" fontSize="8" textAnchor="middle">σ-donatsiya</text>
                  </>
                )}

                {/* π-backdonatsiya */}
                {activeBondingTab === 1 && (
                  <>
                    <defs>
                      <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                      </marker>
                    </defs>
                    <line x1="235" y1="150" x2="280" y2="150" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead2)" />
                    <text x="260" y="140" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">3d → 2π*</text>
                    <text x="260" y="170" fill="#ef4444" fontSize="8" textAnchor="middle">π-backdonatsiya</text>
                  </>
                )}

                {/* Sinergik effekt */}
                {activeBondingTab === 2 && (
                  <>
                    <defs>
                      <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                      </marker>
                      <marker id="arrowhead4" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                      </marker>
                    </defs>
                    <line x1="280" y1="140" x2="235" y2="140" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead3)" />
                    <line x1="235" y1="160" x2="280" y2="160" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead4)" />
                    <text x="260" y="125" fill="#3b82f6" fontSize="9" textAnchor="middle">σ</text>
                    <text x="260" y="180" fill="#ef4444" fontSize="9" textAnchor="middle">π</text>
                    <text x="260" y="200" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">Sinergiya!</text>
                  </>
                )}

                {/* Energiya diagrammasi */}
                <text x="50" y="30" fill="#9ca3af" fontSize="9">Energiya</text>
                <line x1="50" y1="40" x2="50" y2="280" stroke="#6b7280" strokeWidth="1" />
                
                {/* CO orbitallari */}
                <line x1="300" y1="80" x2="350" y2="80" stroke="#6b7280" strokeWidth="2" />
                <text x="370" y="85" fill="#9ca3af" fontSize="8">2π* (LUMO)</text>
                
                <line x1="300" y1="240" x2="350" y2="240" stroke="#6b7280" strokeWidth="2" />
                <text x="370" y="245" fill="#9ca3af" fontSize="8">5σ (HOMO)</text>

                {/* Ni orbitallari */}
                <line x1="50" y1="120" x2="100" y2="120" stroke="#a855f7" strokeWidth="2" />
                <text x="30" y="125" fill="#a855f7" fontSize="8">3d</text>
                
                <line x1="50" y1="200" x2="100" y2="200" stroke="#a855f7" strokeWidth="2" />
                <text x="30" y="205" fill="#a855f7" fontSize="8">4s,4p</text>
              </svg>
            </div>
          </div>

          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 Muhim:</strong> Ni⁰ (d¹⁰) da <strong>π-backdonatsiya juda kuchli</strong>,
            chunki Ni da 10 ta d-elektron bor va ularni CO π* orbitallariga berishi mumkin.
            Bu Ni(CO)₄ ni barqaror qiladi, lekin Ni²⁺ (d⁸) da π-backdonatsiya kuchsizroq.</p>
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
            {selectedRegion === "Ni 2p" && (
              <div className="flex gap-1">
                <button onClick={() => setCompareMode("none")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  Yolg'iz
                </button>
                <button onClick={() => setCompareMode("ni0")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "ni0" ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Ni⁰ (metall)
                </button>
                <button onClick={() => setCompareMode("ni2")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "ni2" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Ni²⁺ (NiO)
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

                <text x="500" y="45" fill="#8b5cf6" fontSize="9" textAnchor="end" fontWeight="bold">Ni(CO)₄ (Ni⁰)</text>
                {compareMode === "ni0" && <text x="500" y="60" fill="#eab308" fontSize="9" textAnchor="end">Ni⁰ (metall)</text>}
                {compareMode === "ni2" && <text x="500" y="60" fill="#ef4444" fontSize="9" textAnchor="end">Ni²⁺ (NiO, shake-up)</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 852.8, label: "Ni 2p", color: "#a855f7" }, { be: 286.2, label: "C 1s", color: "#6b7280" }, { be: 532.5, label: "O 1s", color: "#f59e0b" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 50) / 850) * 520;
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
              <li><strong>Ni 2p:</strong> 852.8 eV — Ni⁰ uchun xarakterli. Ni²⁺ dan −2.7 eV past.</li>
              <li><strong>C 1s:</strong> 286.2 eV — koordinatsion CO (erkin CO dan past — π-backdonatsiya).</li>
              <li><strong>O 1s:</strong> 532.5 eV — koordinatsion CO.</li>
              <li><strong>SO splitting:</strong> 17.3 eV (Ni 2p₃/₂ − Ni 2p₁/₂).</li>
              <li><strong>Satellite yo'q:</strong> Ni⁰ (d¹⁰) da shake-up satellit kuzatilmaydi.</li>
            </ul>
          </div>
        </div>

        {/* ═════ NI OKSIDLANISH DARAJALARI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔄</span> Ni oksidlanish darajalari — XPS solishtirish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-center text-yellow-400">Ni⁰</th>
                <th className="py-3 px-4 text-center text-violet-400">Ni⁰ (Ni(CO)₄)</th>
                <th className="py-3 px-4 text-center text-red-400">Ni²⁺</th>
                <th className="py-3 px-4 text-center text-orange-400">Ni³⁺</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Elektron konfiguratsiya", "d¹⁰ (4s⁰)", "d¹⁰", "d⁸", "d⁷"],
                  ["2p₃/₂ BE (eV)", "852.8", "852.8", "855.5", "856.8"],
                  ["2p₁/₂ BE (eV)", "870.1", "870.1", "872.8", "874.1"],
                  ["SO splitting (eV)", "17.3", "17.3", "17.3", "17.3"],
                  ["Pik shakli", "Asimmetrik", "Simmetrik", "Keng + satellite", "Keng + satellite"],
                  ["FWHM (eV)", "~1.2", "~1.3", "~1.6", "~1.8"],
                  ["Shake-up satellite", "Yo'q", "Yo'q", "Kuchli (~861 eV)", "Kuchli (~863 eV)"],
                  ["Geometriya", "FCC metall", "Tetraedrik (T_d)", "Oktaedrik", "Oktaedrik"],
                  ["Magnit", "Ferromagnit", "Diamagnit", "Paramagnit (S=1)", "Paramagnit (S=1/2)"],
                  ["Rang", "Kumushrang", "Rangsiz", "Yashil", "Qora"],
                  ["Misol", "Ni foil", "Ni(CO)₄", "NiO", "Ni₂O₃"]
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
            <p><strong className="text-amber-400">💡 Diagnostika:</strong> Ni 2p₃/₂ BE qiymatlari:
            <br/>• <strong>Ni⁰</strong> (metall yoki Ni(CO)₄): 852.8 eV
            <br/>• <strong>Ni²⁺</strong> (NiO): 855.5 eV (+2.7 eV)
            <br/>• <strong>Ni³⁺</strong> (Ni₂O₃): 856.8 eV (+4.0 eV)
            <br/><br/>
            <strong className="text-amber-400">💡 Satellite:</strong> Ni²⁺ va Ni³⁺ da kuchli shake-up satellite (~861-863 eV) kuzatiladi.
            Ni⁰ da satellite yo'q (d¹⁰ — barcha orbitallar to'ldirilgan).</p>
          </div>
        </div>

        {/* ═════ INTERAKTIV SINTETIZ YO'LI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🧪</span> Interaktiv sintez yo'li
          </h2>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setSynthesisRoute("mondProcess"); setSynthesisStep(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                synthesisRoute === "mondProcess" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
              }`}
            >
              Mond protsessi
            </button>
            <button
              onClick={() => { setSynthesisRoute("laboratory"); setSynthesisStep(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                synthesisRoute === "laboratory" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
              }`}
            >
              Laboratoriya sintezi
            </button>
          </div>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <h3 className="text-violet-400 font-bold mb-2 text-sm">
              {additionalInfo.synthesis[synthesisRoute].title}
            </h3>
            <p className="font-mono text-xs text-yellow-300 bg-purple-900/50 px-3 py-2 rounded inline-block">
              {additionalInfo.synthesis[synthesisRoute].equation}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {additionalInfo.synthesis[synthesisRoute].steps.map((step, i) => (
              <div key={i} className={`bg-purple-800/30 rounded-xl p-4 border transition-all ${
                synthesisStep === i ? "border-violet-500/50 bg-violet-600/10" : "border-purple-700/30"
              }`}>
                <button
                  onClick={() => setSynthesisStep(i)}
                  className="w-full text-left"
                >
                  <div className="text-2xl mb-2">{i + 1}️⃣</div>
                  <p className="text-purple-200 text-xs leading-relaxed">{step}</p>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setSynthesisStep(Math.max(0, synthesisStep - 1))}
              disabled={synthesisStep === 0}
              className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg text-xs disabled:opacity-30"
            >
              ← Oldingi
            </button>
            <button
              onClick={() => setSynthesisStep(Math.min(additionalInfo.synthesis[synthesisRoute].steps.length - 1, synthesisStep + 1))}
              disabled={synthesisStep === additionalInfo.synthesis[synthesisRoute].steps.length - 1}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-xs disabled:opacity-30"
            >
              Keyingi →
            </button>
          </div>
        </div>

        {/* ═════ SURVEY TARKIB ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>⚛️</span> Elementlar tarkibi (Survey XPS)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {surveyData.map((el, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: el.color }}></div>
                  <p className="font-bold text-white">{el.element}</p>
                </div>
                <p className="text-purple-400 text-xs mb-1">{el.orbital}</p>
                <p className="text-violet-400 font-bold font-mono text-sm">{el.be} eV</p>
                <p className="text-purple-300 text-xs mt-1">{el.atomic_percent.toFixed(1)} at.%</p>
                <p className="text-purple-500 text-[10px] mt-1">{el.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-violet-600/10 border border-violet-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p><strong className="text-violet-400">💡 Nazariy nisbat:</strong> Ni(CO)₄ da Ni:C:O = <strong>1:4:4</strong>.
            Survey XPS da bu nisbat (14.3:57.1:28.6 at.% ≈ 1:4:2) tasdiqlanadi.
            <br/><br/>
            <strong className="text-violet-400">💡 E'tibor bering:</strong> C va O signali faqat CO ligandlardan keladi — boshqa ifloslik yo'q.</p>
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
            <p><strong className="text-amber-400">💡 Muhim:</strong> Ni(CO)₄ ning eng muhim qo'llanilishi —
            <strong>Mond protsessi</strong> orqali toza nikel (99.99%) olish.</p>
          </div>
        </div>

        {/* ═════ INTERAKTIV TARIX ═════ */}
        <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-2">
            <span>📜</span> Tarixiy xronologiya
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
        <div className="bg-red-900/40 border border-red-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-red-400">☠️</span> XAVFSIZLIK VA SAQLASH — JUDA ZAHARLI!
          </h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-red-200 leading-relaxed text-sm font-bold">
              ⚠️ Ni(CO)₄ <strong>JUDA ZAHARLI</strong> va havoda <strong>o'z-o'zidan yonadi</strong>!
              LC₅₀ = 34 ppm (4 soat). O'lim xavfi past konsentratsiyalarda ham mavjud.
              Teri orqali so'riladi. Faqat maxsus jihozlangan laboratoriyalarda ishlatiladi!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-3 text-sm">⚠️ Xavflilik</h3>
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
              <h3 className="text-red-400 font-bold mb-3 text-sm">🚑 Birinchi yordam</h3>
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
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 md:col-span-2">
              <h3 className="text-red-400 font-bold mb-3 text-sm">🏥 Zaharlanish belgilari</h3>
              <ul className="text-red-200 space-y-2 text-xs">
                {additionalInfo.safety.symptoms.map((symptom, i) => (
                  <li key={i}>• {symptom}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>✅</span> Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Ni(CO)₄ — <strong className="text-violet-400">tetraedrik</strong> Ni⁰ (d¹⁰) kompleksi, 4 ta CO ligand.</li>
            <li><strong>Ni 2p₃/₂ BE = 852.8 eV</strong> — Ni⁰ uchun xarakterli (Ni²⁺ dan −2.7 eV past).</li>
            <li>SO splitting: <strong>17.3 eV</strong> (2p₃/₂ − 2p₁/₂), FWHM: ~1.3 eV.</li>
            <li><strong>C 1s BE = 286.2 eV</strong> — koordinatsion CO (π-backdonatsiya tufayli past).</li>
            <li><strong>O 1s BE = 532.5 eV</strong> — koordinatsion CO.</li>
            <li>Survey XPS da Ni:C:O = <strong>1:4:4</strong> (nazariy).</li>
            <li><strong>18 elektron qoidasi</strong>: Ni⁰ (10e⁻) + 4×CO (8e⁻) = 18e⁻ → barqaror.</li>
            <li><strong>Kuchli π-backdonatsiya</strong>: Ni 3d → CO π* (Ni⁰ da juda kuchli).</li>
            <li><strong>Mond protsessi</strong> (1890): toza Ni (99.99%) olish uchun sanoat usuli.</li>
            <li><strong>JUDA ZAHARLI</strong>: LC₅₀ = 34 ppm, havoda o'z-o'zidan yonadi.</li>
            <li>Ni⁰ da <strong>satellite yo'q</strong> (d¹⁰), Ni²⁺ da kuchli shake-up (~861 eV).</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/k2-ptcl4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← K₂[PtCl₄]</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">Birikmalar ro'yxati →</Link>
        </div>
      </section>
    </main>
  );
}