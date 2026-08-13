"use client";

import { useState } from "react";
import Ikon from "@/components/Ikon";
import { AMALIY_MASHGULOTLAR } from "../lib/amaliy-mashgulotlar.js";
import { shishaUrilishi } from "../lib/ovoz.js";
import toast from "react-hot-toast";

export default function AmaliyMashgulotModal({ onYop, onMashgulotBoshlandi }) {
  const [tanlanganId, setTanlanganId] = useState(AMALIY_MASHGULOTLAR[0].id);
  const [bajarilganQadamlar, setBajarilganQadamlar] = useState({});

  const mashgulot = AMALIY_MASHGULOTLAR.find((m) => m.id === tanlanganId) || AMALIY_MASHGULOTLAR[0];

  const handleQadamToggle = (qid) => {
    setBajarilganQadamlar((prev) => {
      const yangi = { ...prev, [qid]: !prev[qid] };
      shishaUrilishi(2200);
      return yangi;
    });
  };

  const bajarilganSoni = mashgulot.qadamlar.filter((q) => bajarilganQadamlar[q.id]).length;
  const foiz = Math.round((bajarilganSoni / mashgulot.qadamlar.length) * 100);

  const handleBoshlash = () => {
    toast.success(`"${mashgulot.nomi}" amaliy mashg'uloti boshlandi!`);
    if (typeof onMashgulotBoshlandi === "function") {
      onMashgulotBoshlandi(mashgulot);
    }
    onYop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] p-5 sm:p-7 space-y-5 shadow-2xl max-h-[94vh] overflow-y-auto">
        {/* ─── HEADER ─── */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">4-Qadam: Oliy & DTM Ta{"'"}lim Dasturi</div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Ssenariyli Amaliy Laboratoriya Mashg{"'"}ulotlari</span>
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

        {/* ─── MASHG'ULOTLAR RO'YXATI (TABS) ─── */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {AMALIY_MASHGULOTLAR.map((m) => {
            const isFaol = tanlanganId === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setTanlanganId(m.id);
                  setBajarilganQadamlar({});
                }}
                className={`p-3 rounded-xl border text-left shrink-0 max-w-xs space-y-1 transition-all ${
                  isFaol
                    ? "bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-sm ring-1 ring-[var(--v3-urgu)]"
                    : "bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[var(--v3-urgu)]">
                  <span>{m.fan}</span>
                  <span className="v3-tag v3-tag-ochiq">{m.qiyinlik}</span>
                </div>
                <div className="font-bold text-xs text-[var(--v3-matn)] truncate">{m.nomi}</div>
              </button>
            );
          })}
        </div>

        {/* ─── TANLANGAN MASHG'ULOT DETAIL PANELI ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Chap qism: Maqsad, Tenglama va Mukofot (5 ustun) */}
          <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-3.5">
            <div>
              <span className="text-[10px] font-mono text-[var(--v3-xira)] uppercase">
                {mashgulot.raqam}-Amaliy Mashg{"'"}ulot
              </span>
              <h3 className="text-base font-bold text-[var(--v3-matn)] leading-snug">
                {mashgulot.nomi}
              </h3>
            </div>

            {/* Maqsad */}
            <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1 text-xs">
              <span className="v3-nishon">Ishning maqsadi:</span>
              <p className="text-[var(--v3-matn)] leading-relaxed">{mashgulot.maqsad}</p>
            </div>

            {/* Reaksiya tenglamasi */}
            <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1 text-xs">
              <span className="v3-nishon">Kimyoviy tenglama:</span>
              <div className="font-mono font-bold text-xs text-[var(--v3-urgu)] truncate">
                {mashgulot.tenglama}
              </div>
            </div>

            {/* Reagentlar va Jihozlar */}
            <div className="space-y-1 text-xs font-mono text-[var(--v3-xira)]">
              <div>Kerakli reagentlar: <strong className="text-[var(--v3-matn)]">{mashgulot.reagentlar.join(", ")}</strong></div>
              <div>Kerakli jihozlar: <strong className="text-[var(--v3-matn)]">{mashgulot.jihozlar.join(", ")}</strong></div>
            </div>

            {/* Mukofotlar */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 font-mono text-xs">
              <span className="text-yellow-300 font-bold">Muvaffaqiyatli topshirish:</span>
              <div className="flex items-center gap-2 font-bold text-[var(--v3-matn)]">
                <span className="text-yellow-400">+{mashgulot.xp} XP</span>
                <span>+{mashgulot.tanga} 🪙</span>
              </div>
            </div>
          </div>

          {/* O'ng qism: Qadam-baqadam Kvest Tracker (7 ustun) */}
          <div className="lg:col-span-7 p-4 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[var(--v3-matn)] flex items-center gap-1.5">
                <Ikon nom="quiz" olcham={15} className="text-[var(--v3-urgu)]" />
                <span>Bosqichma-bosqich Amaliy Qadamlar:</span>
              </div>

              <span className="v3-tag v3-tag-ochiq font-mono font-bold text-xs">
                Bajarildi: {bajarilganSoni} / {mashgulot.qadamlar.length} ({foiz}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[var(--v3-fon)] overflow-hidden border border-[var(--v3-chiziq)]">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${foiz}%` }}
              />
            </div>

            {/* Qadamlar ro'yxati */}
            <div className="space-y-2">
              {mashgulot.qadamlar.map((q, idx) => {
                const isBajarildi = Boolean(bajarilganQadamlar[q.id]);

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleQadamToggle(q.id)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                      isBajarildi
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-[var(--v3-chiziq)] bg-[var(--v3-fon)] text-[var(--v3-matn)] hover:border-[var(--v3-urgu)]"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${
                      isBajarildi ? "bg-emerald-500 text-black border-emerald-400" : "border-[var(--v3-chiziq)] text-[var(--v3-xira)]"
                    }`}>
                      {isBajarildi ? "✓" : idx + 1}
                    </span>

                    <span className={`leading-relaxed ${isBajarildi ? "line-through opacity-85" : ""}`}>
                      {q.matn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Yakuniy xulosa */}
            {foiz === 100 && (
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs font-mono text-emerald-300 space-y-1 animate-in fade-in duration-200">
                <div className="font-bold flex items-center gap-1.5">
                  <Ikon nom="belgi" olcham={15} />
                  <span>Laboratoriya Ishtiroki Muvaffaqiyatli Bajarildi!</span>
                </div>
                <p className="text-[11px] opacity-90">{mashgulot.xulosa}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={handleBoshlash}
                className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold inline-flex items-center gap-2"
              >
                <Ikon nom="kolba" olcham={14} />
                <span>3D Stolda Mashg{"'"}ulotni Boshlash</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
