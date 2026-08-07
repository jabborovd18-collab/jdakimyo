"use client";

import { useState, useMemo } from "react";
import { moddaKorinishi } from "../lib/modda-korinishi.js";

// Nodirlik bo'yicha cheklovchi rangli chegara (border) sinflari.
// Nega: talaba qaysi reagent oddiy, qaysisi nodir yoki noyob ekanini bir qarashda
// vizual ajratib olishi uchun 7.3-bo'limdagi dizayn tili asosida belgilandi.
function nodirlikChegarasi(nodirlik) {
  switch (nodirlik) {
    case "kam":
      return "border-green-600/70 hover:border-green-500";
    case "nodir":
      return "border-blue-600/70 hover:border-blue-500";
    case "noyob":
      return "border-purple-600/70 hover:border-purple-500";
    default:
      return "border-slate-700/70 hover:border-slate-500";
  }
}

// Hex sonini HTML va CSS uchung o'tadigan '#RRGGBB' satriga aylantirish.
function hexDanCss(hexSon) {
  const son = Number(hexSon) || 0xffffff;
  return `#${son.toString(16).padStart(6, "0")}`;
}

// Reagentlar javoni paneli: foydalanuvchi inventaridagi 242 ta modda ichidan qidirib,
// reaksiyaga qo'shmoqchi bo'lgan moddasini tanlaydigan interfeys.
// Nega 6 ta reagent chegarasi qo'yilgan: server bir tajribada ko'pi bilan 6 xil moddani
// qabul qiladi; 7-chisini yubormaslik uchun client tomonda bloklab, sababi ochiq yoziladi.
export default function ReagentJavoni({ reagentlar = [], faol, onTanla, quyilgan = {} }) {
  const [qidiruv, setQidiruv] = useState("");

  const quyilganKalitlar = Object.keys(quyilgan || {});
  const chegaraToldimi = quyilganKalitlar.length >= 6;

  // Qidiruv bo'yicha moddalarni filtrlash: 242 ta modda orasidan tez topish imkonini beradi.
  const filtrlanganlar = useMemo(() => {
    const matn = qidiruv.toLowerCase().trim();
    if (!matn) return reagentlar;
    return reagentlar.filter((item) => {
      const kalit = String(item.kalit || "").toLowerCase();
      const nom = String(item.nom || "").toLowerCase();
      return kalit.includes(matn) || nom.includes(matn);
    });
  }, [reagentlar, qidiruv]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-purple-800/50 bg-slate-900/80 p-4 text-white shadow-xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-purple-300">
          Reagentlar Javoni
        </h3>
        <span className="rounded-full bg-purple-950/80 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
          {quyilganKalitlar.length} / 6
        </span>
      </div>

      {chegaraToldimi && (
        <div className="mb-3 rounded-xl border border-amber-500/50 bg-amber-950/50 p-2 text-xs text-amber-300">
          Bir tajribada ko&apos;pi bilan 6 xil reagent aralashtirish mumkin (server chegarasi).
        </div>
      )}

      <div className="relative mb-3">
        <input
          type="text"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Modda formulasi yoki nomini qidirish..."
          className="w-full rounded-xl border border-purple-800/60 bg-slate-950/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition focus:border-purple-500"
        />
        {qidiruv && (
          <button
            type="button"
            onClick={() => setQidiruv("")}
            className="absolute right-3 top-2 text-xs text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {filtrlanganlar.length === 0 ? (
          <div className="py-8 text-center text-xs text-purple-400/70">
            Reagentlar topilmadi.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 md:grid-cols-2">
            {filtrlanganlar.map((item) => {
              const kalit = item.kalit;
              const soni = item.soni ?? 0;
              const borQuyilgan = quyilgan[kalit] || 0;
              const bloklangan = chegaraToldimi && borQuyilgan <= 0;
              const tanlangan = faol === kalit;

              const korinish = moddaKorinishi(kalit);
              const cssRang = hexDanCss(korinish.rang);

              return (
                <button
                  key={kalit}
                  type="button"
                  disabled={bloklangan || soni <= 0}
                  onClick={() => typeof onTanla === "function" && onTanla(kalit)}
                  className={`group relative flex items-center justify-between rounded-xl border p-2.5 text-left transition ${
                    tanlangan
                      ? "border-yellow-400 bg-purple-900/60 shadow-lg shadow-purple-900/50"
                      : "bg-slate-800/50 hover:bg-slate-800/90"
                  } ${nodirlikChegarasi(item.nodirlik)} ${
                    bloklangan || soni <= 0 ? "cursor-not-allowed opacity-40" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: cssRang }}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-white">
                        {kalit}
                      </div>
                      <div className="text-[11px] text-purple-400">
                        {item.nom || kalit}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[11px] font-semibold text-purple-300">
                      ×{soni}
                    </span>
                    {borQuyilgan > 0 && (
                      <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-300">
                        {borQuyilgan} ml
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}