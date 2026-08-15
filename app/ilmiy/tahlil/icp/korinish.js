"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

const ICP_ELEMENTLARI = [
  { element: "Pt (Platina)", spektr: "214.42 nm", icpMs: "¹⁹⁵Pt (33.8%)", lod: "0.001 ppb (ppt)", usul: "ICP-MS" },
  { element: "Ru (Ruteniy)", spektr: "240.27 nm", icpMs: "¹⁰²Ru (31.6%)", lod: "0.005 ppb", usul: "ICP-MS" },
  { element: "Fe (Temir)", spektr: "238.20 nm", icpMs: "⁵⁶Fe (91.7%)", lod: "0.05 ppb", usul: "ICP-OES / MS" },
  { element: "Co (Kobalt)", spektr: "228.62 nm", icpMs: "⁵⁹Co (100%)", lod: "0.002 ppb", usul: "ICP-MS" },
  { element: "Cu (Mis)", spektr: "324.75 nm", icpMs: "⁶³Cu (69.2%)", lod: "0.01 ppb", usul: "ICP-OES / MS" },
  { element: "Gd (Gadoliniy)", spektr: "342.25 nm", icpMs: "¹⁵⁸Gd (24.8%)", lod: "0.0005 ppb", usul: "HR-ICP-MS" },
];

export default function ICPKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // ICP-MS Izotop Intensivligi Kalkulyatori
  const [metallPpb, setMetallPpb] = useState(10.0);
  const [izotopUlushi, setIzotopUlushi] = useState(33.8); // % (masalan 195Pt)

  const hisoblanganSignalCPS = Math.round(metallPpb * (izotopUlushi / 100) * 125000);

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
              <Ikon nom="plazma" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                ICP-OES / ICP-MS (Plazma Spektrometriyasi)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Ko{"'"}p elementli ultra-iz tahlil, ppb-ppt sezgirlik va izotopik nisbatlar
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
          href="/ilmiy/tahlil/icp/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="plazma" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Birikmalarning ICP Tahlili Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Kompleks birikmalarning ko{"'"}p elementli ICP tahlili, metall konsentratsiyasi,
                izotop nisbatlari va ultra-iz nopokliklar tahlili.
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
              <span>Induktiv Bog{"'"}langan Plazma Spektrometriyasi</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
            <strong className="text-[var(--v3-urgu)]">ICP-MS va ICP-OES</strong> — yuqori chastotali elektromagnit maydon bilan
            qo{"'"}zg{"'"}atilgan <strong>argon plazmasi (6000 ... 10000 K)</strong> yordamida namunani to{"'"}liq
            atomlashtirib va ionlashtirib, bir vaqtning o{"'"}zida 70 dan ortiq elementlarni ultra-iz (ppt = 10⁻¹² g/g)
            darajasida tahlil qiluvchi analitik metoddir.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-[var(--v3-urgu)]">T ~ 8000 K</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Argon Plazma Harorati</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-cyan-400">70+ Element</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Bir Vaqtning O{"'"}zida</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-emerald-400">LOD ~ ppt</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Pikogramm Sezgirlik</div>
            </div>
          </div>
        </div>

        {/* 2. INTERAKTIV ICP-MS KALKULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Interaktiv Simulyator</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>ICP-MS Detektor Signali (CPS) Simulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Metall konsentratsiyasi (ppb):</span>
                <strong className="text-[var(--v3-matn)]">{metallPpb} ppb (ng/mL)</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.5"
                value={metallPpb}
                onChange={(e) => setMetallPpb(Number(e.target.value) || 0.1)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Izotopning tabiiy tarqalganligi:</span>
                <strong className="text-[var(--v3-matn)]">{izotopUlushi}%</strong>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={izotopUlushi}
                onChange={(e) => setIzotopUlushi(Number(e.target.value) || 1)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Kvadrupol Mass-Detektor Signali:</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">
                {hisoblanganSignalCPS.toLocaleString()} CPS (impulslar/s)
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Aniqlash Ishonchliligi:</div>
              <div className="text-lg font-bold text-emerald-400">
                99.9% (Signal/Shovqin &gt; 1000)
              </div>
            </div>
          </div>
        </div>

        {/* 3. ELEMENTLAR ICP JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Spektral va Izotopik Xarakteristikalar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Kompleks Metallarining ICP-OES va ICP-MS Parametrlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Metall</th>
                  <th className="py-2.5 px-3">Emissiya Chizig{"'"}i (OES)</th>
                  <th className="py-2.5 px-3">Asosiy Izotop (MS)</th>
                  <th className="py-2.5 px-3">Sezgirlik (LOD)</th>
                  <th className="py-2.5 px-3">Tavsiya Metodi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {ICP_ELEMENTLARI.map((el, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{el.element}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{el.spektr}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{el.icpMs}</td>
                    <td className="py-2.5 px-3 text-amber-400">{el.lod}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{el.usul}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/aas"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>AAS Spektroskopiya</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/mass"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>Mass-spektrometriya</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
