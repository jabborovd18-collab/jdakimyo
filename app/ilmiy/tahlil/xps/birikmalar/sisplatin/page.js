"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — SISPLATIN (KENGAYTIRILGAN)
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Pt 4f": [
    { orbital: "Pt 4f₇/₂", be: 72.8, intensity: 1.0, fwhm: 1.2, assign: "Pt²⁺ (sisplatin, d⁸)" },
    { orbital: "Pt 4f₅/₂", be: 76.1, intensity: 0.75, fwhm: 1.2, assign: "SO split (Δ=3.3 eV)" },
    { orbital: "Pt 4f (satellite)", be: 75.2, intensity: 0.15, fwhm: 1.8, assign: "Shake-up (Pt 5d→6s)" }
  ],
  "N 1s": [
    { orbital: "N 1s (NH₃)", be: 399.8, intensity: 1.0, fwhm: 1.3, assign: "Koordinatsion NH₃" },
    { orbital: "N 1s (ads)", be: 401.5, intensity: 0.15, fwhm: 1.5, assign: "Sirt iflosligi (N₂/O₂)" },
    { orbital: "N 1s (G-N7)", be: 400.5, intensity: 0.2, fwhm: 1.4, assign: "DNK bilan bog'langan (G-N7)" }
  ],
  "Cl 2p": [
    { orbital: "Cl 2p₃/₂", be: 198.2, intensity: 1.0, fwhm: 1.2, assign: "Cl⁻ (koordinatsion)" },
    { orbital: "Cl 2p₁/₂", be: 199.8, intensity: 0.5, fwhm: 1.2, assign: "SO split (Δ=1.6 eV)" },
    { orbital: "Cl 2p (ads)", be: 200.8, intensity: 0.08, fwhm: 1.3, assign: "Sirt iflosligi (Cl⁻)" }
  ],
  "C 1s": [
    { orbital: "C 1s (C-H)", be: 285.0, intensity: 0.8, fwhm: 1.4, assign: "Alifatik uglerod" },
    { orbital: "C 1s (C-O)", be: 286.5, intensity: 0.1, fwhm: 1.4, assign: "Sirt iflosligi" }
  ],
  "O 1s": [
    { orbital: "O 1s (H₂O)", be: 532.0, intensity: 0.05, fwhm: 1.5, assign: "Adsorbsion suv" },
    { orbital: "O 1s (O=C)", be: 533.5, intensity: 0.03, fwhm: 1.5, assign: "Sirt iflosligi (CO₂)" }
  ]
};

const surveyData = [
  { element: "Pt", orbital: "4f₇/₂", be: 72.8, atomic_percent: 19.8, color: "#a855f7", desc: "Markaziy metal (Pt²⁺, d⁸)" },
  { element: "N", orbital: "1s", be: 399.8, atomic_percent: 39.5, color: "#3b82f6", desc: "Ligand NH₃ (2 ta)" },
  { element: "Cl", orbital: "2p₃/₂", be: 198.2, atomic_percent: 39.7, color: "#10b981", desc: "Ligand Cl⁻ (2 ta)" },
  { element: "C", orbital: "1s", be: 285.0, atomic_percent: 0.8, color: "#6b7280", desc: "Sirt iflosligi (kontaminatsiya)" },
  { element: "O", orbital: "1s", be: 532.0, atomic_percent: 0.2, color: "#f59e0b", desc: "Adsorbsion H₂O/CO₂" }
];

// ═══════════════════════════════════════════════════════════
// QO'SHIMCHA MA'LUMOTLAR
// ═══════════════════════════════════════════════════════════
const additionalInfo = {
  chemical: {
    molecularFormula: "C₂H₆Cl₂N₂Pt",
    molecularWeight: "300.05 g/mol",
    meltingPoint: "270°C (parchalanadi)",
    solubility: "Suvda 2.5 mg/mL (20°C da), DMSOda yaxshi eruvchan",
    stability: "Quruq, sovuq joyda barqaror. Yorug'lik va namlik ta'sirida parchalanishi mumkin",
    pKa: "~5.6 (Cl⁻ ligandlarining suv bilan almashinishi)",
    logP: "-2.19 (gidrofilik)",
    density: "3.58 g/cm³"
  },
  electronic: {
    configuration: "[Xe] 4f¹⁴ 5d⁸",
    oxidationState: "+2",
    coordinationNumber: "4 (tekis kvadrat)",
    pointGroup: "D₂ₕ",
    magneticMoment: "0 BM (diamagnit)",
    spinState: "Low-spin (S=0)",
    crystalFieldSplitting: "Δ₀ ≈ 28,000 cm⁻¹ (UV-Vis da kuzatiladi)"
  },
  xpsDetails: {
    pt4f: {
      reference: "Pt foil (Pt⁰): 71.2 eV (4f₇/₂), 74.5 eV (4f₅/₂)",
      pt2Plus: "72.8 eV (4f₇/₂) — sisplatin uchun xarakterli",
      pt4Plus: "74.8 eV (4f₇/₂) — masalan, K₂PtCl₆",
      fwhm: "1.0–1.3 eV (oksidlanish darajasiga bog'liq)",
      asymmetry: "Pt⁰ uchun asimmetrik tail (metallik xususiyat)",
      satellite: "Shake-up piklari (Pt 5d→6s o'tishlari) 75–78 eV da"
    },
    n1s: {
      nh3: "399.8 eV — koordinatsion NH₃",
      dna: "400.5 eV — DNK bilan bog'langan (G-N7)",
      contamination: "401.5 eV — sirt iflosligi (amidlar, nitratlar)"
    },
    cl2p: {
      coordinate: "198.2 eV (2p₃/₂) — koordinatsion Cl⁻",
      soSplitting: "1.6 eV (2p₃/₂ va 2p₁/₂ orasi)",
      contamination: "200.8 eV — sirt iflosligi (Cl⁻ ionlari)"
    }
  },
  clinical: {
    fdaApproval: "1978-yil (tuxumdon saratoni uchun)",
    indications: [
      "Tuxumdon saratoni (birinchi qator)",
      "O'pka saratoni (kichik hujayrali)",
      "Bosh-bo'yin saratoni",
      "Siydik pufagi saratoni",
      "Testis saratoni (90%+ davolanish)",
      "Me'da saratoni (kombinatsiyada)",
      "Oshqozon-ichak trakti saratonlari"
    ],
    dosage: {
      standard: "50–100 mg/m² (har 3–4 haftada 1 marta)",
      combination: "75–100 mg/m² (boshqa dorilar bilan)",
      infusionTime: "30–60 daqiqa (venada)",
      hydration: "1–2 litr suv (nefrotoksiklikni kamaytirish uchun)"
    },
    sideEffects: {
      common: ["Ko'ngil aynishi va qusish (90%+)", "Neyrotoksiklik (periferik neyropatiya)", "Nefrotoksiklik (buyrak funksiyasining buzilishi)"],
      rare: ["O'tkir buyrak yetishmovchiligi", "Anafilaktik reaksiyalar", "Elektrolitlar balansining buzilishi (Mg²⁺, Ca²⁺)", "Ototoksiklik (eshitish buzilishi)"]
    },
    resistanceMechanisms: [
      "DNK repair mexanizmlarining faollashuvi (NER, MMR)",
      "Glutation va metallotioninlar bilan detoksifikatsiya",
      "Pt transportchi oqsilining kamayishi (CTR1)",
      "DNK polimerazalarining to'xtab qolmasligi"
    ],
    combinations: {
      testicularCancer: "Bleomycin + Etoposide + Cisplatin (BEP)",
      ovarianCancer: "Cisplatin + Paclitaxel",
      lungCancer: "Cisplatin + Etoposide",
      bladderCancer: "Cisplatin + Gemcitabine"
    }
  },
  dnaInteraction: {
    steps: [
      {
        step: 1,
        title: "Akvatsiya",
        description: "Hujayra ichida Cl⁻ konsentratsiyasi past (4 mM). Cl⁻ ligandlari H₂O bilan almashadi. Reaksiya konstantasi: k ≈ 10⁻³ s⁻¹ (25°C da).",
        equation: "Pt(NH₃)₂Cl₂ + 2H₂O → [Pt(NH₃)₂(H₂O)₂]²⁺ + 2Cl⁻"
      },
      {
        step: 2,
        title: "DNK bog'lanish",
        description: "Aktiv Pt kompleksi DNK dagi guanin (G) bazalarining N7 atomlari bilan bog'lanadi. Preferensial joy: 5'-GG-3' va 5'-AG-3' ketma-ketliklari.",
        bindingSites: ["G-N7 (90%)", "A-N7 (5%)", "C-N3 (<1%)"]
      },
      {
        step: 3,
        title: "Crosslink hosil bo'lish",
        description: "Ikki Cl⁻ ligandlari chiqib ketgandan so'ng, Pt DNK da 1,2-intrastrand crosslink hosil qiladi. Bu eng keng tarqalgan addukt turi (65–90%).",
        types: [
          "1,2-intrastrand G-G (65%)",
          "1,2-intrastrand A-G (25%)",
          "1,3-intrastrand G-X-G (5%)",
          "Interstrand crosslink (<5%)"
        ]
      },
      {
        step: 4,
        title: "DNK shikastlanishi",
        description: "Crosslink DNK spiralini buzadi, replikatsiya va transkripsiyani to'xtatadi. Hujayra DNK shikastlanishini tuzata olmaydi."
      },
      {
        step: 5,
        title: "Apoptoz",
        description: "p53 yo'li faollashadi, kaspoza-3 aktivlanadi → apoptoz (hujayra o'limi). Tez bo'linuvchi saraton hujayralari birinchi nobud bo'ladi."
      }
    ],
    xpsChanges: [
      "Pt 4f BE siljishi: DNK bilan bog'langandan so'ng Pt 4f₇/₂ BE ~0.3–0.5 eV ga o'zgaradi (ligand muhiti o'zgarishi).",
      "N 1s yangi komponent: G-N7 bilan bog'langan Pt uchun N 1s da ~400.5 eV da yangi pik paydo bo'ladi.",
      "Cl 2p yo'qolishi: Aqvatsiya va DNK bog'lanish jarayonida Cl⁻ chiqib ketadi → Cl 2p signali kamayadi (70–90%).",
      "P/N nisbati: Survey XPS da Pt/N nisbati o'zgarishi addukt hosil bo'lishini tasdiqlaydi (Pt/N: 1:2 → 1:1.5).",
      "O 1s o'zgarishi: DNK bilan bog'langandan so'ng O 1s da fosfat guruhlari bilan bog'liq yangi piklar paydo bo'ladi (531–532 eV)."
    ]
  },
  history: [
    { year: "1845", event: `Michele Peyrone sisplatinni birinchi marta sintez qildi ("Peyrone tuzi" nomini oldi).` },
    { year: "1893", event: `Alfred Werner sisplatinning tekis kvadrat strukturasini aniqladi. Koordinatsion nazariya uchun Nobel mukofoti (1913).` },
    { year: "1965", event: `Barnett Rosenberg (Michigan State University) sisplatinning hujayra bo'linishini to'xtatishini tasodifan kashf etdi. Tajriba: E. coli bakteriyalarini elektr maydonida o'tkazish, natijada bakteriyalar bo'linishni to'xtatdi.` },
    { year: "1969", event: "Rosenberg va hamkorlari sisplatinning saraton hujayralariga ta'sirini o'rganishni boshladilar." },
    { year: "1971", event: "Birinchi klinik sinovlar boshlandi (National Cancer Institute, USA)." },
    { year: "1978", event: `FDA sisplatinni tuxumdon saratoni uchun rasman tasdiqladi. Kimyoterapiya inqilobining boshlanishi.` },
    { year: "1980", event: `Testis saratoni uchun 90%+ davolanish natijasi erishildi. Lance Armstrong (1996) sisplatin bilan davolangan.` },
    { year: "1990–2000", event: "Yangi Pt komplekslari: karboplatin (1989), oksaliplatin (2002). Sisplatinning kombinatsiyalari kashf etildi." },
    { year: "2010–2020", event: "Nanopartikulalar va targetli yetkazib berish tizimlari (liposomalar, polimerlar) ishlab chiqildi." },
    { year: "2020–hozir", event: "Rezistentlik mexanizmlarini o'rganish, immunoterapiya bilan kombinatsiyalar, yangi generatsiyali Pt dorilari (masalan, picoplatin)." }
  ],
  safety: {
    storage: "Quruq, sovuq (2–8°C) va yorug'likdan himoyalangan joyda saqlang. Namlikdan himoya qiling.",
    handling: "Havo oqimi ostida ishlang. Ko'z va teri bilan aloqa qilmang. Maxsus kiyim va qoʻlqoplar kiying.",
    disposal: "Qoldiqlarni maxsus kimyoviy chiqindilar konteyneriga tashing. Avval suv bilan yuving.",
    firstAid: {
      skin: "Suv bilan 15 daqiqa yuving. Tibbiy yordam ko'rsating.",
      eyes: "Suv bilan 15 daqiqa yuving. Tibbiy yordam ko'rsating.",
      inhalation: "Taza havoga chiqaring. Nafas olish qiyin bo'lsa, tibbiy yordam ko'rsating.",
      ingestion: "Og'izni suv bilan chayqang. Tibbiy yordam ko'rsating."
    }
  },
  alternatives: [
    {
      name: "Karboplatin",
      formula: "Pt(CBDCA)(NH₃)₂",
      advantage: "Kamroq nefrotoksiklik va emetogenik (qusish keltiruvchi) ta'sir",
      disadvantage: "Kamroq samaradorlik (tuxumdon saratonida)",
      xpsPt4f: "72.6 eV (4f₇/₂)"
    },
    {
      name: "Oksaliplatin",
      formula: "Pt(DACH)(oxalate)",
      advantage: "Kamroq nefrotoksiklik, oral qoʻllanish mumkin (kolorektal saraton uchun)",
      disadvantage: "Periferik neyropatiya koʻproq kuzatiladi",
      xpsPt4f: "72.9 eV (4f₇/₂)"
    },
    {
      name: "Nedaplatin",
      formula: "Pt(glycolate)(NH₃)₂",
      advantage: "Yuqori suvda eruvchanlik, kamroq nefrotoksiklik",
      disadvantage: "Cheklangan qoʻllanilish (Yaponiya, Xitoy)",
      xpsPt4f: "72.7 eV (4f₇/₂)"
    }
  ]
};

// ═══════════════════════════════════════════════════════════
// YANGI INTERAKTIV KOMPONENTLAR
// ═══════════════════════════════════════════════════════════

// Quiz savollari
const quizQuestions = [
  {
    question: "Sisplatinda Pt ning oksidlanish darajasi qanday?",
    options: ["0", "+2", "+4", "+3"],
    correct: 1,
    explanation: "Sisplatinda Pt²⁺ (d⁸) holatida. Pt 4f₇/₂ BE = 72.8 eV buni tasdiqlaydi."
  },
  {
    question: "Sisplatin qanday geometriyaga ega?",
    options: ["Oktaedrik", "Tetraedrik", "Tekis kvadrat", "Chiziqli"],
    correct: 2,
    explanation: "Pt²⁺ (d⁸) tekis kvadrat geometriyaga ega (D₂ₕ point group)."
  },
  {
    question: "Cis-platin va trans-platin orasidagi asosiy farq nima?",
    options: [
      "Oksidlanish darajasi",
      "Ligandlar turi",
      "Geometrik konfiguratsiya",
      "Molekulyar massa"
    ],
    correct: 2,
    explanation: "Cis-platinda ikki Cl⁻ yondosh (90°), trans-platinda qarama-qarshi (180°) joylashgan. Faqat cis-platin biologik faol."
  },
  {
    question: "Sisplatin DNK bilan qanday bog'lanadi?",
    options: [
      "Vodorod bog'lari orqali",
      "Ion bog'lari orqali",
      "1,2-intrastrand crosslink",
      "Van-der-Waals kuchlari"
    ],
    correct: 2,
    explanation: "Sisplatin DNK dagi guanin bazalarining N7 atomlari bilan kovalent bog'lanib, 1,2-intrastrand G-G crosslink hosil qiladi (65%)."
  },
  {
    question: "Pt 4f₇/₂ BE qiymati Pt⁰, Pt²⁺, Pt⁴⁺ uchun qanday o'zgaradi?",
    options: [
      "Kamayadi: 74.8 → 72.8 → 71.2 eV",
      "Ortadi: 71.2 → 72.8 → 74.8 eV",
      "O'zgarmaydi",
      "Tartibsiz o'zgaradi"
    ],
    correct: 1,
    explanation: "Oksidlanish darajasi oshganda BE ortadi: Pt⁰ (71.2 eV) < Pt²⁺ (72.8 eV) < Pt⁴⁺ (74.8 eV). Har bir oksidlanish darajasi uchun ~1.6 eV."
  },
  {
    question: "Sisplatin qaysi yilda FDA tomonidan tasdiqlangan?",
    options: ["1965", "1971", "1978", "1985"],
    correct: 2,
    explanation: "FDA sisplatinni 1978-yilda tuxumdon saratoni uchun tasdiqladi."
  },
  {
    question: "Sisplatinning asosiy nojo'ya ta'siri nima?",
    options: [
      "Kardiotoxiclik",
      "Nefrotoksiklik",
      "Gepatotoksiklik",
      "Pulmoner toksiklik"
    ],
    correct: 1,
    explanation: "Nefrotoksiklik (buyrak shikastlanishi) sisplatinning eng jiddiy nojo'ya ta'siri. Gidratatsiya bilan kamaytiriladi."
  },
  {
    question: "Sisplatin qaysi bazalar bilan preferensial bog'lanadi?",
    options: [
      "Adenin (A)",
      "Timin (T)",
      "Guanin (G)",
      "Sitozin (C)"
    ],
    correct: 2,
    explanation: "Sisplatin guanin (G) bazalarining N7 atomi bilan 90% holatlarda bog'lanadi. A-N7 bilan 5%, C-N3 bilan <1%."
  }
];

export default function Sisplatin() {
  const [selectedRegion, setSelectedRegion] = useState("Pt 4f");
  const [showSurvey, setShowSurvey] = useState(false);
  const [compareMode, setCompareMode] = useState("none");
  
  // Yangi interaktiv holatlar
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  
  const [crystalFieldStep, setCrystalFieldStep] = useState(0);
  const [showMolecularOrbitals, setShowMolecularOrbitals] = useState(false);
  
  const [doseWeight, setDoseWeight] = useState(70);
  const [doseHeight, setDoseHeight] = useState(170);
  const [doseBSA, setDoseBSA] = useState(0);
  const [doseResult, setDoseResult] = useState(0);
  
  const [compareDrug1, setCompareDrug1] = useState("Sisplatin");
  const [compareDrug2, setCompareDrug2] = useState("Karboplatin");
  
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [activeDNKStep, setActiveDNKStep] = useState(0);

  // BSA hisoblash (Mosteller formulasi)
  const calculateBSA = () => {
    const bsa = Math.sqrt((doseHeight * doseWeight) / 3600);
    setDoseBSA(bsa);
    setDoseResult(bsa * 75); // 75 mg/m² standart doza
  };

  useEffect(() => {
    calculateBSA();
  }, [doseWeight, doseHeight]);

  // ═══════════════════════════════════════════════════════════
  // SPEKTR GENERATORI (KENGAYTIRILGAN)
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
      { be: 72.8, intensity: 1.0, label: "Pt 4f", color: "#a855f7" },
      { be: 399.8, intensity: 1.2, label: "N 1s", color: "#3b82f6" },
      { be: 285.0, intensity: 0.3, label: "C 1s", color: "#6b7280" },
      { be: 198.2, intensity: 1.2, label: "Cl 2p", color: "#10b981" },
      { be: 532.0, intensity: 0.1, label: "O 1s", color: "#f59e0b" }
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

  // Quiz funksiyalari
  const handleQuizAnswer = (answerIndex) => {
    setQuizAnswer(answerIndex);
    if (answerIndex === quizQuestions[quizStep].correct) {
      setQuizScore(quizScore + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
      setQuizAnswer(null);
    } else {
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setShowQuizResult(false);
  };

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
            <span className="text-violet-400 font-semibold">Sisplatin</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-3">
                <span className="text-3xl">💊</span>
                <span>Sisplatin</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                cis-Pt(NH₃)₂Cl₂ • Pt²⁺ (d⁸) • Tekis kvadrat (D₂ₕ) • Saraton dorisi • Molekulyar massa: 300.05 g/mol
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
            <div className="text-xl font-bold text-violet-400 font-mono">72.8</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-green-400">S=0</div>
            <div className="text-[10px] text-purple-400">Diamagnit</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Qo'llanilish</div>
            <div className="text-xl font-bold text-yellow-400">Saraton</div>
            <div className="text-[10px] text-purple-400">Kimyoterapiya</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">FDA</div>
            <div className="text-xl font-bold text-green-400">1978</div>
            <div className="text-[10px] text-purple-400">Tasdiqlangan</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-violet-400">Sisplatin</strong> (cis-diammindixloroplatina(II), <strong>C₂H₆Cl₂N₂Pt</strong>) —
              dunyodagi <strong>eng keng qoʻllaniladigan saraton dorisilaridan biri</strong>.
              Pt²⁺ (d⁸) <strong>tekis kvadrat</strong> geometriyaga ega boʻlib, ikkita NH₃ va ikkita Cl⁻ ligandi
              <strong>cis-pozitsiyada</strong> joylashgan. Bu cis-konfiguratsiya biologik faollik uchun hal qiluvchi ahamiyatga ega:
              trans-izomer (transplatin) saratonga qarshi faol emas.
              <br/><br/>
              <strong>XPS da Pt 4f₇/₂ BE = 72.8 eV</strong> Pt²⁺ holatini tasdiqlaydi.
              Dorining ta'sir mexanizmi DNK bilan <strong>1,2-intrastrand G-G crosslink</strong> hosil qilishga asoslangan.
              <br/><br/>
              <strong className="text-amber-400">💡 Qiziq fakt:</strong> Sisplatin 1845-yilda sintez qilingan, lekin saratonga qarshi ta'siri faqat 1965-yilda tasodifan kashf etilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kimyoviy xususiyatlar */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar formula:</span>
                  <span className="font-mono">C₂H₆Cl₂N₂Pt</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">300.05 g/mol</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Erish harorati:</span>
                  <span className="font-mono">270°C (parchalanadi)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligandlar:</span>
                  <span>2 × NH₃ + 2 × Cl⁻</span>
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
                  <span className="text-yellow-200">Sariq kristall</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Eruvchanlik (suvda):</span>
                  <span>2.5 mg/mL (20°C)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">pKa:</span>
                  <span className="font-mono">~5.6</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">FDA tasdiqlangan:</span>
                  <span className="text-green-400 font-bold">1978</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Saqlash:</span>
                  <span className="text-[10px]">2–8°C, yorug'likdan himoyalangan</span>
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
                  <span className="text-purple-400">Kristal maydon bo'linishi:</span>
                  <span className="font-mono text-[10px]">Δ₀ ≈ 28,000 cm⁻¹</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kinetik:</span>
                  <span className="text-yellow-400 font-bold">Inert (d⁸)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligand almashinishi:</span>
                  <span className="font-mono text-[10px]">k ≈ 10⁻³ s⁻¹ (25°C)</span>
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
                  <span className="font-mono text-violet-400 font-bold">72.8 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Pt 4f₇/₂ (Pt⁴⁺):</span>
                  <span className="font-mono">74.8 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">SO splitting:</span>
                  <span className="font-mono">3.3 eV (4f)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">FWHM:</span>
                  <span className="font-mono">1.0–1.3 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">N 1s (NH₃):</span>
                  <span className="font-mono">399.8 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">N 1s (G-N7):</span>
                  <span className="font-mono">400.5 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Cl 2p₃/₂:</span>
                  <span className="font-mono">198.2 eV</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Shake-up:</span>
                  <span className="font-mono text-[10px]">75–78 eV (Pt 5d→6s)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ YANGI: INTERAKTIV KRISTAL MAYDON DIAGRAMMASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⚡</span> Interaktiv kristal maydon diagrammasi
          </h2>
          
          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-violet-400">Tekis kvadrat</strong> geometriyada d-orbitallari kristal maydon ta'sirida bo'linadi.
              Pt²⁺ (d⁸) uchun barcha 8 elektron pastki energiyali orbitallarni to'ldiradi → <strong>diamagnit</strong> (S=0).
              <br/><br/>
              <strong className="text-amber-400">💡 Qiziq fakt:</strong> Tekis kvadrat geometriya kuchli kristal maydon bo'linishi (Δ) tufayli yuzaga keladi.
              Bu d⁸ konfiguratsiyasi uchun xarakterli (Ni²⁺, Pd²⁺, Pt²⁺, Au³⁺, Rh⁺, Ir⁺).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diagramma */}
            <div className="bg-purple-950/50 rounded-xl p-4">
              <svg viewBox="0 0 400 300" className="w-full h-64">
                {/* Energiya o'qi */}
                <line x1="50" y1="20" x2="50" y2="280" stroke="#6b7280" strokeWidth="2" />
                <text x="30" y="150" fill="#9ca3af" fontSize="10" textAnchor="middle" transform="rotate(-90, 30, 150)">Energiya →</text>
                
                {/* d-orbitallari */}
                {/* dx²-y² (eng yuqori) */}
                <g opacity={crystalFieldStep >= 4 ? 1 : 0.3}>
                  <line x1="100" y1="40" x2="180" y2="40" stroke="#ef4444" strokeWidth="3" />
                  <text x="140" y="30" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">dx²-y²</text>
                  {crystalFieldStep >= 4 && (
                    <>
                      <circle cx="130" cy="40" r="4" fill="#ef4444" />
                      <circle cx="150" cy="40" r="4" fill="#ef4444" />
                    </>
                  )}
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
                
                {/* dxz, dyz (degenerat) */}
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
                    <text x="240" y="145" fill="#fbbf24" fontSize="9">~28,000 cm⁻¹</text>
                  </>
                )}
                
                {/* Legend */}
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
                  {crystalFieldStep === 0 && (
                    <p>Erkin ion: barcha 5 ta d-orbitali degenerat (bir xil energiya).</p>
                  )}
                  {crystalFieldStep === 1 && (
                    <p>Ligandlar yaqinlashganda: dxz, dyz pastroq energiyaga tushadi (4 elektron).</p>
                  )}
                  {crystalFieldStep === 2 && (
                    <p>dz² orbitali o'rtacha energiyada (2 elektron).</p>
                  )}
                  {crystalFieldStep === 3 && (
                    <p>dxy orbitali yuqoriroq energiyada (2 elektron).</p>
                  )}
                  {crystalFieldStep === 4 && (
                    <p>dx²-y² eng yuqori energiyada va <strong>bo'sh</strong> (0 elektron). Bu tekis kvadrat geometriya uchun xarakterli!</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
                <p><strong className="text-amber-400">💡 Natija:</strong> Barcha 8 elektron juftlangan → <strong>S=0, diamagnit</strong>.
                Bu Pt²⁺ (d⁸) tekis kvadrat komplekslar uchun xarakterli.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ YANGI: INTERAKTIV DOZA KALKULYATORI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>💉</span> Interaktiv doza kalkulyatori
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Sisplatin dozasi <strong>body surface area (BSA)</strong> ga asoslan hisoblanadi.
              Mosteller formulasi: <strong className="font-mono">BSA (m²) = √[(height(cm) × weight(kg)) / 3600]</strong>
              <br/><br/>
              Standart doza: <strong>75 mg/m²</strong> (kombinatsiya terapiyasida).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kiritish */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-4 text-sm">📏 Bemor parametrlari</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-purple-300 text-xs mb-2 block">Vazn: {doseWeight} kg</label>
                  <input
                    type="range"
                    min="40"
                    max="120"
                    value={doseWeight}
                    onChange={(e) => setDoseWeight(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-purple-400 mt-1">
                    <span>40 kg</span>
                    <span>120 kg</span>
                  </div>
                </div>

                <div>
                  <label className="text-purple-300 text-xs mb-2 block">Bo'y: {doseHeight} cm</label>
                  <input
                    type="range"
                    min="140"
                    max="200"
                    value={doseHeight}
                    onChange={(e) => setDoseHeight(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-purple-400 mt-1">
                    <span>140 cm</span>
                    <span>200 cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Natija */}
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-4 text-sm">📊 Hisoblangan doza</h3>
              
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">Body Surface Area (BSA)</p>
                  <p className="text-violet-400 font-bold font-mono text-2xl">{doseBSA.toFixed(2)} m²</p>
                </div>

                <div className="bg-violet-600/20 rounded-lg p-3 border border-violet-500/30">
                  <p className="text-purple-400 text-xs mb-1">Tavsiya etilgan doza (75 mg/m²)</p>
                  <p className="text-green-400 font-bold font-mono text-2xl">{doseResult.toFixed(0)} mg</p>
                  <p className="text-purple-300 text-[10px] mt-1">
                    {doseResult.toFixed(0)} mg = {doseResult.toFixed(2)} mg / 75 mg/m² × {doseBSA.toFixed(2)} m²
                  </p>
                </div>

                <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
                  <p><strong className="text-amber-400">⚠️ Ogohlantirish:</strong> Bu faqat hisoblash vositasi.
                  Haqiqiy doza <strong>buyrak funksiyasi</strong> (kreatinin klirensi), <strong>yosh</strong> va <strong>umumiy holat</strong> ga qarab sozlanadi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ YANGI: INTERAKTIV QUIZ ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎓</span> Bilimingizni sinab ko'ring
          </h2>

          {!showQuizResult ? (
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              {/* Progress */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-purple-400 text-xs">Savol {quizStep + 1} / {quizQuestions.length}</span>
                <span className="text-violet-400 font-bold text-sm">Ball: {quizScore}</span>
              </div>
              
              <div className="w-full bg-purple-900/50 rounded-full h-2 mb-6">
                <div 
                  className="bg-violet-600 h-2 rounded-full transition-all" 
                  style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Savol */}
              <h3 className="text-violet-400 font-bold mb-4 text-sm">
                {quizQuestions[quizStep].question}
              </h3>

              {/* Javoblar */}
              <div className="space-y-2 mb-4">
                {quizQuestions[quizStep].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => quizAnswer === null && handleQuizAnswer(i)}
                    disabled={quizAnswer !== null}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-all ${
                      quizAnswer === null
                        ? "bg-purple-900/50 hover:bg-purple-800/50 text-purple-200"
                        : i === quizQuestions[quizStep].correct
                        ? "bg-green-600/30 border border-green-500/50 text-green-300"
                        : quizAnswer === i
                        ? "bg-red-600/30 border border-red-500/50 text-red-300"
                        : "bg-purple-900/50 text-purple-400 opacity-50"
                    }`}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Tushuntirish */}
              {quizAnswer !== null && (
                <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-3 mb-4">
                  <p className="text-purple-200 text-xs">
                    <strong className="text-violet-400">💡 Tushuntirish:</strong> {quizQuestions[quizStep].explanation}
                  </p>
                </div>
              )}

              {/* Keyingi tugma */}
              {quizAnswer !== null && (
                <button
                  onClick={nextQuizQuestion}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                >
                  {quizStep < quizQuestions.length - 1 ? "Keyingi savol →" : "Natijalarni ko'rish →"}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 text-center">
              <div className="text-6xl mb-4">
                {quizScore >= 7 ? "🏆" : quizScore >= 5 ? "👍" : "📚"}
              </div>
              <h3 className="text-violet-400 font-bold text-xl mb-2">
                Quiz tugadi!
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                Sizning natijangiz: <strong className="text-violet-400 font-bold text-2xl">{quizScore}/{quizQuestions.length}</strong>
              </p>
              
              <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-4 mb-4">
                <p className="text-purple-200 text-xs">
                  {quizScore >= 7 && "Ajoyib! Siz sisplatin haqida chuqur bilimga egasiz! 🎉"}
                  {quizScore >= 5 && quizScore < 7 && "Yaxshi natija! Ba'zi mavzularni qayta ko'rib chiqing. 👍"}
                  {quizScore < 5 && "Qayta o'rganish kerak. Yuqoridagi ma'lumotlarni diqqat bilan o'qing. 📚"}
                </p>
              </div>

              <button
                onClick={resetQuiz}
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2 rounded-lg transition-all text-sm"
              >
                🔄 Qayta boshlash
              </button>
            </div>
          )}
        </div>

        {/* ═════ YANGI: INTERAKTIV DNK ANIMATSIYASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🧬</span> Interaktiv DNK bog'lanish animatsiyasi
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Sisplatinning DNK bilan bog'lanish jarayonini <strong>qadam-baqadam</strong> kuzating.
              Har bir bosish orqali keyingi qadamga o'ting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Animatsiya */}
            <div className="bg-purple-950/50 rounded-xl p-4">
              <svg viewBox="0 0 400 300" className="w-full h-64">
                {/* DNK spiral */}
                <path d="M 50 50 Q 100 100, 50 150 Q 100 200, 50 250" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />
                <path d="M 100 50 Q 50 100, 100 150 Q 50 200, 100 250" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.5" />
                
                {/* Bazalar */}
                {[80, 120, 160, 200].map((y, i) => (
                  <g key={i}>
                    <circle cx="75" cy={y} r="8" fill={i === 1 ? "#ef4444" : "#6b7280"} opacity="0.7" />
                    <circle cx="125" cy={y} r="8" fill={i === 1 ? "#ef4444" : "#6b7280"} opacity="0.7" />
                    <text x="75" y={y + 3} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">
                      {i === 1 ? "G" : i === 0 ? "A" : i === 2 ? "T" : "C"}
                    </text>
                    <text x="125" y={y + 3} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">
                      {i === 1 ? "G" : i === 0 ? "T" : i === 2 ? "A" : "G"}
                    </text>
                  </g>
                ))}

                {/* Sisplatin molekulasi */}
                {activeDNKStep >= 1 && (
                  <g>
                    <circle 
                      cx={activeDNKStep >= 2 ? 100 : 250} 
                      cy={activeDNKStep >= 2 ? 120 : 150} 
                      r="15" 
                      fill="#a855f7"
                      className={activeDNKStep >= 2 ? "" : "animate-pulse"}
                    />
                    <text 
                      x={activeDNKStep >= 2 ? 100 : 250} 
                      y={activeDNKStep >= 2 ? 123 : 153} 
                      fill="white" 
                      fontSize="8" 
                      textAnchor="middle" 
                      fontWeight="bold"
                    >
                      Pt
                    </text>
                    
                    {/* Ligandlar */}
                    {activeDNKStep < 3 && (
                      <>
                        <line 
                          x1={activeDNKStep >= 2 ? 100 : 250} 
                          y1={activeDNKStep >= 2 ? 105 : 135} 
                          x2={activeDNKStep >= 2 ? 100 : 250} 
                          y2={activeDNKStep >= 2 ? 90 : 120} 
                          stroke="#10b981" 
                          strokeWidth="2"
                        />
                        <text 
                          x={activeDNKStep >= 2 ? 100 : 250} 
                          y={activeDNKStep >= 2 ? 85 : 115} 
                          fill="#10b981" 
                          fontSize="7" 
                          textAnchor="middle"
                        >
                          Cl
                        </text>
                      </>
                    )}
                  </g>
                )}

                {/* Crosslink */}
                {activeDNKStep >= 3 && (
                  <>
                    <line x1="75" y1="120" x2="100" y2="120" stroke="#fbbf24" strokeWidth="2" />
                    <line x1="125" y1="120" x2="100" y2="120" stroke="#fbbf24" strokeWidth="2" />
                    <text x="100" y="140" fill="#fbbf24" fontSize="7" textAnchor="middle">Crosslink</text>
                  </>
                )}

                {/* DNK buzilishi */}
                {activeDNKStep >= 4 && (
                  <text x="200" y="280" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">
                    ⚠️ DNK shikastlangan!
                  </text>
                )}
              </svg>
            </div>

            {/* Boshqaruv va tafsilotlar */}
            <div className="space-y-4">
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map(step => (
                  <button
                    key={step}
                    onClick={() => setActiveDNKStep(step)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeDNKStep === step 
                        ? "bg-violet-600 text-white" 
                        : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                    }`}
                  >
                    {step + 1}
                  </button>
                ))}
              </div>

              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-violet-400 font-bold mb-2 text-sm">
                  {additionalInfo.dnaInteraction.steps[activeDNKStep].title}
                </h3>
                <p className="text-purple-200 text-xs leading-relaxed mb-2">
                  {additionalInfo.dnaInteraction.steps[activeDNKStep].description}
                </p>
                
                {additionalInfo.dnaInteraction.steps[activeDNKStep].equation && (
                  <p className="text-center">
                    <span className="font-mono text-[10px] text-yellow-300 bg-purple-900/50 px-2 py-1 rounded">
                      {additionalInfo.dnaInteraction.steps[activeDNKStep].equation}
                    </span>
                  </p>
                )}

                {additionalInfo.dnaInteraction.steps[activeDNKStep].bindingSites && (
                  <div className="mt-2">
                    <p className="text-[10px] text-purple-400 mb-1">Bog'lanish joylari:</p>
                    <ul className="text-[10px] text-purple-300 space-y-1">
                      {additionalInfo.dnaInteraction.steps[activeDNKStep].bindingSites.map((site, i) => (
                        <li key={i}>• {site}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {additionalInfo.dnaInteraction.steps[activeDNKStep].types && (
                  <div className="mt-2">
                    <p className="text-[10px] text-purple-400 mb-1">Crosslink turlari:</p>
                    <ul className="text-[10px] text-purple-300 space-y-1">
                      {additionalInfo.dnaInteraction.steps[activeDNKStep].types.map((type, i) => (
                        <li key={i}>• {type}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═════ YANGI: INTERAKTIV TAQQOSLASH JADVALI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔄</span> Interaktiv dorilar taqqoslash
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Turli Pt komplekslarini <strong>XPS ma'lumotlari</strong> va <strong>klinik xususiyatlari</strong> bo'yicha taqqoslang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-purple-300 text-xs mb-2 block">Dori 1:</label>
              <select
                value={compareDrug1}
                onChange={(e) => setCompareDrug1(e.target.value)}
                className="w-full bg-purple-900/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-purple-200"
              >
                <option>Sisplatin</option>
                <option>Karboplatin</option>
                <option>Oksaliplatin</option>
                <option>Nedaplatin</option>
              </select>
            </div>
            <div>
              <label className="text-purple-300 text-xs mb-2 block">Dori 2:</label>
              <select
                value={compareDrug2}
                onChange={(e) => setCompareDrug2(e.target.value)}
                className="w-full bg-purple-900/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-purple-200"
              >
                <option>Karboplatin</option>
                <option>Sisplatin</option>
                <option>Oksaliplatin</option>
                <option>Nedaplatin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                  <th className="py-3 px-4 text-center text-violet-400">{compareDrug1}</th>
                  <th className="py-3 px-4 text-center text-cyan-400">{compareDrug2}</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Formula", 
                    compareDrug1 === "Sisplatin" ? "Pt(NH₃)₂Cl₂" : 
                    compareDrug1 === "Karboplatin" ? "Pt(CBDCA)(NH₃)₂" :
                    compareDrug1 === "Oksaliplatin" ? "Pt(DACH)(oxalate)" : "Pt(glycolate)(NH₃)₂",
                    compareDrug2 === "Sisplatin" ? "Pt(NH₃)₂Cl₂" : 
                    compareDrug2 === "Karboplatin" ? "Pt(CBDCA)(NH₃)₂" :
                    compareDrug2 === "Oksaliplatin" ? "Pt(DACH)(oxalate)" : "Pt(glycolate)(NH₃)₂"
                  ],
                  ["Pt 4f₇/₂ BE (eV)",
                    compareDrug1 === "Sisplatin" ? "72.8" : 
                    compareDrug1 === "Karboplatin" ? "72.6" :
                    compareDrug1 === "Oksaliplatin" ? "72.9" : "72.7",
                    compareDrug2 === "Sisplatin" ? "72.8" : 
                    compareDrug2 === "Karboplatin" ? "72.6" :
                    compareDrug2 === "Oksaliplatin" ? "72.9" : "72.7"
                  ],
                  ["Nefrotoksiklik",
                    compareDrug1 === "Sisplatin" ? "Yuqori" : "Past",
                    compareDrug2 === "Sisplatin" ? "Yuqori" : "Past"
                  ],
                  ["Emetogenik",
                    compareDrug1 === "Sisplatin" ? "Yuqori" : "O'rtacha",
                    compareDrug2 === "Sisplatin" ? "Yuqori" : "O'rtacha"
                  ],
                  ["Neyrotoksiklik",
                    compareDrug1 === "Oksaliplatin" ? "Yuqori" : "O'rtacha",
                    compareDrug2 === "Oksaliplatin" ? "Yuqori" : "O'rtacha"
                  ],
                  ["Suvda eruvchanlik",
                    compareDrug1 === "Sisplatin" ? "2.5 mg/mL" : 
                    compareDrug1 === "Karboplatin" ? "Yaxshi" :
                    compareDrug1 === "Nedaplatin" ? "Juda yaxshi" : "Yaxshi",
                    compareDrug2 === "Sisplatin" ? "2.5 mg/mL" : 
                    compareDrug2 === "Karboplatin" ? "Yaxshi" :
                    compareDrug2 === "Nedaplatin" ? "Juda yaxshi" : "Yaxshi"
                  ],
                  ["FDA tasdiqlangan",
                    compareDrug1 === "Sisplatin" ? "1978" : 
                    compareDrug1 === "Karboplatin" ? "1989" :
                    compareDrug1 === "Oksaliplatin" ? "2002" : "—",
                    compareDrug2 === "Sisplatin" ? "1978" : 
                    compareDrug2 === "Karboplatin" ? "1989" :
                    compareDrug2 === "Oksaliplatin" ? "2002" : "—"
                  ],
                  ["Asosiy qo'llanilish",
                    compareDrug1 === "Sisplatin" ? "Testis, tuxumdon, o'pka" : 
                    compareDrug1 === "Karboplatin" ? "Tuxumdon, o'pka" :
                    compareDrug1 === "Oksaliplatin" ? "Kolorektal" : "Cheklangan",
                    compareDrug2 === "Sisplatin" ? "Testis, tuxumdon, o'pka" : 
                    compareDrug2 === "Karboplatin" ? "Tuxumdon, o'pka" :
                    compareDrug2 === "Oksaliplatin" ? "Kolorektal" : "Cheklangan"
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
            <p><strong className="text-amber-400">💡 XPS da farq:</strong> Barcha Pt²⁺ komplekslar uchun Pt 4f₇/₂ BE ~72.6–72.9 eV oraliqda.
            Kichik farqlar <strong>ligand muhiti</strong> va <strong>elektron zichlik</strong> ga bog'liq.</p>
          </div>
        </div>

        {/* ═════ YANGI: INTERAKTIV TARIX ═════ */}
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
                    <span className="text-purple-200 text-sm">{event.event.substring(0, 60)}...</span>
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
              <div className="flex gap-1">
                <button onClick={() => setCompareMode("none")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-violet-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  Yolg'iz
                </button>
                <button onClick={() => setCompareMode("pt0")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "pt0" ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Pt⁰ (metall)
                </button>
                <button onClick={() => setCompareMode("pt4")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "pt4" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Pt⁴⁺
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

                <text x="500" y="45" fill="#8b5cf6" fontSize="9" textAnchor="end" fontWeight="bold">Sisplatin (Pt²⁺)</text>
                {compareMode === "pt0" && <text x="500" y="60" fill="#eab308" fontSize="9" textAnchor="end">Pt⁰ (metall, asimmetrik)</text>}
                {compareMode === "pt4" && <text x="500" y="60" fill="#ef4444" fontSize="9" textAnchor="end">Pt⁴⁺ (yuqori BE)</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 72.8, label: "Pt 4f", color: "#a855f7" }, { be: 399.8, label: "N 1s", color: "#3b82f6" }, { be: 285.0, label: "C 1s", color: "#6b7280" }, { be: 198.2, label: "Cl 2p", color: "#10b981" }, { be: 532.0, label: "O 1s", color: "#f59e0b" }].map((peak, i) => {
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
              <li><strong>Pt 4f:</strong> SO splitting Δ = 3.3 eV (4f₇/₂ - 4f₅/₂). Pt²⁺ uchun xarakterli.</li>
              <li><strong>N 1s:</strong> 399.8 eV (NH₃), 400.5 eV (DNK bilan bog'langan G-N7).</li>
              <li><strong>Cl 2p:</strong> SO splitting Δ = 1.6 eV (2p₃/₂ - 2p₁/₂). Koordinatsion Cl⁻ uchun.</li>
              <li><strong>Shake-up piklari:</strong> 75–78 eV da Pt 5d→6s o'tishlari kuzatiladi.</li>
            </ul>
          </div>
        </div>

        {/* ═════ CIS vs TRANS IZOMERIYA ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔷</span> Cis vs Trans — Nima uchun faqat cis faol?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-5">
              <h3 className="text-violet-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">💊</span> Cis-platin (FAOL)
              </h3>
              <svg viewBox="0 0 280 220" className="w-full h-52">
                <circle cx="140" cy="110" r="18" fill="#8b5cf6" />
                <text x="140" y="115" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">Pt²⁺</text>

                <line x1="140" y1="92" x2="140" y2="50" stroke="#3b82f6" strokeWidth="2" />
                <rect x="115" y="25" width="50" height="25" rx="5" fill="#3b82f6" opacity="0.8" />
                <text x="140" y="42" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">NH₃</text>

                <line x1="122" y1="110" x2="80" y2="110" stroke="#3b82f6" strokeWidth="2" />
                <rect x="55" y="97" width="50" height="25" rx="5" fill="#3b82f6" opacity="0.8" />
                <text x="80" y="114" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">NH₃</text>

                <line x1="140" y1="128" x2="140" y2="170" stroke="#10b981" strokeWidth="2" />
                <circle cx="140" cy="182" r="14" fill="#10b981" opacity="0.8" />
                <text x="140" y="187" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">Cl</text>

                <line x1="158" y1="110" x2="200" y2="110" stroke="#10b981" strokeWidth="2" />
                <circle cx="214" cy="110" r="14" fill="#10b981" opacity="0.8" />
                <text x="214" y="115" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">Cl</text>

                <path d="M 140 80 L 140 70 L 130 70" fill="none" stroke="#fbbf24" strokeWidth="1" />
                <text x="125" y="68" fill="#fbbf24" fontSize="8">90°</text>

                <text x="140" y="215" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">✅ DNK crosslink hosil qiladi</text>
              </svg>
              <div className="mt-2 space-y-1 text-xs text-purple-200">
                <p>• Ikki Cl⁻ <strong>yondosh</strong> (cis) pozitsiyada</p>
                <p>• Cl⁻ chiqib ketgandan so'ng DNK ga <strong>1,2-intrastrand crosslink</strong> hosil qiladi</p>
                <p>• G-G bazalari orasida bog'lanadi → replikatsiya to'xtaydi</p>
                <p>• <strong>Biologik faollik: 100%</strong></p>
              </div>
            </div>

            <div className="bg-gray-900/20 border border-gray-500/30 rounded-xl p-5">
              <h3 className="text-gray-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">❌</span> Trans-platin (FAOL EMAS)
              </h3>
              <svg viewBox="0 0 280 220" className="w-full h-52">
                <circle cx="140" cy="110" r="18" fill="#6b7280" />
                <text x="140" y="115" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">Pt²⁺</text>

                <line x1="140" y1="92" x2="140" y2="50" stroke="#3b82f6" strokeWidth="2" />
                <rect x="115" y="25" width="50" height="25" rx="5" fill="#3b82f6" opacity="0.5" />
                <text x="140" y="42" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">NH₃</text>

                <line x1="140" y1="128" x2="140" y2="170" stroke="#3b82f6" strokeWidth="2" />
                <rect x="115" y="170" width="50" height="25" rx="5" fill="#3b82f6" opacity="0.5" />
                <text x="140" y="187" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">NH₃</text>

                <line x1="122" y1="110" x2="80" y2="110" stroke="#10b981" strokeWidth="2" />
                <circle cx="66" cy="110" r="14" fill="#10b981" opacity="0.5" />
                <text x="66" y="115" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">Cl</text>

                <line x1="158" y1="110" x2="200" y2="110" stroke="#10b981" strokeWidth="2" />
                <circle cx="214" cy="110" r="14" fill="#10b981" opacity="0.5" />
                <text x="214" y="115" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">Cl</text>

                <line x1="80" y1="110" x2="200" y2="110" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                <text x="140" y="100" fill="#ef4444" fontSize="8" textAnchor="middle">180°</text>

                <text x="140" y="215" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">❌ Crosslink hosil qila olmaydi</text>
              </svg>
              <div className="mt-2 space-y-1 text-xs text-purple-200">
                <p>• Ikki Cl⁻ <strong>qarama-qarshi</strong> (trans) pozitsiyada</p>
                <p>• Cl⁻ chiqib ketgandan so'ng DNK bazalari orasida <strong>crosslink hosil qila olmaydi</strong></p>
                <p>• Geometrik jihatdan imkonsiz → <strong>biologik faol emas</strong></p>
                <p>• <strong>Biologik faollik: ~0%</strong></p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 XPS da farq:</strong> Cis- va trans-platinning Pt 4f BE qiymatlari deyarli bir xil (~72.8 eV).
            Biroq, <strong>N 1s va Cl 2p pik shakllari</strong> va <strong>valent zonasi spektri</strong> farq qilishi mumkin.
            Asosiy farqlash usuli — <strong>NMR</strong> va <strong>IR spektroskopiya</strong>.
            <br/><br/>
            <strong className="text-amber-400">💡 Qiziq fakt:</strong> Cisplatinning faolligi <strong>cis-konfiguratsiya</strong> tufayli bo'lib, bu DNK bilan crosslink hosil qilish imkonini beradi.
            Transplatin esa geometrik jihatdan DNK bilan bog'lanish uchun mos emas.</p>
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
                <th className="py-3 px-4 text-center text-violet-400">Pt²⁺ (Sisplatin)</th>
                <th className="py-3 px-4 text-center text-red-400">Pt⁴⁺</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Elektron konfiguratsiya", "d¹⁰ (5d⁹6s¹)", "d⁸", "d⁶"],
                  ["4f₇/₂ BE (eV)", "71.2", "72.8", "74.8"],
                  ["4f₅/₂ BE (eV)", "74.5", "76.1", "78.1"],
                  ["SO splitting (eV)", "3.3", "3.3", "3.3"],
                  ["Pik shakli", "Asimmetrik tail", "Simmetrik", "Simmetrik"],
                  ["FWHM (eV)", "~1.0", "~1.2", "~1.3"],
                  ["Geometriya", "FCC metall", "Tekis kvadrat", "Oktaedrik"],
                  ["Magnit", "Diamagnit", "Diamagnit", "Diamagnit (LS)"],
                  ["Misol", "Pt foil", "Sisplatin", "K₂PtCl₆"],
                  ["Biologik faollik", "Yo'q", "Ha (saraton)", "Kam"],
                  ["Kinetik", "Labil", "Inert", "Inert"],
                  ["Ligand almashinishi", "Tez", "Sekin", "Sekin"],
                  ["XPS referens", "71.2 eV", "72.8 eV", "74.8 eV"]
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
            <p><strong className="text-amber-400">💡 Diagnostika:</strong> Pt oksidlanish darajasini aniqlash uchun <strong>Pt 4f₇/₂ BE</strong> eng ishonchli ko'rsatkichdir.
            Har bir oksidlanish darajasi oshganda BE ~1.6–2.0 eV ga ortadi.
            Sisplatinda BE = 72.8 eV → <strong>Pt²⁺ tasdiqlanadi</strong>.
            <br/><br/>
            <strong className="text-amber-400">💡 Qiziq fakt:</strong> Pt⁰ (metall) uchun Pt 4f spektri <strong>asimmetrik tail</strong>ga ega bo'lib, bu metallik xususiyatni ko'rsatadi.
            Pt²⁺ va Pt⁴⁺ uchun spektlar simmetrik bo'ladi.</p>
          </div>
        </div>

        {/* ═════ DNK BILAN O'ZARO TA'SIR ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🧬</span> DNK bilan o'zaro ta'sir mexanizmi</h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Sisplatinning saratonga qarshi ta'siri <strong>DNK bilan kovalent bog'lanishga</strong> asoslangan.
              Hujayraga kirgandan so'ng, suv molekulalari Cl⁻ ligandlarini almashtiradi (<strong>akvatsiya</strong>).
              Hosil bo'lgan aktiv Pt kompleksi DNK dagi <strong>guanin (G) bazalarining N7 atomlari</strong> bilan
              bog'lanib, <strong>1,2-intrastrand G-G crosslink</strong> hosil qiladi. Bu DNK spiralini buzadi,
              replikatsiya va transkripsiyani to'xtatadi → <strong>apoptoz</strong> (hujayra o'limi).
              <br/><br/>
              <strong className="text-amber-400">💡 Qiziq fakt:</strong> Sisplatin DNK da <strong>65% 1,2-intrastrand G-G</strong>, <strong>25% 1,2-intrastrand A-G</strong>,
              <strong>5% 1,3-intrastrand G-X-G</strong>, va <strong>&lt;5% interstrand crosslink</strong> hosil qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {additionalInfo.dnaInteraction.steps.map((step, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <div className="text-2xl mb-2">{step.step}️⃣</div>
                <h3 className="text-violet-400 font-bold mb-2 text-sm">{step.title}</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  {step.description}
                </p>
                {step.equation && (
                  <p className="mt-2 text-center">
                    <span className="font-mono text-[10px] text-yellow-300 bg-purple-900/50 px-2 py-1 rounded">{step.equation}</span>
                  </p>
                )}
                {step.bindingSites && (
                  <div className="mt-2">
                    <p className="text-[10px] text-purple-400 mb-1">Bog'lanish joylari:</p>
                    <ul className="text-[10px] text-purple-300 space-y-1">
                      {step.bindingSites.map((site, j) => (
                        <li key={j}>• {site}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.types && (
                  <div className="mt-2">
                    <p className="text-[10px] text-purple-400 mb-1">Crosslink turlari:</p>
                    <ul className="text-[10px] text-purple-300 space-y-1">
                      {step.types.map((type, j) => (
                        <li key={j}>• {type}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 bg-purple-950/50 rounded-xl p-5">
            <h3 className="text-violet-400 font-bold mb-3 text-sm">XPS da kuzatiladigan o'zgarishlar</h3>
            <div className="space-y-2 text-xs text-purple-200">
              {additionalInfo.dnaInteraction.xpsChanges.map((change, i) => (
                <p key={i}>• {change}</p>
              ))}
            </div>
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
            <p><strong className="text-violet-400">💡 Nazariy nisbat:</strong> Pt(NH₃)₂Cl₂ da Pt:N:Cl = <strong>1:2:2</strong>.
            Survey XPS da bu nisbat (<strong>20:40:40 at.%</strong>) tasdiqlanadi.
            Toza sisplatin namunasi uchun C va O signallari minimal bo'lishi kerak (<strong>&lt;1 at.%</strong>).
            <br/><br/>
            <strong className="text-violet-400">💡 Qiziq fakt:</strong> Survey XPS da Cl 2p signali <strong>aqvatsiya jarayonida kamayadi</strong>,
            chunki Cl⁻ ligandlari suv bilan almashadi.</p>
          </div>
        </div>

        {/* ═════ KLINIK QO'LLANILISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🏥</span> Klinik va amaliy qoʻllanilishi</h2>

          <div className="mb-6">
            <h3 className="text-violet-400 font-bold mb-3 text-sm">🎯 Ko'rsatkichlar</h3>
            <div className="flex flex-wrap gap-2">
              {additionalInfo.clinical.indications.map((indication, i) => (
                <span key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-lg px-3 py-1 text-xs text-purple-200">
                  {indication}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">💉</div>
              <h3 className="text-violet-400 font-bold mb-2 text-sm">Dozalash va qoʻllanish</h3>
              <ul className="text-purple-200 space-y-2 text-xs">
                <li className="flex justify-between">
                  <span className="text-purple-400">Standart doza:</span>
                  <span className="font-mono">{additionalInfo.clinical.dosage.standard}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kombinatsiyada:</span>
                  <span className="font-mono">{additionalInfo.clinical.dosage.combination}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Infuziya vaqti:</span>
                  <span className="font-mono">{additionalInfo.clinical.dosage.infusionTime}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Gidratatsiya:</span>
                  <span className="font-mono">{additionalInfo.clinical.dosage.hydration}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Sikl doimiyligi:</span>
                  <span className="font-mono">Har 3–4 haftada 1 marta</span>
                </li>
              </ul>
              <div className="mt-3 bg-violet-600/10 border border-violet-500/30 rounded-lg p-2 text-[10px] text-purple-200">
                <p><strong className="text-violet-400">💡 Maslahat:</strong> Dozani <strong>buyrak funksiyasiga qarab sozlang</strong>.
                Kreatinin klirensi &lt;60 mL/min bo'lgan bemorlarda doza kamaytirilishi kerak.</p>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="text-violet-400 font-bold mb-2 text-sm">Kombinatsiya terapiyasi</h3>
              <ul className="text-purple-200 space-y-2 text-xs">
                {Object.entries(additionalInfo.clinical.combinations).map(([key, value], i) => (
                  <li key={i} className="flex justify-between">
                    <span className="text-purple-400">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-mono">{value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 bg-violet-600/10 border border-violet-500/30 rounded-lg p-2 text-[10px] text-purple-200">
                <p><strong className="text-violet-400">💡 Qiziq fakt:</strong> <strong>BEP rejimi</strong> (Bleomycin + Etoposide + Cisplatin)
                testis saratoni uchun <strong>90%+ davolanish</strong> natijasini beradi.</p>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-violet-400 font-bold mb-2 text-sm">Nojo'ya ta'sirlar</h3>
              <div className="mb-2">
                <p className="text-purple-400 text-xs mb-1">Keng tarqalgan:</p>
                <ul className="text-purple-200 space-y-1 text-xs">
                  {additionalInfo.clinical.sideEffects.common.map((effect, i) => (
                    <li key={i}>• {effect}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-purple-400 text-xs mb-1">Kam uchraydi:</p>
                <ul className="text-purple-200 space-y-1 text-xs">
                  {additionalInfo.clinical.sideEffects.rare.map((effect, i) => (
                    <li key={i}>• {effect}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 bg-amber-600/10 border border-amber-500/30 rounded-lg p-2 text-[10px] text-purple-200">
                <p><strong className="text-amber-400">⚠️ Ogohlantirish:</strong> <strong>Nefrotoksiklik</strong> asosiy cheklovdir.
                Gidratatsiya protokoli bilan nefrotoksiklik xavfi <strong>kamaytiriladi</strong>.</p>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-violet-400 font-bold mb-2 text-sm">Rezistentlik mexanizmlari</h3>
              <ul className="text-purple-200 space-y-2 text-xs">
                {additionalInfo.clinical.resistanceMechanisms.map((mechanism, i) => (
                  <li key={i}>• {mechanism}</li>
                ))}
              </ul>
              <div className="mt-3 bg-violet-600/10 border border-violet-500/30 rounded-lg p-2 text-[10px] text-purple-200">
                <p><strong className="text-violet-400">💡 Qiziq fakt:</strong> Rezistentlik <strong>DNK repair mexanizmlarining faollashuvi</strong> va
                <strong>Pt transportchi oqsilining kamayishi</strong> natijasida yuzaga keladi.</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-violet-400 font-bold mb-3 text-sm">🔄 Alternativ Pt dorilar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {additionalInfo.alternatives.map((alt, i) => (
                <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                  <h4 className="text-violet-400 font-bold mb-2 text-sm">{alt.name}</h4>
                  <p className="text-purple-400 text-xs mb-1">Formula:</p>
                  <p className="font-mono text-sm text-white mb-2">{alt.formula}</p>
                  <p className="text-purple-400 text-xs mb-1">Afzallik:</p>
                  <p className="text-purple-200 text-xs mb-2">{alt.advantage}</p>
                  <p className="text-purple-400 text-xs mb-1">Kamchilik:</p>
                  <p className="text-purple-200 text-xs mb-2">{alt.disadvantage}</p>
                  <p className="text-purple-400 text-xs mb-1">XPS (Pt 4f₇/₂):</p>
                  <p className="font-mono text-sm text-violet-400">{alt.xpsPt4f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═════ XAVFSIZLIK ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔒</span> Xavfsizlik va saqlash</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
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
            <li>Sisplatin (<strong className="text-violet-400">C₂H₆Cl₂N₂Pt</strong>) — dunyodagi <strong className="text-violet-400">eng muhim saraton dorisilaridan biri</strong> (1978-yildan beri qoʻllaniladi).</li>
            <li>Pt²⁺ (d⁸) — <strong>tekis kvadrat</strong> geometriya (D₂ₕ), <strong>diamagnit</strong> (S=0, μ<sub>eff</sub>=0 BM).</li>
            <li><strong>Pt 4f₇/₂ BE = 72.8 eV</strong> — Pt²⁺ uchun xarakterli (Pt⁰: 71.2 eV, Pt⁴⁺: 74.8 eV).</li>
            <li>SO splitting: <strong>3.3 eV</strong> (4f₇/₂ − 4f₅/₂), FWHM: ~1.2 eV.</li>
            <li><strong>Cis-konfiguratsiya</strong> biologik faollik uchun zarur (trans-izomer faol emas).</li>
            <li>DNK bilan <strong>1,2-intrastrand G-G crosslink</strong> (65%) hosil qiladi → replikatsiya to'xtaydi → <strong>apoptoz</strong>.</li>
            <li>Pt oksidlanish darajasi <strong>BE bo'yicha aniq farqlanadi</strong> (har 1+ oksidlanish darajasi uchun ~1.6–2.0 eV).</li>
            <li><strong>Kinetik inert</strong> (d⁸ tekis kvadrat) — sekin ligand almashinishi (k ≈ 10⁻³ s⁻¹).</li>
            <li>FDA 1978-yilda tasdiqlangan — <strong>testis, tuxumdon, o'pka saratonida</strong> qoʻllaniladi.</li>
            <li>XPS da <strong>Pt²⁺ standarti</strong> sifatida ishlatiladi (N 1s: 399.8 eV, Cl 2p: 198.2 eV).</li>
            <li><strong>Alternativlari:</strong> Karboplatin (72.6 eV), Oksaliplatin (72.9 eV), Nedaplatin (72.7 eV).</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/co-h2o6-2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← [Co(H₂O)₆]²⁺</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar/ferrosen" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">Keyingi: Ferrosen →</Link>
        </div>
      </section>
    </main>
  );
}