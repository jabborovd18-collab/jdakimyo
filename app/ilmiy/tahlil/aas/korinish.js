"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

const AAS_METALLARI = [
  { metall: "Cu (Mis)", chiziq: "324.75 nm", sezgirlik: "0.02 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS" },
  { metall: "Fe (Temir)", chiziq: "248.33 nm", sezgirlik: "0.05 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS" },
  { metall: "Co (Kobalt)", chiziq: "240.73 nm", sezgirlik: "0.05 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS" },
  { metall: "Ni (Nikel)", chiziq: "232.00 nm", sezgirlik: "0.04 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS" },
  { metall: "Pt (Platina)", chiziq: "265.95 nm", sezgirlik: "0.002 mg/L", alanga: "Grafit pechi (2700°C)", usul: "GFAAS (Grafit)" },
  { metall: "Ru (Ruteniy)", chiziq: "349.89 nm", sezgirlik: "0.005 mg/L", alanga: "N₂O-Asetilen (2900°C)", usul: "Yuqori harorat" },
];

export default function AASKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // AAS Kalibrlash Simulyatori (A = k * C)
  const [konsentratsiyaPpm, setKonsentratsiyaPpm] = useState(2.5);
  const [kyuvaQalinligi, setKyuvaQalinligi] = useState(1.0);

  const kKoef = 0.085;
  const hisoblanganAbsorbsiya = (konsentratsiyaPpm * kyuvaQalinligi * kKoef).toFixed(3);
  const otkazuvchanlikFoiz = (Math.pow(10, -Number(hisoblanganAbsorbsiya)) * 100).toFixed(1);

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
              <Ikon nom="alanga" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                AAS (Atom-Absorbtsion Spektroskopiya)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Metall ionlarining miqdoriy tahlili, alanga/grafit atomizatsiyasi va kalibrlash
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
          href="/ilmiy/tahlil/aas/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="alanga" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Birikmalarning AAS Tahlili Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Kompleks birikmalardagi metall ionlarining miqdoriy AAS tahlili, metall foizi,
                aniqlash chegarasi (LOD/LOQ) va atomlashtirish usullari.
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
              <span>Atom-Absorbtsion Spektroskopiya Metodologiyasi</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
            <strong className="text-[var(--v3-urgu)]">AAS usuli</strong> — erkin atomik gaz holatidagi neytral metall atomlarining
            o{"'"}ziga xos rezonans spektral chiziqlaridagi nurlarni yutishiga asoslangan miqdoriy tahlil metodidir.
            Alanga (Flame AAS) va elektrotermik grafit kyuveta (GFAAS) yordamida kompleksdagi metall ionlari
            10⁻⁶ ... 10⁻⁹ g/L (ppm-ppb) sezgirlikda aniqlanadi.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-[var(--v3-urgu)]">A = k · c</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Graduirovka Grafigi</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-cyan-400">HCL Chiroq</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Kovak Katodli Manba</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-emerald-400">LOD ~ ppb</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Ultra-Past Sezgirlik</div>
            </div>
          </div>
        </div>

        {/* 2. INTERAKTIV AAS KALKULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Interaktiv Simulyator</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>AAS Kalibrlash va Optik Zichlik Simulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Metall konsentratsiyasi (c):</span>
                <strong className="text-[var(--v3-matn)]">{konsentratsiyaPpm} mg/L (ppm)</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={konsentratsiyaPpm}
                onChange={(e) => setKonsentratsiyaPpm(Number(e.target.value) || 0.1)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Alanga qatlami qalinligi (l):</span>
                <strong className="text-[var(--v3-matn)]">{kyuvaQalinligi} cm</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={kyuvaQalinligi}
                onChange={(e) => setKyuvaQalinligi(Number(e.target.value) || 1.0)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">O{"'"}lchangan Optik Yutilish (A):</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">
                A = {hisoblanganAbsorbsiya}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Nurning O{"'"}tkazuvchanligi (T%):</div>
              <div className="text-lg font-bold text-cyan-400">
                T = {otkazuvchanlikFoiz}%
              </div>
            </div>
          </div>
        </div>

        {/* 3. METALLAR TAHLIL JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Spektral Chiziqlar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Asosiy Kompleks Metallarining Rezonans Chiziqlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Metall</th>
                  <th className="py-2.5 px-3">Rezonans To{"'"}lqin Uzunligi</th>
                  <th className="py-2.5 px-3">Sezgirlik (LOD)</th>
                  <th className="py-2.5 px-3">Atomizatsiya Gaz Muhiti</th>
                  <th className="py-2.5 px-3">Metod Turi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {AAS_METALLARI.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{m.metall}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{m.chiziq}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{m.sezgirlik}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{m.alanga}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{m.usul}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/element-analiz"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Elementar (CHNOS) Tahlil</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/icp"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>ICP-OES / ICP-MS Plazma</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
