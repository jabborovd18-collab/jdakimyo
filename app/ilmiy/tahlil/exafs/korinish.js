"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ═══════════════════════════════════════════════════════════════════════════════
// EXAFS VA XANES — SINXROTRON RENTGEN YUTILISH SPEKTROSKOPIYASI (V3 ENSIKLOPEDIYA)
// ═══════════════════════════════════════════════════════════════════════════════

const EXAFS_NAMUNALARI = [
  { komplek: "[Fe(CN)₆]³⁻", qobiq: "Fe K-edge (7112 eV)", n: 6, r: "1.93 Å", sigma: "0.0022 Å²", izoh: "Kuchli C≡N kovalent bog'i, past Debay-Uoller tarqalishi" },
  { komplek: "[Co(NH₃)₆]³⁺", qobiq: "Co K-edge (7709 eV)", n: 6, r: "1.96 Å", sigma: "0.0025 Å²", izoh: "Klassik oktaedrik amin koordinatsiyasi, simmetrik qobiq" },
  { komplek: "sis-[PtCl₂(NH₃)₂]", qobiq: "Pt L₃-edge (11564 eV)", n: "2 N + 2 Cl", r: "Pt-N: 2.01 Å, Pt-Cl: 2.31 Å", sigma: "0.0030 Å²", izoh: "Saraton preparati: eritmada DNK ga bog'lanish kinetikasi" },
  { komplek: "[Cu(H₂O)₆]²⁺", qobiq: "Cu K-edge (8979 eV)", n: "4 ekv + 2 aks", r: "Cu-O: 1.97 Å (4), 2.28 Å (2)", sigma: "0.0065 Å²", izoh: "Yan-Teller cho'zilishi kristallsiz eritmada ham bevosita isbotlanadi" },
  { komplek: "[Ni(CN)₄]²⁻", qobiq: "Ni K-edge (8333 eV)", n: 4, r: "1.86 Å", sigma: "0.0020 Å²", izoh: "Kvadrat tekislik D4h geometriyasi, qisqa Ni-C masofasi" },
  { komplek: "[Fe(C₅H₅)₂] Ferrosen", qobiq: "Fe K-edge (7112 eV)", n: 10, r: "2.05 Å", sigma: "0.0035 Å²", izoh: "Sendvich kompleks: temir atomidan 10 ta uglerodga masofa" }
];

export default function EXAFSKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // Interaktiv Fotoelektron To'lqin Soni (k) va Radial Masofa Simulyatori
  const [fotoelektronK, setFotoelektronK] = useState(8.5); // Å⁻¹
  const [debyeWaller, setDebyeWaller] = useState(0.003); // Å²

  const debyeSochilish = Math.exp(-2 * debyeWaller * Math.pow(fotoelektronK, 2)).toFixed(3);
  const tobaEnergiyaEV = (Math.pow(fotoelektronK, 2) * 3.81).toFixed(1);

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
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Ikon nom="atom" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                EXAFS va XANES Spektroskopiyasi
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Sinxrotron rentgen yutilishi, koordinatsion son (N) va bog{"'"} uzunliklari (±0.01 Å)
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
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-500 group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="atom" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono text-emerald-400">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-emerald-400 transition-colors">
                Birikmalarning EXAFS/XANES Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Kompleks birikmalarning rentgen yutilish spektrlari, mahalliy atomik atrof,
                Fure-o{"'"}zgartirish profillari va Debay-Uoller faktorlari.
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
            <div className="v3-nishon text-emerald-400">Fundamental XAS Metodologiyasi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-emerald-400" />
              <span>1. XAS (X-ray Absorption Spectroscopy) — XANES va EXAFS</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] leading-relaxed text-xs sm:text-sm text-[var(--v3-matn)]">
            <strong className="text-emerald-400">EXAFS (Extended X-ray Absorption Fine Structure)</strong> va 
            <strong className="text-emerald-400"> XANES (X-ray Absorption Near Edge Structure)</strong> — sinxrotron 
            nurlanishi manbaida metall atomlarining ichki elektron qobiqlaridan (K yoki L chekkalari) fotoelektronlar urib 
            chiqarilishi va qo{"'"}shni atomlar tomonidan sochilishiga asoslangan zamonaviy usul. 
            Rentgen difraksiyasidan farqli ravishda, EXAFS <strong className="text-emerald-400">kristall bo{"'"}lmagan namunalarda 
            (suyuq eritma, amorf kukun, tirik biologik to{"'"}qima, ferment)</strong> ham metall atrofidagi 
            bog{"'"} uzunliklarini <strong className="text-emerald-400">±0.01 Å aniqlikda</strong> o{"'"}lchay oladi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">XANES Sohasi (E₀ dan +50 eV gacha)</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Oksidlanish darajasi:</strong> Chekka energiyasi siljishi (Edge shift)</li>
                <li><strong>Koordinatsiya geometriyasi:</strong> Pre-edge cho{"'"}qqisi (1s → 3d/4p o{"'"}tish)</li>
                <li><strong>Markazsimmetriya:</strong> Td da kuchli pre-edge pik, Oh da zaif (Laport taqiqi)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-emerald-400">EXAFS Sohasi (+50 dan +1000 eV gacha)</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Bog{"'"} uzunligi (R):</strong> ±0.01 Å aniqlik bilan metall-ligand masofasi</li>
                <li><strong>Koordinatsion son (N):</strong> Metall atrofidagi birinchi/ikkinchi qobiq atomlar soni</li>
                <li><strong>Debay-Uoller faktori (σ²):</strong> Issiqlik va statik tebranish buzilishlari</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. EXAFS MATEMATIK TENGLAMASI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-emerald-400">Matematik Qonuniyat</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-emerald-400" />
              <span>2. Standart EXAFS Tenglamasi va Fure-O{"'"}zgartirish</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-3 font-mono">
            <div className="text-sm sm:text-base font-bold text-emerald-400">
              χ(k) = Σ [ N_j · S₀² · F_j(k) / (k · R_j²) ] · exp(−2σ_j² · k²) · exp(−2R_j/λ) · sin(2k·R_j + φ_j)
            </div>
            <p className="text-xs text-[var(--v3-xira)] font-sans max-w-xl mx-auto">
              Fotoelektron to{"'"}lqin vektori k = √(2m(E − E₀)/ℏ²) bo{"'"}lib, Fure-o{"'"}zgartirish orqali
              k-fazodan real fazoviy masofalar profiliga (Radial Distribution Function) o{"'"}tiladi.
            </p>
          </div>
        </div>

        {/* 3. INTERAKTIV DEBAY-UOLLER VA FOTOELEKTRON SIMULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-emerald-400">Kvant Simulyatsiyasi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-emerald-400" />
              <span>3. Fotoelektron To{"'"}lqin Vektori va Debay-Uoller Sochilish Simulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Fotoelektron to{"'"}lqin soni (k):</span>
                <strong className="text-emerald-400 font-mono">{fotoelektronK} Å⁻¹</strong>
              </div>
              <input
                type="range"
                min="2.0"
                max="16.0"
                step="0.5"
                value={fotoelektronK}
                onChange={(e) => setFotoelektronK(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Debay-Uoller tebranish koeffitsienti (σ²):</span>
                <strong className="text-cyan-400 font-mono">{debyeWaller} Å²</strong>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.010"
                step="0.001"
                value={debyeWaller}
                onChange={(e) => setDebyeWaller(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Fotoelektron Kinetik Energiyasi (E − E₀):</div>
              <div className="text-2xl font-black text-emerald-400">{tobaEnergiyaEV} eV</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Tebranish Sochilish Omili exp(−2σ²k²):</div>
              <div className="text-lg font-bold text-cyan-400">{debyeSochilish}</div>
            </div>
          </div>
        </div>

        {/* 4. ETALON KOMPLEKSLAR EXAFS JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-emerald-400">Eksperimental Natijalar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-emerald-400" />
              <span>4. Etalon Komplekslarning EXAFS Parametrlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kompleks</th>
                  <th className="py-2.5 px-3">Yutilish Chekkasi</th>
                  <th className="py-2.5 px-3">Koordinatsion Son N</th>
                  <th className="py-2.5 px-3">Bog{"'"} Uzunligi R (Å)</th>
                  <th className="py-2.5 px-3">σ² (Å²)</th>
                  <th className="py-2.5 px-3">Xususiyati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {EXAFS_NAMUNALARI.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{m.komplek}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{m.qobiq}</td>
                    <td className="py-2.5 px-3 text-amber-400">{m.n}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-urgu)]">{m.r}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{m.sigma}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{m.izoh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/icp"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>ICP-OES / ICP-MS Plazma</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/xps"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>XPS Rentgen Fotoelektron</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
