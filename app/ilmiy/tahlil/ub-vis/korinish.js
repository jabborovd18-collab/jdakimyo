"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ============================================================================
// 1. ETALON KOMPLEKSLARNING HAQIQIY EKSPERIMENTAL UB-VIS BAZASI
// ============================================================================
const SPEKTR_ETALONLARI = {
  ti_h2o6: {
    id: "ti_h2o6",
    nomi: "[Ti(H₂O)₆]³⁺ (Titan geksaakva)",
    konfig: "d¹ (t₂g¹ eg⁰)",
    simmetriya: "Oktaedrik (Oh)",
    term: "²T₂g → ²Eg",
    deltaO: 20000,
    rangi: "Binafsha-havorang",
    perceivedHex: "#a855f7",
    absorbedHex: "#eab308",
    peaks: [{ nm: 500, eps: 5.5, width: 50, label: "²T₂g → ²Eg (d–d)", ev: 2.48, cm: 20000 }],
    izoh: "d¹ konfiguratsiyadagi yagona d–d o'tish: t₂g¹ eg⁰ → t₂g⁰ eg¹. Laport-taqiqlangan (g→g), shuning uchun ε ≈ 5.5. Yutilgan sariq nur tufayli eritma binafsha ko'rinadi.",
  },
  cr_h2o6: {
    id: "cr_h2o6",
    nomi: "[Cr(H₂O)₆]³⁺ (Xrom geksaakva)",
    konfig: "d³ (t₂g³ eg⁰)",
    simmetriya: "Oktaedrik (Oh)",
    term: "⁴A₂g → ⁴T₂g, ⁴T₁g(F), ⁴T₁g(P)",
    deltaO: 17400,
    rangi: "Binafsha-yashil",
    perceivedHex: "#7c3aed",
    absorbedHex: "#84cc16",
    peaks: [
      { nm: 575, eps: 15.2, width: 42, label: "ν₁: ⁴A₂g → ⁴T₂g (= Δo)", ev: 2.16, cm: 17400 },
      { nm: 407, eps: 17.5, width: 36, label: "ν₂: ⁴A₂g → ⁴T₁g(F)", ev: 3.05, cm: 24570 },
      { nm: 260, eps: 48.0, width: 32, label: "ν₃: LMCT / ⁴T₁g(P)", ev: 4.77, cm: 38460 },
    ],
    izoh: "d³ oktaedr: 3 ta spin-ruxsat etilgan polosa. Birinchi polosa (575 nm) to'g'ridan-to'g'ri Δo ajralish energiyasini beradi (17 400 cm⁻¹). Racah parametri B = 918 cm⁻¹.",
  },
  co_nh3_6: {
    id: "co_nh3_6",
    nomi: "[Co(NH₃)₆]³⁺ (Luteo-kobalt)",
    konfig: "d⁶ LS (t₂g⁶ eg⁰)",
    simmetriya: "Oktaedrik (Oh)",
    term: "¹A₁g → ¹T₁g, ¹T₂g",
    deltaO: 22900,
    rangi: "Sariq (Luteo)",
    perceivedHex: "#facc15",
    absorbedHex: "#3b82f6",
    peaks: [
      { nm: 475, eps: 60.0, width: 40, label: "ν₁: ¹A₁g → ¹T₁g", ev: 2.61, cm: 21050 },
      { nm: 340, eps: 55.0, width: 35, label: "ν₂: ¹A₁g → ¹T₂g", ev: 3.65, cm: 29410 },
    ],
    izoh: "Past spinli d⁶ oktaedr: ¹A₁g asosiy holatdan 2 ta yakkalik termga d–d o'tish (475 nm ko'k nurni yutadi → sariq ko'rinadi). Racah B = 615 cm⁻¹, β = 0.66.",
  },
  co_cl4: {
    id: "co_cl4",
    nomi: "[CoCl₄]²⁻ (Tetraxlorokobaltat)",
    konfig: "d⁷ (e⁴ t₂³)",
    simmetriya: "Tetraedrik (Td)",
    term: "⁴A₂ → ⁴T₁(P)",
    deltaO: 3300,
    rangi: "To'q moviy-ko'k",
    perceivedHex: "#1d4ed8",
    absorbedHex: "#f97316",
    peaks: [{ nm: 660, eps: 650.0, width: 60, label: "⁴A₂ → ⁴T₁(P) (Laport qisman ruxsat)", ev: 1.88, cm: 15150 }],
    izoh: "Tetraedrik Td simmetriyada inversiya markazi (i) yo'q! Bu Laport taqiqini yechadi va ekstinksiya ε ≈ 650 ga yetadi — oktaedrlarga nisbatan 50 barobar kuchli to'q ko'k rang!",
  },
  cu_h2o6: {
    id: "cu_h2o6",
    nomi: "[Cu(H₂O)₆]²⁺ (Mis geksaakva)",
    konfig: "d⁹ (t₂g⁶ eg³)",
    simmetriya: "Oktaedr (D₄h Yan-Teller)",
    term: "²B₁g → ²A₁g, ²B₂g, ²Eg",
    deltaO: 12500,
    rangi: "Havorang (Moviy)",
    perceivedHex: "#38bdf8",
    absorbedHex: "#ea580c",
    peaks: [{ nm: 800, eps: 12.5, width: 95, label: "²B₁g → ²Eg (Yan-Teller assimetrik)", ev: 1.55, cm: 12500 }],
    izoh: "d⁹ konfiguratsiyada eg orbitallari notekis to'lgan (eg³). Kuchli Yan-Teller cho'zilishi tufayli 800 nm (NIR) da keng assimetrik polosa hosil bo'lib, qizil-sariq nurni yutadi.",
  },
  kmno4: {
    id: "kmno4",
    nomi: "KMnO₄ (Kaliy permanganat)",
    konfig: "d⁰ (Mn⁷⁺)",
    simmetriya: "Tetraedrik (Td)",
    term: "LMCT (O 2p → Mn 3d)",
    deltaO: 0,
    rangi: "To'q binafsha (Fuksiya)",
    perceivedHex: "#9333ea",
    absorbedHex: "#84cc16",
    peaks: [
      { nm: 525, eps: 2400.0, width: 26, label: "LMCT t₁ → 2e (¹A₁ → ¹T₂)", ev: 2.36, cm: 19050 },
      { nm: 545, eps: 2300.0, width: 26, label: "LMCT vibronik polosa", ev: 2.28, cm: 18350 },
      { nm: 315, eps: 1800.0, width: 32, label: "LMCT t₁ → 4t₂", ev: 3.94, cm: 31750 },
    ],
    izoh: "Mn⁷⁺ d⁰ ionida d-elektron yo'q, shuning uchun d–d o'tishlar bo'lmaydi! Permanganatning o'ta kuchli binafsha rangi to'liq LMCT (Kislorod 2p dan Marganets 3d ga) zaryad ko'chishi tufaylidir (ε > 2400).",
  },
  ru_bpy3: {
    id: "ru_bpy3",
    nomi: "[Ru(bpy)₃]²⁺ (Ruteniy-tris-bipiridil)",
    konfig: "d⁶ LS (Ru²⁺)",
    simmetriya: "Oktaedrik (D₃)",
    term: "MLCT (Ru dπ → bpy π*)",
    deltaO: 28600,
    rangi: "To'q qizil-to'q sariq",
    perceivedHex: "#dc2626",
    absorbedHex: "#10b981",
    peaks: [
      { nm: 452, eps: 14600.0, width: 38, label: "MLCT (Ru d → bpy π*)", ev: 2.74, cm: 22120 },
      { nm: 285, eps: 87000.0, width: 30, label: "IL π → π* (bpy ligand)", ev: 4.35, cm: 35090 },
    ],
    izoh: "Zamonaviy quyosh batareyalari (DSSC) va fotokatalizning yuragi: 452 nm da o'ta kuchli MLCT (Metalldan Ligandga Zaryad Ko'chishi, ε = 14 600) va kuchli lyuminessensiya beradi.",
  },
};

// ============================================================================
// 2. LIGANDLARNING SPEKTROXIMIK VA NEFELAUKSETIK PARAMETRLARI
// ============================================================================
const SPEKTROXIMIK_LIGANDLAR = [
  { nom: "I⁻", f: 0.70, beta: 0.35, tur: "Zaif maydon (kuchli π-donor)", rang: "text-red-400" },
  { nom: "Br⁻", f: 0.76, beta: 0.40, tur: "Zaif maydon (π-donor)", rang: "text-red-400" },
  { nom: "S²⁻", f: 0.80, beta: 0.45, tur: "Zaif maydon (π-donor)", rang: "text-red-400" },
  { nom: "SCN⁻", f: 0.85, beta: 0.50, tur: "Zaif maydon", rang: "text-amber-400" },
  { nom: "Cl⁻", f: 0.88, beta: 0.55, tur: "Zaif maydon (π-donor)", rang: "text-amber-400" },
  { nom: "F⁻", f: 0.90, beta: 0.60, tur: "Kuchsiz maydon", rang: "text-amber-400" },
  { nom: "OH⁻", f: 0.94, beta: 0.65, tur: "Kuchsiz maydon", rang: "text-amber-400" },
  { nom: "H₂O", f: 1.00, beta: 1.00, tur: "Standart etalon (1.00)", rang: "text-cyan-400" },
  { nom: "NCS⁻", f: 1.02, beta: 0.70, tur: "N-koordinatsiyalangan", rang: "text-cyan-400" },
  { nom: "NH₃", f: 1.25, beta: 0.80, tur: "Kuchli maydon (σ-donor)", rang: "text-emerald-400" },
  { nom: "en", f: 1.28, beta: 0.82, tur: "Xelat kuchli maydon", rang: "text-emerald-400" },
  { nom: "bpy", f: 1.33, beta: 0.85, tur: "Kuchli (π-akseptor)", rang: "text-purple-400" },
  { nom: "NO₂⁻", f: 1.40, beta: 0.88, tur: "Kuchli maydon (Nitro)", rang: "text-purple-400" },
  { nom: "CN⁻", f: 1.70, beta: 0.50, tur: "Juda kuchli maydon", rang: "text-purple-400" },
  { nom: "CO", f: 1.90, beta: 0.40, tur: "Eng kuchli π-akseptor", rang: "text-[var(--v3-urgu)]" },
];

const ERITUVCHILAR_CUTOFF = [
  { nom: "Suv (H₂O)", cutoff: 190, qutblilik: 10.2, izoh: "Anorganik komplekslar uchun universal, 190 nm gacha shaffof" },
  { nom: "Asetonitril (MeCN)", cutoff: 190, qutblilik: 5.8, izoh: "Elektrokimyo va koordinatsion kimyoda ajoyib qutbli erituvchi" },
  { nom: "Geksan (C₆H₁₄)", cutoff: 195, qutblilik: 0.1, izoh: "Qutbsiz metallosenlar (Ferrosen) va karbonillar uchun" },
  { nom: "Metanol (MeOH)", cutoff: 205, qutblilik: 5.1, izoh: "Ko'p organik ligandlar va tuzlar eriydi" },
  { nom: "Etanol (EtOH)", cutoff: 205, qutblilik: 5.2, izoh: "Standart optik toza spektral erituvchi" },
  { nom: "Dixlormetan (CH₂Cl₂)", cutoff: 233, qutblilik: 3.1, izoh: "Kationik komplekslar va xelatlar uchun" },
  { nom: "Xloroform (CHCl₃)", cutoff: 240, qutblilik: 4.1, izoh: "Stabil komplekslar uchun (UV-Vis da 245 nm dan yuqori)" },
  { nom: "Dimetilsulfoksid (DMSO)", cutoff: 268, qutblilik: 7.2, izoh: "Kuchli erituvchi, lekin 270 nm dan pastda yutadi" },
];

// Gauss Egri Chizig'ini Hisoblash Yordamchisi
function hisoblaGaussSpektr(peaks, isFilled = false) {
  const maxEps = peaks[0]?.eps > 500 ? 3000 : 80;
  const points = [];
  if (isFilled) points.push("M 50 200");
  for (let nm = 200; nm <= 1000; nm += 4) {
    const x = 50 + ((nm - 200) / 800) * 730;
    let totalEps = 0;
    peaks.forEach((p) => {
      totalEps += p.eps * Math.exp(-Math.pow((nm - p.nm) / p.width, 2));
    });
    const y = 200 - (totalEps / maxEps) * 180;
    points.push(`${!isFilled && nm === 200 ? "M" : "L"} ${x} ${Math.max(20, Math.min(200, y))}`);
  }
  if (isFilled) points.push("L 780 200 Z");
  return points.join(" ");
}

export default function UBVisKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // 1. Spektr Simulyatori Holatlari
  const [faolEtalonKey, setFaolEtalonKey] = useState("ti_h2o6");
  const [kursorNm, setKursorNm] = useState(500);

  // 2. Beer-Lambert Kalkulyatori
  const [blKonsentratsiya, setBlKonsentratsiya] = useState(0.001); // mol/L
  const [blEkstinksiya, setBlEkstinksiya] = useState(5000); // M^-1 cm^-1
  const [blKyuvaQalinligi, setBlKyuvaQalinligi] = useState(1.0); // cm

  // 3. Tanabe-Sugano Holatlari
  const [faolDKonfig, setFaolDKonfig] = useState("d3");
  const [deltaOB, setDeltaOB] = useState(25); // Delta_o / B

  const etalon = SPEKTR_ETALONLARI[faolEtalonKey] || SPEKTR_ETALONLARI.ti_h2o6;

  // Joriy to'lqin uzunligidagi hisoblar
  const fotonEnergiyaEV = (1240 / Math.max(1, kursorNm)).toFixed(2);
  const tolqinSoniCm = Math.round(10000000 / Math.max(1, kursorNm));
  const fotonKJmol = Math.round(119627 / Math.max(1, kursorNm));

  // Beer-Lambert Hisobi
  const blAbsorbsiya = (blEkstinksiya * blKonsentratsiya * blKyuvaQalinligi).toFixed(3);
  const blOtkazuvchanlik = (Math.pow(10, -Number(blAbsorbsiya)) * 100).toFixed(2);

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200"
    >
      {/* ─── YUQORI HEADER ─── */}
      <header className="sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[var(--v3-fon-2)]/90 border-[var(--v3-chiziq)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ilmiy/tahlil"
            className="v3-tugma text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Tahlil usullari ro'yxatiga qaytish"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Tahlil Usullari</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)]">
              <Ikon nom="nurlar" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                UB-Vis Spektroskopiyasi (Ultrabinafsha-Ko{"'"}rinuvchi)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Elektron spektroskopiya, d–d va CT o{"'"}tishlar, Tanabe-Sugano diagrammalari va Beer-Lambert
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ilmiy/tahlil/ub-vis/birikmalar"
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md"
          >
            <Ikon nom="kolba" olcham={14} />
            <span>16 Ta Kompleks Bazasini Ko{"'"}rish</span>
            <Ikon nom="ong" olcham={12} />
          </Link>
          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
        </div>
      </header>

      {/* ─── ASOSIY MAZMUN ─── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* ─── HERO: 16 TA BIRIKMALAR KATALOGIGA LINK ─── */}
        <Link
          href="/ilmiy/tahlil/ub-vis/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="nurlar" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>16 ta kompleks birikma katalogi</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Kompleks Birikmalarning UB-Vis Spektrlari Bazasini Ochish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                [Cu(H₂O)₆]²⁺, [Co(NH₃)₆]³⁺, [Cr(H₂O)₆]³⁺, [CoCl₄]²⁻, [Fe(CO)₅], Sisplatin va boshqa birikmalarning
                haqiqiy yutilish to{"'"}lqin uzunliklari (λmax), ekstinksiyalari (ε), d–d va LMCT/MLCT tasmalar tahlili.
              </p>
            </div>
          </div>

          <div className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-5 font-bold flex items-center gap-1.5 shrink-0 group-hover:shadow-lg">
            <span>Bazasini Ko{"'"}rish</span>
            <Ikon nom="ong" olcham={14} />
          </div>
        </Link>

        {/* ─── 1. KISQA NAZARIY ASOS VA ELEKTRON O'TISHLARINING KVANT MEXANIKASI ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1 pb-3 border-b border-[var(--v3-chiziq)]">
            <div className="v3-nishon text-[var(--v3-urgu)]">Fundamental Kvant Nazariyasi</div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>Elektron Spektroskopiyaning Fizik Mohiyati</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed space-y-2">
            <p>
              <strong className="text-[var(--v3-urgu)]">UB-Vis spektroskopiyasi</strong> — molekula va ionlarning
              ultrabinafsha (200 ... 400 nm) hamda ko{"'"}rinadigan (400 ... 780 nm) sohadagi fotonlarni yutib,
              elektronlarni quyi energetik sathlardan yuqori bo{"'"}sh sathlarga o{"'"}tkazishini o{"'"}rganuvchi metoddir.
            </p>
            <p className="font-mono text-xs text-cyan-400">
              E = h·ν = h·c / λ = h·c·ν̃ &nbsp;|&nbsp; 1 eV = 8065.5 cm⁻¹ = 96.485 kJ/mol
            </p>
          </div>

          {/* 4 Asosiy O'tish Turlari Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="text-purple-400 font-bold text-sm">d–d O{"'"}tishlar (dd)</div>
              <div className="text-[11px] text-[var(--v3-xira)]">ε = 1 ... 100 M⁻¹cm⁻¹</div>
              <p className="text-[11px] text-[var(--v3-matn)] leading-relaxed font-sans">
                Metallning d-orbitallari ichida (t₂g → eg). Laport taqiqlangan (g→g), shuning uchun intensivligi past.
                Kompleksning rangini belgilaydi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="text-red-400 font-bold text-sm">LMCT Zaryad Ko{"'"}chishi</div>
              <div className="text-[11px] text-[var(--v3-xira)]">ε = 1000 ... 50 000 M⁻¹cm⁻¹</div>
              <p className="text-[11px] text-[var(--v3-matn)] leading-relaxed font-sans">
                Ligand orbitalidan metallning bo{"'"}sh orbitaliga ko{"'"}chish (masalan KMnO₄). Laport va spin ruxsat etilgan, o{"'"}ta kuchli!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="text-amber-400 font-bold text-sm">MLCT Zaryad Ko{"'"}chishi</div>
              <div className="text-[11px] text-[var(--v3-xira)]">ε = 1000 ... 25 000 M⁻¹cm⁻¹</div>
              <p className="text-[11px] text-[var(--v3-matn)] leading-relaxed font-sans">
                Metalldan ligandning bo{"'"}sh π* orbitaliga ko{"'"}chish (masalan [Ru(bpy)₃]²⁺). π-akseptor ligandlarda yuz beradi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="text-emerald-400 font-bold text-sm">IL (Ligand Ichi π→π*)</div>
              <div className="text-[11px] text-[var(--v3-xira)]">ε &gt; 10 000 M⁻¹cm⁻¹</div>
              <p className="text-[11px] text-[var(--v3-matn)] leading-relaxed font-sans">
                Aromatik ligandlarning o{"'"}z ichidagi π→π* va n→π* o{"'"}tishlari. Far UV (200 ... 300 nm) sohada kuzatiladi.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 2. JONLI INTERAKTIV SPEKTR SIMULYATORI VA GAUSS EGRIDAGI KVANT TAHLILI ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
            <div>
              <div className="v3-nishon text-[var(--v3-urgu)]">Spektral Laboratoriya</div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="nurlar" olcham={22} className="text-[var(--v3-urgu)]" />
                <span>Interaktiv 200–1000 nm Spektr Dekonvolyutsiyasi</span>
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-[var(--v3-xira)] hidden md:inline">Kompleks:</span>
              <select
                value={faolEtalonKey}
                onChange={(e) => setFaolEtalonKey(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl border text-xs font-mono font-bold bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] focus:outline-none focus:border-[var(--v3-urgu)] cursor-pointer"
              >
                {Object.entries(SPEKTR_ETALONLARI).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[var(--v3-fon-2)] text-[var(--v3-matn)]">
                    {v.nomi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Spektr Chizmasi va Ko'rsatkichlar */}
          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-5">
            {/* Kompleks va Term Ma'lumotlari */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pb-3 border-b border-[var(--v3-chiziq)]">
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: etalon.perceivedHex }} />
                <span className="font-bold text-[var(--v3-matn)] text-sm">{etalon.nomi}</span>
                <span className="text-[var(--v3-xira)]">({etalon.simmetriya})</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">{etalon.konfig}</span>
                <span className="text-[var(--v3-urgu)] font-bold">
                  {etalon.deltaO > 0 ? `Δo = ${etalon.deltaO.toLocaleString()} cm⁻¹` : "LMCT / MLCT"}
                </span>
              </div>
            </div>

            {/* SVG Spektr Grafigi */}
            <div className="relative w-full h-64 sm:h-72 select-none">
              <svg viewBox="0 0 800 240" className="w-full h-full" preserveAspectRatio="none">
                {/* Fon Gorizontal To'rlari */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((v) => {
                  const y = 200 - v * 180;
                  return (
                    <g key={v}>
                      <line x1="50" y1={y} x2="780" y2={y} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="12" y={y + 4} fill="currentColor" opacity="0.45" fontSize="10" fontFamily="monospace">
                        {(v * (etalon.peaks[0]?.eps > 500 ? 3000 : 80)).toFixed(0)}
                      </text>
                    </g>
                  );
                })}

                {/* To'lqin Uzunligi Vertikal O'qlari */}
                {[200, 300, 400, 500, 600, 700, 800, 900, 1000].map((nm) => {
                  const x = 50 + ((nm - 200) / 800) * 730;
                  return (
                    <g key={nm}>
                      <line x1={x} y1="20" x2={x} y2="200" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                      <text x={x - 12} y="222" fill="currentColor" opacity="0.55" fontSize="10" fontFamily="monospace">
                        {nm}
                      </text>
                    </g>
                  );
                })}

                {/* Spektr Egri Chizig'i */}
                <path
                  d={hisoblaGaussSpektr(etalon.peaks, false)}
                  fill="none"
                  stroke={etalon.perceivedHex || "#f43f5e"}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Soya Maydoni */}
                <path
                  d={hisoblaGaussSpektr(etalon.peaks, true)}
                  fill={etalon.perceivedHex || "#f43f5e"}
                  fillOpacity="0.15"
                />

                {/* Kursor Interaktiv Chizig'i */}
                {(() => {
                  const x = 50 + ((kursorNm - 200) / 800) * 730;
                  return (
                    <g>
                      <line x1={x} y1="20" x2={x} y2="200" stroke="#facc15" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx={x} cy="110" r="5" fill="#facc15" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Slayder va Ko'rsatkichlar */}
            <div className="space-y-2 pt-2 border-t border-[var(--v3-chiziq)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2 text-[var(--v3-xira)]">
                <div>
                  To{"'"}lqin uzunligi (λ): <strong className="text-[var(--v3-matn)] font-bold text-sm">{kursorNm} nm</strong>
                </div>
                <div className="flex items-center gap-3">
                  <span>Energiya: <strong className="text-cyan-400 font-bold">{fotonEnergiyaEV} eV</strong> ({fotonKJmol} kJ/mol)</span>
                  <span>To{"'"}lqin soni: <strong className="text-emerald-400 font-bold">{tolqinSoniCm.toLocaleString()} cm⁻¹</strong></span>
                </div>
              </div>

              <input
                type="range"
                min="200"
                max="1000"
                step="2"
                value={kursorNm}
                onChange={(e) => setKursorNm(Number(e.target.value) || 500)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-[var(--v3-xira)]">
                <span>200 nm (Far UV)</span>
                <span>400 nm (Binafsha)</span>
                <span>500 nm (Ko'k)</span>
                <span>600 nm (Sariq)</span>
                <span>700 nm (Qizil)</span>
                <span>1000 nm (NIR)</span>
              </div>
            </div>

            {/* Spektrdagi Cho'qqilar Tafsilotlari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {etalon.peaks.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] space-y-1 font-mono text-xs"
                >
                  <div className="text-[var(--v3-urgu)] font-bold flex items-center justify-between">
                    <span>{p.label}</span>
                    <span className="text-[10px] text-[var(--v3-xira)]">{p.nm} nm</span>
                  </div>
                  <div className="text-[11px] text-[var(--v3-xira)]">
                    ε = {p.eps} M⁻¹cm⁻¹ | E = {p.ev} eV ({p.cm.toLocaleString()} cm⁻¹)
                  </div>
                </div>
              ))}
            </div>

            {/* Ilmiy Tushuntirish */}
            <div className="p-4 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)] leading-relaxed">
              <strong className="text-[var(--v3-urgu)] font-bold">Kvant-mexanik tahlil: </strong>
              {etalon.izoh}
            </div>
          </div>
        </section>

        {/* ─── 3. BEER-LAMBERT QONUNI LAB-KALKULYATORI VA KYUVETA ZICHLIGI (A = ε · c · l) ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1 pb-3 border-b border-[var(--v3-chiziq)]">
            <div className="v3-nishon text-[var(--v3-urgu)]">Miqdoriy Spektrofotometriya</div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kolba" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>Beer-Lambert Qonuni va Optik Zichlik Simulyatori</span>
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-2">
            <div className="text-2xl sm:text-3xl font-mono font-black text-[var(--v3-urgu)] tracking-wider">
              A = ε · c · l &nbsp;|&nbsp; T = 10⁻ᴬ × 100%
            </div>
            <p className="text-xs text-[var(--v3-xira)] max-w-xl mx-auto">
              Optik zichlik ($A$), molyar ekstinksiya koeffitsienti ($\varepsilon$), eritma konsentratsiyasi ($c$)
              va kyuveta qalinligi ($l$) o{"'"}rtasidagi qonuniyat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Konsentratsiya (c):</span>
                <strong className="text-[var(--v3-matn)]">{(blKonsentratsiya * 1000).toFixed(2)} mM</strong>
              </div>
              <input
                type="range"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={blKonsentratsiya}
                onChange={(e) => setBlKonsentratsiya(Number(e.target.value) || 0.001)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Ekstinksiya (ε):</span>
                <strong className="text-[var(--v3-matn)]">{blEkstinksiya.toLocaleString()} M⁻¹cm⁻¹</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50000"
                step="50"
                value={blEkstinksiya}
                onChange={(e) => setBlEkstinksiya(Number(e.target.value) || 1000)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Kyuveta qalinligi (l):</span>
                <strong className="text-[var(--v3-matn)]">{blKyuvaQalinligi.toFixed(1)} cm</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={blKyuvaQalinligi}
                onChange={(e) => setBlKyuvaQalinligi(Number(e.target.value) || 1.0)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Hisoblangan Optik Zichlik (Absorbance):</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">
                A = {blAbsorbsiya}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Nur O{"'"}tkazuvchanligi (Transmittance):</div>
              <div className="text-lg font-bold text-cyan-400">
                T = {blOtkazuvchanlik}%
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. LIGANDLARNING SPEKTROXIMIK VA NEFELAUKSETIK QATORI ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1 pb-3 border-b border-[var(--v3-chiziq)]">
            <div className="v3-nishon text-[var(--v3-urgu)]">Kristall Maydon Nazariyasi</div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>Ligandlarning Spektroximik va Nefelauksetik Qatori</span>
            </h2>
            <p className="text-xs text-[var(--v3-xira)]">
              Ligandlarning kristall maydonni yorish kuchi ($f$) va kovalentlik nefelauksetik koeffitsienti ($\beta = B'/B_0$):
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono text-center">
            {SPEKTROXIMIK_LIGANDLAR.map((lig) => (
              <div
                key={lig.nom}
                className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)] transition-all space-y-1"
              >
                <div className={`text-base font-bold ${lig.rang}`}>{lig.nom}</div>
                <div className="text-[11px] text-[var(--v3-matn)]">f = {lig.f.toFixed(2)} | β = {lig.beta.toFixed(2)}</div>
                <div className="text-[9.5px] text-[var(--v3-xira)] truncate">{lig.tur}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)] leading-relaxed space-y-2 font-mono">
            <div>
              <strong className="text-[var(--v3-urgu)]">Metall kationlarining spektroximik qatori (Δo oshib borishi):</strong>
              <div className="text-[11px] text-cyan-400 mt-1">
                Mn²⁺ &lt; Ni²⁺ &lt; Co²⁺ &lt; Fe²⁺ &lt; V²⁺ &lt; Fe³⁺ &lt; Cr³⁺ &lt; Co³⁺ &lt; Ru³⁺ &lt; Pt⁴⁺
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. ERITUVCHILAR CUT-OFF VA SPEKTROMETR APPARATURASI ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1 pb-3 border-b border-[var(--v3-chiziq)]">
            <div className="v3-nishon text-[var(--v3-urgu)]">Laboratoriya Metodologiyasi</div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>Optik Erituvchilarning UB Chegarasi (Cut-off Wavelengths)</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Erituvchi Nomi</th>
                  <th className="py-2.5 px-3">UB Cut-off (λmin)</th>
                  <th className="py-2.5 px-3">Qutblilik (εr)</th>
                  <th className="py-2.5 px-3">Amaliy Qo{"'"}llanilishi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {ERITUVCHILAR_CUTOFF.map((er, idx) => (
                  <tr key={idx} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{er.nom}</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{er.cutoff} nm</td>
                    <td className="py-2.5 px-3 text-emerald-400">{er.qutblilik}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)] font-sans">{er.izoh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── 6. NAVIGATSIYA FOOTER ─── */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Tahlil Usullari Katalogi</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/ub-vis/birikmalar"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>16 Ta Birikma Bazasiga O{"'"}tish</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
