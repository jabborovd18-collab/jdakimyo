"use client";

import { useState, useMemo } from "react";
import { moddaKorinishi } from "../lib/modda-korinishi.js";
import { reagentBirligi, hajmniBirlikka, miqdorniFormatla } from "@/lib/lab-birlik.js";

// Nodirlik bo'yicha premium kartochka uslublari va neon nur effektlari
function nodirlikUslubi(nodirlik) {
  switch (nodirlik) {
    case "kam":
      return {
        borderColor: "rgba(34, 197, 94, 0.6)",
        glow: "0 0 12px rgba(34, 197, 94, 0.25)",
        badgeBg: "rgba(34, 197, 94, 0.2)",
        badgeColor: "#4ade80",
      };
    case "nodir":
      return {
        borderColor: "rgba(168, 85, 247, 0.6)",
        glow: "0 0 12px rgba(168, 85, 247, 0.3)",
        badgeBg: "rgba(168, 85, 247, 0.2)",
        badgeColor: "#c084fc",
      };
    case "noyob":
      return {
        borderColor: "rgba(234, 179, 8, 0.8)",
        glow: "0 0 16px rgba(234, 179, 8, 0.4)",
        badgeBg: "rgba(234, 179, 8, 0.25)",
        badgeColor: "#fde047",
      };
    default:
      return {
        borderColor: "var(--v3-chiziq)",
        glow: "none",
        badgeBg: "var(--v3-yuza-2)",
        badgeColor: "var(--v3-xira)",
      };
  }
}

// Hex rangini CSS satriga aylantirish
function hexDanCss(hexSon) {
  const son = Number(hexSon) || 0xffffff;
  return `#${son.toString(16).padStart(6, "0")}`;
}

// Reagent sinfini (guruhini) aniqlash
function reagentGuruhiniAniqla(kalit = "") {
  if (["HCl", "HNO₃", "H₂SO₄", "CH₃COOH"].includes(kalit)) return "kislota";
  if (["NaOH", "KOH", "NH₃", "Ca(OH)₂", "Ba(OH)₂"].includes(kalit)) return "ishqor";
  if (["CuSO₄", "AgNO₃", "BaCl₂", "FeCl₃", "KMnO₄", "NaCl", "KI", "Na₂CO₃"].includes(kalit)) return "tuz";
  return "boshqa";
}

// Reagent idishi 3D simulyatsiya ko'rinishi
function ReagentShishaIcon({ rang, holat, guruh }) {
  const cssRang = hexDanCss(rang);

  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-black/40 p-1.5 shadow-inner border-white/10">
      {/* Liquid / Solid body */}
      <div
        className="h-full w-full rounded-md transition-transform group-hover:scale-110"
        style={{
          background:
            holat === "gaz"
              ? `radial-gradient(circle, ${cssRang} 20%, transparent 80%)`
              : `linear-gradient(to top, ${cssRang} 60%, rgba(255,255,255,0.2) 100%)`,
          boxShadow: `0 0 10px ${cssRang}40`,
        }}
      />
      <span className="absolute text-[10px] font-black text-white/90 drop-shadow">
        {guruh === "kislota" ? "⚡" : guruh === "ishqor" ? "💧" : guruh === "tuz" ? "💎" : "🧪"}
      </span>
    </div>
  );
}

export default function ReagentJavoni({ reagentlar = [], faol, onTanla, quyilgan = {} }) {
  const [qidiruv, setQidiruv] = useState("");
  const [faolGuruh, setFaolGuruh] = useState("hammasi");
  const [gridRejim, setGridRejim] = useState(true);

  const quyilganKalitlar = Object.keys(quyilgan || {});
  const chegaraToldimi = quyilganKalitlar.length >= 6;

  // Tezkor kirish uchun asosiy reagentlar (Quick Access Bar)
  const tezkorReagentlar = useMemo(() => {
    const muhimlar = ["H₂O", "HCl", "NaOH", "CuSO₄", "AgNO₃"];
    return reagentlar.filter((r) => muhimlar.includes(r.kalit));
  }, [reagentlar]);

  // Qidiruv va guruh bo'yicha filtrlash
  const filtrlanganlar = useMemo(() => {
    const matn = qidiruv.toLowerCase().trim();

    return reagentlar.filter((item) => {
      const kalit = String(item.kalit || "").toLowerCase();
      const nom = String(item.nom || "").toLowerCase();
      const mosQidiruv = !matn || kalit.includes(matn) || nom.includes(matn);

      if (!mosQidiruv) return false;

      if (faolGuruh === "hammasi") return true;
      const guruh = reagentGuruhiniAniqla(item.kalit);
      return guruh === faolGuruh;
    });
  }, [reagentlar, qidiruv, faolGuruh]);

  return (
    <div
      className="flex h-full flex-col rounded-2xl border p-4 shadow-2xl backdrop-blur-xl"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b pb-2.5" style={{ borderColor: "var(--v3-chiziq)" }}>
        <div className="flex items-center gap-2">
          <span className="text-base">🧪</span>
          <h3 className="text-sm font-bold tracking-wide" style={{ color: "var(--v3-matn)" }}>
            Reagentlar Javoni
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGridRejim(!gridRejim)}
            className="rounded-lg border px-2 py-1 text-[11px] font-bold"
            style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}
          >
            {gridRejim ? "☰ Ro'yxat" : "📱 Grid"}
          </button>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{
              background: chegaraToldimi
                ? "color-mix(in srgb, var(--v3-urgu) 25%, transparent)"
                : "var(--v3-yuza-2)",
              color: chegaraToldimi ? "var(--v3-urgu)" : "var(--v3-xira)",
            }}
          >
            {quyilganKalitlar.length} / 6
          </span>
        </div>
      </div>

      {/* Quick Access Bar (Tezkor Javon) */}
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {tezkorReagentlar.map((r) => {
          const tanlangan = faol === r.kalit;
          const quyilganMl = quyilgan[r.kalit]?.ml || 0;
          return (
            <button
              key={r.kalit}
              type="button"
              onClick={() => typeof onTanla === "function" && onTanla(r.kalit)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition hover:scale-105 ${
                tanlangan ? "border-amber-400 text-amber-400 bg-amber-400/10" : ""
              }`}
              style={{
                background: tanlangan ? undefined : "var(--v3-fon)",
                borderColor: tanlangan ? undefined : "var(--v3-chiziq)",
              }}
            >
              <span>{r.kalit}</span>
              {quyilganMl > 0 && <span className="text-[10px] text-amber-400">({quyilganMl}ml)</span>}
            </button>
          );
        })}
      </div>

      {/* Category Tabs (Guruhlar) */}
      <div className="mb-3 flex gap-1 overflow-x-auto rounded-xl p-1" style={{ background: "var(--v3-fon)" }}>
        {[
          ["hammasi", "Barchasi"],
          ["kislota", "⚡ Kislotalar"],
          ["ishqor", "💧 Ishqorlar"],
          ["tuz", "💎 Tuzlar"],
        ].map(([guruhId, nom]) => (
          <button
            key={guruhId}
            type="button"
            onClick={() => setFaolGuruh(guruhId)}
            className="flex-1 shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition"
            style={
              faolGuruh === guruhId
                ? { background: "var(--v3-urgu)", color: "var(--v3-fon)" }
                : { color: "var(--v3-xira)" }
            }
          >
            {nom}
          </button>
        ))}
      </div>

      {/* Qidiruv Inputi */}
      <div className="relative mb-3">
        <input
          type="text"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Modda formulasi yoki nomini qidirish..."
          className="w-full rounded-xl border px-3.5 py-2 text-xs outline-none transition"
          style={{
            background: "var(--v3-fon)",
            borderColor: "var(--v3-chiziq)",
            color: "var(--v3-matn)",
          }}
        />
        {qidiruv && (
          <button
            type="button"
            onClick={() => setQidiruv("")}
            className="v3-xira absolute right-3 top-2 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Reagentlar Ro'yxati / Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filtrlanganlar.length === 0 ? (
          <div className="v3-xira py-8 text-center text-xs">Reagentlar topilmadi.</div>
        ) : (
          <div className={gridRejim ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
            {filtrlanganlar.map((item) => {
              const kalit = item.kalit;
              const soni = item.soni ?? 0;
              const bor = item.cheksiz ? Infinity : (item.miqdor ?? soni);
              const quyilganMl = quyilgan[kalit]?.ml || 0;
              const birlik = reagentBirligi(kalit);
              const quyilganMiqdor = hajmniBirlikka(quyilganMl, birlik);
              const bloklangan = chegaraToldimi && quyilganMl <= 0;
              const tanlangan = faol === kalit;

              const korinish = moddaKorinishi(kalit);
              const guruh = reagentGuruhiniAniqla(kalit);
              const uslub = nodirlikUslubi(item.nodirlik);

              return (
                <button
                  key={kalit}
                  type="button"
                  disabled={bloklangan || bor <= 0}
                  onClick={() => typeof onTanla === "function" && onTanla(kalit)}
                  className={`group relative flex items-center justify-between rounded-xl border p-2.5 text-left transition hover:scale-[1.02] ${
                    bloklangan || bor <= 0 ? "cursor-not-allowed opacity-40" : ""
                  }`}
                  style={{
                    background: tanlangan
                      ? "color-mix(in srgb, var(--v3-urgu) 15%, var(--v3-yuza))"
                      : "var(--v3-fon)",
                    borderColor: tanlangan ? "var(--v3-urgu)" : uslub.borderColor,
                    boxShadow: tanlangan ? "0 0 14px rgba(245, 158, 11, 0.3)" : uslub.glow,
                    color: "var(--v3-matn)",
                  }}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <ReagentShishaIcon rang={korinish.rang} holat={korinish.holat} guruh={guruh} />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-black">{kalit}</div>
                      <div className="v3-xira truncate text-[10px]">{item.nom || kalit}</div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                      style={{ background: uslub.badgeBg, color: uslub.badgeColor }}
                    >
                      {item.matn || `×${soni}`}
                    </span>
                    {quyilganMl > 0 && (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-extrabold animate-pulse"
                        style={{
                          background: "var(--v3-urgu)",
                          color: "var(--v3-fon)",
                        }}
                      >
                        {miqdorniFormatla(quyilganMiqdor, birlik)}
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
