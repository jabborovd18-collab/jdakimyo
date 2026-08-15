"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

const EXAFS_NAMUNALARI = [
  { kompleks: "[Fe(H₂O)₆]²⁺", sfera: "1-sfera (Fe−O)", radius: "2.13 Å", nSon: "6.0", debye: "0.005 Å²", usul: "EXAFS" },
  { kompleks: "[Fe(CN)₆]³⁻", sfera: "1-sfera (Fe−C)", radius: "1.93 Å", nSon: "6.0", debye: "0.003 Å²", usul: "EXAFS" },
  { kompleks: "[Cu(H₂O)₆]²⁺", sfera: "Ekvatorial (Cu−O)", radius: "1.96 Å", nSon: "4.0", debye: "0.004 Å²", usul: "EXAFS (Yan-Teller)" },
  { kompleks: "sis-[PtCl₂(NH₃)₂]", sfera: "Pt−N / Pt−Cl", radius: "2.02 / 2.31 Å", nSon: "2.0 + 2.0", debye: "0.003 Å²", usul: "EXAFS" },
  { kompleks: "[Ni(CO)₄]", sfera: "1-sfera (Ni−C)", radius: "1.82 Å", nSon: "4.0", debye: "0.002 Å²", usul: "EXAFS" },
];

export default function EXAFSKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // EXAFS Fotoelektron To'lqin Vektori k (Å⁻¹) Kalkulyatori: k = sqrt(2m(E - E0) / hbar^2)
  const [fotonEnergiyasi, setFotonEnergiyasi] = useState(7150); // eV
  const [chegaraEnergiyasi, setChegaraEnergiyasi] = useState(7112); // Fe K-edge eV

  const kinetikEnergiyaEV = Math.max(0, fotonEnergiyasi - chegaraEnergiyasi);
  // k = 0.5123 * sqrt(E_kin)
  const tolqinVektoriK = (0.5123 * Math.sqrt(kinetikEnergiyaEV)).toFixed(2);

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200"
    >
      {/* ─── YUQORI HEADER ─── */}
      <header className="sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[var(--v3-fon-2)]/90 border-[var(--v3-chiziq)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ilmiy/tahlil"
            className="v3-tugma text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Tahlil usullari ro'yxatiga qaytish"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Tahlil Usullari</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)]">
              <Ikon nom="atom" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                EXAFS / XANES (Sinxrotron Yutilishi)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Mahalliy koordinatsion sfera, bog{"'"} uzunliklari va oksidlanish darajasi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
        </div>
      </header>

      {/* ─── ASOSIY MAZMUN ─── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* BIRIKMALAR BAZASI LINKI */}
        <Link
          href="/ilmiy/tahlil/exafs/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="atom" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Birikmalarning EXAFS / XANES Tahlili Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Kompleks birikmalarning rentgen yutilish spektrlari, mahalliy struktura,
                bog{"'"} uzunliklari (R), koordinatsion son (N) va Debay-Uoller parametrlari.
              </p>
            </div>
          </div>

          <div className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-5 font-bold flex items-center gap-1.5 shrink-0 group-hover:shadow-lg">
            <span>Bazasini Ochish</span>
            <Ikon nom="ong" olcham={14} />
          </div>
        </Link>

        {/* 1. ASOSIY ILMIY NAZARIYA */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Fundamental Metodologiya</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Sinxrotron Rentgen Yutilish Spektroskopiyasi</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
            <strong className="text-[var(--v3-urgu)]">EXAFS / XANES</strong> — monokristall o{"'"}stirish imkoni bo{"'"}lmagan,
            amorf, kukun yoki eritmada mavjud bo{"'"}lgan komplekslarning <strong>mahalliy nano-geometriyasini</strong>
            aniqlashning eng qudratli usulidir. Markaziy metall atomidan chiqayotgan fotoelektron to{"'"}lqini
            qo{"'"}shni ligand atomlaridan qayta sochilib, yutilish koeffitsientida tebranishlar (EXAFS modulyatsiyasi) hosil qiladi.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-[var(--v3-urgu)]">R ± 0.01 Å</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">M−L Bog{"'"} Radiusi</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-cyan-400">N ± 10%</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Koordinatsion Son</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-emerald-400">XANES Pog{"'"}ona</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Oksidlanish Darajasi</div>
            </div>
          </div>
        </div>

        {/* 2. INTERAKTIV EXAFS KALKULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Kvant Mexanikasi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Fotoelektron To{"'"}lqin Vektori (k) Simulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Rentgen foton energiyasi (E):</span>
                <strong className="text-[var(--v3-matn)]">{fotonEnergiyasi} eV</strong>
              </div>
              <input
                type="range"
                min="7112"
                max="8000"
                step="5"
                value={fotonEnergiyasi}
                onChange={(e) => setFotonEnergiyasi(Number(e.target.value) || 7112)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <label className="text-[var(--v3-xira)] text-[11px] block">Metallning K-yutilish chegarasi (E₀):</label>
              <select
                value={chegaraEnergiyasi}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setChegaraEnergiyasi(val);
                  setFotonEnergiyasi(Math.max(val + 30, fotonEnergiyasi));
                }}
                className="w-full px-3 py-1.5 rounded-lg border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              >
                <option value={7112}>Fe K-edge (7112 eV)</option>
                <option value={7709}>Co K-edge (7709 eV)</option>
                <option value={8333}>Ni K-edge (8333 eV)</option>
                <option value={8979}>Cu K-edge (8979 eV)</option>
                <option value={11564}>Pt L₃-edge (11564 eV)</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Fotoelektron Kinetik Energiyasi:</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">
                Ekin = {kinetikEnergiyaEV} eV
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">To{"'"}lqin Vektori:</div>
              <div className="text-lg font-bold text-cyan-400">
                k = {tolqinVektoriK} Å⁻¹
              </div>
            </div>
          </div>
        </div>

        {/* 3. EXAFS STRUKTURALARI JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Sinxrotron Natijalari</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Etalon Komplekslarning EXAFS Parametrlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kompleks</th>
                  <th className="py-2.5 px-3">Koordinatsion Sfera</th>
                  <th className="py-2.5 px-3">Masofa R (Å)</th>
                  <th className="py-2.5 px-3">Koordinatsion Son (N)</th>
                  <th className="py-2.5 px-3">Debay-Uoller (σ²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {EXAFS_NAMUNALARI.map((e, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{e.kompleks}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{e.sfera}</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{e.radius}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{e.nSon}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{e.debye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/rentgen"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Rentgen Difraksiyasi (XRD)</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/xps"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>XPS Fotoelektron Spektroskopiya</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
