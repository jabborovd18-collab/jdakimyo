"use client";

import { useState } from "react";
import { shishaUrilishi, chokmaTushishi } from "../lib/ovoz.js";

const SANDIQLAR = [
  {
    id: "oddiy-sandiq",
    nom: "Oddiy Reagentlar Sandig'i",
    narxCoins: 50,
    narxGems: 0,
    icon: "📦",
    rang: "#38bdf8",
    tushadi: ["H₂O", "HCl", "NaOH", "NaCl", "CuSO₄"],
  },
  {
    id: "nodir-sandiq",
    nom: "Nodir Reagentlar Sandig'i",
    narxCoins: 150,
    narxGems: 5,
    icon: "🎁",
    rang: "#a855f7",
    tushadi: ["AgNO₃", "BaCl₂", "FeCl₃", "KMnO₄", "I₂"],
  },
  {
    id: "noyob-sandiq",
    nom: "Noyob Kimyogar Sandig'i",
    narxCoins: 300,
    narxGems: 15,
    icon: "💎",
    rang: "#eab308",
    tushadi: ["PtCl₂", "AuCl₃", "K₃[Fe(CN)₆]", "NH₄SCN"],
  },
];

export default function SandiqOchishModal({ balans = { coins: 100, gems: 10 }, onYop, onReagentKashf }) {
  const [faolSandiq, setFaolSandiq] = useState(SANDIQLAR[0]);
  const [ochilmoqda, setOchilmoqda] = useState(false);
  const [yangiReagent, setYangiReagent] = useState(null);

  const handleOchish = () => {
    if (ochilmoqda) return;

    if (balans.coins < faolSandiq.narxCoins) {
      alert("Tangalar yetarli emas!");
      return;
    }

    setOchilmoqda(true);
    setYangiReagent(null);
    shishaUrilishi(1800);

    // Dynamic roulette spin animation simulation
    setTimeout(() => {
      chokmaTushishi();
      const tanlanganIndex = Math.floor(Math.random() * faolSandiq.tushadi.length);
      const kashfModda = faolSandiq.tushadi[tanlanganIndex];
      setYangiReagent(kashfModda);
      setOchilmoqda(false);

      if (typeof onReagentKashf === "function") {
        onReagentKashf(kashfModda, faolSandiq);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/70">
      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border p-5 shadow-2xl"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)",
          color: "var(--v3-matn)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--v3-chiziq)" }}>
          <h3 className="text-base font-bold" style={{ color: "var(--v3-urgu)" }}>
            🎁 Reagentlar Sandig&apos;i va Bozor
          </h3>
          <button
            type="button"
            onClick={onYop}
            className="rounded-lg px-2.5 py-1 text-xs font-bold"
            style={{ background: "var(--v3-yuza-2)" }}
          >
            ✕
          </button>
        </div>

        {/* Sandiqlar ro'yxati */}
        <div className="my-4 flex gap-2 overflow-x-auto pb-2">
          {SANDIQLAR.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setFaolSandiq(s);
                setYangiReagent(null);
              }}
              className={`flex flex-1 flex-col items-center rounded-xl border p-3 text-center transition ${
                faolSandiq.id === s.id ? "border-amber-400 bg-amber-500/10" : "opacity-70 hover:opacity-100"
              }`}
              style={{ background: "var(--v3-fon)", borderColor: faolSandiq.id === s.id ? s.rang : "var(--v3-chiziq)" }}
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="mt-1 text-xs font-bold">{s.nom}</span>
              <span className="mt-1 text-[10px] font-bold" style={{ color: s.rang }}>
                {s.narxCoins} 🪙 {s.narxGems > 0 ? `+ ${s.narxGems} 💎` : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Unboxing Animation Display */}
        <div
          className="my-3 flex h-40 flex-col items-center justify-center rounded-2xl border p-4 text-center"
          style={{ background: "var(--v3-fon)", borderColor: faolSandiq.rang }}
        >
          {ochilmoqda ? (
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-5xl">{faolSandiq.icon}</span>
              <span className="mt-3 text-xs font-bold" style={{ color: "var(--v3-urgu)" }}>
                Sandiq ochilmoqda...
              </span>
            </div>
          ) : yangiReagent ? (
            <div className="flex flex-col items-center animate-pulse">
              <span className="text-xs font-bold text-emerald-400">🎉 YANGI MODDA KASHF ETILDI!</span>
              <span className="my-2 text-3xl font-black" style={{ color: faolSandiq.rang }}>
                {yangiReagent}
              </span>
              <span className="text-[11px]" style={{ color: "var(--v3-xira)" }}>
                Inventarga muvaffaqiyatli qo&apos;shildi!
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-4xl">{faolSandiq.icon}</span>
              <span className="mt-2 text-xs font-bold">{faolSandiq.nom}</span>
              <span className="mt-1 text-[10px] text-center" style={{ color: "var(--v3-xira)" }}>
                Tushishi mumkin bo&apos;lgan moddalar: {faolSandiq.tushadi.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Action button */}
        <button
          type="button"
          disabled={ochilmoqda}
          onClick={handleOchish}
          className="w-full rounded-xl py-3 text-xs font-bold transition hover:scale-[1.01]"
          style={{
            background: "var(--v3-urgu)",
            color: "var(--v3-urgu-matn)",
          }}
        >
          {ochilmoqda ? "Ochilmoqda..." : `🎁 ${faolSandiq.narxCoins} Tangaga Ochish`}
        </button>
      </div>
    </div>
  );
}
