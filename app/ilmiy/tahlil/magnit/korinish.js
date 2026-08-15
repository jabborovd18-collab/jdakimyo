"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ═══════════════════════════════════════════════════════════════════════════════
// MAGNITOMETRIYA VA MAGNIT SUSCEPTIBILITI (V3 ENSIKLOPEDIYA)
// ═══════════════════════════════════════════════════════════════════════════════

const MAGNIT_NAMUNALARI = [
  { komplek: "[Fe(CN)₆]⁴⁻", d: "d⁶ LS", n: 0, nazariy: "0.00 BM", eksp: "0.00 BM", xususiyat: "Diamagnit (S=0), barcha elektronlar juftlangan" },
  { komplek: "[Fe(H₂O)₆]²⁺", d: "d⁶ HS", n: 4, nazariy: "4.90 BM", eksp: "5.10–5.50 BM", xususiyat: "Paramagnit (S=2), orbital hissa (⁵T₂g yer holati)" },
  { komplek: "[Fe(CN)₆]³⁻", d: "d⁵ LS", n: 1, nazariy: "1.73 BM", eksp: "2.20–2.40 BM", xususiyat: "Past spinli paramagnit (S=1/2), ²T₂g orbital hissa" },
  { komplek: "[Fe(H₂O)₆]³⁺", d: "d⁵ HS", n: 5, nazariy: "5.92 BM", eksp: "5.90–6.00 BM", xususiyat: "Yuqori spinli (S=5/2), ⁶A₁g orbital hissasi yo'q (L=0)" },
  { komplek: "[Co(NH₃)₆]³⁺", d: "d⁶ LS", n: 0, nazariy: "0.00 BM", eksp: "0.00 BM", xususiyat: "Klassik Werner diamagniti (t₂g⁶eg⁰)" },
  { komplek: "[Co(H₂O)₆]²⁺", d: "d⁷ HS", n: 3, nazariy: "3.87 BM", eksp: "4.80–5.20 BM", xususiyat: "Kuchli orbital hissa (⁴T₁g), spin-orbit bog'lanish" },
  { komplek: "[Ni(H₂O)₆]²⁺", d: "d⁸", n: 2, nazariy: "2.83 BM", eksp: "3.10–3.30 BM", xususiyat: "³A₂g yer holati, spin-orbit hisobiga biroz yuqori" },
  { komplek: "[Cu(H₂O)₆]²⁺", d: "d⁹", n: 1, nazariy: "1.73 BM", eksp: "1.90–2.20 BM", xususiyat: "²Eg Yan-Teller buzilishi, g-faktor g > 2.0023" }
];

export default function MagnitKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // Interaktiv Spin-Only Magnit Moment Kalkulyatori
  const [toqElektronlarN, setToqElektronlarN] = useState(3);
  const [haroratKelvin, setHaroratKelvin] = useState(298);

  const muSpinOnly = Math.sqrt(toqElektronlarN * (toqElektronlarN + 2)).toFixed(2);
  const kyuriDoimiysiC = ((toqElektronlarN * (toqElektronlarN + 2)) / 8).toFixed(3);
  const molyarSezgirlikChi = (Number(kyuriDoimiysiC) / haroratKelvin).toExponential(3);

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
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Ikon nom="atom" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                Magnitometriya va Magnit Sezgirlik
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Spin holati (HS/LS), toq elektronlar soni (n), Gouy/SQUID tarozisi va Bor Magnetoni (BM)
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
          href="/ilmiy/tahlil/magnit/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-purple-500 group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="atom" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono text-purple-400">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-purple-400 transition-colors">
                Birikmalarning Magnit Xususiyatlari Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Eksperimental magnit momentlar (μ_eff), Kyuri-Vayss qonuni parametrlari,
                spin-krossover (SCO) hodisasi va diamagnit/paramagnit xulosalari.
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
            <div className="v3-nishon text-purple-400">Fundamental Kvant Magnetizmi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-purple-400" />
              <span>1. Kompleks Birikmalarda Magnit Sezgirlik Metodologiyasi</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] leading-relaxed text-xs sm:text-sm text-[var(--v3-matn)]">
            <strong className="text-purple-400">Magnitometriya</strong> — moddaning tashqi magnit maydoni bilan o{"'"}zaro 
            ta{"'"}sirini o{"'"}lchash orqali uning elektron tuzilishini aniqlash usuli. 
            Kompleks birikmada toq elektronlar bo{"'"}lsa, modda maydonga tortiladi 
            (<strong className="text-purple-400">paramagnit</strong>); agar barcha elektronlar juftlangan bo{"'"}lsa, 
            maydondan itariladi (<strong className="text-purple-400">diamagnit</strong>). 
            Ushbu usul <strong className="text-purple-400">oksidlanish darajasi, yuqori spin (HS) yoki past spin (LS) 
            holati va geometrik tuzilishni</strong> to{"'"}g{"'"}ridan-to{"'"}g{"'"}ri isbotlaydi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-purple-400">O{"'"}lchash Uskunalari</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Gouy tarozisi:</strong> Moddaning magnit maydondagi og{"'"}irlik o{"'"}zgarishi (Δm)</li>
                <li><strong>Evans YaMR usuli:</strong> Eritmada YaMR kimyoviy siljish farqi (Δν) orqali</li>
                <li><strong>SQUID magnetometr:</strong> 1.8 K gacha o{"'"}ta yuqori sezgirlikdagi o{"'"}lchovlar</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">Aniqlanadigan Parametrlar</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Toq elektronlar soni (n):</strong> Spin-only formulasi bo{"'"}yicha</li>
                <li><strong>HS vs LS holati:</strong> Masalan, [Fe(CN)₆]³⁻ (LS, n=1) vs [Fe(H₂O)₆]³⁺ (HS, n=5)</li>
                <li><strong>Orbital hissa:</strong> T-holat termlarida (Co²⁺ HS da μ_eff = 4.8–5.2 BM)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. SPIN-ONLY FORMULASI VA KALKULYATOR */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-purple-400">Kvant Formulalari</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-purple-400" />
              <span>2. Interaktiv Spin-Only Magnit Moment Kalkulyatori</span>
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-2">
            <div className="text-2xl font-mono font-black text-purple-400">
              μ_so = √(n(n + 2))  [Bor Magnetoni, BM]
            </div>
            <div className="text-xs text-[var(--v3-xira)]">
              Kyuri qonuni: χ_M = C / T • C = (N_A · μ_B² / 3k_B) · μ_eff² ≈ μ_eff² / 8
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Toq elektronlar soni (n):</span>
                <strong className="text-purple-400 font-mono">{toqElektronlarN} ta</strong>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={toqElektronlarN}
                onChange={(e) => setToqElektronlarN(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Harorat (Kelvin):</span>
                <strong className="text-cyan-400 font-mono">{haroratKelvin} K</strong>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={haroratKelvin}
                onChange={(e) => setHaroratKelvin(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Nazariy Magnit Moment (μ_so):</div>
              <div className="text-2xl font-black text-purple-400">{muSpinOnly} BM</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Molyar Magnit Sezgirlik (χ_M):</div>
              <div className="text-lg font-bold text-cyan-400">{molyarSezgirlikChi} cm³·mol⁻¹</div>
            </div>
          </div>
        </div>

        {/* 3. ETALON KOMPLEKSLAR MAGNIT JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-purple-400">Eksperimental Baza</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-purple-400" />
              <span>3. Etalon Komplekslarning Magnit Momentlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kompleks</th>
                  <th className="py-2.5 px-3">Konfiguratsiya</th>
                  <th className="py-2.5 px-3">n (toq e⁻)</th>
                  <th className="py-2.5 px-3">μ_so (Nazariy)</th>
                  <th className="py-2.5 px-3">μ_eff (Eksperimental)</th>
                  <th className="py-2.5 px-3">Magnit Holati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {MAGNIT_NAMUNALARI.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-purple-400">{m.komplek}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{m.d}</td>
                    <td className="py-2.5 px-3 text-amber-400">{m.n}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{m.nazariy}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{m.eksp}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{m.xususiyat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/mossbauer"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Mössbauer Spektroskopiyasi</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/elektrokimyo"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>Siklik Voltamperometriya</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
