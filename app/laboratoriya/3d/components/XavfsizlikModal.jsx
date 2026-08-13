"use client";

import { shishaUrilishi } from "../lib/ovoz.js";
import { useEffect } from "react";

export default function XavfsizlikModal({ malumot, maLumot: ml, onYop }) {
  const maLumot = malumot || ml;

  useEffect(() => {
    shishaUrilishi(800);
  }, []);

  if (!maLumot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/75">
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border p-6 shadow-2xl animate-shake"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "#ef4444",
          color: "var(--v3-matn)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-3 border-red-500/30">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-3xl animate-pulse">
            💥
          </span>
          <div>
            <h3 className="text-base font-black text-red-500">
              ⚠️ XAVFSIZLIK QOIDASI BUZILDI!
            </h3>
            <p className="text-xs" style={{ color: "var(--v3-xira)" }}>
              Eksotermik Reaksiya Portlashi va Idish Sinishi
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="my-4 flex flex-col gap-3 rounded-xl border border-red-500/20 p-4 bg-red-950/20">
          <p className="text-xs leading-relaxed font-bold text-red-400">
            {maLumot.sabab}
          </p>

          {maLumot.tenglama && (
            <div className="rounded-lg bg-black/40 p-2 text-center font-mono text-xs font-bold text-amber-300">
              {maLumot.tenglama}
            </div>
          )}

          <div className="rounded-lg border border-yellow-500/30 p-3 bg-yellow-950/20 text-xs">
            <span className="font-bold text-yellow-400">🥽 Laboratoriya xavfsizlik eslatmasi:</span>
            {/* `xavfsizlik` endi BAZADAGI GHS kodlari ro'yxati, qo'lda
                yozilgan bitta jumla emas. Shuning uchun ro'yxat bo'lib
                chiqadi va rangi mavzuga ergashadi. */}
            <ul
              className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed"
              style={{ color: "var(--v3-matn)" }}
            >
              {(Array.isArray(maLumot.xavfsizlik)
                ? maLumot.xavfsizlik
                : [maLumot.xavfsizlik].filter(Boolean)
              ).map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onYop}
          className="w-full rounded-xl py-3 text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition hover:scale-[1.01]"
        >
          ✓ Tushundim (Xavfsizlik qoidasiga rioya qilaman)
        </button>
      </div>
    </div>
  );
}
