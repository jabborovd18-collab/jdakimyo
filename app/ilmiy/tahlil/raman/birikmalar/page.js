"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// RAMAN SPEKTROSKOPIYA — KOMPLEKS BIRIKMALAR KATALOGI
// Ma'lumotlar o'quv va spektral yo'naltirish maqsadida berilgan. Chastotalar
// namuna fazasi, qarshi ion, gidratlanish, lazer λ va koordinatsion muhitga qarab siljishi mumkin.
// Asosiy adabiyotlar: K. Nakamoto (2009); J.R. Ferraro et al. (2003); D.A. Long (2002).
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  {
    id: "k3-fe-cn6",
    slug: "k3-fe-cn6",
    formula: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
    plain: "K3[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(III)",
    commonName: "Qizil qon tuzi",
    metal: "Fe³⁺",
    dConfig: "d⁵, past spin",
    geometry: "Oktaedrik (O<sub>h</sub>)",
    ligand: "Sianido (CN⁻)",
    category: "Sianido kompleks",
    intensity: "Juda kuchli",
    color: "rose",
    fingerprint: "ν(C≡N) ≈ 2130 sm⁻¹",
    metalLigand: "ν(Fe–C) ≈ 390 sm⁻¹",
    symmetry: "A<sub>1g</sub> ν(C≡N) simmetrik cho'zilishi Raman da kuchli",
    ramanWhy:
      "Kuchli π-akseptor CN⁻ ligandi va yuqori simmetriya C≡N simmetrik cho'zilishining qutblanuvchanligini sezilarli o'zgartiradi.",
    application:
      "Fe(II)/Fe(III) redoks juftini va CN⁻ koordinatsiyasini kuzatish",
    tags: ["Fe", "CN⁻", "redoks", "O<sub>h</sub>"],
  },
  {
    id: "k4-fe-cn6",
    slug: "k4-fe-cn6",
    formula: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]",
    plain: "K4[Fe(CN)6]",
    iupac: "Kaliy geksatsianoferrat(II)",
    commonName: "Sariq qon tuzi",
    metal: "Fe²⁺",
    dConfig: "d⁶, past spin",
    geometry: "Oktaedrik (O<sub>h</sub>)",
    ligand: "Sianido (CN⁻)",
    category: "Sianido kompleks",
    intensity: "Juda kuchli",
    color: "amber",
    fingerprint: "ν(C≡N) ≈ 2098 sm⁻¹",
    metalLigand: "ν(Fe–C) ≈ 380 sm⁻¹",
    symmetry: "A<sub>1g</sub> simmetrik ν(C≡N) — dominant Raman chizig'i",
    ramanWhy:
      "Fe(II) markazidan CN⁻ ga kuchliroq π-back-donatsiya C≡N bog'ini zaiflashtiradi; shu sababli ν(C≡N) ferritsianidnikidan pastda.",
    application: "Oksidlanish darajasini Raman siljishi bilan farqlash",
    tags: ["Fe", "CN⁻", "redoks", "O<sub>h</sub>"],
  },
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formula: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
    plain: "[Co(NH3)6]Cl3",
    iupac: "Geksaamminkobalt(III) xlorid",
    commonName: "Luteo-kobalt",
    metal: "Co³⁺",
    dConfig: "d⁶, past spin",
    geometry: "Oktaedrik (O<sub>h</sub>)",
    ligand: "Amm(in) (NH₃)",
    category: "Verner kompleksi",
    intensity: "O'rtacha",
    color: "sky",
    fingerprint: "ν(Co–N) ≈ 500 sm⁻¹",
    metalLigand: "δ(N–Co–N) ≈ 250–350 sm⁻¹",
    symmetry:
      "A<sub>1g</sub> va E<sub>g</sub> Co–N normal tebranishlari Raman-faol",
    ramanWhy:
      "Markaz-simmetrik O<sub>h</sub> geometriyada to'la simmetrik Co–N cho'zilishi dipolni kam, qutblanuvchanlikni esa kuchli o'zgartiradi.",
    application:
      "Oktaedrik koordinatsiya va Verner nazariyasi namunasini tasdiqlash",
    tags: ["Co", "NH₃", "Werner", "O<sub>h</sub>"],
  },
  {
    id: "sisplatin",
    slug: "sisplatin",
    formula: "cis-[PtCl<sub>2</sub>(NH<sub>3</sub>)<sub>2</sub>]",
    plain: "cis-[PtCl2(NH3)2]",
    iupac: "Sis-diammin-dixloroplatina(II)",
    commonName: "Sisplatin",
    metal: "Pt²⁺",
    dConfig: "d⁸",
    geometry: "Kvadrat-planar (C<sub>2v</sub>)",
    ligand: "Xloro va amm(in)",
    category: "Bioanorganik",
    intensity: "O'rtacha",
    color: "violet",
    fingerprint: "ν(Pt–Cl) ≈ 330 sm⁻¹",
    metalLigand: "ν(Pt–N) ≈ 520 sm⁻¹",
    symmetry:
      "C<sub>2v</sub> da Pt–Cl normal tebranishlari IQ va Raman da faol bo'lishi mumkin",
    ramanWhy:
      "Markaziy simmetriyaning yo'qligi hamda og'ir Pt atomi bilan bog'langan polarizatsiyalanuvchi Cl⁻ ligandi past chastotali aniq chiziqlar beradi.",
    application:
      "Dori moddasining gidrolizi va Pt–Cl/Pt–N ligand almashinuvini kuzatish",
    tags: ["Pt", "dori", "C<sub>2v</sub>", "Pt–Cl"],
  },
  {
    id: "ferrosen",
    slug: "ferrosen",
    formula: "Fe(η<sup>5</sup>-C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>",
    plain: "Fe(C5H5)2",
    iupac: "Bis(η⁵-siklopentadienil)temir(II)",
    commonName: "Ferrosen",
    metal: "Fe²⁺",
    dConfig: "d⁶",
    geometry: "Sandvich kompleks (D<sub>5d</sub>/D<sub>5h</sub>)",
    ligand: "η⁵-Siklopentadienil",
    category: "Organometall",
    intensity: "Kuchli",
    color: "orange",
    fingerprint: "ν(C–C)<sub>Cp</sub> ≈ 1105 sm⁻¹",
    metalLigand: "ν(Fe–Cp) ≈ 305 sm⁻¹",
    symmetry:
      'Halqaning A<sub>1g</sub>-tipidagi "nafas" tebranishlari juda Raman-faol',
    ramanWhy:
      "Keng π-elektron tizimi va yuqori simmetriya Cp halqasi tebranishlari paytida katta qutblanuvchanlik modulyatsiyasini beradi.",
    application:
      "Sandvich geometriyasi, Cp koordinatsiyasi va ferrosenil materiallar tahlili",
    tags: ["Fe", "Cp", "organometall", "sandvich"],
  },
  {
    id: "ni-cn4",
    slug: "ni-cn4",
    formula: "[Ni(CN)<sub>4</sub>]<sup>2−</sup>",
    plain: "[Ni(CN)4]2−",
    iupac: "Tetrasiyanonikkolat(II) ioni",
    commonName: "Nikkel(II) sianido kompleksi",
    metal: "Ni²⁺",
    dConfig: "d⁸, past spin",
    geometry: "Kvadrat-planar (D<sub>4h</sub>)",
    ligand: "Sianido (CN⁻)",
    category: "Sianido kompleks",
    intensity: "Juda kuchli",
    color: "cyan",
    fingerprint: "ν(C≡N) ≈ 2125 sm⁻¹",
    metalLigand: "ν(Ni–C) ≈ 420 sm⁻¹",
    symmetry:
      "A<sub>1g</sub> ν(C≡N) va metall-ligandning g-turdagi modlari Raman-faol",
    ramanWhy:
      "D<sub>4h</sub> markaziy-simmetrik strukturada simmetrik C≡N va Ni–C modlari Raman da, asimmetrik modlar IQ da ajralib ko'rinadi.",
    application:
      "Kvadrat-planar d⁸ geometriyani va Ni–CN bog'lanishini aniqlash",
    tags: ["Ni", "CN⁻", "d⁸", "D<sub>4h</sub>"],
  },
  {
    id: "cu-h2o6",
    slug: "cu-h2o6",
    formula: "[Cu(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    plain: "[Cu(H2O)6]2+",
    iupac: "Geksaakvamis(II) ioni",
    commonName: "Mis(II) akvakompleksi",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    geometry: "Yan–Teller buzilgan oktaedr",
    ligand: "Aqua (H₂O)",
    category: "Akvakompleks",
    intensity: "Kuchsiz",
    color: "blue",
    fingerprint: "ν(Cu–O) ≈ 440 sm⁻¹",
    metalLigand: "ν(Cu–O)<sub>aksial</sub> ≈ 290 sm⁻¹",
    symmetry:
      "D<sub>4h</sub>-ga yaqin buzilish ekvatorial va aksial Cu–O modlarini ajratadi",
    ramanWhy:
      "d⁹ konfiguratsiyadagi Yan–Teller effekti Cu–O bog' uzunliklarini tengsizlashtiradi; bu esa past-chastotali keng/chiziqli xususiyatlarni hosil qiladi.",
    application:
      "Suvli eritmada Cu²⁺ solvatlanishi va Yan–Teller buzilishini o'rganish",
    tags: ["Cu", "H₂O", "d⁹", "Yan–Teller"],
  },
  {
    id: "ag-nh3-2",
    slug: "ag-nh3-2",
    formula: "[Ag(NH<sub>3</sub>)<sub>2</sub>]<sup>+</sup>",
    plain: "[Ag(NH3)2]+",
    iupac: "Diamminkumush(I) ioni",
    commonName: "Tollens reaktivi",
    metal: "Ag⁺",
    dConfig: "d¹⁰",
    geometry: "Chiziqli (D<sub>∞h</sub>-ga yaqin)",
    ligand: "Amm(in) (NH₃)",
    category: "Analitik kompleks",
    intensity: "Kuchsiz",
    color: "slate",
    fingerprint: "ν(Ag–N) ≈ 375 sm⁻¹",
    metalLigand: "δ(N–Ag–N) past chastotada",
    symmetry:
      "Chiziqli simmetrik cho'zilish Raman da, asimmetrik cho'zilish esa asosan IQ da faol",
    ramanWhy:
      "Deyarli chiziqli Ag–N–N skeletida qutblanuvchanlik simmetrik cho'zilish vaqtida o'zgaradi; bu mutual-exclusion prinsipining ko'rgazmali misoli.",
    application: "Tollens reagentida Ag(I)–ammiak koordinatsiyasini tekshirish",
    tags: ["Ag", "NH₃", "Tollens", "chiziqli"],
  },
  {
    id: "co-cl4",
    slug: "co-cl4",
    formula: "[CoCl<sub>4</sub>]<sup>2−</sup>",
    plain: "[CoCl4]2−",
    iupac: "Tetraxlorokobaltat(II) ioni",
    commonName: "Kobaltat(II) xlorokompleksi",
    metal: "Co²⁺",
    dConfig: "d⁷, yuqori spin",
    geometry: "Tetraedrik (T<sub>d</sub>)",
    ligand: "Xloro (Cl⁻)",
    category: "Galogenido kompleks",
    intensity: "Kuchli",
    color: "indigo",
    fingerprint: "ν(Co–Cl) ≈ 300 sm⁻¹",
    metalLigand: "δ(Cl–Co–Cl) ≈ 150–250 sm⁻¹",
    symmetry:
      "T<sub>d</sub> da A<sub>1</sub>, E va T<sub>2</sub> Raman-faol; T<sub>2</sub> IQ da ham faol",
    ramanWhy:
      "Og'ir va oson qutblanadigan Cl⁻ ligandlari Co–Cl skeleti tebranishlarini kuchli Raman sochuvchilarga aylantiradi.",
    application:
      "Tetraedrik Co(II) xlorokompleksini suvli Co²⁺ turlaridan ajratish",
    tags: ["Co", "Cl⁻", "T<sub>d</sub>", "galogenido"],
  },
  {
    id: "fe-co5",
    slug: "fe-co5",
    formula: "Fe(CO)<sub>5</sub>",
    plain: "Fe(CO)5",
    iupac: "Pentakarboniltemir(0)",
    commonName: "Temir pentakarbonil",
    metal: "Fe⁰",
    dConfig: "d⁸ (18e⁻)",
    geometry: "Trigonal-bipiramidal (D<sub>3h</sub>)",
    ligand: "Karbonil (CO)",
    category: "Karbonil kompleks",
    intensity: "Juda kuchli",
    color: "red",
    fingerprint: "ν(C≡O) ≈ 2014, 2034 sm⁻¹",
    metalLigand: "ν(Fe–C) ≈ 415 sm⁻¹",
    symmetry: "A'<sub>1</sub> va E' CO modlari Raman spektrida sezilarli",
    ramanWhy:
      "CO ligandining katta polarizatsiyalanuvchanligi hamda Fe→CO π-back-donatsiyasi C≡O cho'zilish chastotasini va intensitetini juda sezgir qiladi.",
    application:
      "Karbonil koordinatsiyasi, terminal/ko'prik CO turlari va back-donatsiyani baholash",
    tags: ["Fe", "CO", "18e⁻", "D<sub>3h</sub>"],
  },
  {
    id: "zn-oh4",
    slug: "zn-oh4",
    formula: "[Zn(OH)<sub>4</sub>]<sup>2−</sup>",
    plain: "[Zn(OH)4]2−",
    iupac: "Tetrahidroksosinkat(II) ioni",
    commonName: "Sinkat(II)",
    metal: "Zn²⁺",
    dConfig: "d¹⁰",
    geometry: "Tetraedrik (T<sub>d</sub>)",
    ligand: "Gidroxo (OH⁻)",
    category: "Gidroksokompleks",
    intensity: "O'rtacha",
    color: "emerald",
    fingerprint: "ν(Zn–O) ≈ 480 sm⁻¹",
    metalLigand: "δ(O–Zn–O) ≈ 250–400 sm⁻¹",
    symmetry:
      "Tetraedrik A<sub>1</sub> simmetrik Zn–O cho'zilishi spektral barmoq izi",
    ramanWhy:
      "d¹⁰ Zn²⁺ markazida elektron o'tishlar bilan to'silish kam; Zn–O skelet modlari koordinatsion tur haqida bevosita axborot beradi.",
    application:
      "Ishqoriy eritmalarda sink turlarining gidroliz/komplekslanishini kuzatish",
    tags: ["Zn", "OH⁻", "d¹⁰", "T<sub>d</sub>"],
  },
  {
    id: "cr-h2o6",
    slug: "cr-h2o6",
    formula: "[Cr(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
    plain: "[Cr(H2O)6]3+",
    iupac: "Geksaakvaxrom(III) ioni",
    commonName: "Xrom(III) akvakompleksi",
    metal: "Cr³⁺",
    dConfig: "d³",
    geometry: "Oktaedrik (O<sub>h</sub>)",
    ligand: "Aqua (H₂O)",
    category: "Akvakompleks",
    intensity: "Kuchsiz",
    color: "fuchsia",
    fingerprint: "ν(Cr–O) ≈ 540 sm⁻¹",
    metalLigand: "δ(O–Cr–O) ≈ 250–400 sm⁻¹",
    symmetry:
      "A<sub>1g</sub>/E<sub>g</sub> Cr–O modlari Raman, T<sub>1u</sub> modlari IQ faol",
    ramanWhy:
      "O<sub>h</sub> simmetriyasi IQ va Raman faol tebranishlarini ajratadi; bu koordinatsion sferaning simmetriyasini sinashda qulay.",
    application:
      "Cr(III) aqua sferasining ligand almashinuvi va gidratlanishini o'rganish",
    tags: ["Cr", "H₂O", "d³", "O<sub>h</sub>"],
  },
];

const intensityStyles = {
  "Juda kuchli": "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Kuchli: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  "O'rtacha": "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Kuchsiz: "bg-purple-500/15 text-purple-300 border-purple-400/30",
};

const accentStyles = {
  rose: "from-rose-500/20 via-purple-900/40 to-slate-900/30 border-rose-400/25 hover:border-rose-300/60",
  amber:
    "from-amber-500/20 via-purple-900/40 to-slate-900/30 border-amber-400/25 hover:border-amber-300/60",
  sky: "from-sky-500/20 via-purple-900/40 to-slate-900/30 border-sky-400/25 hover:border-sky-300/60",
  violet:
    "from-violet-500/20 via-purple-900/40 to-slate-900/30 border-violet-400/25 hover:border-violet-300/60",
  orange:
    "from-orange-500/20 via-purple-900/40 to-slate-900/30 border-orange-400/25 hover:border-orange-300/60",
  cyan: "from-cyan-500/20 via-purple-900/40 to-slate-900/30 border-cyan-400/25 hover:border-cyan-300/60",
  blue: "from-blue-500/20 via-purple-900/40 to-slate-900/30 border-blue-400/25 hover:border-blue-300/60",
  slate:
    "from-slate-500/20 via-purple-900/40 to-slate-900/30 border-slate-400/25 hover:border-slate-300/60",
  indigo:
    "from-indigo-500/20 via-purple-900/40 to-slate-900/30 border-indigo-400/25 hover:border-indigo-300/60",
  red: "from-red-500/20 via-purple-900/40 to-slate-900/30 border-red-400/25 hover:border-red-300/60",
  emerald:
    "from-emerald-500/20 via-purple-900/40 to-slate-900/30 border-emerald-400/25 hover:border-emerald-300/60",
  fuchsia:
    "from-fuchsia-500/20 via-purple-900/40 to-slate-900/30 border-fuchsia-400/25 hover:border-fuchsia-300/60",
};

function Formula({ html, className = "" }) {
  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default function RamanBirikmalar() {
  const [qidiruv, setQidiruv] = useState("");
  const [category, setCategory] = useState("Barchasi");
  const [intensity, setIntensity] = useState("Barchasi");
  const [sort, setSort] = useState("nom");
  const [expanded, setExpanded] = useState(null);

  const categories = [
    "Barchasi",
    ...new Set(birikmalar.map((b) => b.category)),
  ];
  const intensities = [
    "Barchasi",
    "Juda kuchli",
    "Kuchli",
    "O'rtacha",
    "Kuchsiz",
  ];

  const filtered = useMemo(() => {
    const q = qidiruv.trim().toLowerCase();
    return birikmalar
      .filter((b) => {
        const searchable = [
          b.plain,
          b.iupac,
          b.commonName,
          b.metal,
          b.ligand,
          b.category,
          ...b.tags,
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!q || searchable.includes(q)) &&
          (category === "Barchasi" || b.category === category) &&
          (intensity === "Barchasi" || b.intensity === intensity)
        );
      })
      .sort((a, b) => {
        if (sort === "metall") return a.metal.localeCompare(b.metal);
        if (sort === "intensivlik")
          return (
            ["Juda kuchli", "Kuchli", "O'rtacha", "Kuchsiz"].indexOf(
              a.intensity,
            ) -
            ["Juda kuchli", "Kuchli", "O'rtacha", "Kuchsiz"].indexOf(
              b.intensity,
            )
          );
        return a.iupac.localeCompare(b.iupac, "uz");
      });
  }, [qidiruv, category, intensity, sort]);

  const clear = () => {
    setQidiruv("");
    setCategory("Barchasi");
    setIntensity("Barchasi");
    setSort("nom");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 border-b border-purple-700/40 bg-purple-950/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link
            href="/ilmiy/tahlil/raman"
            className="shrink-0 text-sm text-purple-300 transition-colors hover:text-sky-300 sm:text-lg"
          >
            ← Raman spektroskopiya
          </Link>
          <div className="min-w-0 border-l border-purple-700/50 pl-4">
            <h1 className="truncate text-lg font-bold text-sky-300 sm:text-2xl">
              🔆 Raman birikmalar katalogi
            </h1>
            <p className="hidden text-xs text-purple-400 sm:block">
              Kompleks birikmalar • Spektral barmoq izlari • Metall–ligand
              tebranishlari
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-900/45 via-purple-900/55 to-indigo-950 p-7 shadow-2xl shadow-sky-950/40 sm:p-10">
          <div className="absolute -right-12 -top-16 text-[12rem] opacity-[0.06]">
            🔆
          </div>
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200">
              RAMAN SPECTRAL LIBRARY · β
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Komplekslarning{" "}
              <span className="text-sky-300">tebranish barmoq izi</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-purple-200 sm:text-base">
              Har kartochkada diagnostik Raman siljishi, metall–ligand
              tebranishi, simmetriya belgisi va koordinatsion kimyodagi
              qo'llanishi jamlangan. Qidiruv va filtrlar bilan kerakli
              kompleksni tez toping.
            </p>
          </div>
          <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["12", "kompleks"],
              ["8", "metall markaz"],
              ["11", "geometriya turi"],
              ["50–2200", "sm⁻¹ diapazon"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3"
              >
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-purple-300">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-purple-700/45 bg-purple-900/35 p-5 backdrop-blur-sm sm:p-6">
          <div className="relative">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl">
              ⌕
            </span>
            <input
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Formula, IUPAC nomi, metall, ligand yoki tarixiy nom bo'yicha qidiring..."
              className="w-full rounded-2xl border border-purple-600/60 bg-purple-950/55 py-4 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-purple-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 sm:text-base"
            />
            {qidiruv && (
              <button
                onClick={() => setQidiruv("")}
                aria-label="Qidiruvni tozalash"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-purple-400 transition hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_220px]">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-purple-400">
                Kompleks sinfi
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${category === item ? "border-sky-400/60 bg-sky-500/20 text-sky-200" : "border-purple-600/45 bg-purple-950/30 text-purple-300 hover:border-purple-400"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-purple-400">
                Raman intensivligi
              </label>
              <div className="flex flex-wrap gap-2">
                {intensities.map((item) => (
                  <button
                    key={item}
                    onClick={() => setIntensity(item)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${intensity === item ? "border-sky-400/60 bg-sky-500/20 text-sky-200" : "border-purple-600/45 bg-purple-950/30 text-purple-300 hover:border-purple-400"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-purple-400">
                Saralash
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-purple-600/60 bg-purple-950/70 px-3 py-2 text-sm text-purple-100 outline-none focus:border-sky-400"
              >
                <option value="nom">Nomi bo'yicha</option>
                <option value="metall">Metall markazi</option>
                <option value="intensivlik">Intensivligi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-purple-300">
            <span className="font-bold text-white">{filtered.length}</span> ta
            kompleks ko'rsatilmoqda{" "}
            <span className="ml-1 text-purple-500">
              / jami {birikmalar.length}
            </span>
          </p>
          {(qidiruv ||
            category !== "Barchasi" ||
            intensity !== "Barchasi" ||
            sort !== "nom") && (
            <button
              onClick={clear}
              className="rounded-lg border border-purple-600/50 px-3 py-1.5 text-xs text-purple-300 transition hover:border-sky-400 hover:text-sky-200"
            >
              Filtrlarni tozalash
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-purple-700/40 bg-purple-900/25 px-6 py-20 text-center">
            <div className="text-6xl">🔎</div>
            <h3 className="mt-4 text-xl font-bold">Mos kompleks topilmadi</h3>
            <p className="mt-2 text-sm text-purple-300">
              Qidiruv so'zini yoki tanlangan filtrlarni o'zgartirib ko'ring.
            </p>
            <button
              onClick={clear}
              className="mt-5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500"
            >
              Katalogni tiklash
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.map((b) => {
              const isOpen = expanded === b.id;
              return (
                <article
                  key={b.id}
                  className={`group overflow-hidden rounded-3xl border bg-gradient-to-br ${accentStyles[b.color]} transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/25`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-400">
                          {b.category}
                        </div>
                        <Formula
                          html={b.formula}
                          className="font-mono text-2xl font-bold text-sky-200"
                        />
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${intensityStyles[b.intensity]}`}
                      >
                        {b.intensity}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold leading-snug text-white">
                      {b.iupac}
                    </h3>
                    <p className="mt-1 min-h-5 text-sm italic text-purple-300">
                      {b.commonName || "—"}
                    </p>
                    <div className="mt-5 rounded-2xl border border-sky-400/15 bg-sky-950/25 p-3.5">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                        Asosiy Raman barmoq izi
                      </div>
                      <p className="mt-1 font-mono text-sm font-bold text-yellow-200">
                        {b.fingerprint}
                      </p>
                      <p className="mt-1 text-xs text-purple-300">
                        {b.metalLigand}
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-purple-950/35 p-3">
                        <div className="text-purple-500">Metall markaz</div>
                        <div className="mt-1 font-semibold text-purple-100">
                          {b.metal} · {b.dConfig}
                        </div>
                      </div>
                      <div className="rounded-xl bg-purple-950/35 p-3">
                        <div className="text-purple-500">Geometriya</div>
                        <Formula
                          html={b.geometry}
                          className="mt-1 block font-semibold text-purple-100"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {b.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-purple-500/25 bg-purple-900/35 px-2 py-1 text-[10px] text-purple-200"
                        >
                          <Formula html={tag} />
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setExpanded(isOpen ? null : b.id)}
                      className="mt-5 flex w-full items-center justify-between rounded-xl border border-purple-500/35 bg-purple-900/25 px-4 py-2.5 text-sm font-semibold text-purple-200 transition hover:border-sky-400/60 hover:bg-sky-500/10 hover:text-sky-100"
                    >
                      <span>
                        {isOpen
                          ? "Ilmiy izohni yopish"
                          : "Raman izohini ochish"}
                      </span>
                      <span className="text-sky-300">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="mt-3 space-y-3 rounded-2xl border border-sky-400/15 bg-slate-950/30 p-4 text-xs leading-relaxed text-purple-200">
                        <div>
                          <span className="font-bold text-sky-300">
                            Simmetriya:{" "}
                          </span>
                          <Formula html={b.symmetry} />
                        </div>
                        <div>
                          <span className="font-bold text-sky-300">
                            Nega Raman da ko'rinadi:{" "}
                          </span>
                          {b.ramanWhy}
                        </div>
                        <div>
                          <span className="font-bold text-sky-300">
                            Amaliy ahamiyat:{" "}
                          </span>
                          {b.application}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/ilmiy/tahlil/raman/birikmalar/${b.slug}`}
                    className="flex items-center justify-between border-t border-white/10 bg-black/15 px-6 py-3 text-sm font-bold text-sky-200 transition hover:bg-sky-500/15 hover:text-white"
                  >
                    <span>Batafsil tahlil</span>
                    <span>→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-900/30 to-purple-900/35 p-6">
            <h2 className="text-lg font-bold text-white">
              🧭 Katalogdan qanday foydalaniladi
            </h2>
            <ol className="mt-4 space-y-2 text-sm leading-relaxed text-purple-200">
              <li>
                <span className="mr-2 font-bold text-sky-300">01.</span>Asosiy ν
                qiymatini diagnostik chiziq sifatida oling.
              </li>
              <li>
                <span className="mr-2 font-bold text-sky-300">02.</span>
                Metall–ligand sohasini (odatda 100–600 sm⁻¹) alohida baholang.
              </li>
              <li>
                <span className="mr-2 font-bold text-sky-300">03.</span>
                Simmetrik modlarni IQ spektri bilan birga solishtiring.
              </li>
              <li>
                <span className="mr-2 font-bold text-sky-300">04.</span>Chastota
                siljishlarini oksidlanish darajasi, back-donatsiya va
                koordinatsion muhit bilan bog'lang.
              </li>
            </ol>
          </div>
          <div className="rounded-3xl border border-amber-400/20 bg-amber-900/10 p-6">
            <h2 className="text-lg font-bold text-amber-200">
              ⚠️ Spektrni talqin qilish eslatmasi
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-purple-200">
              Keltirilgan qiymatlar tipik yo'nalish beruvchi chastotalardir.
              Erituvchi, konsentratsiya, qarshi ion, agregatsiya, kristall faza,
              harorat va lazer energiyasi Raman siljishi hamda chiziq shakliga
              ta'sir qiladi. Yakuniy identifikatsiyada standart namuna va
              IQ/UV-Vis/XRD kabi qo'shimcha metodlar bilan tasdiqlash zarur.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-purple-700/45 bg-purple-900/30 p-6">
          <h2 className="text-lg font-bold text-white">
            📚 Katalogning ilmiy manbalari
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-purple-300">
            <li>
              • Nakamoto, K.{" "}
              <em>
                Infrared and Raman Spectra of Inorganic and Coordination
                Compounds
              </em>
              , 6-nashr, Wiley, 2009.
            </li>
            <li>
              • Ferraro, J.R.; Nakamoto, K.; Brown, C.W.{" "}
              <em>Introductory Raman Spectroscopy</em>, 2-nashr, Academic Press,
              2003.
            </li>
            <li>
              • Long, D.A. <em>The Raman Effect</em>, Wiley, 2002.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
