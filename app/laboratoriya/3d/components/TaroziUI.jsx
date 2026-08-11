"use client";

import { useState } from "react";
import { massaHisobla } from "../lib/tarozi.js";

export default function TaroziUI({ idishKaliti = "probirka", moddalar = {}, onYop }) {
  const [taraMassa, setTaraMassa] = useState(0);
  const data = massaHisobla(idishKaliti, moddalar, taraMassa);

  const handleTara = () => {
    const hozirgiBrutto = data.bruttoMassa;
    setTaraMassa(hozirgiBrutto);
  };

  const handleNolgaQaytar = () => {
    setTaraMassa(0);
  };

  return (
    <div
      className="fixed top-20 left-4 z-40 flex w-72 flex-col rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--v3-chiziq)" }}>
        <span className="flex items-center gap-2 text-xs font-bold" style={{ color: "var(--v3-urgu)" }}>
          ⚖️ Raqamli Analitik Tarozi
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

      {/* Digital Weight Screen */}
      <div
        className="my-3 flex flex-col items-center justify-center rounded-xl border py-3 font-mono"
        style={{
          background: "var(--v3-fon)",
          borderColor: "var(--v3-urgu)",
        }}
      >
        <span className="text-2xl font-black tracking-widest text-emerald-400">
          {data.nettoMassa.toFixed(3)} g
        </span>
        <span className="mt-1 text-[10px]" style={{ color: "var(--v3-xira)" }}>
          {taraMassa > 0 ? `(Tara o'rnatilgan: ${taraMassa.toFixed(3)}g)` : "Sof massa"}
        </span>
      </div>

      {/* Mass Breakdown Details */}
      <div className="flex flex-col gap-1 text-[11px]" style={{ color: "var(--v3-xira)" }}>
        <div className="flex justify-between border-b pb-1 border-white/5">
          <span>Bo&apos;sh idish massasi:</span>
          <span className="font-bold" style={{ color: "var(--v3-matn)" }}>{data.boshMassa.toFixed(3)} g</span>
        </div>
        <div className="flex justify-between border-b pb-1 border-white/5">
          <span>Suyuqlik massasi:</span>
          <span className="font-bold" style={{ color: "var(--v3-matn)" }}>{data.suyuqlikMassa.toFixed(3)} g</span>
        </div>
        <div className="flex justify-between pt-1">
          <span>Jami Brutto:</span>
          <span className="font-bold" style={{ color: "var(--v3-urgu)" }}>{data.bruttoMassa.toFixed(3)} g</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleTara}
          className="flex-1 rounded-xl py-2 text-xs font-bold transition hover:scale-[1.01]"
          style={{
            background: "var(--v3-urgu)",
            color: "var(--v3-urgu-matn)",
          }}
        >
          🔘 TARA (Nol)
        </button>
        {taraMassa > 0 && (
          <button
            type="button"
            onClick={handleNolgaQaytar}
            className="rounded-xl px-3 py-2 text-xs font-bold border"
            style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}
          >
            ↺
          </button>
        )}
      </div>
    </div>
  );
}
