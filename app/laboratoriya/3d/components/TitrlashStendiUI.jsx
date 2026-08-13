"use client";

import { useState, useEffect, useRef } from "react";
import Ikon from "@/components/Ikon";
import {
  TITRLASH_TURLARI,
  titrlashHolatiniHisobla,
  titrlashEgriChiziginiTuz,
  titrlashNatijasiniBaho,
} from "../lib/titrlash-dvigatel.js";
import { pufakchaChiqishi, shishaUrilishi } from "../lib/ovoz.js";
import toast from "react-hot-toast";

function hexDanCss(hexSon) {
  const son = Number(hexSon) || 0xffffff;
  return `#${son.toString(16).padStart(6, "0")}`;
}

export default function TitrlashStendiUI({ onYop }) {
  const [faolTur, setFaolTur] = useState(TITRLASH_TURLARI[0].id);
  const [vTitrant, setVTitrant] = useState(0); // Sarflangan titrant ml
  const [oqimRejimi, setOqimRejimi] = useState(0); // 0: stop, 0.05: tomchi, 0.2: sekin, 1.0: tez
  const [talabaJavobi, setTalabaJavobi] = useState("");
  const [tekshiruvNatijasi, setTekshiruvNatijasi] = useState(null);

  const kadrIdRef = useRef(null);
  const vaqtRef = useRef(Date.now());
  const profil = TITRLASH_TURLARI.find((t) => t.id === faolTur) || TITRLASH_TURLARI[0];

  // Real vaqt holatini hisoblash
  const holat = titrlashHolatiniHisobla(faolTur, vTitrant);
  const egriChiziqNuqtalari = titrlashEgriChiziginiTuz(faolTur);

  // Oqim animatsiyasi sikli
  useEffect(() => {
    if (oqimRejimi <= 0) return;

    vaqtRef.current = Date.now();

    const oqimSikli = () => {
      kadrIdRef.current = requestAnimationFrame(oqimSikli);

      const hozir = Date.now();
      const dt = Math.min(0.1, (hozir - vaqtRef.current) / 1000);
      vaqtRef.current = hozir;

      setVTitrant((prev) => {
        const yangi = prev + oqimRejimi * dt;
        if (yangi >= 50) {
          setOqimRejimi(0);
          return 50;
        }
        return Number(yangi.toFixed(3));
      });
    };

    kadrIdRef.current = requestAnimationFrame(oqimSikli);

    return () => {
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [oqimRejimi]);

  // Ekvivalentlik nuqtasiga yetganda audio signal
  useEffect(() => {
    if (holat.ekvivalentlikYetdimi && Math.abs(vTitrant - holat.vEkvivalent) <= 0.1) {
      shishaUrilishi(2200);
    }
  }, [holat.ekvivalentlikYetdimi, vTitrant, holat.vEkvivalent]);

  const handleYagonaTomchiQosh = () => {
    pufakchaChiqishi();
    setVTitrant((prev) => Number((prev + 0.05).toFixed(3)));
  };

  const handleReset = () => {
    setOqimRejimi(0);
    setVTitrant(0);
    setTekshiruvNatijasi(null);
    setTalabaJavobi("");
  };

  const handleHisobniTekshirish = (e) => {
    e.preventDefault();
    if (!talabaJavobi.trim()) {
      toast.error("Konsentratsiya qiymatini kiriting!");
      return;
    }

    const baho = titrlashNatijasiniBaho(faolTur, vTitrant, talabaJavobi);
    setTekshiruvNatijasi(baho);
    if (baho.togri) {
      toast.success(`✓ Ajoyib! Aniqlik: ${baho.aniqlik}%`);
    } else {
      toast.error(`Farq mavjud! Aniqlik: ${baho.aniqlik}%`);
    }
  };

  // SVG Titration Curve koordinatalari (X: 0..40ml -> 0..300px, Y: 0..14pH -> 160..0px)
  const SVG_W = 320;
  const SVG_H = 160;

  const svgPath = egriChiziqNuqtalari
    .map((p, idx) => {
      const x = (p.v / 40) * SVG_W;
      const y = SVG_H - (p.ph / 14) * SVG_H;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const joriyX = Math.min(SVG_W, (vTitrant / 40) * SVG_W);
  const joriyY = SVG_H - (holat.ph / 14) * SVG_H;
  const eqX = (holat.vEkvivalent / 40) * SVG_W;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] p-5 sm:p-7 space-y-5 shadow-2xl max-h-[94vh] overflow-y-auto">
        {/* ─── HEADER ─── */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">1-Qadam: Analitik Kimyo Stendi</div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kolba" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Volumetrik Titrlash va Byuretka Stendi</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onYop}
            className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="yopish" olcham={16} />
          </button>
        </div>

        {/* ─── TITRLASH PROFILINI TANLASH ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {TITRLASH_TURLARI.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setFaolTur(t.id);
                handleReset();
              }}
              className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                faolTur === t.id
                  ? "bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-sm ring-1 ring-[var(--v3-urgu)]"
                  : "bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]"
              }`}
            >
              <div className="font-bold text-xs text-[var(--v3-matn)] truncate">{t.nomi.split(":")[0]}</div>
              <div className="text-[11px] text-[var(--v3-xira)] truncate">{t.tenglama}</div>
            </button>
          ))}
        </div>

        {/* ─── ASOSIY ISH MAYDONI: BYURETKA VA TITRLASH EGRI CHIZIG'I ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Chap qism: 3D Byuretka & Erlenmeyyer Flask Gage (5 ustun) */}
          <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--v3-xira)]">Byuretkadagi titrant:</span>
              <strong className="text-cyan-400 font-bold">{(50 - vTitrant).toFixed(2)} / 50.0 ml</strong>
            </div>

            {/* Byuretka shisha shkalasi */}
            <div className="relative w-full h-7 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-150"
                style={{ width: `${Math.max(0, ((50 - vTitrant) / 50) * 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-mono font-bold text-black mix-blend-difference">
                <span>0 ml</span>
                <span>25 ml</span>
                <span>50 ml</span>
              </div>
            </div>

            {/* Erlenmeyyer kolbasi va rang o'zgarishi */}
            <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-center space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--v3-xira)]">Sarflangan: <strong className="text-[var(--v3-urgu)]">{vTitrant.toFixed(2)} ml</strong></span>
                <span className="text-[var(--v3-xira)]">Eritma: <strong className="text-[var(--v3-matn)]">{(profil.aniqlanuvchiHajm + vTitrant).toFixed(1)} ml</strong></span>
              </div>

              {/* Flask Liquid Indicator */}
              <div
                className="w-24 h-24 mx-auto rounded-3xl border-2 border-white/20 flex flex-col items-center justify-center p-2 shadow-2xl transition-colors duration-300"
                style={{
                  backgroundColor: hexDanCss(holat.rangHex),
                  boxShadow: `0 0 24px ${hexDanCss(holat.rangHex)}60`,
                }}
              >
                <span className="text-2xl">🧪</span>
                <span className="text-[10px] font-bold font-mono text-black">
                  pH {holat.ph}
                </span>
              </div>

              <div className="text-xs font-bold text-[var(--v3-matn)] leading-relaxed">
                {holat.holatNomi}
              </div>
            </div>

            {/* Jo'mrak (Stopcock) Boshqaruvi */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[var(--v3-xira)]">Jo{"'"}mrak (Teflon Krant) Tezligi:</div>
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                {[
                  { v: 0, nom: "⏸️ Yopiq" },
                  { v: 0.05, nom: "💧 Tomchi" },
                  { v: 0.2, nom: "🔹 Sekin" },
                  { v: 1.0, nom: "⏩ Tez" },
                ].map((b) => (
                  <button
                    key={b.v}
                    type="button"
                    onClick={() => setOqimRejimi(b.v)}
                    className={`py-2 rounded-xl border font-bold transition-all ${
                      oqimRejimi === b.v
                        ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] shadow-md"
                        : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
                    }`}
                  >
                    {b.nom}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleYagonaTomchiQosh}
                  className="flex-1 v3-tugma text-xs py-2 justify-center font-bold font-mono"
                >
                  +1 Tomchi (+0.05 ml)
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="v3-tugma text-xs py-2 px-3 text-red-400"
                  title="Qayta boshlash"
                >
                  ↺ Reset
                </button>
              </div>
            </div>
          </div>

          {/* O'ng qism: Jonli SVG Titration S-Curve va Hisob-Kitob (7 ustun) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live SVG Titration S-Curve */}
            <div className="p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[var(--v3-urgu)] flex items-center gap-1.5">
                  <Ikon nom="atom" olcham={14} />
                  <span>Jonli Titrlash Egri Chizig{"'"}i (pH vs V_titrant)</span>
                </span>
                <span className="text-[var(--v3-xira)]">V_eq: <strong className="text-emerald-400">{holat.vEkvivalent} ml</strong></span>
              </div>

              {/* Dynamic SVG Graph */}
              <div className="relative w-full h-44 bg-[var(--v3-fon-2)] rounded-xl border border-[var(--v3-chiziq)] p-2">
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1={SVG_H / 2} x2={SVG_W} y2={SVG_H / 2} stroke="var(--v3-chiziq)" strokeDasharray="3 3" />
                  <line x1={eqX} y1="0" x2={eqX} y2={SVG_H} stroke="#10b981" strokeDasharray="2 2" opacity="0.6" />

                  {/* Sigmoid Titration Curve */}
                  <path d={svgPath} fill="none" stroke="var(--v3-urgu)" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Animated Current Point Pulse */}
                  <circle cx={joriyX} cy={joriyY} r="5" fill="#38bdf8" />
                  <circle cx={joriyX} cy={joriyY} r="9" fill="#38bdf8" opacity="0.3" className="animate-ping" />
                </svg>

                {/* Y-axis Labels */}
                <div className="absolute left-2 top-2 text-[9px] font-mono text-[var(--v3-xira)]">pH 14</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[var(--v3-xira)]">pH 7</div>
                <div className="absolute left-2 bottom-2 text-[9px] font-mono text-[var(--v3-xira)]">pH 0</div>

                {/* X-axis Labels */}
                <div className="absolute right-3 bottom-1 text-[9px] font-mono text-[var(--v3-xira)]">40 ml</div>
              </div>
            </div>

            {/* Stexiometrik Hisob-Kitob va Natija Formulalari */}
            <div className="p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-3 font-mono text-xs">
              <div className="text-[var(--v3-urgu)] font-bold">Stexiometrik Ekvivalentlik Qoidasi:</div>
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-1 text-[11.5px]">
                <div>C₁ × V₁ = C₂ × V₂</div>
                <div className="text-cyan-400">
                  C(analit) = [C(titrant) × V(sarflangan)] / V(kolbadagi)
                </div>
              </div>

              {/* Talaba Hisobini Tekshirish Formasi */}
              <form onSubmit={handleHisobniTekshirish} className="space-y-2 pt-1">
                <label className="text-[11px] text-[var(--v3-xira)] block">
                  Hisoblangan noma{"'"}lum eritma konsentratsiyasini (M) kiriting:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={talabaJavobi}
                    onChange={(e) => setTalabaJavobi(e.target.value)}
                    placeholder="Masalan: 0.1000 M"
                    className="v3-kiritish flex-1 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold shrink-0"
                  >
                    Tekshirish
                  </button>
                </div>
              </form>

              {/* Natija Bahosi */}
              {tekshiruvNatijasi && (
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-150 ${
                    tekshiruvNatijasi.togri
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/40 bg-red-500/10 text-red-300"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{tekshiruvNatijasi.togri ? "✓ To'g'ri natija!" : "⚠️ Xatolik aniqlandi"}</span>
                    <span>Aniqlik: {tekshiruvNatijasi.aniqlik}%</span>
                  </div>
                  <p className="text-[11px] mt-1 opacity-90">{tekshiruvNatijasi.izoh}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
