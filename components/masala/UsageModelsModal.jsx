// components/masala/UsageModelsModal.jsx
//
// JDA KIMYO AI — USAGE & MODELS MODALI (Claude & Gemini Advanced uslubida)
// Foydalanuvchi limitlari, faol modellar klasteri va kesh samaradorligini ko'rsatadi.

"use client";

import { useState, useEffect } from "react";
import Ikon from "@/components/Ikon";

export default function UsageModelsModal({ ochiq, yopish }) {
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [statistika, setStatistika] = useState(null);

  useEffect(() => {
    if (!ochiq) return;

    let bekorQilindi = false;
    setYuklanmoqda(true);

    fetch("/api/masala/usage")
      .then((res) => res.json())
      .then((data) => {
        if (!bekorQilindi && data.muvaffaqiyatli) {
          setStatistika(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!bekorQilindi) setYuklanmoqda(false);
      });

    return () => {
      bekorQilindi = true;
    };
  }, [ochiq]);

  if (!ochiq) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] p-5 sm:p-7 shadow-2xl space-y-6 text-[var(--v3-matn)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sarlavha */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-urgu)] text-[var(--v3-urgu)] flex items-center justify-center">
              <Ikon nom="kolba" olcham={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                JDA Kimyo AI — Usage & Models
              </h3>
              <p className="text-[10px] text-[var(--v3-xira)]">
                Foydalanish kvotasi va faol AI arxitekturasi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={yopish}
            className="p-2 rounded-xl bg-[var(--v3-fon)] hover:bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] transition-colors cursor-pointer"
          >
            <Ikon nom="yopish" olcham={16} />
          </button>
        </div>

        {yuklanmoqda ? (
          <div className="py-12 text-center space-y-2 text-xs text-[var(--v3-xira)] animate-pulse">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-[var(--v3-urgu)] border-t-transparent animate-spin" />
            <p>Ma'lumotlar yangilanmoqda...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* 1. KUNLIK FOYDALANISH KVOTASI (USAGE PROGRESS) */}
            <div className="p-4 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Ikon nom="chaqmoq" olcham={14} className="text-[var(--v3-urgu)]" />
                  Bugungi AI Yechimlar:
                </span>
                <span className="font-mono font-black text-sm text-[var(--v3-matn)]">
                  {statistika?.quota?.ishlatildi || 0} / {statistika?.quota?.jamiLimit || 25}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[var(--v3-yuza)] overflow-hidden border border-[var(--v3-chiziq)]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-[var(--v3-urgu)] to-amber-500 transition-all duration-500 rounded-full"
                  style={{ width: `${statistika?.quota?.foiz || 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[var(--v3-xira)]">
                <span>Qolgan: {statistika?.quota?.qoldi || 0} ta yangi masala</span>
                <span>{statistika?.quota?.yangilanish || "00:00 da yangilanadi"}</span>
              </div>
            </div>

            {/* 2. FAOL AI MODELLAR KLASTERI */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--v3-xira)] block px-1">
                Faol AI Dvigatellari:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {statistika?.modellar?.map((m, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold truncate max-w-[140px]">
                        {m.nom}
                      </strong>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <p className="text-[10px] text-[var(--v3-xira)]">{m.turi}</p>
                    <div className="flex justify-between items-center text-[9px] pt-1 border-t border-[var(--v3-chiziq)]/50">
                      <span className="text-emerald-400 font-bold">{m.holat}</span>
                      <span className="font-mono text-[var(--v3-xira)]">{m.tezlik}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. TEJAMKORLIK & XAVFSIZLIK STATISTIKASI */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Ikon nom="tasdiq" olcham={15} className="text-emerald-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-emerald-400 block">
                    Kesh Samaradorligi: {statistika?.keshStatistika?.samaradorlik || "100%"}
                  </span>
                  <p className="text-[10px] text-[var(--v3-xira)]">
                    Takroriy masalalar 10ms da bepul keshdan xizmat qiladi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tugma */}
        <div className="pt-2">
          <button
            type="button"
            onClick={yopish}
            className="w-full py-2.5 rounded-2xl bg-[var(--v3-urgu)] hover:opacity-90 text-white text-xs font-bold shadow-md transition-all cursor-pointer text-center"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
}
