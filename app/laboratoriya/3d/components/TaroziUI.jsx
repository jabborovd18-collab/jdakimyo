"use client";

import { useState } from "react";
import { massaHisobla } from "../lib/tarozi.js";
import Ikon from "@/components/Ikon";

export default function TaroziUI({ idishKaliti = "probirka", moddalar = {}, onYop, onEritmaOch }) {
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
      className="fixed top-20 left-4 z-40 flex w-80 flex-col rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all v3-panel-karta bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq-2)] space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[var(--v3-chiziq)]">
        <span className="flex items-center gap-2 text-xs font-bold text-[var(--v3-urgu)]">
          <Ikon nom="orin" olcham={15} />
          Raqamli Analitik Tarozi
        </span>
        <button
          type="button"
          onClick={onYop}
          className="p-1 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
        >
          <Ikon nom="yopish" olcham={14} />
        </button>
      </div>

      {/* Digital Weight Screen */}
      <div
        className="p-4 rounded-xl border flex flex-col items-center justify-center font-mono bg-[var(--v3-fon)] border-[var(--v3-urgu)] shadow-inner"
      >
        <span className="text-3xl font-black tracking-widest text-emerald-400">
          {data.nettoMassa.toFixed(3)} <span className="text-sm text-[var(--v3-xira)]">g</span>
        </span>
        <span className="mt-1 text-[10px] text-[var(--v3-xira)]">
          {taraMassa > 0 ? `(Tara: ${taraMassa.toFixed(3)} g)` : "Sof netto massa"}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1 text-[11px] font-mono text-[var(--v3-xira)] pt-1">
        <div className="flex justify-between">
          <span>Bo{"'"}sh idish massasi:</span>
          <strong className="text-[var(--v3-matn)]">{data.boshMassa.toFixed(3)} g</strong>
        </div>
        <div className="flex justify-between">
          <span>Suyuqlik/Modda massasi:</span>
          <strong className="text-[var(--v3-matn)]">{data.suyuqlikMassa.toFixed(3)} g</strong>
        </div>
        <div className="flex justify-between border-t border-[var(--v3-chiziq)] pt-1">
          <span>Jami Brutto:</span>
          <strong className="text-[var(--v3-urgu)]">{data.bruttoMassa.toFixed(3)} g</strong>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleTara}
          className="flex-1 v3-tugma v3-tugma-asosiy text-xs py-2 justify-center font-bold"
        >
          🔘 TARA (Nol)
        </button>
        {taraMassa > 0 && (
          <button
            type="button"
            onClick={handleNolgaQaytar}
            className="v3-tugma text-xs py-2 px-3"
            title="Tarani bekor qilish"
          >
            ↺
          </button>
        )}
      </div>

      {/* Eritma tayyorlash stendiga o'tish tugmasi */}
      {typeof onEritmaOch === 'function' && (
        <div className="pt-2 border-t border-[var(--v3-chiziq)]">
          <button
            type="button"
            onClick={onEritmaOch}
            className="w-full v3-tugma text-xs py-1.5 justify-center font-semibold text-[var(--v3-urgu)]"
          >
            🧪 Standart eritma tayyorlash →
          </button>
        </div>
      )}
    </div>
  );
}
