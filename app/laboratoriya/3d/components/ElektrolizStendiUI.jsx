"use client";

import { useState, useEffect, useRef } from "react";
import Ikon from "@/components/Ikon";
import {
  ELEKTROLIZ_TURLARI,
  elektrolizHisobla,
  elektrolizHisobiniTekshir,
} from "../lib/elektroliz-dvigatel.js";
import { pufakchaChiqishi, shishaUrilishi } from "../lib/ovoz.js";
import toast from "react-hot-toast";

function vaqtFormatla(soniya) {
  const s = Math.floor(soniya);
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export default function ElektrolizStendiUI({ onYop }) {
  const [faolTur, setFaolTur] = useState(ELEKTROLIZ_TURLARI[0].id);
  const [yoqilgan, setYoqilgan] = useState(false);
  const [tokAmper, setTokAmper] = useState(2.5); // Amper
  const [vaqtSoniya, setVaqtSoniya] = useState(0); // Soniya
  const [talabaJavobi, setTalabaJavobi] = useState("");
  const [tekshiruvNatijasi, setTekshiruvNatijasi] = useState(null);

  const kadrIdRef = useRef(null);
  const vaqtRef = useRef(Date.now());
  const profil = ELEKTROLIZ_TURLARI.find((t) => t.id === faolTur) || ELEKTROLIZ_TURLARI[0];

  // Real vaqt hisobi
  const holat = elektrolizHisobla(faolTur, tokAmper, vaqtSoniya);

  // Elektroliz vaqt sikli
  useEffect(() => {
    if (!yoqilgan) return;

    vaqtRef.current = Date.now();
    pufakchaChiqishi();

    const sikl = () => {
      kadrIdRef.current = requestAnimationFrame(sikl);

      const hozir = Date.now();
      const dt = Math.min(0.1, (hozir - vaqtRef.current) / 1000);
      vaqtRef.current = hozir;

      setVaqtSoniya((prev) => Number((prev + dt).toFixed(2)));
    };

    kadrIdRef.current = requestAnimationFrame(sikl);

    return () => {
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [yoqilgan]);

  const handleToggleTok = () => {
    if (!yoqilgan) {
      shishaUrilishi(1800);
      setYoqilgan(true);
      toast.success("Tok manbai ulandi — Elektroliz boshlandi!");
    } else {
      setYoqilgan(false);
    }
  };

  const handleReset = () => {
    setYoqilgan(false);
    setVaqtSoniya(0);
    setTekshiruvNatijasi(null);
    setTalabaJavobi("");
  };

  const handleTekshirish = (e) => {
    e.preventDefault();
    if (!talabaJavobi.trim()) {
      toast.error("Hisoblangan qiymatni kiriting!");
      return;
    }

    const baho = elektrolizHisobiniTekshir(faolTur, tokAmper, vaqtSoniya, talabaJavobi);
    setTekshiruvNatijasi(baho);
    if (baho.togri) {
      toast.success(`✓ Ajoyib! Faradey hisobi aniqligi: ${baho.aniqlik}%`);
    } else {
      toast.error(`Farq bor! Aniqlik: ${baho.aniqlik}%`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] p-5 sm:p-7 space-y-5 shadow-2xl max-h-[94vh] overflow-y-auto">
        {/* ─── HEADER ─── */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">2-Qadam: Elektrokimyo Stendi</div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="chaqmoq" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Elektroliz va Tok Manbai Stendi (Faradey Qonunlari)</span>
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

        {/* ─── ELEKTROLIZ JARAYONINI TANLASH ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {ELEKTROLIZ_TURLARI.map((t) => (
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
              <div className="font-bold text-xs text-[var(--v3-matn)] truncate">{t.nomi.split("(")[0]}</div>
              <div className="text-[11px] text-[var(--v3-xira)] truncate">{t.eritma}</div>
            </button>
          ))}
        </div>

        {/* ─── ASOSIY ISH MAYDONI: TOK MANBAI VA ELEKTROD VANNASI ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Chap qism: Raqamli Tok Manbai (DC Power Supply) (5 ustun) */}
          <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--v3-urgu)] flex items-center gap-1.5 font-mono uppercase">
                <Ikon nom="chaqmoq" olcham={14} />
                <span>Raqamli Tok Manbai (DC)</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                yoqilgan ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse" : "bg-[var(--v3-yuza)] text-[var(--v3-xira)]"
              }`}>
                {yoqilgan ? "⚡ ISHLAMOQDA" : "⏸️ O'CHIQ"}
              </span>
            </div>

            {/* Digital LED Display Readouts */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-center">
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] shadow-inner">
                <span className="text-[10px] text-[var(--v3-xira)] block">Tok kuchi (I)</span>
                <strong className="text-xl sm:text-2xl text-emerald-400 font-black">
                  {tokAmper.toFixed(1)} <span className="text-xs text-[var(--v3-xira)]">A</span>
                </strong>
              </div>
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] shadow-inner">
                <span className="text-[10px] text-[var(--v3-xira)] block">Kuchlanish (U)</span>
                <strong className="text-xl sm:text-2xl text-cyan-400 font-black">
                  {holat.kuchlanishVolt.toFixed(2)} <span className="text-xs text-[var(--v3-xira)]">V</span>
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-center text-xs">
              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
                <span className="text-[10px] text-[var(--v3-xira)] block">O'tgan vaqt (t)</span>
                <strong className="text-sm text-[var(--v3-matn)] font-bold">{vaqtFormatla(vaqtSoniya)}</strong>
              </div>
              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
                <span className="text-[10px] text-[var(--v3-xira)] block">Elektr miqdori (Q)</span>
                <strong className="text-sm text-[var(--v3-urgu)] font-bold">{holat.kulon} C</strong>
              </div>
            </div>

            {/* Tok kuchi regulyatori slideri */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono text-[var(--v3-xira)]">
                <span>Tok regulyatori:</span>
                <strong className="text-[var(--v3-matn)]">{tokAmper.toFixed(1)} A</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={tokAmper}
                onChange={(e) => setTokAmper(parseFloat(e.target.value) || 1.0)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            {/* Asosiy Yoqish/O'chirish Tugmasi */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleToggleTok}
                className={`flex-1 v3-tugma text-xs py-2.5 justify-center font-bold font-mono transition-all ${
                  yoqilgan ? "border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30" : "v3-tugma-asosiy shadow-lg"
                }`}
              >
                {yoqilgan ? "⏹️ Tokni o'chirish" : "⚡ Tokni ulash (Start)"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="v3-tugma text-xs py-2.5 px-3 text-[var(--v3-xira)] hover:text-red-400"
                title="Vaqtni tozalash"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* O'ng qism: 3D Elektroliz Vannasi va Faradey Qonunlari (7 ustun) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 3D Elektroliz Vanna Vizualizatsiyasi */}
            <div className="p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[var(--v3-matn)] truncate">{profil.tenglama}</span>
              </div>

              {/* Vanna va Katod/Anod shkalasi */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                {/* Katod (-) */}
                <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      Katod (-)
                    </span>
                    <span className="text-[10px] text-blue-300 font-bold">{profil.katodModda}</span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[var(--v3-xira)]">Jarayon:</span>
                      <span className="text-[var(--v3-matn)] truncate">{profil.katodJarayoni.split("➔")[1] || "Tiklanish"}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-500/20 pt-1">
                      <span className="text-[var(--v3-xira)]">{holat.katod.gaz ? "Hajm:" : "Massa:"}</span>
                      <strong className="text-emerald-400 text-sm font-bold">
                        {holat.katod.gaz ? `${holat.katod.hajmLitr} L (${holat.katod.hajmMl} ml)` : `${holat.katod.massaGramm} g`}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Anod (+) */}
                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Anod (+)
                    </span>
                    <span className="text-[10px] text-red-300 font-bold">{profil.anodModda}</span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[var(--v3-xira)]">Jarayon:</span>
                      <span className="text-[var(--v3-matn)] truncate">{profil.anodJarayoni.split("➔")[1] || "Oksidlanish"}</span>
                    </div>
                    <div className="flex justify-between border-t border-red-500/20 pt-1">
                      <span className="text-[var(--v3-xira)]">{holat.anod.gaz ? "Hajm:" : "Massa:"}</span>
                      <strong className="text-amber-400 text-sm font-bold">
                        {holat.anod.gaz ? `${holat.anod.hajmLitr} L (${holat.anod.hajmMl} ml)` : `${holat.anod.massaGramm} g`}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Faradey Qonuni Formulalari va O'quvchi Hisob-kitobi */}
            <div className="p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-3 font-mono text-xs">
              <div className="text-[var(--v3-urgu)] font-bold flex items-center gap-1.5">
                <Ikon nom="quiz" olcham={14} />
                <span>Faradeyning 1- va 2-Qonunlari:</span>
              </div>

              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-1 text-[11.5px]">
                <div className="text-cyan-400 font-bold">m = (M × I × t) / (z × F)</div>
                <div className="text-[var(--v3-xira)] text-[10.5px]">
                  F = 96485 C/mol · I = {tokAmper} A · t = {vaqtSoniya.toFixed(0)} s · z = {profil.katodZ}
                </div>
              </div>

              {/* O'quvchi Hisobini Tekshirish */}
              <form onSubmit={handleTekshirish} className="space-y-2 pt-1">
                <label className="text-[11px] text-[var(--v3-xira)] block">
                  Katodda ajraladigan {holat.katod.gaz ? "gaz hajmini (litr)" : "metall massasini (gramm)"} hisoblab kiriting:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={talabaJavobi}
                    onChange={(e) => setTalabaJavobi(e.target.value)}
                    placeholder={`Masalan: ${holat.katod.gaz ? "0.050 L" : "0.150 g"}`}
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
                    <span>{tekshiruvNatijasi.togri ? "✓ To'g'ri Faradey hisobi!" : "⚠️ Xatolik aniqlandi"}</span>
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
