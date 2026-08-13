"use client";

import { useState } from "react";
import Ikon from "@/components/Ikon";

// IUPAC 2024 Davriy Jadval Baza (Asosiy va keng tarqalgan elementlar)
export const ELEMENTLAR_BAZASI = [
  // 1-davr
  { z: 1, sym: "H", nom: "Vodorod", m: 1.008, guruh: "metallmas", blok: "s", ox: "+1, -1", konfig: "1s¹" },
  { z: 2, sym: "He", nom: "Geliy", m: 4.003, guruh: "nodir_gaz", blok: "s", ox: "0", konfig: "1s²" },

  // 2-davr
  { z: 3, sym: "Li", nom: "Litiy", m: 6.94, guruh: "ishqoriy", blok: "s", ox: "+1", konfig: "[He] 2s¹" },
  { z: 4, sym: "Be", nom: "Berilliy", m: 9.012, guruh: "ishqoriy_yer", blok: "s", ox: "+2", konfig: "[He] 2s²" },
  { z: 5, sym: "B", nom: "Bor", m: 10.81, guruh: "yarim_metall", blok: "p", ox: "+3", konfig: "[He] 2s² 2p¹" },
  { z: 6, sym: "C", nom: "Uglerod", m: 12.011, guruh: "metallmas", blok: "p", ox: "+4, +2, -4", konfig: "[He] 2s² 2p²" },
  { z: 7, sym: "N", nom: "Azot", m: 14.007, guruh: "metallmas", blok: "p", ox: "+5, +4, +3, +2, +1, -3", konfig: "[He] 2s² 2p³" },
  { z: 8, sym: "O", nom: "Kislorod", m: 15.999, guruh: "metallmas", blok: "p", ox: "-2, -1, +2", konfig: "[He] 2s² 2p⁴" },
  { z: 9, sym: "F", nom: "Ftor", m: 18.998, guruh: "galogen", blok: "p", ox: "-1", konfig: "[He] 2s² 2p⁵" },
  { z: 10, sym: "Ne", nom: "Neon", m: 20.18, guruh: "nodir_gaz", blok: "p", ox: "0", konfig: "[He] 2s² 2p⁶" },

  // 3-davr
  { z: 11, sym: "Na", nom: "Natriy", m: 22.99, guruh: "ishqoriy", blok: "s", ox: "+1", konfig: "[Ne] 3s¹" },
  { z: 12, sym: "Mg", nom: "Magniy", m: 24.305, guruh: "ishqoriy_yer", blok: "s", ox: "+2", konfig: "[Ne] 3s²" },
  { z: 13, sym: "Al", nom: "Alyuminiy", m: 26.982, guruh: "otish_keyingi", blok: "p", ox: "+3", konfig: "[Ne] 3s² 3p¹" },
  { z: 14, sym: "Si", nom: "Kremniy", m: 28.085, guruh: "yarim_metall", blok: "p", ox: "+4, -4", konfig: "[Ne] 3s² 3p²" },
  { z: 15, sym: "P", nom: "Fosfor", m: 30.974, guruh: "metallmas", blok: "p", ox: "+5, +3, -3", konfig: "[Ne] 3s² 3p³" },
  { z: 16, sym: "S", nom: "Oltingugurt", m: 32.06, guruh: "metallmas", blok: "p", ox: "+6, +4, +2, -2", konfig: "[Ne] 3s² 3p⁴" },
  { z: 17, sym: "Cl", nom: "Xlor", m: 35.45, guruh: "galogen", blok: "p", ox: "+7, +5, +3, +1, -1", konfig: "[Ne] 3s² 3p⁵" },
  { z: 18, sym: "Ar", nom: "Argon", m: 39.948, guruh: "nodir_gaz", blok: "p", ox: "0", konfig: "[Ne] 3s² 3p⁶" },

  // 4-davr
  { z: 19, sym: "K", nom: "Kaliy", m: 39.098, guruh: "ishqoriy", blok: "s", ox: "+1", konfig: "[Ar] 4s¹" },
  { z: 20, sym: "Ca", nom: "Kalsiy", m: 40.078, guruh: "ishqoriy_yer", blok: "s", ox: "+2", konfig: "[Ar] 4s²" },
  { z: 21, sym: "Sc", nom: "Skandiy", m: 44.956, guruh: "otish_metali", blok: "d", ox: "+3", konfig: "[Ar] 3d¹ 4s²" },
  { z: 22, sym: "Ti", nom: "Titan", m: 47.867, guruh: "otish_metali", blok: "d", ox: "+4, +3, +2", konfig: "[Ar] 3d² 4s²" },
  { z: 23, sym: "V", nom: "Vanadiy", m: 50.942, guruh: "otish_metali", blok: "d", ox: "+5, +4, +3, +2", konfig: "[Ar] 3d³ 4s²" },
  { z: 24, sym: "Cr", nom: "Xrom", m: 51.996, guruh: "otish_metali", blok: "d", ox: "+6, +3, +2", konfig: "[Ar] 3d⁵ 4s¹" },
  { z: 25, sym: "Mn", nom: "Marganets", m: 54.938, guruh: "otish_metali", blok: "d", ox: "+7, +6, +4, +2", konfig: "[Ar] 3d⁵ 4s²" },
  { z: 26, sym: "Fe", nom: "Temir", m: 55.845, guruh: "otish_metali", blok: "d", ox: "+3, +2", konfig: "[Ar] 3d⁶ 4s²" },
  { z: 27, sym: "Co", nom: "Kobalt", m: 58.933, guruh: "otish_metali", blok: "d", ox: "+3, +2", konfig: "[Ar] 3d⁷ 4s²" },
  { z: 28, sym: "Ni", nom: "Nikel", m: 58.693, guruh: "otish_metali", blok: "d", ox: "+2, +3", konfig: "[Ar] 3d⁸ 4s²" },
  { z: 29, sym: "Cu", nom: "Mis", m: 63.546, guruh: "otish_metali", blok: "d", ox: "+2, +1", konfig: "[Ar] 3d¹⁰ 4s¹" },
  { z: 30, sym: "Zn", nom: "Rux", m: 65.38, guruh: "otish_metali", blok: "d", ox: "+2", konfig: "[Ar] 3d¹⁰ 4s²" },
  { z: 31, sym: "Ga", nom: "Galliy", m: 69.723, guruh: "otish_keyingi", blok: "p", ox: "+3", konfig: "[Ar] 3d¹⁰ 4s² 4p¹" },
  { z: 32, sym: "Ge", nom: "Germaniy", m: 72.63, guruh: "yarim_metall", blok: "p", ox: "+4, +2", konfig: "[Ar] 3d¹⁰ 4s² 4p²" },
  { z: 33, sym: "As", nom: "Margumush", m: 74.922, guruh: "yarim_metall", blok: "p", ox: "+5, +3, -3", konfig: "[Ar] 3d¹⁰ 4s² 4p³" },
  { z: 34, sym: "Se", nom: "Selen", m: 78.971, guruh: "metallmas", blok: "p", ox: "+6, +4, -2", konfig: "[Ar] 3d¹⁰ 4s² 4p⁴" },
  { z: 35, sym: "Br", nom: "Brom", m: 79.904, guruh: "galogen", blok: "p", ox: "+5, +3, +1, -1", konfig: "[Ar] 3d¹⁰ 4s² 4p⁵" },
  { z: 36, sym: "Kr", nom: "Kripton", m: 83.798, guruh: "nodir_gaz", blok: "p", ox: "0, +2", konfig: "[Ar] 3d¹⁰ 4s² 4p⁶" },

  // Muhim og'ir elementlar
  { z: 47, sym: "Ag", nom: "Kumush", m: 107.87, guruh: "otish_metali", blok: "d", ox: "+1", konfig: "[Kr] 4d¹⁰ 5s¹" },
  { z: 53, sym: "I", nom: "Yod", m: 126.9, guruh: "galogen", blok: "p", ox: "+7, +5, +1, -1", konfig: "[Kr] 4d¹⁰ 5s² 5p⁵" },
  { z: 56, sym: "Ba", nom: "Bariy", m: 137.33, guruh: "ishqoriy_yer", blok: "s", ox: "+2", konfig: "[Xe] 6s²" },
  { z: 78, sym: "Pt", nom: "Platina", m: 195.08, guruh: "otish_metali", blok: "d", ox: "+4, +2", konfig: "[Xe] 4f¹⁴ 5d⁹ 6s¹" },
  { z: 79, sym: "Au", nom: "Oltin", m: 196.97, guruh: "otish_metali", blok: "d", ox: "+3, +1", konfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹" },
  { z: 80, sym: "Hg", nom: "Simob", m: 200.59, guruh: "otish_metali", blok: "d", ox: "+2, +1", konfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s²" },
  { z: 82, sym: "Pb", nom: "Qo'rg'oshin", m: 207.2, guruh: "otish_keyingi", blok: "p", ox: "+4, +2", konfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²" },
];

const GURUH_USLUBLARI = {
  ishqoriy: { nom: "Ishqoriy metallar", rang: "border-orange-500/40 bg-orange-500/10 text-orange-400" },
  ishqoriy_yer: { nom: "Ishqoriy-yer metallar", rang: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
  otish_metali: { nom: "O'tish metallari (d)", rang: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
  otish_keyingi: { nom: "O'tishdan keyingi", rang: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" },
  yarim_metall: { nom: "Yarim metallar (Metalloid)", rang: "border-teal-500/40 bg-teal-500/10 text-teal-400" },
  metallmas: { nom: "Oddiy metallmaslar", rang: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
  galogen: { nom: "Galogenlar", rang: "border-lime-500/40 bg-lime-500/10 text-lime-400" },
  nodir_gaz: { nom: "Nodir gazlar", rang: "border-sky-500/40 bg-sky-500/10 text-sky-400" },
};

export default function DavriyJadvalModal({ onYop }) {
  const [qidiruv, setQidiruv] = useState("");
  const [tanlanganGuruh, setTanlanganGuruh] = useState("hammasi");
  const [faolElement, setFaolElement] = useState(ELEMENTLAR_BAZASI[5]); // Default: C (Uglerod)

  const filtrlanganlar = ELEMENTLAR_BAZASI.filter((el) => {
    const matn = qidiruv.toLowerCase().trim();
    const mosQidiruv =
      !matn ||
      el.sym.toLowerCase().includes(matn) ||
      el.nom.toLowerCase().includes(matn) ||
      String(el.z).includes(matn);

    if (!mosQidiruv) return false;
    if (tanlanganGuruh === "hammasi") return true;
    return el.guruh === tanlanganGuruh;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] p-5 sm:p-7 space-y-5 shadow-2xl max-h-[94vh] overflow-y-auto">
        {/* ─── HEADER ─── */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">D.I. Mendeleyev Davriy Sistemasi</div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Interaktiv Kimyoviy Elementlar Jadvali (IUPAC)</span>
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

        {/* ─── QIDIRUV VA GURUHLAR FILTRI ─── */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <input
            type="text"
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Element belgisi, nomi yoki raqamini qidirish (H, Fe, 26)..."
            className="v3-kiritish w-full sm:max-w-md text-xs py-2"
          />

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            <button
              type="button"
              onClick={() => setTanlanganGuruh("hammasi")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                tanlanganGuruh === "hammasi"
                  ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold border-[var(--v3-urgu)]"
                  : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
              }`}
            >
              Hammasi
            </button>
            {Object.entries(GURUH_USLUBLARI).slice(0, 4).map(([k, g]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTanlanganGuruh(k)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  tanlanganGuruh === k
                    ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold border-[var(--v3-urgu)]"
                    : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
                }`}
              >
                {g.nom.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* ─── ASOSIY MAYDON: ELEMENTLAR KATALOGI & DETAL CARD ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Chap qism: Elementlar Grid Paneli (7 ustun) */}
          <div className="lg:col-span-7 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {filtrlanganlar.map((el) => {
              const uslub = GURUH_USLUBLARI[el.guruh] || GURUH_USLUBLARI.metallmas;
              const isFaol = faolElement.z === el.z;

              return (
                <button
                  key={el.z}
                  type="button"
                  onClick={() => setFaolElement(el)}
                  className={`p-2 rounded-xl border text-center font-mono transition-all flex flex-col justify-between ${uslub.rang} ${
                    isFaol ? "ring-2 ring-[var(--v3-urgu)] scale-105 shadow-lg bg-[var(--v3-yuza-2)]" : "hover:scale-102"
                  }`}
                >
                  <div className="flex justify-between text-[9px] text-[var(--v3-xira)]">
                    <span>{el.z}</span>
                    <span>{el.blok}</span>
                  </div>
                  <strong className="text-base sm:text-lg font-black my-0.5">{el.sym}</strong>
                  <div className="text-[9px] truncate opacity-85">{el.nom}</div>
                </button>
              );
            })}
          </div>

          {/* O'ng qism: Tanlangan Element Chuqur Tahlili (5 ustun) */}
          <div className="lg:col-span-5 p-5 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--v3-xira)] uppercase">Atom Raqami #{faolElement.z}</span>
                <h3 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
                  <span>{faolElement.nom}</span>
                  <span className="text-xs text-[var(--v3-xira)]">({faolElement.sym})</span>
                </h3>
              </div>

              {/* Katta Element Belgisi */}
              <div className="w-14 h-14 rounded-2xl border-2 border-[var(--v3-urgu)] bg-[var(--v3-yuza-2)] flex flex-col items-center justify-center font-mono shadow-lg">
                <span className="text-xs text-[var(--v3-xira)] leading-none">{faolElement.z}</span>
                <strong className="text-xl font-black text-[var(--v3-urgu)]">{faolElement.sym}</strong>
              </div>
            </div>

            {/* Parametrlar jadvali */}
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex justify-between">
                <span className="text-[var(--v3-xira)]">Nisbiy Atom Massa (Ar):</span>
                <strong className="text-emerald-400 font-bold">{faolElement.m} g/mol</strong>
              </div>

              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex justify-between">
                <span className="text-[var(--v3-xira)]">Oksidlanish darajalari:</span>
                <strong className="text-cyan-400 font-bold">{faolElement.ox}</strong>
              </div>

              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex justify-between">
                <span className="text-[var(--v3-xira)]">Elektron konfiguratsiya:</span>
                <strong className="text-amber-400 font-bold">{faolElement.konfig}</strong>
              </div>

              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex justify-between">
                <span className="text-[var(--v3-xira)]">Elementlar oilasi:</span>
                <strong className="text-[var(--v3-matn)]">
                  {GURUH_USLUBLARI[faolElement.guruh]?.nom || "Oddiy element"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
