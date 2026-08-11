"use client";

import { pHHisobla } from "../lib/ph-meter.js";

export default function PHMeterUI({ moddalar = {}, onYop }) {
  const data = pHHisobla(moddalar);

  return (
    <div
      className="fixed top-20 right-4 z-40 flex w-72 flex-col rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--v3-chiziq)" }}>
        <span className="flex items-center gap-2 text-xs font-bold" style={{ color: "var(--v3-urgu)" }}>
          🧪 Raqamli pH-Meter
        </span>
        <button
          type="button"
          onClick={onYop}
          className="rounded px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: "var(--v3-yuza-2)" }}
        >
          ✕
        </button>
      </div>

      {/* pH Display Box */}
      <div
        className="my-3 flex flex-col items-center justify-center rounded-xl border py-3 font-mono"
        style={{
          background: "var(--v3-fon)",
          borderColor: data.rang,
        }}
      >
        <span className="text-2xl font-black tracking-wider" style={{ color: data.rang }}>
          {data.ph.toFixed(2)} pH
        </span>
        <span className="mt-1 text-[11px] font-bold" style={{ color: "var(--v3-matn)" }}>
          {data.muhit}
        </span>
      </div>

      {/* pH Scale Bar */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-red-500 via-green-500 to-purple-600">
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#fff]"
          style={{ left: `${(data.ph / 14) * 100}%` }}
        />
      </div>

      {/* Indikator rangi preview */}
      <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--v3-xira)" }}>
        <span>Fenolftalein rangi:</span>
        <div className="flex items-center gap-1.5 font-bold">
          <span
            className="h-3 w-3 rounded-full border border-white/40"
            style={{ backgroundColor: data.indikatorRang }}
          />
          <span style={{ color: "var(--v3-matn)" }}>
            {data.ph >= 8.3 ? "Pushti" : "Rangsiz"}
          </span>
        </div>
      </div>
    </div>
  );
}
