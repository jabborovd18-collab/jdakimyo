"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

const MAGNIT_JADVALI = [
  { dn: "d¹", ion: "Ti³⁺", n: 1, nazariy: "1.73", tajriba: "1.7−1.8", holat: "Paramagnit (S = 1/2)" },
  { dn: "d²", ion: "V³⁺", n: 2, nazariy: "2.83", tajriba: "2.8−3.1", holat: "Paramagnit (S = 1)" },
  { dn: "d³", ion: "Cr³⁺", n: 3, nazariy: "3.87", tajriba: "3.7−3.9", holat: "Paramagnit (S = 3/2)" },
  { dn: "d⁴ (HS)", ion: "Cr²⁺, Mn³⁺", n: 4, nazariy: "4.90", tajriba: "4.8−4.9", holat: "Yuqori spin (t₂g³ eg¹)" },
  { dn: "d⁴ (LS)", ion: "Cr²⁺ (CN⁻)", n: 2, nazariy: "2.83", tajriba: "3.0−3.3", holat: "Quyi spin (t₂g⁴)" },
  { dn: "d⁵ (HS)", ion: "Fe³⁺, Mn²⁺", n: 5, nazariy: "5.92", tajriba: "5.7−6.0", holat: "Yuqori spin (t₂g³ eg²)" },
  { dn: "d⁵ (LS)", ion: "Fe³⁺ (CN⁻)", n: 1, nazariy: "1.73", tajriba: "2.2−2.4", holat: "Quyi spin (t₂g⁵)" },
  { dn: "d⁶ (HS)", ion: "Fe²⁺, Co³⁺ (F⁻)", n: 4, nazariy: "4.90", tajriba: "5.0−5.6", holat: "Yuqori spin (t₂g⁴ eg²)" },
  { dn: "d⁶ (LS)", ion: "Fe²⁺ (CN⁻), Co³⁺", n: 0, nazariy: "0.00", tajriba: "0.00", holat: "Diamagnit (t₂g⁶)" },
  { dn: "d⁷ (HS)", ion: "Co²⁺ (oktaedr)", n: 3, nazariy: "3.87", tajriba: "4.3−5.2", holat: "Yuqori spin (t₂g⁵ eg²)" },
  { dn: "d⁷ (LS)", ion: "Co²⁺ (kuchli maydon)", n: 1, nazariy: "1.73", tajriba: "1.8−2.0", holat: "Quyi spin (t₂g⁶ eg¹)" },
  { dn: "d⁸", ion: "Ni²⁺ (Oh)", n: 2, nazariy: "2.83", tajriba: "2.9−3.3", holat: "Paramagnit (t₂g⁶ eg²)" },
  { dn: "d⁸ (kv)", ion: "Ni²⁺, Pt²⁺, Pd²⁺", n: 0, nazariy: "0.00", tajriba: "0.00", holat: "Diamagnit (Kvadrat planar)" },
  { dn: "d⁹", ion: "Cu²⁺", n: 1, nazariy: "1.73", tajriba: "1.9−2.2", holat: "Paramagnit (Yan-Teller)" },
  { dn: "d¹⁰", ion: "Zn²⁺, Cu⁺, Ag⁺", n: 0, nazariy: "0.00", tajriba: "0.00", holat: "Diamagnit (S = 0)" },
];

export default function MagnitKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // Spin-Only Magnit Moment Kalkulyatori
  const [toqElektronlar, setToqElektronlar] = useState(2);
  const [haroratK, setHaroratK] = useState(298);

  const muEffSpinOnly = Math.sqrt(toqElektronlar * (toqElektronlar + 2)).toFixed(3);
  // Curie qonuni: chi_M = (mu_eff)^2 / (8 * T) = C / T
  const curieC = ((toqElektronlar * (toqElektronlar + 2)) / 8).toFixed(3);
  const chiM = (Number(curieC) / Math.max(1, haroratK)).toFixed(5);

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
              <Ikon nom="magnit" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                Magnitometriya (SQUID / Gouy)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Magnit qabul qiluvchanlik (χ), effektiv magnit moment (μeff) va spin holati
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
        {/* BIRIKMALAR MAGNIT BAZASIGA O'TISH KARTASI */}
        <Link
          href="/ilmiy/tahlil/magnit/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="magnit" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Birikmalarning Magnit Tahlili Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                K₃[Fe(CN)₆], [Fe(H₂O)₆]²⁺, [Co(NH₃)₆]Cl₃, [Ni(CN)₄]²⁻ va boshqa komplekslarning magnit momenti,
                yuqori va quyi spin holati, toq elektronlar soni hamda SQUID o{"'"}lchashlari.
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
              <span>Magnitometriya va Spin Holati</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
            <strong className="text-[var(--v3-urgu)]">Magnitometriya</strong> — koordinatsion birikmalarda
            markaziy metall ionining <strong>toq (juftlashmagan) elektronlar soni (n)</strong> va
            <strong> spin holatini (High-Spin vs Low-Spin)</strong> aniqlashning eng to{"'"}g{"'"}ridan-to{"'"}g{"'"}ri fizik metodidir.
            Kristall maydon yoriqlanishi (Δo) va elektronlar juftlashish energiyasi (P) o{"'"}rtasidagi nisbat
            bevosita magnit moment (μeff) orqali isbotlanadi.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-[var(--v3-urgu)]">μeff = √(n(n+2))</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Spin-Only Formulaci (BM)</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-cyan-400">μB = 9.274×10⁻²⁴</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Bor Magnetoni (J/T)</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-emerald-400">χM = C / (T − θ)</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Curie-Weiss Qonuni</div>
            </div>
          </div>
        </div>

        {/* 2. INTERAKTIV MAGNIT MOMENT KALKULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Interaktiv Simulyator</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Spin-Only Magnit Moment va Qabul Qiluvchanlik Kalkulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <label className="text-[var(--v3-xira)] block">Toq elektronlar soni (n):</label>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setToqElektronlar(val)}
                    className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                      toqElektronlar === val
                        ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)]"
                        : "bg-[var(--v3-fon-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
                    }`}
                  >
                    n = {val} {val === 0 ? "(Diamagnit)" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Harorat (T):</span>
                <strong className="text-[var(--v3-matn)]">{haroratK} K</strong>
              </div>
              <input
                type="range"
                min="2"
                max="400"
                value={haroratK}
                onChange={(e) => setHaroratK(Number(e.target.value) || 298)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[var(--v3-xira)]">
                <span>2 K (SQUID)</span>
                <span>77 K (Suyuq N₂)</span>
                <span>298 K (Xona)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Effektiv Magnit Moment:</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">
                μeff = {muEffSpinOnly} μB (BM)
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Molyar Magnit Qabul Qiluvchanlik:</div>
              <div className="text-lg font-bold text-cyan-400">
                χM = {chiM} cm³·mol⁻¹
              </div>
            </div>
          </div>
        </div>

        {/* 3. D-ELEKTRONLAR VA MAGNIT MOMENTLARI JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Eksperimental Ma{"'"}lumotlar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>dⁿ Konfiguratsiyalar va Nazariy vs Tajribaviy μeff</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Konfiguratsiya</th>
                  <th className="py-2.5 px-3">Ion Namunasi</th>
                  <th className="py-2.5 px-3">Toq e⁻ (n)</th>
                  <th className="py-2.5 px-3">μeff (Nazariy, BM)</th>
                  <th className="py-2.5 px-3">μeff (Tajribaviy, BM)</th>
                  <th className="py-2.5 px-3">Spin Holati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {MAGNIT_JADVALI.map((r, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{r.dn}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{r.ion}</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{r.n}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{r.nazariy}</td>
                    <td className="py-2.5 px-3 text-amber-400">{r.tajriba}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{r.holat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/mass"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Mass-spektrometriya</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/elektrokimyo"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>Elektrokimyoviy tahlil</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
