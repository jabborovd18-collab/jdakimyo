"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ============================================================================
// ETALON KOMPLEKSLAR UB-VIS SPEKTR BAZASI (Gauss cho'qqilari va parametrlari)
// ============================================================================
const SPEKTR_ETALONLARI = {
  ti_h2o6: {
    nomi: "[Ti(H₂O)₆]³⁺ (Titan geksaakva)",
    konfig: "d¹ (Oh)",
    term: "²T₂g → ²Eg",
    deltaO: 20000,
    rangi: "Binafsha-havorang",
    perceivedHex: "#a855f7",
    peaks: [{ nm: 500, eps: 5.5, width: 45, type: "d-d" }],
    izoh: "d¹ konfiguratsiyaning yagona d–d o'tishi: t₂g¹ eg⁰ → t₂g⁰ eg¹. Laport-taqiqlangan (ε ≈ 5.5).",
  },
  cr_h2o6: {
    nomi: "[Cr(H₂O)₆]³⁺ (Xrom geksaakva)",
    konfig: "d³ (Oh)",
    term: "⁴A₂g → ⁴T₂g, ⁴T₁g(F), ⁴T₁g(P)",
    deltaO: 17400,
    rangi: "Binafsha-yashil",
    perceivedHex: "#7c3aed",
    peaks: [
      { nm: 575, eps: 15.0, width: 40, type: "d-d (⁴T₂g)" },
      { nm: 407, eps: 17.5, width: 35, type: "d-d (⁴T₁g)" },
      { nm: 260, eps: 45.0, width: 30, type: "LMCT" },
    ],
    izoh: "d³ oktaedr: 3 ta spin-ruxsat etilgan d–d polosa. Birinchi polosa to'g'ridan-to'g'ri Δo ni beradi (17 400 cm⁻¹).",
  },
  co_nh3_6: {
    nomi: "[Co(NH₃)₆]³⁺ (Luteo-kobalt)",
    konfig: "d⁶ LS (Oh)",
    term: "¹A₁g → ¹T₁g, ¹T₂g",
    deltaO: 22900,
    rangi: "Sariq (Luteo)",
    perceivedHex: "#facc15",
    peaks: [
      { nm: 475, eps: 60.0, width: 38, type: "d-d (¹T₁g)" },
      { nm: 340, eps: 55.0, width: 32, type: "d-d (¹T₂g)" },
    ],
    izoh: "Past spin d⁶ oktaedr: ¹A₁g asosiy holatdan 2 ta yakkalik termga d–d o'tish (475 va 340 nm).",
  },
  co_cl4: {
    nomi: "[CoCl₄]²⁻ (Tetraxlorokobaltat)",
    konfig: "d⁷ (Td)",
    term: "⁴A₂ → ⁴T₁(P)",
    deltaO: 3300,
    rangi: "To'q moviy-ko'k",
    perceivedHex: "#1d4ed8",
    peaks: [{ nm: 660, eps: 650.0, width: 55, type: "d-d (Laport ruxsat)" }],
    izoh: "Tetraedrik Td simmetriyada inversiya markazi yo'q (i yo'q) → Laport taqiqi yechiladi → ε ≈ 650 (juda kuchli ko'k rang)!",
  },
  cu_h2o6: {
    nomi: "[Cu(H₂O)₆]²⁺ (Mis geksaakva)",
    konfig: "d⁹ (Oh — Yan-Teller)",
    term: "²Eg → ²T₂g (Buzilgan)",
    deltaO: 12500,
    rangi: "Havorang (Moviy)",
    perceivedHex: "#38bdf8",
    peaks: [{ nm: 800, eps: 12.5, width: 85, type: "d-d (Yan-Teller assimetrik)" }],
    izoh: "d⁹ da eg pog'onasi notekis to'lgan (eg³) → kuchli Yan-Teller cho'zilishi tufayli 800 nm da keng assimetrik polosa hosil bo'ladi.",
  },
  kmno4: {
    nomi: "KMnO₄ (Kaliy permanganat)",
    konfig: "d⁰ (Td)",
    term: "LMCT (O 2p → Mn 3d)",
    deltaO: 0,
    rangi: "To'q binafsha (Fuksiya)",
    perceivedHex: "#9333ea",
    peaks: [
      { nm: 525, eps: 2400.0, width: 25, type: "LMCT" },
      { nm: 545, eps: 2300.0, width: 25, type: "LMCT" },
      { nm: 315, eps: 1800.0, width: 30, type: "LMCT" },
    ],
    izoh: "d⁰ da d–d o'tish yo'q! Permanganatning yorqin binafsha rangi to'liq LMCT (Liganddan Metalga Zaryad Ko'chishi) tufayli (ε > 2000).",
  },
  ru_bpy3: {
    nomi: "[Ru(bpy)₃]²⁺ (Ruteniy-tris-bipiridil)",
    konfig: "d⁶ LS (D₃)",
    term: "MLCT (Ru d → bpy π*)",
    deltaO: 28600,
    rangi: "To'q qizil-to'q sariq",
    perceivedHex: "#dc2626",
    peaks: [
      { nm: 452, eps: 14600.0, width: 35, type: "MLCT" },
      { nm: 285, eps: 87000.0, width: 28, type: "IL (π→π*)" },
    ],
    izoh: "Quyosh batareyalari va fotokatalizning asosi: 452 nm da o'ta kuchli MLCT (Metalldan Ligandga Zaryad Ko'chishi, ε = 14 600).",
  },
};

const SPEKTROXIMIK_LIGANDLAR = [
  { nom: "I⁻", f: 0.70, tur: "Zaif maydon (π-donor)", rang: "text-red-400" },
  { nom: "Br⁻", f: 0.76, tur: "Zaif maydon (π-donor)", rang: "text-red-400" },
  { nom: "S²⁻", f: 0.80, tur: "Zaif maydon (π-donor)", rang: "text-red-400" },
  { nom: "SCN⁻", f: 0.85, tur: "Zaif maydon", rang: "text-amber-400" },
  { nom: "Cl⁻", f: 0.88, tur: "Zaif maydon (π-donor)", rang: "text-amber-400" },
  { nom: "F⁻", f: 0.90, tur: "Kuchsiz maydon", rang: "text-amber-400" },
  { nom: "OH⁻", f: 0.94, tur: "Kuchsiz maydon", rang: "text-amber-400" },
  { nom: "H₂O", f: 1.00, tur: "Standart etalon (1.00)", rang: "text-cyan-400" },
  { nom: "NH₃", f: 1.25, tur: "Kuchli maydon (σ-donor)", rang: "text-emerald-400" },
  { nom: "en", f: 1.28, tur: "Xelat kuchli maydon", rang: "text-emerald-400" },
  { nom: "bpy", f: 1.33, tur: "Kuchli (π-akseptor)", rang: "text-purple-400" },
  { nom: "NO₂⁻", f: 1.40, tur: "Kuchli maydon", rang: "text-purple-400" },
  { nom: "CN⁻", f: 1.70, tur: "Juda kuchli maydon", rang: "text-purple-400" },
  { nom: "CO", f: 1.90, tur: "Eng kuchli π-akseptor", rang: "text-[var(--v3-urgu)]" },
];

// Gauss Spektr Yutilish Chizig'ini Hisoblash
function hisoblaSpektrPath(peaks, isClosed = false) {
  const maxEps = peaks[0]?.eps > 500 ? 3000 : 80;
  const points = [];
  if (isClosed) points.push("M 50 200");
  for (let nm = 200; nm <= 1000; nm += 4) {
    const x = 50 + ((nm - 200) / 800) * 730;
    let totalEps = 0;
    peaks.forEach((p) => {
      totalEps += p.eps * Math.exp(-Math.pow((nm - p.nm) / p.width, 2));
    });
    const y = 200 - (totalEps / maxEps) * 180;
    points.push(`${!isClosed && nm === 200 ? "M" : "L"} ${x} ${Math.max(20, Math.min(200, y))}`);
  }
  if (isClosed) points.push("L 780 200 Z");
  return points.join(" ");
}

export default function UBVisKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // 1. Spektr Simulyatori Holatlari
  const [faolEtalonKey, setFaolEtalonKey] = useState("ti_h2o6");
  const [kursorNm, setKursorNm] = useState(500);
  const [bosilganNm, setBosilganNm] = useState(null);

  // 2. Beer-Lambert Kalkulyatori
  const [blKonsentratsiya, setBlKonsentratsiya] = useState(0.001); // mol/L
  const [blEkstinksiya, setBlEkstinksiya] = useState(5000); // M^-1 cm^-1
  const [blKyuvaQalinligi, setBlKyuvaQalinligi] = useState(1.0); // cm

  // 3. Tanabe-Sugano Simulyatori
  const [dKonfig, setDKonfig] = useState("d3");
  const [deltaOB, setDeltaOB] = useState(25); // Delta_o / B

  const etalon = SPEKTR_ETALONLARI[faolEtalonKey] || SPEKTR_ETALONLARI.ti_h2o6;

  // Gauss Yutilish Egri Chizig'ini Hisoblash
  const hisoblanganYutilish = useCallback((nm, peaks) => {
    let totalAbs = 0;
    peaks.forEach((p) => {
      const gauss = (p.eps / 1000) * Math.exp(-Math.pow((nm - p.nm) / p.width, 2));
      totalAbs += gauss;
    });
    return totalAbs;
  }, []);

  const joriyNm = bosilganNm || kursorNm;
  const joriyAbsorbsiya = hisoblanganYutilish(joriyNm, etalon.peaks);
  const fotonEnergiyaEV = (1240 / Math.max(1, joriyNm)).toFixed(2);
  const tolqinSoniCm = Math.round(10000000 / Math.max(1, joriyNm));

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
                d–d o{"'"}tishlar, Tanabe-Sugano diagrammasi, zaryad ko{"'"}chishi (CT) va Beer-Lambert qonuni
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* ─── 1. INTERAKTIV UB-VIS SPEKTR SIMULYATORI VA GAUSS EGRI CHIZIG'I ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
            <div>
              <div className="v3-nishon text-[var(--v3-urgu)]">Interaktiv Spektr Simulyatori</div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="nurlar" olcham={22} className="text-[var(--v3-urgu)]" />
                <span>Optik Yutilish Spektri va Elektron O{"'"}tishlar</span>
              </h2>
            </div>

            {/* Kompleks tanlash selektori */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-[var(--v3-xira)] hidden md:inline">Kompleks:</span>
              <select
                value={faolEtalonKey}
                onChange={(e) => setFaolEtalonKey(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border text-xs font-mono font-bold bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] focus:outline-none focus:border-[var(--v3-urgu)] cursor-pointer"
              >
                {Object.entries(SPEKTR_ETALONLARI).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[var(--v3-fon-2)] text-[var(--v3-matn)]">
                    {v.nomi} ({v.konfig})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dinamik 2D / SVG Spektr Grafigi */}
          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pb-2 border-b border-[var(--v3-chiziq)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: etalon.perceivedHex }} />
                <span className="font-bold text-[var(--v3-matn)]">{etalon.nomi}</span>
                <span className="text-[var(--v3-xira)]">| {etalon.term}</span>
              </div>
              <div className="text-[var(--v3-urgu)] font-bold">
                {etalon.deltaO > 0 ? `Δo = ${etalon.deltaO.toLocaleString()} cm⁻¹` : "LMCT / MLCT zaryad ko'chishi"}
              </div>
            </div>

            {/* Spektr Vizualizatori (SVG 200nm - 1000nm) */}
            <div className="relative w-full h-64 sm:h-72 select-none">
              <svg viewBox="0 0 800 240" className="w-full h-full" preserveAspectRatio="none">
                {/* Fon to'rlari */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((v) => {
                  const y = 200 - v * 180;
                  return (
                    <g key={v}>
                      <line x1="50" y1={y} x2="780" y2={y} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="15" y={y + 4} fill="currentColor" opacity="0.4" fontSize="10" fontFamily="monospace">
                        {(v * (etalon.peaks[0]?.eps > 500 ? 3000 : 80)).toFixed(0)}
                      </text>
                    </g>
                  );
                })}

                {/* To'lqin uzunligi o'qlari (200 - 1000 nm) */}
                {[200, 300, 400, 500, 600, 700, 800, 900, 1000].map((nm) => {
                  const x = 50 + ((nm - 200) / 800) * 730;
                  return (
                    <g key={nm}>
                      <line x1={x} y1="20" x2={x} y2="200" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                      <text x={x - 12} y="222" fill="currentColor" opacity="0.5" fontSize="10" fontFamily="monospace">
                        {nm}
                      </text>
                    </g>
                  );
                })}

                {/* Spektr Egri Chizig'i (Gauss Polyline) */}
                <path
                  d={hisoblaSpektrPath(etalon.peaks, false)}
                  fill="none"
                  stroke={etalon.perceivedHex || "#f43f5e"}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Spektr ostidagi gradient soya */}
                <path
                  d={hisoblaSpektrPath(etalon.peaks, true)}
                  fill={etalon.perceivedHex || "#f43f5e"}
                  fillOpacity="0.15"
                />

                {/* Kursor chizig'i */}
                {(() => {
                  const x = 50 + ((joriyNm - 200) / 800) * 730;
                  return (
                    <g>
                      <line x1={x} y1="20" x2={x} y2="200" stroke="#facc15" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx={x} cy={200 - (joriyAbsorbsiya * 1000 / (etalon.peaks[0]?.eps > 500 ? 3000 : 80)) * 180} r="5" fill="#facc15" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* To'lqin uzunligi slayderi */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs font-mono text-[var(--v3-xira)]">
                <span>To{"'"}lqin uzunligi (λ): <strong className="text-[var(--v3-matn)] font-bold">{joriyNm} nm</strong></span>
                <span>Foton energiyasi: <strong className="text-cyan-400 font-bold">{fotonEnergiyaEV} eV</strong> ({tolqinSoniCm.toLocaleString()} cm⁻¹)</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="2"
                value={joriyNm}
                onChange={(e) => {
                  const v = Number(e.target.value) || 500;
                  setKursorNm(v);
                  setBosilganNm(null);
                }}
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

            {/* Ilmiy Izoh */}
            <div className="p-3.5 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)] leading-relaxed">
              <strong className="text-[var(--v3-matn)] font-bold">🔬 Spektral mexanizm: </strong>
              {etalon.izoh}
            </div>
          </div>
        </section>

        {/* ─── 2. BEER-LAMBERT QONUNI KALKULYATORI VA KYUVETA ZICHLIGI (A = ε · c · l) ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1 pb-3 border-b border-[var(--v3-chiziq)]">
            <div className="v3-nishon text-[var(--v3-urgu)]">Kvant Miqdoriy Tahlil</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kolba" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>Beer-Lambert Qonuni va Optik Zichlik Laboratoriyasi</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-2">
            <div className="text-2xl sm:text-3xl font-mono font-black text-[var(--v3-urgu)] tracking-wider">
              A = ε · c · l
            </div>
            <p className="text-xs text-[var(--v3-xira)] max-w-xl mx-auto">
              Optik zichlik ($A$), molyar yutilish koeffitsienti ($\varepsilon$), eritma konsentratsiyasi ($c$)
              va kyuveta qalinligi ($l$) o{"'"}rtasidagi chiziqli bog{"'"}liqlik.
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

        {/* ─── 3. SPEKTROXIMIK QATOR VA LIGANDLAR MAYDON KUCHI ─── */}
        <section className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1 pb-3 border-b border-[var(--v3-chiziq)]">
            <div className="v3-nishon text-[var(--v3-urgu)]">Kristall Maydon Nazariyasi</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>Ligandlarning Spektroximik Qatori (Tsuchida & Fajans)</span>
            </h2>
            <p className="text-xs text-[var(--v3-xira)]">
              Ligandlarning d-orbitallarni yorish kuchi ($\Delta_o$) bo{"'"}yicha tartiblangan qatori:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 font-mono text-center">
            {SPEKTROXIMIK_LIGANDLAR.map((lig, idx) => (
              <div
                key={lig.nom}
                className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)] transition-all space-y-1"
              >
                <div className={`text-base font-bold ${lig.rang}`}>{lig.nom}</div>
                <div className="text-[10.5px] text-[var(--v3-xira)]">f = {lig.f.toFixed(2)}</div>
                <div className="text-[9px] opacity-75 truncate">{lig.tur}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)] leading-relaxed space-y-1.5">
            <strong className="text-[var(--v3-matn)] font-bold">Asosiy spektroximik qoidalar:</strong>
            <p>
              • <strong>π-donor ligandlar</strong> (I⁻, Br⁻, Cl⁻, F⁻) metallning t₂g orbitallari bilan qo{"'"}shilib, Δo ni kamaytiradi (Kuchsiz maydon → Yuqori spin HS).
            </p>
            <p>
              • <strong>π-akseptor ligandlar</strong> (CN⁻, CO, NO₂⁻, bpy) metallning t₂g elektronlarini o{"'"}zining bo{"'"}sh π* orbitallariga tortib, Δo ni keskin oshiradi (Kuchli maydon → Quyi spin LS).
            </p>
          </div>
        </section>

        {/* ─── 4. TANABE-SUGANO VA LAPORT TANLASH QOIDALARI ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="v3-panel-karta p-6 space-y-3">
            <div className="text-xs font-bold font-mono text-purple-400 uppercase flex items-center gap-1.5">
              <Ikon nom="nurlar" olcham={16} />
              <span>Laport Tanlash Qoidasi (Δl = ±1)</span>
            </div>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
              Inversiya markaziga ega bo{"'"}lgan markazsimmetrik oktaedrik komplekslarda g → g (d → d) o{"'"}tishlari
              <strong> qat{"'"}iy taqiqlangan</strong>. Biroq, molekula tebranishlari (vibronik bog{"'"}lanish)
              simmetriyani vaqtincha buzib, zaif intensivlikdagi (ε ≈ 1 ... 100) spektrlarni beradi.
            </p>
          </div>

          <div className="v3-panel-karta p-6 space-y-3">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase flex items-center gap-1.5">
              <Ikon nom="atom" olcham={16} />
              <span>Spin Tanlash Qoidasi (ΔS = 0)</span>
            </div>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
              Foton yutilishi paytida elektron spini o{"'"}zgarmasligi kerak (ΔS = 0).
              Spin-taqiqlangan o{"'"}tishlar ([Mn(H₂O)₆]²⁺ d⁵ HS kabi) o{"'"}ta zaif (ε &lt; 1)
              bo{"'"}lib, eritmada deyarli rangsiz yoki juda och pushti bo{"'"}lib ko{"'"}rinadi.
            </p>
          </div>
        </section>

        {/* ─── 5. NAVIGATSIYA FOOTER ─── */}
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
