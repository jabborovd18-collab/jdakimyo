"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — K₂[PtCl₄] (KALIY TEXTRAXLOROPLATINAT)
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Pt 4f": [
    { orbital: "Pt 4f₇/₂", be: 73.2, intensity: 1.0, fwhm: 1.3, assign: "Pt²⁺ (K₂[PtCl₄], d⁸)" },
    { orbital: "Pt 4f₅/₂", be: 76.5, intensity: 0.75, fwhm: 1.3, assign: "SO split (Δ=3.3 eV)" },
    { orbital: "Pt 4f (satellite)", be: 75.5, intensity: 0.10, fwhm: 1.8, assign: "Shake-up (kuchsiz)" }
  ],
  "Cl 2p": [
    { orbital: "Cl 2p₃/₂", be: 198.5, intensity: 1.0, fwhm: 1.2, assign: "Cl⁻ (koordinatsion, 4 ta)" },
    { orbital: "Cl 2p₁/₂", be: 200.1, intensity: 0.5, fwhm: 1.2, assign: "SO split (Δ=1.6 eV)" },
    { orbital: "Cl 2p (ads)", be: 201.0, intensity: 0.06, fwhm: 1.3, assign: "Sirt iflosligi" }
  ],
  "K 2p": [
    { orbital: "K 2p₃/₂", be: 293.0, intensity: 1.0, fwhm: 1.4, assign: "K⁺ (qarama-qarshi ion)" },
    { orbital: "K 2p₁/₂", be: 295.2, intensity: 0.5, fwhm: 1.4, assign: "SO split (Δ=2.2 eV)" },
    { orbital: "K 2s", be: 37.7, intensity: 0.3, fwhm: 1.8, assign: "K⁺ 2s (kuchsiz)" }
  ],
  "O 1s": [
    { orbital: "O 1s (H₂O)", be: 532.0, intensity: 0.15, fwhm: 1.5, assign: "Gidratatsion suv" },
    { orbital: "O 1s (O=C)", be: 533.5, intensity: 0.04, fwhm: 1.5, assign: "Sirt iflosligi" }
  ],
  "C 1s": [
    { orbital: "C 1s (C-H)", be: 285.0, intensity: 0.2, fwhm: 1.4, assign: "Sirt iflosligi" }
  ]
};

const surveyData = [
  { element: "Pt", orbital: "4f₇/₂", be: 73.2, atomic_percent: 14.5, color: "#a855f7", desc: "Markaziy metal (Pt²⁺, d⁸)" },
  { element: "Cl", orbital: "2p₃/₂", be: 198.5, atomic_percent: 58.0, color: "#10b981", desc: "4 × Cl⁻ ligandlar" },
  { element: "K", orbital: "2p₃/₂", be: 293.0, atomic_percent: 29.0, color: "#ec4899", desc: "2 × K⁺ qarama-qarshi ion" },
  { element: "O", orbital: "1s", be: 532.0, atomic_percent: 0.3, color: "#f59e0b", desc: "Gidratatsion suv" },
  { element: "C", orbital: "1s", be: 285.0, atomic_percent: 0.2, color: "#6b7280", desc: "Sirt iflosligi" }
];

// ═══════════════════════════════════════════════════════════
// QO'SHIMCHA MA'LUMOTLAR
// ═══════════════════════════════════════════════════════════
const additionalInfo = {
  chemical: {
    molecularFormula: "K₂[PtCl₄]",
    molecularWeight: "415.09 g/mol",
    meltingPoint: "Parchalanadi ~300°C da",
    solubility: "Suvda yaxshi eruvchan (qizil eritma), etanol da kam eruvchan",
    stability: "Quruq holatda barqaror. Yorug'likda sekin parchalanadi.",
    density: "4.08 g/cm³",
    color: "Qizil-to'q sariq kristall",
    crystalSystem: "Monoklinik",
    hygroscopic: "Namlikni yutadi (gigroskopik)"
  },
  electronic: {
    configuration: "[Xe] 4f¹⁴ 5d⁸",
    oxidationState: "+2",
    coordinationNumber: "4 (tekis kvadrat)",
    pointGroup: "D₂ₕ",
    magneticMoment: "0 BM (diamagnit)",
    spinState: "Low-spin (S=0)",
    crystalFieldSplitting: "Δ ≈ 32,000 cm⁻¹ (Cl⁻ bilan)",
    transEffect: "Cl⁻ — o'rtacha trans-effekt"
  },
  xpsDetails: {
    pt4f: {
      reference: "Pt foil (Pt⁰): 71.2 eV (4f₇/₂)",
      pt2Plus: "73.2 eV (4f₇/₂) — K₂[PtCl₄] uchun xarakterli",
      comparison: "Sisplatindan (72.8 eV) +0.4 eV yuqori — barcha Cl⁻ ligandlar",
      pt4Plus: "74.8 eV (4f₇/₂) — K₂[PtCl₆] (Pt⁴⁺)",
      fwhm: "1.2–1.4 eV",
      asymmetry: "Simmetrik (metall emas)"
    },
    cl2p: {
      coordinate: "198.5 eV (2p₃/₂) — koordinatsion Cl⁻",
      soSplitting: "1.6 eV (2p₃/₂ va 2p₁/₂ orasi)",
      comparison: "Sisplatindan (198.2 eV) +0.3 eV farq",
      contamination: "201.0 eV — sirt iflosligi"
    },
    k2p: {
      main: "293.0 eV (2p₃/₂) — K⁺ ioni",
      soSplitting: "2.2 eV (2p₃/₂ - 2p₁/₂)",
      note: "K⁺ qarama-qarshi ion, koordinatsiyada qatnashmaydi"
    }
  },
  synthesis: {
    fromSisplatin: {
      title: "Sisplatindan sintez (qayta kristallash)",
      steps: [
        "Sisplatinni (Pt(NH₃)₂Cl₂) konsentrat HCl da eritish",
        "Qizdirish (80–100°C) → NH₃ ligandlar chiqib ketadi",
        "KCl qo'shish → K₂[PtCl₄] cho'kma hosil bo'ladi",
        "Sovuqda kristallash → qizil kristallar"
      ],
      equation: "Pt(NH₃)₂Cl₂ + 2HCl + 2KCl → K₂[PtCl₄] + 2NH₄Cl"
    },
    fromPtMetal: {
      title: "Pt metallidan sintez (aqua regia)",
      steps: [
        "Pt metallini aqua regia (3HCl:HNO₃) da eritish",
        "H₂[PtCl₆] hosil bo'ladi (sariq eritma)",
        "KCl qo'shish → K₂[PtCl₆] cho'kma",
        "K₂[PtCl₆] ni qaytarish (K₂C₂O₄ yoki SO₂ bilan)",
        "K₂[PtCl₄] hosil bo'ladi (qizil kristallar)"
      ],
      equation: "K₂[PtCl₆] + K₂C₂O₄ → K₂[PtCl₄] + 2CO₂ + 2KCl"
    }
  },
  comparison: {
    sisplatin: {
      name: "Sisplatin",
      formula: "Pt(NH₃)₂Cl₂",
      pt4fBE: "72.8 eV",
      cl2pBE: "198.2 eV",
      color: "Sariq",
      solubility: "Suvda 2.5 mg/mL",
      application: "Saraton dorisi",
      geometry: "Tekis kvadrat",
      transEffect: "NH₃ < Cl⁻"
    },
    k2ptcl4: {
      name: "K₂[PtCl₄]",
      formula: "K₂[PtCl₄]",
      pt4fBE: "73.2 eV",
      cl2pBE: "198.5 eV",
      color: "Qizil-to'q sariq",
      solubility: "Suvda yaxshi",
      application: "Prekursor, katalizator",
      geometry: "Tekis kvadrat",
      transEffect: "Barcha Cl⁻"
    },
    k2ptcl6: {
      name: "K₂[PtCl₆]",
      formula: "K₂[PtCl₆]",
      pt4fBE: "74.8 eV",
      cl2pBE: "198.8 eV",
      color: "Sariq-to'q sariq",
      solubility: "Suvda o'rtacha",
      application: "Pt⁴⁺ standarti",
      geometry: "Oktaedrik",
      transEffect: "—"
    }
  },
  applications: [
    {
      category: "Sintez prekursori",
      items: [
        "Sisplatin va boshqa Pt dorilarini sintez qilish",
        "K₂[PtCl₆] (Pt⁴⁺) olish uchun oksidlash",
        "Turli Pt komplekslari uchun boshlang'ich modda"
      ]
    },
    {
      category: "Kataliz",
      items: [
        "Gidrogenlanish reaksiyalarida katalizator",
        "C-C bog' hosil qilish reaksiyalari",
        "Elektrokataliz (suv elektrolizi)"
      ]
    },
    {
      category: "Materialshunoslik",
      items: [
        "Pt nanopartikulalari sintezi",
        "Yupqa qatlamli Pt plyonkalar (CVD)",
        "Magnit materiallar"
      ]
    },
    {
      category: "Ta'lim va standart",
      items: [
        "Tekis kvadrat geometriya namunasi",
        "XPS da Pt²⁺ standarti",
        "Trans-effekt o'rganish"
      ]
    }
  ],
  history: [
    { year: "1840-1860", event: "Platina guruhi kimyosi rivojlanishi. PtCl₂ birinchi marta olingan." },
    { year: "1848", event: "K₂[PtCl₄] birinchi marta tavsiflangan. Qizil kristallar sifatida." },
    { year: "1893", event: "Alfred Werner koordinatsion nazariyasini ishlab chiqdi. K₂[PtCl₄] tekis kvadrat ekanligini ko'rsatdi." },
    { year: "1950-1960", event: "K₂[PtCl₄] dan turli Pt komplekslari sintez qilina boshlandi." },
    { year: "1965", event: "Rosenberg K₂[PtCl₄] va boshqa Pt tuzlarini biologik ta'sirini o'rgandi." },
    { year: "1970-1980", event: "K₂[PtCl₄] sisplatin sintezi uchun asosiy prekursor sifatida ishlatildi." },
    { year: "1990–hozir", event: "Nanotexnologiya va materialshunoslikda qo'llanilishi kengaydi." }
  ],
  safety: {
    storage: "Quruq, sovuq va qorong'i joyda. Namlikdan saqlang (gigroskopik).",
    handling: "Qo'lqop va himoya ko'zoynak kiying. Tortuvchi shkafda ishlang.",
    disposal: "Og'ir metal chiqindisi sifatida utilizatsiya qiling.",
    hazards: "Zaharli. Teri va ko'z uchun irritant. Uzoq muddatli ta'sirda allergiya chaqirishi mumkin.",
    firstAid: {
      skin: "Suv va sovun bilan yuving.",
      eyes: "15 daqiqa suv bilan yuving. Tibbiy yordam.",
      inhalation: "Taza havoga chiqaring.",
      ingestion: "Shifokorga murojaat qiling."
    }
  }
};

export default function K2PtCl4() {
  const [selectedRegion, setSelectedRegion] = useState("Pt 4f");
  const [showSurvey, setShowSurvey] = useState(false);
  const [compareMode, setCompareMode] = useState("none"); // none, pt0, pt4, sisplatin
  
  const [crystalFieldStep, setCrystalFieldStep] = useState(0);
  const [synthesisRoute, setSynthesisRoute] = useState("fromSisplatin");
  const [synthesisStep, setSynthesisStep] = useState(0);
  const [compareDrug, setCompareDrug] = useState("sisplatin");
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [activeAppCategory, setActiveAppCategory] = useState(0);

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

      if (refMode === "pt0" && region === "Pt 4f") {
        const x1 = (be - 71.2) / 1.0;
        intensity += 0.95 * Math.exp(-0.5 * x1 * x1);
        const x2 = (be - 74.5) / 1.0;
        intensity += 0.71 * Math.exp(-0.5 * x2 * x2);
        if (be > 71.2) {
          intensity += 0.12 * Math.exp(-(be - 71.2) / 3);
        }
      } else if (refMode === "pt4" && region === "Pt 4f") {
        const x1 = (be - 74.8) / 1.3;
        intensity += 0.90 * Math.exp(-0.5 * x1 * x1);
        const x2 = (be - 78.1) / 1.3;
        intensity += 0.67 * Math.exp(-0.5 * x2 * x2);
      } else if (refMode === "sisplatin" && region === "Pt 4f") {
        const x1 = (be - 72.8) / 1.2;
        intensity += 0.95 * Math.exp(-0.5 * x1 * x1);
        const x2 = (be - 76.1) / 1.2;
        intensity += 0.71 * Math.exp(-0.5 * x2 * x2);
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
      { be: 73.2, intensity: 1.0, label: "Pt 4f", color: "#a855f7" },
      { be: 293.0, intensity: 1.5, label: "K 2p", color: "#ec4899" },
      { be: 198.5, intensity: 2.0, label: "Cl 2p", color: "#10b981" },
      { be: 532.0, intensity: 0.1, label: "O 1s", color: "#f59e0b" },
      { be: 285.0, intensity: 0.15, label: "C 1s", color: "#6b7280" }
    ];
    for (let i = 0; i <= 250; i++) {
      const be = 50 + (i / 250) * 500;
      let intensity = 0.03 * (550 - be) / 500;
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
            <span className="text-violet-400 font-semibold">K₂[PtCl₄]</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-3">
                <span className="text-3xl">🔴</span>
                <span>K₂[PtCl₄]</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Kaliy tetraxloroplatinat(II) • Pt²⁺ (d⁸) • Tekis kvadrat (D₂ₕ) • Molekulyar massa: 415.09 g/mol
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
            <div className="text-xl font-bold text-violet-400">Pt²⁺</div>
            <div className="text-[10px] text-purple-400">d⁸</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-cyan-400">D₂ₕ</div>
            <div className="text-[10px] text-purple-400">Tekis kvadrat</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Pt 4f₇/₂ BE</div>
            <div className="text-xl font-bold text-violet-400 font-mono">73.2</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-green-400">S=0</div>
            <div className="text-[10px] text-purple-400">Diamagnit</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Qo'llanilish</div>
            <div className="text-xl font-bold text-yellow-400">Prekursor</div>
            <div className="text-[10px] text-purple-400">Sisplatin uchun</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Rang</div>
            <div className="text-xl font-bold text-red-400">Qizil</div>
            <div className="text-[10px] text-purple-400">Kristall</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-violet-400">K₂[PtCl₄]</strong> (kaliy tetraxloroplatinat(II)) —
              <strong>tekis kvadrat</strong> geometriyaga ega Pt²⁺ kompleksi.
              Markaziy Pt²⁺ (d⁸) to'rtta <strong>Cl⁻</strong> ligandi bilan koordinatsiyalangan.
              Ikki <strong>K⁺</strong> qarama-qarshi ion sifatida mavjud.
              <br/><br/>
              <strong>XPS da Pt 4f₇/₂ BE = 73.2 eV</strong> — bu sisplatindan (72.8 eV) <strong>+0.4 eV yuqori</strong>.
              Sababi: sisplatinda 2 ta NH₃ (kuchli maydon) va 2 ta Cl⁻ bor, K₂[PtCl₄] da esa <strong>barcha 4 ta ligand Cl⁻</strong>.
              <br/><br/>
              <strong className="text-amber-400">💡 Muhim:</strong> K₂[PtCl₄] — <strong>sisplatin sintezining asosiy prekursori</strong>.
              NH₃ ligandlarni qo'shish orqali sisplatin olinadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kimyoviy xususiyatlar */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar formula:</span>
                  <span className="font-mono">K₂[PtCl₄]</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">415.09 g/mol</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Erish harorati:</span>
                  <span className="font-mono">~300°C (parch.)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligandlar:</span>
                  <span>4 × Cl⁻</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Qarama-qarshi ion:</span>
                  <span>2 × K⁺</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsion son:</span>
                  <span className="font-bold">4 (tekis kvadrat)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish darajasi:</span>
                  <span className="font-bold text-violet-400">+2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-red-300">Qizil-to'q sariq</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Eruvchanlik:</span>
                  <span className="text-[10px]">Suvda yaxshi</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kristall tizimi:</span>
                  <span>Monoklinik</span>
                </li>
              </ul>
            </div>

            {/* Elektron struktura */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">[Xe] 4f¹⁴ 5d⁸</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="text-cyan-400 font-bold">Tekis kvadrat (D₂ₕ)</span>
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
                  <span className="text-purple-400">SO splitting (4f):</span>
                  <span className="font-mono">3.3 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kristal maydon:</span>
                  <span className="font-mono text-[10px]">Δ ≈ 32,000 cm⁻¹</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kinetik:</span>
                  <span className="text-yellow-400 font-bold">Inert (d⁸)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Trans-effekt:</span>
                  <span>Cl⁻ (o'rtacha)</span>
                </li>
              </ul>
            </div>

            {/* XPS tafsilotlari */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">📊 XPS tafsilotlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Pt 4f₇/₂ (Pt⁰):</span>
                  <span className="font-mono">71.2 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Pt 4f₇/₂ (Pt²⁺):</span>
                  <span className="font-mono text-violet-400 font-bold">73.2 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Pt 4f₇/₂ (Pt⁴⁺):</span>
                  <span className="font-mono">74.8 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">vs Sisplatin:</span>
                  <span className="font-mono text-amber-400">+0.4 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Cl 2p₃/₂:</span>
                  <span className="font-mono">198.5 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">K 2p₃/₂:</span>
                  <span className="font-mono">293.0 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">SO splitting:</span>
                  <span className="font-mono">3.3 eV (4f)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">FWHM:</span>
                  <span className="font-mono">1.2–1.4 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Shake-up:</span>
                  <span className="font-mono text-[10px]">Kuchsiz</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ INTERAKTIV KRISTAL MAYDON DIAGRAMMASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⚡</span> Interaktiv kristal maydon diagrammasi
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong>Tekis kvadrat</strong> geometriyada d-orbitallari kristal maydon ta'sirida bo'linadi.
              Pt²⁺ (d⁸) uchun barcha 8 elektron pastki energiyali orbitallarni to'ldiradi → <strong>diamagnit</strong> (S=0).
              <br/><br/>
              <strong className="text-amber-400">💡 Farq:</strong> Sisplatin bilan bir xil geometriya, lekin Cl⁻ ligandlar sababli
              kristal maydon bo'linishi (Δ) biroz farq qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diagramma */}
            <div className="bg-purple-950/50 rounded-xl p-4">
              <svg viewBox="0 0 400 300" className="w-full h-64">
                <line x1="50" y1="20" x2="50" y2="280" stroke="#6b7280" strokeWidth="2" />
                <text x="30" y="150" fill="#9ca3af" fontSize="10" textAnchor="middle" transform="rotate(-90, 30, 150)">Energiya →</text>
                
                {/* dx²-y² (eng yuqori) */}
                <g opacity={crystalFieldStep >= 4 ? 1 : 0.3}>
                  <line x1="100" y1="40" x2="180" y2="40" stroke="#ef4444" strokeWidth="3" />
                  <text x="140" y="30" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">dx²-y²</text>
                  <text x="200" y="45" fill="#9ca3af" fontSize="8">Bo'sh</text>
                </g>
                
                {/* dxy */}
                <g opacity={crystalFieldStep >= 3 ? 1 : 0.3}>
                  <line x1="100" y1="90" x2="180" y2="90" stroke="#f59e0b" strokeWidth="3" />
                  <text x="140" y="80" fill="#f59e0b" fontSize="11" textAnchor="middle" fontWeight="bold">dxy</text>
                  {crystalFieldStep >= 3 && (
                    <>
                      <circle cx="130" cy="90" r="4" fill="#f59e0b" />
                      <circle cx="150" cy="90" r="4" fill="#f59e0b" />
                    </>
                  )}
                </g>
                
                {/* dz² */}
                <g opacity={crystalFieldStep >= 2 ? 1 : 0.3}>
                  <line x1="100" y1="150" x2="180" y2="150" stroke="#10b981" strokeWidth="3" />
                  <text x="140" y="140" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">dz²</text>
                  {crystalFieldStep >= 2 && (
                    <>
                      <circle cx="130" cy="150" r="4" fill="#10b981" />
                      <circle cx="150" cy="150" r="4" fill="#10b981" />
                    </>
                  )}
                </g>
                
                {/* dxz, dyz */}
                <g opacity={crystalFieldStep >= 1 ? 1 : 0.3}>
                  <line x1="100" y1="220" x2="180" y2="220" stroke="#3b82f6" strokeWidth="3" />
                  <text x="140" y="210" fill="#3b82f6" fontSize="11" textAnchor="middle" fontWeight="bold">dxz, dyz</text>
                  {crystalFieldStep >= 1 && (
                    <>
                      <circle cx="120" cy="220" r="4" fill="#3b82f6" />
                      <circle cx="140" cy="220" r="4" fill="#3b82f6" />
                      <circle cx="160" cy="220" r="4" fill="#3b82f6" />
                      <circle cx="130" cy="220" r="4" fill="#3b82f6" />
                    </>
                  )}
                </g>
                
                {/* Δ belgisi */}
                {crystalFieldStep >= 4 && (
                  <>
                    <line x1="220" y1="40" x2="220" y2="220" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5" />
                    <text x="240" y="130" fill="#fbbf24" fontSize="12" fontWeight="bold">Δ</text>
                    <text x="240" y="145" fill="#fbbf24" fontSize="9">~32,000 cm⁻¹</text>
                  </>
                )}
                
                <text x="300" y="40" fill="#ef4444" fontSize="9">dx²-y² (bo'sh)</text>
                <text x="300" y="60" fill="#f59e0b" fontSize="9">dxy (to'ldirilgan)</text>
                <text x="300" y="80" fill="#10b981" fontSize="9">dz² (to'ldirilgan)</text>
                <text x="300" y="100" fill="#3b82f6" fontSize="9">dxz, dyz (to'ldirilgan)</text>
              </svg>
            </div>

            {/* Boshqaruv */}
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-violet-400 font-bold mb-3 text-sm">🎮 Qadamlar</h3>
                <div className="flex gap-2 mb-4">
                  {[0, 1, 2, 3, 4].map(step => (
                    <button
                      key={step}
                      onClick={() => setCrystalFieldStep(step)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        crystalFieldStep === step 
                          ? "bg-violet-600 text-white" 
                          : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2 text-xs text-purple-200">
                  {crystalFieldStep === 0 && <p>Erkin ion: barcha 5 ta d-orbitali degenerat.</p>}
                  {crystalFieldStep === 1 && <p>Ligandlar yaqinlashganda: dxz, dyz pastroq energiyaga tushadi (4 elektron).</p>}
                  {crystalFieldStep === 2 && <p>dz² orbitali o'rtacha energiyada (2 elektron).</p>}
                  {crystalFieldStep === 3 && <p>dxy orbitali yuqoriroq energiyada (2 elektron).</p>}
                  {crystalFieldStep === 4 && <p>dx²-y² eng yuqori energiyada va <strong>bo'sh</strong> (0 elektron). Bu tekis kvadrat geometriya uchun xarakterli!</p>}
                </div>
              </div>

              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
                <p><strong className="text-amber-400">💡 Natija:</strong> Barcha 8 elektron juftlangan → <strong>S=0, diamagnit</strong>.
                Bu Pt²⁺ (d⁸) tekis kvadrat komplekslar uchun xarakterli.</p>
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
            {selectedRegion === "Pt 4f" && (
              <div className="flex flex-wrap gap-1">
                <button onClick={() => setCompareMode("none")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  Yolg'iz
                </button>
                <button onClick={() => setCompareMode("pt0")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "pt0" ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Pt⁰
                </button>
                <button onClick={() => setCompareMode("pt4")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "pt4" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Pt⁴⁺
                </button>
                <button onClick={() => setCompareMode("sisplatin")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "sisplatin" ? "bg-green-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Sisplatin
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
                  for (let be = Math.ceil(minBE / 2) * 2; be <= maxBE; be += 2) {
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

                <text x="500" y="45" fill="#8b5cf6" fontSize="9" textAnchor="end" fontWeight="bold">K₂[PtCl₄] (Pt²⁺)</text>
                {compareMode === "pt0" && <text x="500" y="60" fill="#eab308" fontSize="9" textAnchor="end">Pt⁰ (metall)</text>}
                {compareMode === "pt4" && <text x="500" y="60" fill="#ef4444" fontSize="9" textAnchor="end">Pt⁴⁺ (K₂[PtCl₆])</text>}
                {compareMode === "sisplatin" && <text x="500" y="60" fill="#10b981" fontSize="9" textAnchor="end">Sisplatin (72.8 eV)</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 73.2, label: "Pt 4f", color: "#a855f7" }, { be: 293.0, label: "K 2p", color: "#ec4899" }, { be: 198.5, label: "Cl 2p", color: "#10b981" }, { be: 532.0, label: "O 1s", color: "#f59e0b" }, { be: 285.0, label: "C 1s", color: "#6b7280" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 50) / 500) * 520;
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
              <li><strong>Pt 4f:</strong> 73.2 eV — sisplatindan +0.4 eV yuqori (barcha Cl⁻ ligandlar).</li>
              <li><strong>Cl 2p:</strong> 198.5 eV — koordinatsion Cl⁻ (4 ta). SO splitting = 1.6 eV.</li>
              <li><strong>K 2p:</strong> 293.0 eV — qarama-qarshi ion K⁺ (koordinatsiyada emas).</li>
              <li><strong>Survey:</strong> Pt:Cl:K = 1:4:2 nisbat (nazariy).</li>
            </ul>
          </div>
        </div>

        {/* ═════ SISPLATIN BILAN TAQQOSLASH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔄</span> Sisplatin bilan taqqoslash
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              K₂[PtCl₄] va sisplatin bir xil <strong>Pt²⁺ (d⁸)</strong> markaziy metal va <strong>tekis kvadrat</strong> geometriyaga ega.
              Asosiy farq: <strong>ligandlar</strong>. K₂[PtCl₄] da barcha 4 ta ligand Cl⁻, sisplatinda esa 2 ta NH₃ va 2 ta Cl⁻.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-purple-300 text-xs mb-2 block">Taqqoslash uchun birikma:</label>
              <select
                value={compareDrug}
                onChange={(e) => setCompareDrug(e.target.value)}
                className="w-full bg-purple-900/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-purple-200"
              >
                <option value="sisplatin">Sisplatin — Pt(NH₃)₂Cl₂</option>
                <option value="k2ptcl6">K₂[PtCl₆] — Pt⁴⁺ kompleksi</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                  <th className="py-3 px-4 text-center text-violet-400">K₂[PtCl₄]</th>
                  <th className="py-3 px-4 text-center text-cyan-400">
                    {compareDrug === "sisplatin" ? "Sisplatin" : "K₂[PtCl₆]"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Formula", "K₂[PtCl₄]", compareDrug === "sisplatin" ? "Pt(NH₃)₂Cl₂" : "K₂[PtCl₆]"],
                  ["Oksidlanish darajasi", "Pt²⁺", compareDrug === "sisplatin" ? "Pt²⁺" : "Pt⁴⁺"],
                  ["Ligandlar", "4 × Cl⁻", compareDrug === "sisplatin" ? "2 × NH₃ + 2 × Cl⁻" : "6 × Cl⁻"],
                  ["Geometriya", "Tekis kvadrat", compareDrug === "sisplatin" ? "Tekis kvadrat" : "Oktaedrik"],
                  ["Pt 4f₇/₂ BE (eV)", "73.2", compareDrug === "sisplatin" ? "72.8" : "74.8"],
                  ["Cl 2p₃/₂ BE (eV)", "198.5", compareDrug === "sisplatin" ? "198.2" : "198.8"],
                  ["Δ BE (vs K₂[PtCl₄])", "—", compareDrug === "sisplatin" ? "−0.4 eV" : "+1.6 eV"],
                  ["Rang", "Qizil-to'q sariq", compareDrug === "sisplatin" ? "Sariq" : "Sariq"],
                  ["Eruvchanlik", "Suvda yaxshi", compareDrug === "sisplatin" ? "Suvda 2.5 mg/mL" : "Suvda o'rtacha"],
                  ["Qo'llanilish", "Prekursor", compareDrug === "sisplatin" ? "Saraton dorisi" : "Pt⁴⁺ standarti"],
                  ["Magnit", "Diamagnit", compareDrug === "sisplatin" ? "Diamagnit" : "Diamagnit"]
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-4 font-semibold">{row[0]}</td>
                    <td className="py-2 px-4 text-center font-bold text-violet-400">{row[1]}</td>
                    <td className="py-2 px-4 text-center">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 XPS diagnostikasi:</strong> Pt 4f₇/₂ BE qiymatlari:
            <br/>• <strong>Pt⁰</strong> (metall): 71.2 eV
            <br/>• <strong>Sisplatin</strong> (Pt²⁺, 2NH₃+2Cl⁻): 72.8 eV
            <br/>• <strong>K₂[PtCl₄]</strong> (Pt²⁺, 4Cl⁻): 73.2 eV
            <br/>• <strong>K₂[PtCl₆]</strong> (Pt⁴⁺, 6Cl⁻): 74.8 eV
            <br/><br/>
            <strong>Ligandlar BE ga ta'siri:</strong> Cl⁻ dan NH₃ ga o'tganda BE kamayadi (NH₃ kuchliroq elektron donor).</p>
          </div>
        </div>

        {/* ═════ INTERAKTIV SINTETIZ YO'LI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🧪</span> Interaktiv sintez yo'li
          </h2>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setSynthesisRoute("fromSisplatin"); setSynthesisStep(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                synthesisRoute === "fromSisplatin" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
              }`}
            >
              Sisplatindan
            </button>
            <button
              onClick={() => { setSynthesisRoute("fromPtMetal"); setSynthesisStep(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                synthesisRoute === "fromPtMetal" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
              }`}
            >
              Pt metallidan
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

        {/* ═════ PT OKSIDLANISH DARAJALARI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔄</span> Pt oksidlanish darajalari — XPS solishtirish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-center text-yellow-400">Pt⁰</th>
                <th className="py-3 px-4 text-center text-violet-400">Pt²⁺ (K₂[PtCl₄])</th>
                <th className="py-3 px-4 text-center text-red-400">Pt⁴⁺</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Elektron konfiguratsiya", "d¹⁰ (5d⁹6s¹)", "d⁸", "d⁶"],
                  ["4f₇/₂ BE (eV)", "71.2", "73.2", "74.8"],
                  ["4f₅/₂ BE (eV)", "74.5", "76.5", "78.1"],
                  ["SO splitting (eV)", "3.3", "3.3", "3.3"],
                  ["Pik shakli", "Asimmetrik tail", "Simmetrik", "Simmetrik"],
                  ["FWHM (eV)", "~1.0", "~1.3", "~1.3"],
                  ["Geometriya", "FCC metall", "Tekis kvadrat", "Oktaedrik"],
                  ["Magnit", "Diamagnit", "Diamagnit", "Diamagnit (LS)"],
                  ["Misol", "Pt foil", "K₂[PtCl₄]", "K₂[PtCl₆]"],
                  ["Ligandlar", "—", "4 × Cl⁻", "6 × Cl⁻"],
                  ["Rang", "Kumushrang", "Qizil", "Sariq"]
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i >= 1 && i <= 3 ? 'bg-violet-900/10' : ''}`}>
                    <td className="py-2 px-4 font-semibold">{r[0]}</td>
                    <td className="py-2 px-4 text-center">{r[1]}</td>
                    <td className="py-2 px-4 text-center font-bold text-violet-400">{r[2]}</td>
                    <td className="py-2 px-4 text-center">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 Diagnostika:</strong> Pt oksidlanish darajasi oshgan sari BE ortadi:
            <br/>• Pt⁰ → Pt²⁺: +2.0 eV
            <br/>• Pt²⁺ → Pt⁴⁺: +1.6 eV
            <br/><br/>
            K₂[PtCl₄] da BE = 73.2 eV → <strong>Pt²⁺ tasdiqlanadi</strong>.</p>
          </div>
        </div>

        {/* ═════ SURVEY TARKIB ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>⚛️</span> Elementlar tarkibi (Survey XPS)</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
            <p><strong className="text-violet-400">💡 Nazariy nisbat:</strong> K₂[PtCl₄] da Pt:Cl:K = <strong>1:4:2</strong>.
            Survey XPS da bu nisbat (14.5:58:29 at.% ≈ 1:4:2) tasdiqlanadi.
            <br/><br/>
            <strong className="text-violet-400">💡 E'tibor bering:</strong> K 2p signali (293 eV) — qarama-qarshi ion, koordinatsiyada qatnashmaydi.</p>
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
            <p><strong className="text-amber-400">💡 Muhim:</strong> K₂[PtCl₄] ning eng muhim qo'llanilishi —
            <strong>sisplatin va boshqa Pt dorilarini sintez qilish uchun prekursor</strong> sifatida.</p>
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
            <li>K₂[PtCl₄] — <strong className="text-violet-400">tekis kvadrat</strong> Pt²⁺ (d⁸) kompleksi, 4 ta Cl⁻ ligand.</li>
            <li><strong>Pt 4f₇/₂ BE = 73.2 eV</strong> — sisplatindan +0.4 eV yuqori (barcha Cl⁻ ligandlar).</li>
            <li>SO splitting: <strong>3.3 eV</strong> (4f₇/₂ − 4f₅/₂), FWHM: ~1.3 eV.</li>
            <li><strong>Cl 2p₃/₂ BE = 198.5 eV</strong> — koordinatsion Cl⁻ (4 ta).</li>
            <li><strong>K 2p₃/₂ BE = 293.0 eV</strong> — qarama-qarshi ion K⁺.</li>
            <li>Survey XPS da Pt:Cl:K = <strong>1:4:2</strong> (nazariy).</li>
            <li><strong>Sisplatin prekursori</strong> — NH₃ ligandlarni qo'shish orqali sisplatin olinadi.</li>
            <li>Pt oksidlanish darajalari: Pt⁰ (71.2 eV) &lt; Pt²⁺ (73.2 eV) &lt; Pt⁴⁺ (74.8 eV).</li>
            <li>Ligandlar BE ga ta'siri: NH₃ → Cl⁻ o'tganda BE <strong>ortadi</strong> (+0.4 eV).</li>
            <li>Diamagnit (S=0), kinetik inert (d⁸ tekis kvadrat).</li>
            <li>Qizil-to'q sariq kristall, suvda yaxshi eruvchan.</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/ferrosen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← Ferotsen</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">Birikmalar ro'yxati →</Link>
        </div>
      </section>
    </main>
  );
}