"use client";

import { useEffect, useRef, useState } from "react";
import { FONLAR, fonOl, hexCss } from "../lib/fonlar.js";

// Sahna fonini tanlash tugmasi.
//
// Nega ro'yxat ochiladigan qilib yasaldi, to'rtta tugma qatori emas:
// sarlavha paneli telefonda allaqachon to'lgan — daraja chizig'i, balans va
// orqaga qaytish havolasi bor. To'rtta doimiy tugma u yerda ikkinchi qatorga
// tushib, 3D maydonidan joy yeb ketardi.
export default function FonTanlagich({ qiymat, onOzgartir }) {
  const [ochiq, setOchiq] = useState(false);
  const orovRef = useRef(null);

  const joriy = fonOl(qiymat);

  // Tashqariga bosilganda yopiladi. Aks holda ro'yxat ochiq qolib, 3D
  // sahnaga bosmoqchi bo'lgan foydalanuvchi uni tasodifan bosardi.
  useEffect(() => {
    if (!ochiq) return;

    const tashqaribosildi = (hodisa) => {
      if (orovRef.current && !orovRef.current.contains(hodisa.target)) {
        setOchiq(false);
      }
    };
    const escBosildi = (hodisa) => {
      if (hodisa.key === "Escape") setOchiq(false);
    };

    document.addEventListener("pointerdown", tashqaribosildi);
    document.addEventListener("keydown", escBosildi);
    return () => {
      document.removeEventListener("pointerdown", tashqaribosildi);
      document.removeEventListener("keydown", escBosildi);
    };
  }, [ochiq]);

  return (
    <div ref={orovRef} className="relative">
      <button
        type="button"
        onClick={() => setOchiq((holat) => !holat)}
        aria-haspopup="listbox"
        aria-expanded={ochiq}
        className="flex items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-slate-800 hover:text-white"
        title="Sahna fonini almashtirish"
      >
        <span
          className="h-3 w-3 shrink-0 rounded-full border border-white/30"
          style={{ backgroundColor: hexCss(joriy.fon) }}
        />
        <span className="hidden sm:inline">Fon: {joriy.nom}</span>
        <span className="sm:hidden">Fon</span>
      </button>

      {ochiq && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-purple-800/60 bg-slate-950/95 shadow-2xl backdrop-blur-xl"
        >
          {Object.entries(FONLAR).map(([kalit, fon]) => {
            const tanlangan = kalit === qiymat;
            return (
              <button
                key={kalit}
                type="button"
                role="option"
                aria-selected={tanlangan}
                onClick={() => {
                  onOzgartir(kalit);
                  setOchiq(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                  tanlangan ? "bg-purple-900/50" : "hover:bg-slate-900"
                }`}
              >
                <span
                  className="h-6 w-6 shrink-0 rounded-lg border border-white/20"
                  style={{ backgroundColor: hexCss(fon.fon) }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                    {fon.belgi} {fon.nom}
                    {tanlangan && <span className="text-yellow-400">✓</span>}
                  </span>
                  <span className="block truncate text-[10px] text-purple-400">
                    {fon.izoh}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
