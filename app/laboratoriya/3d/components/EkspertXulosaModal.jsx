"use client";

import Ikon from "@/components/Ikon";
import { ekspertXulosasiniTuz } from "../lib/ekspert-xulosa.js";
import { labDaftariPdfYukla } from "../lib/pdf-hisobot.js";
import toast from "react-hot-toast";

export default function EkspertXulosaModal({
  natija,
  nisbat,
  kinetika,
  jurnal = [],
  foydalanuvchiNom = "Talaba",
  onYop,
  onXRayOch,
}) {
  if (!natija) return null;

  const tahlil = ekspertXulosasiniTuz({
    reaksiya: natija.reaksiya,
    nisbat,
    kinetika,
    jurnal,
  });

  const pdfYuklabOlish = async () => {
    try {
      toast.loading("Laboratoriya daftari (PDF) tayyorlanmoqda...", { id: "pdf" });
      await labDaftariPdfYukla({
        foydalanuvchiNom,
        tenglama: tahlil.tenglama,
        observations: tahlil.kuzatuv,
        nisbat,
        kinetika,
        jurnal,
      });
      toast.success("Laboratoriya hisoboti muvaffaqiyatli yuklandi!", { id: "pdf" });
    } catch (err) {
      toast.error("PDF yaratishda xatolik: " + err.message, { id: "pdf" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">5-Bosqich: Post-Factum Tahlil</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="orin" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Ilmiy Ekspert Xulosasi</span>
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

        {/* Reaksiya Tenglamasi va Nomi */}
        <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-1.5 text-center">
          <div className="text-xs text-[var(--v3-xira)]">{tahlil.nomi}</div>
          <div className="font-mono text-sm sm:text-base font-bold text-[var(--v3-urgu)]">
            {tahlil.tenglama}
          </div>
        </div>

        {/* Unum va Kinetika Taqqosi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
            <span className="text-[10.5px] font-mono uppercase text-emerald-300 block">
              Reaksiya Unumi (Yield %)
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {tahlil.unumFoizi}%
            </div>
            <p className="text-[11px] text-[var(--v3-xira)] leading-relaxed">
              {tahlil.cheklovchiReagentIzohi}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
            <span className="text-[10.5px] font-mono uppercase text-amber-300 block">
              Harorat va Kinetika ({tahlil.harorat}°C)
            </span>
            <div className="text-2xl font-black font-mono text-amber-400">
              T = {tahlil.harorat}°C
            </div>
            <p className="text-[11px] text-[var(--v3-xira)] leading-relaxed">
              {tahlil.haroratIzohi}
            </p>
          </div>
        </div>

        {/* Pedagogik Tavsiyalar */}
        <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-2">
          <div className="font-bold text-xs text-[var(--v3-matn)] flex items-center gap-1.5">
            <Ikon nom="quiz" olcham={14} className="text-[var(--v3-urgu)]" />
            <span>O{"'"}rganilgan darslar va tavsiyalar:</span>
          </div>
          <ul className="space-y-1 text-xs text-[var(--v3-matn)] list-disc list-inside">
            {tahlil.tavsiyalar.map((t, i) => (
              <li key={i} className="leading-relaxed">{t}</li>
            ))}
          </ul>
        </div>

        {/* Jurnal Qadamlari */}
        {tahlil.jurnalQadamlari?.length > 0 && (
          <div className="space-y-2">
            <div className="v3-nishon">Qadam-baqadam amaliyot tarixi:</div>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
              {tahlil.jurnalQadamlari.map((j) => (
                <div
                  key={j.qadam}
                  className="p-2 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] flex items-center justify-between"
                >
                  <span>{j.qadam}-qadam: {j.amal} ({j.reagent})</span>
                  <span className="text-[var(--v3-urgu)]">{j.ml ? `${j.ml} ml` : 'bajarildi'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--v3-chiziq)]">
          <div className="flex items-center gap-2">
            {typeof onXRayOch === "function" && (
              <button
                type="button"
                onClick={onXRayOch}
                className="v3-tugma text-xs py-2 px-3 text-amber-400 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 font-bold flex items-center gap-1.5"
                title="Mortal Kombat X-Ray Slow-Mo Bog'lar Uzilishi"
              >
                <Ikon nom="chaqmoq" olcham={14} />
                <span>⚡ X-Ray Slow-Mo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onYop}
              className="v3-tugma text-xs py-2 px-4"
            >
              Yopish
            </button>

            <button
              type="button"
              onClick={pdfYuklabOlish}
              className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-5 font-bold inline-flex items-center gap-2"
            >
              <Ikon nom="fayl" olcham={14} />
              <span>Laboratoriya Daftarini Yuklash (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
