"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ═══════════════════════════════════════════════════════════════════════════════
// ICP-OES VA ICP-MS — PLAZMA ELEMENT TAHLILI (V3 ENSIKLOPEDIYA)
// ═══════════════════════════════════════════════════════════════════════════════

const ICP_PARAMETRLARI = [
  { metall: "Fe (Temir)", oesWv: "238.2 / 259.9 nm", msMz: "56 (91.7%)", lodOes: "0.5 μg/L", lodMs: "0.5 ng/L", inter: "⁴⁰Ar¹⁶O⁺ (m/z=56) — He to'qnashuv kamerasi (KED)" },
  { metall: "Cu (Mis)", oesWv: "324.7 / 327.4 nm", msMz: "63 (69.2%)", lodOes: "0.3 μg/L", lodMs: "0.2 ng/L", inter: "⁴⁰Ar²³Na⁺ (m/z=63) — past matritsa effekti" },
  { metall: "Co (Kobalt)", oesWv: "228.6 / 238.9 nm", msMz: "59 (100%)", lodOes: "0.5 μg/L", lodMs: "0.1 ng/L", inter: "Mononuklid izotop — interferensiyalarsiz" },
  { metall: "Ni (Nikel)", oesWv: "231.6 / 221.6 nm", msMz: "58 (68.1%)", lodOes: "0.8 μg/L", lodMs: "0.3 ng/L", inter: "⁴⁰Ar¹⁸O⁺, ⁵⁸Fe — He rejimi" },
  { metall: "Cr (Xrom)", oesWv: "267.7 / 283.6 nm", msMz: "52 (83.8%)", lodOes: "0.5 μg/L", lodMs: "0.3 ng/L", inter: "⁴⁰Ar¹²C⁺ (m/z=52) — DRC reaksiya kamerasi (NH₃)" },
  { metall: "Pt (Platina)", oesWv: "214.4 / 265.9 nm", msMz: "195 (33.8%)", lodOes: "2.0 μg/L", lodMs: "0.05 ng/L", inter: "Yuqori massa — poliatomik interferensiyalar yo'q" },
  { metall: "Ru (Ruteniy)", oesWv: "240.2 / 267.8 nm", msMz: "102 (31.6%)", lodOes: "1.0 μg/L", lodMs: "0.05 ng/L", inter: "Fotokatalizatorlar va quyosh batareyalari tahlili" },
  { metall: "Ag (Kumush)", oesWv: "328.1 / 338.3 nm", msMz: "107 (51.8%)", lodOes: "0.5 μg/L", lodMs: "0.1 ng/L", inter: "Mononuklid jufti (¹⁰⁷Ag, ¹⁰⁹Ag)" },
  { metall: "Zn (Rux)", oesWv: "213.9 / 206.2 nm", msMz: "64 (49.2%)", lodOes: "0.2 μg/L", lodMs: "0.1 ng/L", inter: "⁴⁰Ar²⁴Mg⁺ — oz ta'sir" }
];

export default function ICPKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // Interaktiv Plazma Quvvati & Sezgirlik Simulyatori
  const [plazmaQuvvat, setPlazmaQuvvat] = useState(1350); // Watt
  const [argonOqim, setArgonOqim] = useState(15.0); // L/min

  const ionlanishDarajasi = Math.min(99.9, ((plazmaQuvvat / 1500) * 98.5 + (argonOqim / 20) * 1.4)).toFixed(1);
  const haroratK = Math.round(5500 + (plazmaQuvvat - 1000) * 6.5);

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
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Ikon nom="atom" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                ICP-OES va ICP-MS (Plazma Spektrometriyasi)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                6000–10000 K induktiv argon plazmasi, ko{"'"}p elementli tahlil va izotop nisbatlari
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
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan-500 group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="atom" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono text-cyan-400">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-cyan-400 transition-colors">
                Birikmalarning ICP-OES/MS Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Bir vaqtning o{"'"}zida 60+ elementni ppt darajasida aniqlash, izotop nisbatlari va
                matritsa interferensiyalarini chegirish.
              </p>
            </div>
          </div>

          <div className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-5 font-bold flex items-center gap-1.5 shrink-0 group-hover:shadow-lg">
            <span>Bazasini Ochish</span>
            <Ikon nom="ong" olcham={14} />
          </div>
        </Link>

        {/* 1. ASOSIY METODIK NAZARIYA */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-cyan-400">Fundamental Plazma Kimyosi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-cyan-400" />
              <span>1. ICP-OES va ICP-MS Fizik-Kimyoviy Asoslari</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] leading-relaxed text-xs sm:text-sm text-[var(--v3-matn)]">
            <strong className="text-cyan-400">ICP (Inductively Coupled Plasma)</strong> — 
            <strong className="text-cyan-400"> 6000−10000 K</strong> haroratdagi argon plazmasida namunani 
            to{"'"}liq atomlashtirish va ionlashtirishga asoslangan eng kuchli element tahlil usuli.
            <strong className="text-cyan-400"> ICP-OES (Optical Emission)</strong> qo{"'"}zg{"'"}algan atomlarning nur taratishini, 
            <strong className="text-cyan-400"> ICP-MS (Mass Spectrometry)</strong> esa hosil bo{"'"}lgan ionlarning massa/zaryad (m/z) nisbatini o{"'"}lchaydi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">ICP-OES (Optik Emission)</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Prinsip:</strong> Har bir elementning xarakteristik emissiya chiziqlari</li>
                <li><strong>LOD:</strong> 0.1 — 10 μg/L (ppb)</li>
                <li><strong>Dinamik diapazon:</strong> 10⁶ gacha (juda keng)</li>
                <li><strong>Afzalligi:</strong> Yuqori tuzli matritsalarga chidamli</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-emerald-400">ICP-MS (Mass-Spektrometriya)</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Prinsip:</strong> Kvadrupol yoki TOF massa separatori (m/z)</li>
                <li><strong>LOD:</strong> 0.001 — 0.1 ng/L (ppq — ppt)</li>
                <li><strong>Izotop tahlili:</strong> Barcha izotoplar alohida o{"'"}lchanadi</li>
                <li><strong>Afzalligi:</strong> Ultra-iz konsentratsiyalarni aniqlash</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. PLAZMA ZONALARI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-cyan-400">Plazma Harorat Profili</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="alanga" olcham={20} className="text-cyan-400" />
              <span>2. Induktiv Plazma Geometriyasi va 3 Asosiy Zona</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-rose-400">Tashqi Toroid (10 000 K)</h3>
              <p className="text-[var(--v3-matn)]">
                RF induksion g{"'"}altak (27.12 MHz) maydonida elektronlarning argon atomlari bilan to{"'"}qnashuv zonasi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-amber-400">Markaziy Kanal (6 000 K)</h3>
              <p className="text-[var(--v3-matn)]">
                Namuna aerozoli purkaladi — erituvchi bug{"'"}lanadi, molekulalar atomlarga va M⁺ kationlariga parchalanadi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">Analitik Zona (5 000 K)</h3>
              <p className="text-[var(--v3-matn)]">
                Optik detektor fotonlarni yig{"'"}adi yoki vakuumni ochuvchi skimmer-konus orqali mass-spektrometrga tortiladi.
              </p>
            </div>
          </div>
        </div>

        {/* 3. INTERAKTIV PLAZMA PARAMETRLARI SIMULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-cyan-400">Plazma Fizikasi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-cyan-400" />
              <span>3. Interaktiv Plazma Quvvati va Ionizatsiya Simulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>RF Generator Quvvati:</span>
                <strong className="text-cyan-400 font-mono">{plazmaQuvvat} Watt</strong>
              </div>
              <input
                type="range"
                min="1000"
                max="1600"
                step="25"
                value={plazmaQuvvat}
                onChange={(e) => setPlazmaQuvvat(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Argon Plazma Oqimi:</span>
                <strong className="text-emerald-400 font-mono">{argonOqim} L/min</strong>
              </div>
              <input
                type="range"
                min="10"
                max="20"
                step="0.5"
                value={argonOqim}
                onChange={(e) => setArgonOqim(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Plazma Kanal Harorati:</div>
              <div className="text-2xl font-black text-cyan-400">{haroratK.toLocaleString()} Kelvin</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Metall Ionizatsiya Samaradorligi:</div>
              <div className="text-lg font-bold text-emerald-400">{ionlanishDarajasi}% (M⁺)</div>
            </div>
          </div>
        </div>

        {/* 4. ICP PARAMETRLARI JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-cyan-400">Analitik Ko{"'"}rsatkichlar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-cyan-400" />
              <span>4. Kompleks Metallarining ICP-OES va MS Parametrlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Metall</th>
                  <th className="py-2.5 px-3">ICP-OES λ</th>
                  <th className="py-2.5 px-3">ICP-MS m/z</th>
                  <th className="py-2.5 px-3">LOD (OES)</th>
                  <th className="py-2.5 px-3">LOD (MS)</th>
                  <th className="py-2.5 px-3">Interferensiya & Korreksiya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {ICP_PARAMETRLARI.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-cyan-400">{m.metall}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{m.oesWv}</td>
                    <td className="py-2.5 px-3 text-amber-400">{m.msMz}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{m.lodOes}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-urgu)]">{m.lodMs}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{m.inter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. TAQQOSLASH: ICP-OES vs ICP-MS vs AAS */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-cyan-400">Taqqoslash</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="grafik" olcham={20} className="text-cyan-400" />
              <span>5. ICP-OES vs ICP-MS vs AAS Usullarini Taqqoslash</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Parametr</th>
                  <th className="py-2.5 px-3">Alanga AAS</th>
                  <th className="py-2.5 px-3">Grafit GFAAS</th>
                  <th className="py-2.5 px-3">ICP-OES</th>
                  <th className="py-2.5 px-3">ICP-MS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-[var(--v3-matn)]">Sezgirlik (LOD)</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">ppm (mg/L)</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">ppb (μg/L)</td>
                  <td className="py-2.5 px-3 text-cyan-400">ppb (μg/L)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">ppt (ng/L)</td>
                </tr>
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-[var(--v3-matn)]">Ko{"'"}p elementlilik</td>
                  <td className="py-2.5 px-3 text-rose-400">Ketma-ket (1 ta)</td>
                  <td className="py-2.5 px-3 text-rose-400">Ketma-ket (1 ta)</td>
                  <td className="py-2.5 px-3 text-emerald-400">Bir vaqtda (60+)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">Bir vaqtda (75+)</td>
                </tr>
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-[var(--v3-matn)]">Dinamik Diapazon</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">10² — 10³</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">10² — 10³</td>
                  <td className="py-2.5 px-3 text-cyan-400">10⁶ (keng)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">10⁹ (maksimal)</td>
                </tr>
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-[var(--v3-matn)]">Izotop Nisbatlari</td>
                  <td className="py-2.5 px-3 text-rose-400">Mavjud emas</td>
                  <td className="py-2.5 px-3 text-rose-400">Mavjud emas</td>
                  <td className="py-2.5 px-3 text-rose-400">Mavjud emas</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">To{"'"}liq o{"'"}lchanadi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/aas"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>AAS Spektroskopiyasi</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/exafs"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>EXAFS / XANES Spektroskopiyasi</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
